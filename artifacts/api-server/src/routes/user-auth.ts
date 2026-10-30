import { Router } from "express";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import pool from "../lib/db";
import { signToken, verifyToken } from "../lib/auth";
import { awardPoints, createWelcomeVoucher, processDailyLogin } from "./user-points";

const router = Router();

async function logActivity(userId: number, action: string, details: string, ip?: string, ua?: string) {
  await pool.query(
    "INSERT INTO user_activities (user_id, action, details, ip_address, user_agent) VALUES ($1,$2,$3,$4,$5)",
    [userId, action, details, ip ?? null, ua ?? null]
  );
}

function parseDevice(ua?: string) {
  if (!ua) return { device: "Perangkat tidak dikenal", browser: "Browser tidak dikenal" };
  let browser = "Browser lain";
  if (/Chrome\//.test(ua) && !/Edg\//.test(ua)) browser = "Google Chrome";
  else if (/Firefox\//.test(ua)) browser = "Mozilla Firefox";
  else if (/Edg\//.test(ua)) browser = "Microsoft Edge";
  else if (/Safari\//.test(ua) && !/Chrome/.test(ua)) browser = "Apple Safari";
  else if (/OPR\/|Opera\//.test(ua)) browser = "Opera";

  let device = "Desktop";
  if (/Android/.test(ua)) device = "Android";
  else if (/iPhone|iPad/.test(ua)) device = "iPhone/iPad";
  else if (/Windows/.test(ua)) device = "Windows PC";
  else if (/Macintosh/.test(ua)) device = "Mac";
  else if (/Linux/.test(ua)) device = "Linux PC";

  return { device, browser };
}

async function logSession(userId: number, token: string, req: any) {
  const tokenHash = crypto.createHash("sha256").update(token).digest("hex").slice(0, 64);
  const { device, browser } = parseDevice(req.headers["user-agent"]);
  await pool.query(
    `INSERT INTO user_sessions (user_id, token_hash, device_name, browser, ip_address)
     VALUES ($1,$2,$3,$4,$5)
     ON CONFLICT DO NOTHING`,
    [userId, tokenHash, device, browser, req.ip ?? null]
  );
}

/* ── Register ── */
router.post("/auth/register", async (req, res) => {
  const { name, email, password, phone } = req.body;
  if (!name || !email || !password) return res.status(400).json({ error: "Nama, email, dan password wajib diisi" });
  const exists = await pool.query("SELECT id FROM users WHERE email=$1", [email]);
  if (exists.rows[0]) return res.status(409).json({ error: "Email sudah terdaftar" });
  const hash = await bcrypt.hash(password, 10);
  const { rows } = await pool.query(
    "INSERT INTO users (name, email, password_hash, phone) VALUES ($1,$2,$3,$4) RETURNING id, name, email, avatar_url, created_at",
    [name, email, hash, phone ?? null]
  );
  const user = rows[0];
  const token = signToken({ id: user.id, email: user.email, role: "user" });
  await logActivity(user.id, "register", "Akun baru dibuat", req.ip);
  // Award welcome points + voucher
  await awardPoints(user.id, "register_bonus", 50, "Bonus pendaftaran akun baru (+50 poin)").catch(() => {});
  await createWelcomeVoucher(user.id).catch(() => {});
  res.status(201).json({ token, user });
});

/* ── Login ── */
router.post("/auth/login", async (req, res) => {
  const { email, password } = req.body;
  const identifier = (email ?? "").trim();
  if (!identifier || !password) return res.status(400).json({ error: "Email/No. HP dan password wajib diisi" });
  const { rows } = await pool.query(
    "SELECT * FROM users WHERE (email=$1 OR phone=$1) AND active=true",
    [identifier]
  );
  const user = rows[0];
  if (!user || !user.password_hash) return res.status(401).json({ error: "Email/No. HP atau password salah" });
  const valid = await bcrypt.compare(password, user.password_hash);
  if (!valid) return res.status(401).json({ error: "Email/No. HP atau password salah" });
  await pool.query("UPDATE users SET last_login_at=NOW() WHERE id=$1", [user.id]);
  await logActivity(user.id, "login", "Login berhasil", req.ip, req.headers["user-agent"]);
  await processDailyLogin(user.id).catch(() => {});
  const token = signToken({ id: user.id, email: user.email, role: "user" });
  await logSession(user.id, token, req).catch(() => {});
  res.json({ token, user: { id: user.id, name: user.name, email: user.email, avatar_url: user.avatar_url, phone: user.phone } });
});

/* ── Forgot password (public, no login required) ── */
router.post("/auth/forgot-password", async (req, res) => {
  const { identifier, new_password } = req.body;
  const id = (identifier ?? "").trim();
  if (!id || !new_password || new_password.length < 6) {
    return res.status(400).json({ error: "Email/No. HP dan password baru (minimal 6 karakter) wajib diisi" });
  }
  // Always respond with the same generic message, whether or not the account exists,
  // to avoid leaking which emails/phones are registered.
  const genericResponse = {
    ok: true,
    message: "Jika akun ditemukan, permintaan reset password sudah dikirim ke admin. Admin akan menghubungi kamu untuk verifikasi dalam 1×24 jam.",
  };
  try {
    const { rows } = await pool.query(
      "SELECT id FROM users WHERE (email=$1 OR phone=$1) AND active=true",
      [id]
    );
    const user = rows[0];
    if (user) {
      const existing = await pool.query(
        "SELECT id FROM password_reset_requests WHERE user_id=$1 AND status='pending'",
        [user.id]
      );
      if (!existing.rows[0]) {
        const hash = await bcrypt.hash(new_password, 10);
        await pool.query(
          "INSERT INTO password_reset_requests (user_id, new_password_hash) VALUES ($1,$2)",
          [user.id, hash]
        );
        await logActivity(user.id, "forgot_password_request", "Pengajuan lupa password (tanpa login)", req.ip);
      }
    }
  } catch {
    // swallow errors to keep the generic response and avoid leaking info
  }
  res.json(genericResponse);
});

/* ── Google OAuth ── */
router.post("/auth/google", async (req, res) => {
  const { credential } = req.body;
  if (!credential) return res.status(400).json({ error: "Google credential required" });
  try {
    const parts = credential.split(".");
    if (parts.length !== 3) throw new Error("Invalid JWT");
    const payload = JSON.parse(Buffer.from(parts[1], "base64url").toString());
    const { sub: googleId, email, name, picture } = payload;
    if (!email) throw new Error("No email in Google payload");

    let { rows } = await pool.query("SELECT * FROM users WHERE google_id=$1 OR email=$2", [googleId, email]);
    let user = rows[0];
    if (!user) {
      const ins = await pool.query(
        "INSERT INTO users (name, email, google_id, avatar_url) VALUES ($1,$2,$3,$4) RETURNING *",
        [name, email, googleId, picture]
      );
      user = ins.rows[0];
      await logActivity(user.id, "register_google", "Akun baru via Google", req.ip);
      await awardPoints(user.id, "register_bonus", 50, "Bonus pendaftaran akun baru (+50 poin)").catch(() => {});
      await createWelcomeVoucher(user.id).catch(() => {});
    } else {
      await pool.query("UPDATE users SET google_id=$1, avatar_url=COALESCE(avatar_url,$2), last_login_at=NOW() WHERE id=$3",
        [googleId, picture, user.id]);
      await logActivity(user.id, "login_google", "Login via Google", req.ip, req.headers["user-agent"]);
      await processDailyLogin(user.id).catch(() => {});
    }
    const token = signToken({ id: user.id, email: user.email, role: "user" });
    await logSession(user.id, token, req).catch(() => {});
    res.json({ token, user: { id: user.id, name: user.name, email: user.email, avatar_url: user.avatar_url ?? picture } });
  } catch (err: any) {
    res.status(401).json({ error: "Google sign-in gagal: " + err.message });
  }
});

/* ── Get current user ── */
router.get("/auth/me", async (req, res) => {
  const auth = req.headers.authorization;
  if (!auth?.startsWith("Bearer ")) return res.status(401).json({ error: "Unauthorized" });
  try {
    const payload = verifyToken(auth.slice(7)) as any;
    const { rows } = await pool.query("SELECT id, name, email, avatar_url, phone, created_at, last_login_at, google_id IS NOT NULL AS is_google FROM users WHERE id=$1 AND active=true", [payload.id]);
    if (!rows[0]) return res.status(404).json({ error: "User not found" });
    res.json(rows[0]);
  } catch {
    res.status(401).json({ error: "Token invalid" });
  }
});

/* ── Update profile ── */
router.put("/auth/profile", async (req, res) => {
  const auth = req.headers.authorization;
  if (!auth?.startsWith("Bearer ")) return res.status(401).json({ error: "Unauthorized" });
  try {
    const payload = verifyToken(auth.slice(7)) as any;
    const { name, phone, avatar_url } = req.body;
    const { rows } = await pool.query(
      "UPDATE users SET name=COALESCE($1,name), phone=COALESCE($2,phone), avatar_url=COALESCE($3,avatar_url), updated_at=NOW() WHERE id=$4 RETURNING id, name, email, avatar_url, phone",
      [name, phone, avatar_url, payload.id]
    );
    await logActivity(payload.id, "update_profile", "Profil diperbarui", req.ip);
    res.json(rows[0]);
  } catch {
    res.status(401).json({ error: "Token invalid" });
  }
});

/* ── Track activity (called from frontend) ── */
router.post("/auth/track", async (req, res) => {
  const auth = req.headers.authorization;
  if (!auth?.startsWith("Bearer ")) return res.status(204).send();
  try {
    const payload = verifyToken(auth.slice(7)) as any;
    const { action, details } = req.body;
    if (action) await logActivity(payload.id, action, details ?? "", req.ip);
  } catch { /* ignore */ }
  res.status(204).send();
});

/* ── Change password (self-service, langsung aktif) ── */
router.post("/auth/request-password-reset", async (req, res) => {
  const auth = req.headers.authorization;
  if (!auth?.startsWith("Bearer ")) return res.status(401).json({ error: "Unauthorized" });
  try {
    const payload = verifyToken(auth.slice(7)) as any;
    const { current_password, new_password } = req.body;
    if (!new_password || new_password.length < 6) return res.status(400).json({ error: "Password baru minimal 6 karakter" });

    const { rows } = await pool.query(
      "SELECT id, password_hash, google_id FROM users WHERE id=$1 AND active=true",
      [payload.id]
    );
    if (!rows[0]) return res.status(404).json({ error: "Akun tidak ditemukan" });
    const user = rows[0];

    // Akun Google tanpa password — tidak bisa ganti password lewat sini
    if (!user.password_hash) {
      return res.status(400).json({ error: "Akun Google tidak memiliki password. Gunakan Google untuk masuk." });
    }

    if (!current_password) return res.status(400).json({ error: "Password saat ini wajib diisi" });
    const valid = await bcrypt.compare(current_password, user.password_hash);
    if (!valid) return res.status(401).json({ error: "Password saat ini salah" });

    const newHash = await bcrypt.hash(new_password, 10);
    await pool.query("UPDATE users SET password_hash=$1, updated_at=NOW() WHERE id=$2", [newHash, user.id]);
    await logActivity(payload.id, "change_password", "Password berhasil diubah mandiri", req.ip);
    res.json({ ok: true, message: "Password berhasil diubah" });
  } catch {
    res.status(401).json({ error: "Token invalid" });
  }
});

/* ── Request account deletion (legacy — keep for backwards compat) ── */
router.post("/auth/request-delete-account", async (req, res) => {
  const auth = req.headers.authorization;
  if (!auth?.startsWith("Bearer ")) return res.status(401).json({ error: "Unauthorized" });
  try {
    const payload = verifyToken(auth.slice(7)) as any;
    const { reason } = req.body;
    const { rows } = await pool.query("SELECT id, name, email FROM users WHERE id=$1", [payload.id]);
    if (!rows[0]) return res.status(404).json({ error: "User not found" });
    const user = rows[0];
    const existing = await pool.query("SELECT id FROM delete_account_requests WHERE user_id=$1 AND status='pending'", [payload.id]);
    if (existing.rows[0]) return res.status(409).json({ error: "Masih ada permintaan hapus akun yang belum diproses" });
    await pool.query(
      "INSERT INTO delete_account_requests (user_id, user_email, user_name, reason) VALUES ($1,$2,$3,$4)",
      [payload.id, user.email, user.name, reason ?? null]
    );
    await logActivity(payload.id, "request_delete_account", "Pengajuan hapus akun: " + (reason ?? "tanpa alasan"), req.ip);
    res.json({ ok: true, message: "Permintaan hapus akun terkirim ke admin" });
  } catch {
    res.status(401).json({ error: "Token invalid" });
  }
});

/* ── Self-service account deletion — langsung, tanpa persetujuan admin ── */
router.delete("/auth/account", async (req, res) => {
  const auth = req.headers.authorization;
  if (!auth?.startsWith("Bearer ")) return res.status(401).json({ error: "Unauthorized" });
  try {
    const payload = verifyToken(auth.slice(7)) as any;
    const { password } = req.body;

    const { rows } = await pool.query(
      "SELECT id, name, email, password_hash, google_id FROM users WHERE id=$1 AND active=true",
      [payload.id]
    );
    if (!rows[0]) return res.status(404).json({ error: "Akun tidak ditemukan" });
    const user = rows[0];

    // Akun non-Google wajib verifikasi password
    if (!user.google_id) {
      if (!password) return res.status(400).json({ error: "Password wajib diisi untuk konfirmasi" });
      if (!user.password_hash) return res.status(400).json({ error: "Akun tidak memiliki password" });
      const valid = await bcrypt.compare(password, user.password_hash);
      if (!valid) return res.status(401).json({ error: "Password salah" });
    }

    // Soft-delete: nonaktifkan akun & anonimkan PII supaya email bisa didaftar ulang
    const anonEmail = `deleted_${user.id}_${Date.now()}@nempo.invalid`;
    await pool.query(
      `UPDATE users SET
         active        = false,
         name          = 'Pengguna Dihapus',
         email         = $1,
         phone         = NULL,
         avatar_url    = NULL,
         password_hash = NULL,
         google_id     = NULL
       WHERE id = $2`,
      [anonEmail, user.id]
    );

    // Cabut semua sesi aktif
    await pool.query("DELETE FROM user_sessions WHERE user_id=$1", [user.id]);

    await logActivity(user.id, "account_deleted", "Akun dihapus mandiri oleh pengguna", req.ip);
    res.json({ ok: true, message: "Akun berhasil dihapus" });
  } catch {
    res.status(401).json({ error: "Token invalid" });
  }
});

export default router;
