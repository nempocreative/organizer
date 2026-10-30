import { Router } from "express";
import pool from "../lib/db";
import { verifyToken } from "../lib/auth";
import { requireAuth } from "../middlewares/auth";

const router = Router();

function authUser(req: any): number | null {
  const auth = req.headers.authorization;
  if (!auth?.startsWith("Bearer ")) return null;
  try {
    const p = verifyToken(auth.slice(7)) as any;
    return p.id ?? null;
  } catch { return null; }
}

/* ─ Tier calculator ──────────────────────────────────────── */
export function getTier(points: number): { tier: string; next: string; nextPts: number; pct: number } {
  if (points < 500)  return { tier: "Bronze", next: "Silver", nextPts: 500,  pct: Math.round((points / 500) * 100) };
  if (points < 1500) return { tier: "Silver", next: "Gold",   nextPts: 1500, pct: Math.round(((points - 500) / 1000) * 100) };
  if (points < 3000) return { tier: "Gold",   next: "Platinum", nextPts: 3000, pct: Math.round(((points - 1500) / 1500) * 100) };
  return { tier: "Platinum", next: "—", nextPts: 3000, pct: 100 };
}

/* ─ Ensure user_points row exists ────────────────────────── */
async function ensurePoints(userId: number) {
  await pool.query(
    "INSERT INTO user_points (user_id, total_points, login_streak, last_login_date) VALUES ($1, 0, 0, NULL) ON CONFLICT (user_id) DO NOTHING",
    [userId]
  );
}

/* ─ Award points (internal) ──────────────────────────────── */
export async function awardPoints(userId: number, type: string, pts: number, desc: string) {
  await ensurePoints(userId);
  await pool.query(
    "UPDATE user_points SET total_points = total_points + $1, updated_at = NOW() WHERE user_id = $2",
    [pts, userId]
  );
  await pool.query(
    "INSERT INTO point_transactions (user_id, type, points, description) VALUES ($1,$2,$3,$4)",
    [userId, type, pts, desc]
  );
}

/* ─ Check & award daily login points ─────────────────────── */
export async function processDailyLogin(userId: number) {
  await ensurePoints(userId);
  const { rows } = await pool.query("SELECT * FROM user_points WHERE user_id=$1", [userId]);
  const up = rows[0];
  const today = new Date().toISOString().slice(0, 10);
  const lastDate = up.last_login_date ? String(up.last_login_date).slice(0, 10) : null;

  if (lastDate === today) return; // already logged in today

  // Calculate streak
  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
  const newStreak = lastDate === yesterday ? (up.login_streak || 0) + 1 : 1;

  // Points: 10 per day, bonus 30 every 7-day streak
  let pts = 10;
  let desc = "Login harian (+10 poin)";
  if (newStreak % 7 === 0) {
    pts += 30;
    desc = `Login ${newStreak} hari berturut-turut! (+40 poin)`;
  }

  await pool.query(
    "UPDATE user_points SET total_points = total_points + $1, login_streak = $2, last_login_date = $3, updated_at = NOW() WHERE user_id = $4",
    [pts, newStreak, today, userId]
  );
  await pool.query(
    "INSERT INTO point_transactions (user_id, type, points, description) VALUES ($1,$2,$3,$4)",
    [userId, "login_daily", pts, desc]
  );

  // Check point milestones → auto-grant voucher
  const { rows: upd } = await pool.query("SELECT total_points FROM user_points WHERE user_id=$1", [userId]);
  const total = upd[0]?.total_points ?? 0;
  await checkMilestoneVouchers(userId, total);
}

/* ─ Milestone vouchers ───────────────────────────────────── */
const MILESTONES = [
  { pts: 100,  voucher: { code: "LOYAL100",  title: "Voucher Loyal 5% Off",  disc: 5,  desc: "Hadiah 100 poin pertama — diskon 5% untuk semua event" } },
  { pts: 300,  voucher: { code: "LOYAL300",  title: "Voucher Loyal 10% Off", disc: 10, desc: "Hadiah 300 poin — diskon 10% untuk semua event" } },
  { pts: 500,  voucher: { code: "SILVER500", title: "Voucher Silver 15% Off",disc: 15, desc: "Selamat naik ke Silver! Diskon 15% untuk semua event" } },
  { pts: 1500, voucher: { code: "GOLD1500",  title: "Voucher Gold 20% Off",  disc: 20, desc: "Selamat naik ke Gold! Diskon 20% untuk semua event" } },
];

