import { Router } from "express";
import pool from "../lib/db";
import { requireAuth } from "../middlewares/auth";

const router = Router();

/* ── Public: stats ─────────────────────────────────────── */
router.get("/donations/stats", async (_req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT
        COALESCE(SUM(quantity), 0)::int           AS total_bibit,
        COUNT(*)::int                              AS total_submissions,
        COUNT(DISTINCT LOWER(donor_email))::int    AS total_donors,
        COALESCE(SUM(CASE WHEN status='planted' OR status='completed' THEN quantity ELSE 0 END), 0)::int AS pohon_tumbuh,
        COUNT(CASE WHEN status='pending'   THEN 1 END)::int AS pending,
        COUNT(CASE WHEN status='confirmed' THEN 1 END)::int AS confirmed,
        COUNT(CASE WHEN status='planted'   THEN 1 END)::int AS planted,
        COUNT(CASE WHEN status='completed' THEN 1 END)::int AS completed
      FROM donations
    `);
    res.json(rows[0]);
  } catch (e) {
    res.status(500).json({ error: "Server error" });
  }
});

/* ── Public: recent activity (non-anonymous) ───────────── */
router.get("/donations/activity", async (_req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT id, donor_name, bibit_type, bibit_custom_name, quantity, location_name, status, created_at
      FROM donations
      WHERE show_in_profile = true
      ORDER BY created_at DESC
      LIMIT 20
    `);
    res.json(rows);
  } catch (e) {
    res.status(500).json({ error: "Server error" });
  }
});

/* ── Public: submit donation ────────────────────────────── */
router.post("/donations", async (req, res) => {
  const { donor_name, donor_email, bibit_type, bibit_custom_name, quantity, location_id, location_name, delivery_type, show_in_profile, message, user_id } = req.body;
  if (!donor_name || !bibit_type || !quantity || !location_id || !location_name) {
    return res.status(400).json({ error: "Data tidak lengkap" });
  }
  try {
    const { rows } = await pool.query(
      `INSERT INTO donations
        (donor_name, donor_email, bibit_type, bibit_custom_name, quantity, location_id, location_name, delivery_type, show_in_profile, message, user_id)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
       RETURNING id, donor_name, quantity, status, created_at`,
      [
        donor_name, donor_email ?? null, bibit_type,
        bibit_custom_name ?? null, Number(quantity),
        location_id, location_name,
        delivery_type ?? "pickup",
        show_in_profile !== false,
        message ?? null,
        user_id ?? null,
      ]
    );
    res.status(201).json(rows[0]);
  } catch (e) {
    res.status(500).json({ error: "Server error" });
  }
});

/* ── Admin: list all donations ─────────────────────────── */
router.get("/admin/donations", requireAuth, async (req, res) => {
  const { status } = req.query;
  let q = "SELECT * FROM donations";
  const params: string[] = [];
  if (status && status !== "all") {
    q += " WHERE status=$1";
    params.push(String(status));
  }
  q += " ORDER BY created_at DESC";
  const { rows } = await pool.query(q, params);
  res.json(rows);
});

/* ── Admin: update donation ─────────────────────────────── */
router.put("/admin/donations/:id", requireAuth, async (req, res) => {
  const { status, photo_url, message } = req.body;
  const { rows } = await pool.query(
    `UPDATE donations SET
       status    = COALESCE($1, status),
       photo_url = COALESCE($2, photo_url),
       message   = COALESCE($3, message),
       updated_at = NOW()
     WHERE id = $4 RETURNING *`,
    [status ?? null, photo_url ?? null, message ?? null, req.params.id]
  );
  if (!rows[0]) return res.status(404).json({ error: "Not found" });
  res.json(rows[0]);
});

/* ── Admin: delete donation ─────────────────────────────── */
router.delete("/admin/donations/:id", requireAuth, async (req, res) => {
  await pool.query("DELETE FROM donations WHERE id=$1", [req.params.id]);
  res.json({ ok: true });
});

export default router;
