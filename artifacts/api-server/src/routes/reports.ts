import { Router } from "express";
import pool from "../lib/db";
import { verifyToken } from "../lib/auth";

const router = Router();

async function ensureTable() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS user_reports (
      id          SERIAL PRIMARY KEY,
      user_id     INTEGER REFERENCES users(id) ON DELETE SET NULL,
      category    VARCHAR(50)  NOT NULL DEFAULT 'other',
      title       VARCHAR(200) NOT NULL,
      description TEXT         NOT NULL,
      platform    VARCHAR(50),
      app_version VARCHAR(20),
      status      VARCHAR(20)  NOT NULL DEFAULT 'open',
      created_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW()
    )
  `);
}
ensureTable().catch(() => {});

router.post("/user/reports", async (req, res) => {
  const auth = req.headers.authorization?.split(" ")[1];
  const payload = auth ? verifyToken(auth) : null;
  const userId: number | null = payload?.id ?? null;

  const { category, title, description, platform, app_version } = req.body;
  if (!title?.trim() || !description?.trim()) {
    return res.status(400).json({ error: "Judul dan deskripsi wajib diisi" });
  }

  try {
    const { rows } = await pool.query(
      `INSERT INTO user_reports (user_id, category, title, description, platform, app_version)
       VALUES ($1,$2,$3,$4,$5,$6) RETURNING id, created_at`,
      [userId, category ?? "other", title.trim(), description.trim(), platform ?? null, app_version ?? null]
    );
    res.status(201).json({ success: true, id: rows[0].id, created_at: rows[0].created_at });
  } catch (e) {
    res.status(500).json({ error: "Gagal menyimpan laporan" });
  }
});

router.get("/admin/reports", async (req, res) => {
  const auth = req.headers.authorization?.split(" ")[1];
  const payload = auth ? verifyToken(auth) : null;
  if (!payload || payload.role !== "admin") return res.status(403).json({ error: "Forbidden" });

  const { rows } = await pool.query(`
    SELECT r.*, u.name as user_name, u.email as user_email
    FROM user_reports r
    LEFT JOIN users u ON r.user_id = u.id
    ORDER BY r.created_at DESC LIMIT 100
  `);
  res.json({ reports: rows });
});

export default router;