export async function checkMilestoneVouchers(userId: number, total: number) {
  for (const m of MILESTONES) {
    if (total >= m.pts) {
      const code = `${m.voucher.code}-U${userId}`;
      const exists = await pool.query("SELECT id FROM user_vouchers WHERE user_id=$1 AND code=$2", [userId, code]);
      if (!exists.rows[0]) {
        await pool.query(
          `INSERT INTO user_vouchers (user_id, code, title, description, discount_value, discount_type, applicable_type, source, expires_at)
           VALUES ($1,$2,$3,$4,$5,'persen','all','milestone', NOW() + INTERVAL '60 days')`,
          [userId, code, m.voucher.title, m.voucher.desc, m.voucher.disc]
        );
        // Add notification
        await pool.query(
          "INSERT INTO notifications (title, message, type, active) VALUES ($1,$2,'voucher',true)",
          [
            `🎁 ${m.voucher.title} untukmu!`,
            `Kamu telah mencapai ${m.pts} poin! Voucher ${m.voucher.code} (diskon ${m.voucher.disc}%) telah otomatis ditambahkan ke dompet vouchermu.`,
          ]
        ).catch(() => {});
      }
    }
  }
}

/* ─ Create welcome voucher for new user ──────────────────── */
export async function createWelcomeVoucher(userId: number) {
  const code = `NEWBIE10-U${userId}`;
  const existing = await pool.query("SELECT id FROM user_vouchers WHERE user_id=$1 AND code=$2", [userId, code]);
  if (existing.rows[0]) return;

  // Get upcoming events if any
  const { rows: events } = await pool.query(
    "SELECT id, name FROM events WHERE active=true ORDER BY id LIMIT 3"
  );
  const eventInfo = events.length > 0
    ? `Berlaku untuk event: ${events.map((e: any) => e.name).join(", ")}`
    : "Berlaku untuk semua event Nempo.id";

  await pool.query(
    `INSERT INTO user_vouchers (user_id, code, title, description, discount_value, discount_type, applicable_type, source, expires_at)
     VALUES ($1,$2,$3,$4,10,'persen','event','register_bonus', NOW() + INTERVAL '30 days')`,
    [
      userId,
      code,
      "Voucher Selamat Datang 10% Off",
      `Selamat bergabung di Nempo.id! ${eventInfo}. Gunakan sebelum kedaluwarsa.`,
    ]
  );
}

/* ──────────────────────────────────────────────────────────
   PUBLIC ENDPOINTS
────────────────────────────────────────────────────────── */

/* GET /api/user/points */
router.get("/user/points", async (req, res) => {
  const userId = authUser(req);
  if (!userId) return res.status(401).json({ error: "Unauthorized" });
  await ensurePoints(userId);
  const { rows } = await pool.query("SELECT * FROM user_points WHERE user_id=$1", [userId]);
  const up = rows[0] ?? { total_points: 0, login_streak: 0 };
  const { rows: txns } = await pool.query(
    "SELECT * FROM point_transactions WHERE user_id=$1 ORDER BY created_at DESC LIMIT 10",
    [userId]
  );
  const tierInfo = getTier(up.total_points);
  res.json({ ...up, ...tierInfo, transactions: txns });
});

/* POST /api/user/daily-login — call on every login from frontend */
router.post("/user/daily-login", async (req, res) => {
  const userId = authUser(req);
  if (!userId) return res.status(401).json({ error: "Unauthorized" });
  await processDailyLogin(userId);
  const { rows } = await pool.query("SELECT * FROM user_points WHERE user_id=$1", [userId]);
  const up = rows[0] ?? { total_points: 0, login_streak: 0 };
  res.json({ ...up, ...getTier(up.total_points) });
});

/* GET /api/user/checkin/status — check if already checked in today */
router.get("/user/checkin/status", async (req, res) => {
  const userId = authUser(req);
  if (!userId) return res.status(401).json({ error: "Unauthorized" });
  await ensurePoints(userId);
  const { rows } = await pool.query("SELECT * FROM user_points WHERE user_id=$1", [userId]);
  const up = rows[0] ?? { total_points: 0, login_streak: 0, last_checkin_date: null };
  const today = new Date().toISOString().slice(0, 10);
  const lastCheckin = up.last_checkin_date ? String(up.last_checkin_date).slice(0, 10) : null;
  const alreadyCheckedIn = lastCheckin === today;
  const currentStreak = up.login_streak || 0;
  const nextStreak = alreadyCheckedIn ? currentStreak : currentStreak + 1;
  const nextPts = (nextStreak % 7 === 0) ? 40 : 10;
  res.json({
    already_checked_in: alreadyCheckedIn,
    streak: currentStreak,
    points_today: alreadyCheckedIn ? 0 : nextPts,
    total_points: up.total_points,
  });
});

