import { Router } from "express";
import bcrypt from "bcryptjs";
import pool from "../lib/db";
import { requireAuth } from "../middlewares/auth";

const router = Router();

/* ── List all users ── */
router.get("/admin/users", requireAuth, async (_req, res) => {
  const { rows } = await pool.query(`
    SELECT u.id, u.name, u.email, u.phone, u.avatar_url, u.active,
           u.created_at, u.last_login_at, u.google_id IS NOT NULL AS has_google,
           (SELECT COUNT(*) FROM user_activities WHERE user_id=u.id)::int AS activity_count
    FROM users u ORDER BY u.created_at DESC
  `);
  res.json(rows);
});

/* ── Get single user + activities ── */
router.get("/admin/users/:id", requireAuth, async (req, res) => {
  const { rows: users } = await pool.query(
    "SELECT id, name, email, phone, avatar_url, active, created_at, last_login_at FROM users WHERE id=$1",
    [req.params.id]
  );
  if (!users[0]) return res.status(404).json({ error: "User not found" });
  const { rows: activities } = await pool.query(
    "SELECT id, action, details, ip_address, created_at FROM user_activities WHERE user_id=$1 ORDER BY created_at DESC LIMIT 50",
    [req.params.id]
  );
  res.json({ user: users[0], activities });
});

/* ── Toggle user active status ── */
router.put("/admin/users/:id/toggle-active", requireAuth, async (req, res) => {
  const { rows } = await pool.query(
    "UPDATE users SET active = NOT active, updated_at=NOW() WHERE id=$1 RETURNING id, name, email, active",
    [req.params.id]
  );
  if (!rows[0]) return res.status(404).json({ error: "User not found" });
  res.json(rows[0]);
});

/* ── List password reset requests ── */
router.get("/admin/password-reset-requests", requireAuth, async (_req, res) => {
  const { rows } = await pool.query(`
    SELECT r.id, r.status, r.created_at, r.resolved_at,
           u.id AS user_id, u.name AS user_name, u.email AS user_email, u.phone AS user_phone
    FROM password_reset_requests r
    JOIN users u ON r.user_id = u.id
    ORDER BY r.created_at DESC
  `);
  res.json(rows);
});

/* ── Approve password reset ── */
router.post("/admin/password-reset-requests/:id/approve", requireAuth, async (req, res) => {
  const { rows } = await pool.query("SELECT * FROM password_reset_requests WHERE id=$1 AND status='pending'", [req.params.id]);
  if (!rows[0]) return res.status(404).json({ error: "Request not found or already processed" });
  const r = rows[0];
  await pool.query("UPDATE users SET password_hash=$1, updated_at=NOW() WHERE id=$2", [r.new_password_hash, r.user_id]);
  await pool.query("UPDATE password_reset_requests SET status='approved', resolved_at=NOW() WHERE id=$1", [r.id]);
  await pool.query("INSERT INTO user_activities (user_id, action, details) VALUES ($1,$2,$3)",
    [r.user_id, "password_reset_approved", "Password berhasil direset oleh admin"]);
  res.json({ ok: true });
});

/* ── Reject password reset ── */
router.post("/admin/password-reset-requests/:id/reject", requireAuth, async (req, res) => {
  const { rows } = await pool.query("UPDATE password_reset_requests SET status='rejected', resolved_at=NOW() WHERE id=$1 AND status='pending' RETURNING *", [req.params.id]);
  if (!rows[0]) return res.status(404).json({ error: "Request not found or already processed" });
  await pool.query("INSERT INTO user_activities (user_id, action, details) VALUES ($1,$2,$3)",
    [rows[0].user_id, "password_reset_rejected", "Permintaan reset password ditolak admin"]);
  res.json({ ok: true });
});

/* ── List delete account requests ── */
router.get("/admin/delete-account-requests", requireAuth, async (_req, res) => {
  const { rows } = await pool.query(`
    SELECT id, user_id, user_email, user_name, reason, status, created_at, resolved_at
    FROM delete_account_requests ORDER BY created_at DESC
  `);
  res.json(rows);
});

/* ── Approve delete account ── */
router.post("/admin/delete-account-requests/:id/approve", requireAuth, async (req, res) => {
  const { rows } = await pool.query("SELECT * FROM delete_account_requests WHERE id=$1 AND status='pending'", [req.params.id]);
  if (!rows[0]) return res.status(404).json({ error: "Request not found or already processed" });
  const r = rows[0];
  if (r.user_id) await pool.query("DELETE FROM users WHERE id=$1", [r.user_id]);
  await pool.query("UPDATE delete_account_requests SET status='approved', resolved_at=NOW() WHERE id=$1", [r.id]);
  res.json({ ok: true });
});

/* ── Reject delete account ── */
router.post("/admin/delete-account-requests/:id/reject", requireAuth, async (req, res) => {
  const { rows } = await pool.query("UPDATE delete_account_requests SET status='rejected', resolved_at=NOW() WHERE id=$1 AND status='pending' RETURNING *", [req.params.id]);
  if (!rows[0]) return res.status(404).json({ error: "Request not found or already processed" });
  res.json({ ok: true });
});

/* ── User activities ── */
router.get("/admin/user-activities", requireAuth, async (req, res) => {
  const limit = Number(req.query.limit) || 100;
  const { rows } = await pool.query(`
    SELECT a.id, a.action, a.details, a.ip_address, a.created_at,
           u.id AS user_id, u.name AS user_name, u.email AS user_email
    FROM user_activities a
    LEFT JOIN users u ON a.user_id = u.id
    ORDER BY a.created_at DESC LIMIT $1
  `, [limit]);
  res.json(rows);
});

export default router;
