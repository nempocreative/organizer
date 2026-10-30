import { Router } from "express";
import crypto from "crypto";
import pool from "../lib/db";
import { verifyToken } from "../lib/auth";
import { generateSecret, generateURI, verify } from "otplib";
import QRCode from "qrcode";

const router = Router();

function getAuth(req: any): { id: number } | null {
  const auth = req.headers.authorization;
  if (!auth?.startsWith("Bearer ")) return null;
  try { return verifyToken(auth.slice(7)) as any; }
  catch { return null; }
}

function hashToken(token: string) {
  return crypto.createHash("sha256").update(token).digest("hex").slice(0, 64);
}

function parseUserAgent(ua?: string) {
  if (!ua) return { device: "Perangkat tidak dikenal", browser: "Browser tidak dikenal" };
  let browser = "Browser lain";
  if (/Chrome\//.test(ua) && !/Edg\//.test(ua)) browser = "Google Chrome";
  else if (/Firefox\//.test(ua)) browser = "Mozilla Firefox";
  else if (/Edg\//.test(ua)) browser = "Microsoft Edge";
  else if (/Safari\//.test(ua) && !/Chrome/.test(ua)) browser = "Apple Safari";
  else if (/OPR\//.test(ua) || /Opera\//.test(ua)) browser = "Opera";

  let device = "Desktop";
  if (/Android/.test(ua)) device = "Android";
  else if (/iPhone|iPad/.test(ua)) device = "iPhone/iPad";
  else if (/Windows/.test(ua)) device = "Windows PC";
  else if (/Macintosh/.test(ua)) device = "Mac";
  else if (/Linux/.test(ua)) device = "Linux PC";

  return { device, browser };
}

/* ── GET /api/user/security — fetch security prefs ── */
router.get("/user/security", async (req, res) => {
  const p = getAuth(req);
  if (!p) return res.status(401).json({ error: "Unauthorized" });
  const { rows } = await pool.query(
    "SELECT twofa_enabled, biometric_pref FROM users WHERE id=$1",
    [p.id]
  );
  if (!rows[0]) return res.status(404).json({ error: "Not found" });
  res.json(rows[0]);
});

/* ── PUT /api/user/security/biometric — toggle biometric ── */
router.put("/user/security/biometric", async (req, res) => {
  const p = getAuth(req);
  if (!p) return res.status(401).json({ error: "Unauthorized" });
  const { enabled } = req.body;
  await pool.query("UPDATE users SET biometric_pref=$1 WHERE id=$2", [!!enabled, p.id]);
  res.json({ ok: true, biometric_pref: !!enabled });
});

/* ── POST /api/user/2fa/setup — generate TOTP secret + QR ── */
router.post("/user/2fa/setup", async (req, res) => {
  const p = getAuth(req);
  if (!p) return res.status(401).json({ error: "Unauthorized" });

  const { rows } = await pool.query("SELECT email, twofa_enabled FROM users WHERE id=$1", [p.id]);
  if (!rows[0]) return res.status(404).json({ error: "Not found" });
  if (rows[0].twofa_enabled) return res.status(400).json({ error: "2FA sudah aktif" });

  const secret = generateSecret(20);
  const otpauth = generateURI({ secret, label: rows[0].email, issuer: "Nempo.id", type: "totp" });
  const qrDataUrl = await QRCode.toDataURL(otpauth);

  await pool.query("UPDATE users SET twofa_secret=$1 WHERE id=$2", [secret, p.id]);
  res.json({ secret, qr: qrDataUrl, otpauth });
});

/* ── POST /api/user/2fa/verify — confirm OTP + enable 2FA ── */
router.post("/user/2fa/verify", async (req, res) => {
  const p = getAuth(req);
  if (!p) return res.status(401).json({ error: "Unauthorized" });
  const { token } = req.body;
  if (!token) return res.status(400).json({ error: "Token OTP wajib diisi" });

  const { rows } = await pool.query("SELECT twofa_secret FROM users WHERE id=$1", [p.id]);
  if (!rows[0]?.twofa_secret) return res.status(400).json({ error: "Setup 2FA terlebih dahulu" });

  const valid = await verify({ token: String(token), secret: rows[0].twofa_secret, type: "totp" });
  if (!valid) return res.status(400).json({ error: "Kode OTP tidak valid" });

  await pool.query("UPDATE users SET twofa_enabled=true WHERE id=$1", [p.id]);
  await pool.query(
    "INSERT INTO user_activities (user_id, action, details, ip_address, user_agent) VALUES ($1,$2,$3,$4,$5)",
    [p.id, "2fa_enabled", "Autentikasi dua faktor diaktifkan", req.ip, req.headers["user-agent"] ?? null]
  );
  res.json({ ok: true });
});

/* ── DELETE /api/user/2fa — disable 2FA ── */
router.delete("/user/2fa", async (req, res) => {
  const p = getAuth(req);
  if (!p) return res.status(401).json({ error: "Unauthorized" });
  const { token } = req.body;

  const { rows } = await pool.query("SELECT twofa_secret, twofa_enabled FROM users WHERE id=$1", [p.id]);
  if (!rows[0]) return res.status(404).json({ error: "Not found" });
  if (!rows[0].twofa_enabled) return res.status(400).json({ error: "2FA tidak aktif" });

  if (token) {
    const valid = await verify({ token: String(token), secret: rows[0].twofa_secret, type: "totp" });
    if (!valid) return res.status(400).json({ error: "Kode OTP tidak valid" });
  }

  await pool.query("UPDATE users SET twofa_enabled=false, twofa_secret=NULL WHERE id=$1", [p.id]);
  await pool.query(
    "INSERT INTO user_activities (user_id, action, details, ip_address) VALUES ($1,$2,$3,$4)",
    [p.id, "2fa_disabled", "Autentikasi dua faktor dinonaktifkan", req.ip]
  );
  res.json({ ok: true });
});

/* ── GET /api/user/activities — activity history ── */
router.get("/user/activities", async (req, res) => {
  const p = getAuth(req);
  if (!p) return res.status(401).json({ error: "Unauthorized" });
  const limit = Math.min(Number(req.query.limit) || 30, 100);
  const { rows } = await pool.query(
    "SELECT id, action, details, ip_address, user_agent, created_at FROM user_activities WHERE user_id=$1 ORDER BY created_at DESC LIMIT $2",
    [p.id, limit]
  );
  res.json(rows);
});

/* ── GET /api/user/sessions — active sessions ── */
router.get("/user/sessions", async (req, res) => {
  const p = getAuth(req);
  if (!p) return res.status(401).json({ error: "Unauthorized" });

  const auth = req.headers.authorization!.slice(7);
  const currentHash = hashToken(auth);

  const { rows } = await pool.query(
    `SELECT id, device_name, browser, ip_address, last_active_at, created_at,
            token_hash = $2 AS is_current
     FROM user_sessions
     WHERE user_id=$1 AND revoked_at IS NULL
     ORDER BY last_active_at DESC LIMIT 20`,
    [p.id, currentHash]
  );
  res.json(rows);
});

/* ── DELETE /api/user/sessions/:id — revoke session ── */
router.delete("/user/sessions/:id", async (req, res) => {
  const p = getAuth(req);
  if (!p) return res.status(401).json({ error: "Unauthorized" });
  await pool.query(
    "UPDATE user_sessions SET revoked_at=NOW() WHERE id=$1 AND user_id=$2",
    [req.params.id, p.id]
  );
  res.json({ ok: true });
});

/* ── DELETE /api/user/sessions — revoke all except current ── */
router.delete("/user/sessions", async (req, res) => {
  const p = getAuth(req);
  if (!p) return res.status(401).json({ error: "Unauthorized" });

  const auth = req.headers.authorization!.slice(7);
  const currentHash = hashToken(auth);

  await pool.query(
    "UPDATE user_sessions SET revoked_at=NOW() WHERE user_id=$1 AND token_hash<>$2 AND revoked_at IS NULL",
    [p.id, currentHash]
  );
  res.json({ ok: true });
});

/* ── GET /api/user/notifications/prefs ── */
router.get("/user/notifications/prefs", async (req, res) => {
  const p = getAuth(req);
  if (!p) return res.status(401).json({ error: "Unauthorized" });

  const { rows } = await pool.query(
    `INSERT INTO user_notification_prefs (user_id)
     VALUES ($1)
     ON CONFLICT (user_id) DO NOTHING`,
    [p.id]
  );
  const { rows: prefs } = await pool.query(
    "SELECT push_enabled, email_enabled, promo_enabled, event_enabled, komunitas_enabled, berita_enabled FROM user_notification_prefs WHERE user_id=$1",
    [p.id]
  );
  res.json(prefs[0] ?? {
    push_enabled: true, email_enabled: false, promo_enabled: true,
    event_enabled: true, komunitas_enabled: false, berita_enabled: true,
  });
});

/* ── PUT /api/user/notifications/prefs ── */
router.put("/user/notifications/prefs", async (req, res) => {
  const p = getAuth(req);
  if (!p) return res.status(401).json({ error: "Unauthorized" });

  const { push_enabled, email_enabled, promo_enabled, event_enabled, komunitas_enabled, berita_enabled } = req.body;

  await pool.query(
    `INSERT INTO user_notification_prefs (user_id, push_enabled, email_enabled, promo_enabled, event_enabled, komunitas_enabled, berita_enabled, updated_at)
     VALUES ($1,$2,$3,$4,$5,$6,$7,NOW())
     ON CONFLICT (user_id) DO UPDATE
     SET push_enabled=$2, email_enabled=$3, promo_enabled=$4, event_enabled=$5,
         komunitas_enabled=$6, berita_enabled=$7, updated_at=NOW()`,
    [p.id, !!push_enabled, !!email_enabled, !!promo_enabled, !!event_enabled, !!komunitas_enabled, !!berita_enabled]
  );
  res.json({ ok: true });
});

export default router;