/* POST /api/user/checkin — manual daily check-in */
router.post("/user/checkin", async (req, res) => {
  const userId = authUser(req);
  if (!userId) return res.status(401).json({ error: "Unauthorized" });
  await ensurePoints(userId);

  const { rows } = await pool.query("SELECT * FROM user_points WHERE user_id=$1", [userId]);
  const up = rows[0];
  const today = new Date().toISOString().slice(0, 10);
  const lastCheckin = up.last_checkin_date ? String(up.last_checkin_date).slice(0, 10) : null;

  if (lastCheckin === today) {
    return res.json({
      already_checked_in: true,
      streak: up.login_streak,
      points_earned: 0,
      total_points: up.total_points,
      message: "Sudah check-in hari ini",
    });
  }

  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
  const newStreak = lastCheckin === yesterday ? (up.login_streak || 0) + 1 : 1;
  let pts = 10;
  let desc = `Check-in harian (+10 poin)`;
  if (newStreak % 7 === 0) {
    pts += 30;
    desc = `Check-in ${newStreak} hari berturut-turut! Bonus streak (+40 poin)`;
  }

  const { rowCount } = await pool.query(
    `UPDATE user_points
     SET total_points = total_points + $1,
         login_streak = $2,
         last_checkin_date = $3::date,
         updated_at = NOW()
     WHERE user_id = $4
       AND (last_checkin_date IS NULL OR last_checkin_date < $3::date)`,
    [pts, newStreak, today, userId]
  );

  if (!rowCount || rowCount === 0) {
    const { rows: cur } = await pool.query("SELECT * FROM user_points WHERE user_id=$1", [userId]);
    const c = cur[0];
    return res.json({
      already_checked_in: true,
      streak: c.login_streak,
      points_earned: 0,
      total_points: c.total_points,
      message: "Sudah check-in hari ini",
    });
  }

  await pool.query(
    "INSERT INTO point_transactions (user_id, type, points, description) VALUES ($1,'checkin_daily',$2,$3)",
    [userId, pts, desc]
  );

  const { rows: upd } = await pool.query("SELECT total_points FROM user_points WHERE user_id=$1", [userId]);
  const newTotal = upd[0]?.total_points ?? 0;
  await checkMilestoneVouchers(userId, newTotal);

  res.json({
    already_checked_in: false,
    streak: newStreak,
    points_earned: pts,
    total_points: newTotal,
    message: desc,
  });
});

/* GET /api/user/vouchers */
router.get("/user/vouchers", async (req, res) => {
  const userId = authUser(req);
  if (!userId) return res.status(401).json({ error: "Unauthorized" });
  const { rows } = await pool.query(
    `SELECT * FROM user_vouchers WHERE user_id=$1
     AND (expires_at IS NULL OR expires_at > NOW())
     ORDER BY created_at DESC`,
    [userId]
  );
  // Also update expired ones
  await pool.query(
    "UPDATE user_vouchers SET status='expired' WHERE user_id=$1 AND expires_at <= NOW() AND status='active'",
    [userId]
  );
  res.json(rows);
});

/* POST /api/user/vouchers/validate — check if a code is valid for the current user */
router.post("/user/vouchers/validate", async (req, res) => {
  const userId = authUser(req);
  if (!userId) return res.status(401).json({ error: "Login terlebih dahulu" });
  const { code } = req.body;
  if (!code?.trim()) return res.status(400).json({ error: "Kode voucher tidak boleh kosong" });
  try {
    const { rows } = await pool.query(
      `SELECT * FROM user_vouchers
       WHERE user_id=$1 AND UPPER(code)=UPPER($2) AND status='active'
       AND (expires_at IS NULL OR expires_at > NOW())`,
      [userId, code.trim()]
    );
    if (!rows[0]) return res.status(404).json({ error: "Voucher tidak ditemukan, sudah digunakan, atau sudah kedaluwarsa" });
    const v = rows[0];
    res.json({
      valid: true,
      voucher: {
        id: v.id,
        code: v.code,
        title: v.title,
        discount_value: Number(v.discount_value),
        discount_type: v.discount_type,
        applicable_type: v.applicable_type,
        expires_at: v.expires_at,
      },
    });
  } catch { res.status(500).json({ error: "Server error" }); }
});

/* POST /api/user/vouchers/use — mark a voucher as used */
router.post("/user/vouchers/use", async (req, res) => {
  const userId = authUser(req);
  if (!userId) return res.status(401).json({ error: "Login terlebih dahulu" });
  const { code } = req.body;
  if (!code?.trim()) return res.status(400).json({ error: "Kode voucher tidak boleh kosong" });
  try {
    const { rows } = await pool.query(
      `UPDATE user_vouchers SET status='used'
       WHERE user_id=$1 AND UPPER(code)=UPPER($2) AND status='active'
       AND (expires_at IS NULL OR expires_at > NOW())
       RETURNING id`,
      [userId, code.trim()]
    );
    if (!rows[0]) return res.status(404).json({ error: "Voucher tidak valid atau sudah digunakan" });
    res.json({ success: true });
  } catch { res.status(500).json({ error: "Server error" }); }
});

/* GET /api/user/vouchers/count */
router.get("/user/vouchers/count", async (req, res) => {
  const userId = authUser(req);
  if (!userId) return res.json({ count: 0 });
  const { rows } = await pool.query(
    "SELECT COUNT(*) AS count FROM user_vouchers WHERE user_id=$1 AND status='active' AND (expires_at IS NULL OR expires_at > NOW())",
    [userId]
  );
  res.json({ count: parseInt(rows[0].count) });
});

/* POST /api/user/vouchers/claim/:id — claim a public voucher */
router.post("/user/vouchers/claim/:id", async (req, res) => {
  const userId = authUser(req);
  if (!userId) return res.status(401).json({ error: "Unauthorized" });
  const { rows: vs } = await pool.query("SELECT * FROM vouchers WHERE id=$1 AND active=true", [req.params.id]);
  if (!vs[0]) return res.status(404).json({ error: "Voucher tidak ditemukan" });
  const v = vs[0];
  const requiredPoints = Number(v.required_points ?? 0);
  if (requiredPoints > 0) {
    const { rows: pointsRows } = await pool.query(
      "SELECT total_points FROM user_points WHERE user_id=$1",
      [userId]
    );
    const totalPoints = Number(pointsRows[0]?.total_points ?? 0);
    if (totalPoints < requiredPoints) {
      return res.status(403).json({
        error: `Butuh ${requiredPoints.toLocaleString("id-ID")} poin untuk mengklaim reward ini`,
        required_points: requiredPoints,
        total_points: totalPoints,
      });
    }
  }
  const code = `${v.code}-U${userId}`;
  const exists = await pool.query("SELECT id FROM user_vouchers WHERE user_id=$1 AND code=$2", [userId, code]);
  if (exists.rows[0]) return res.status(409).json({ error: "Voucher sudah diklaim" });
  const { rows } = await pool.query(
    `INSERT INTO user_vouchers (user_id, code, title, description, discount_value, discount_type, applicable_type, source, expires_at)
     VALUES ($1,$2,$3,$4,$5,$6,$7,'claim',$8) RETURNING *`,
    [userId, code, v.title, v.description, v.discount_value, v.discount_type,
     v.applicable_type ?? v.type ?? "all",
     v.expiry_date || null]
  );
  res.status(201).json(rows[0]);
});

/* ──────────────────────────────────────────────────────────
   ADMIN ENDPOINTS
────────────────────────────────────────────────────────── */

/* GET /admin/user-points — all users with point summary */
router.get("/admin/user-points", requireAuth, async (_req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT u.id, u.name, u.email, u.created_at AS registered_at,
             COALESCE(up.total_points, 0) AS total_points,
             COALESCE(up.login_streak, 0) AS login_streak,
             up.last_login_date,
             (SELECT COUNT(*) FROM point_transactions pt WHERE pt.user_id = u.id) AS txn_count,
             (SELECT COALESCE(SUM(points),0) FROM point_transactions pt WHERE pt.user_id = u.id AND points > 0) AS total_earned,
             (SELECT COALESCE(ABS(SUM(points)),0) FROM point_transactions pt WHERE pt.user_id = u.id AND points < 0) AS total_spent,
             (SELECT COUNT(*) FROM user_vouchers uv WHERE uv.user_id = u.id) AS voucher_count
      FROM users u
      LEFT JOIN user_points up ON up.user_id = u.id
      WHERE u.active = true
      ORDER BY total_points DESC
    `);
    res.json(rows);
  } catch { res.status(500).json({ error: "Server error" }); }
});

/* GET /admin/user-points/:userId/transactions */
router.get("/admin/user-points/:userId/transactions", requireAuth, async (req, res) => {
  try {
    const { rows } = await pool.query(
      "SELECT * FROM point_transactions WHERE user_id=$1 ORDER BY created_at DESC",
      [req.params.userId]
    );
    res.json(rows);
  } catch { res.status(500).json({ error: "Server error" }); }
});

/* GET /admin/user-vouchers — all user_vouchers with user info */
router.get("/admin/user-vouchers", requireAuth, async (req, res) => {
  try {
    const { status, userId } = req.query;
    let q = `
      SELECT uv.*, u.name AS user_name, u.email AS user_email
      FROM user_vouchers uv
      JOIN users u ON u.id = uv.user_id
      WHERE 1=1
    `;
    const params: any[] = [];
    if (status) { params.push(status); q += ` AND uv.status = $${params.length}`; }
    if (userId) { params.push(userId); q += ` AND uv.user_id = $${params.length}`; }
    q += " ORDER BY uv.created_at DESC";
    const { rows } = await pool.query(q, params);
    res.json(rows);
  } catch { res.status(500).json({ error: "Server error" }); }
});

export default router;
