import { Router } from "express";
import pool from "../lib/db";
import { requireAuth } from "../middlewares/auth";

const router = Router();

async function ensureTable() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS talents (
      id           SERIAL PRIMARY KEY,
      name         VARCHAR(200) NOT NULL,
      role         VARCHAR(200) NOT NULL DEFAULT '',
      category     VARCHAR(100) NOT NULL DEFAULT 'mc',
      tagline      TEXT NOT NULL DEFAULT '',
      instagram    VARCHAR(200) NOT NULL DEFAULT '',
      tags         TEXT[] NOT NULL DEFAULT '{}',
      verified     BOOLEAN NOT NULL DEFAULT false,
      featured     BOOLEAN NOT NULL DEFAULT false,
      bio          TEXT NOT NULL DEFAULT '',
      wa           VARCHAR(50) NOT NULL DEFAULT '',
      photo        TEXT NOT NULL DEFAULT '',
      sort_order   INTEGER NOT NULL DEFAULT 0,
      active       BOOLEAN NOT NULL DEFAULT true,
      created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);
}

ensureTable().catch(() => {});

function toArray(val: unknown): string[] {
  if (Array.isArray(val)) return val.map(String).map(s => s.trim()).filter(Boolean);
  if (typeof val === "string") return val.split(",").map(s => s.trim()).filter(Boolean);
  return [];
}

/* ── Public ── */
router.get("/talents", async (_req, res) => {
  const { rows } = await pool.query(
    "SELECT * FROM talents WHERE active = true ORDER BY featured DESC, sort_order ASC, id ASC"
  );
  res.json(rows);
});

router.get("/talents/:id", async (req, res) => {
  const { rows } = await pool.query(
    "SELECT * FROM talents WHERE id = $1 AND active = true",
    [req.params.id]
  );
  if (!rows[0]) return res.status(404).json({ error: "Not found" });
  res.json(rows[0]);
});

/* ── Admin ── */
router.get("/admin/talents", requireAuth, async (_req, res) => {
  const { rows } = await pool.query(
    "SELECT * FROM talents ORDER BY sort_order ASC, id ASC"
  );
  res.json(rows);
});

router.post("/admin/talents", requireAuth, async (req, res) => {
  const { name, role, category, tagline, instagram, tags, verified, featured, bio, wa, photo, sort_order, active } = req.body;
  const { rows } = await pool.query(
    `INSERT INTO talents (name, role, category, tagline, instagram, tags, verified, featured, bio, wa, photo, sort_order, active)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13) RETURNING *`,
    [name, role ?? "", category ?? "mc", tagline ?? "", instagram ?? "", toArray(tags),
     verified ?? false, featured ?? false, bio ?? "", wa ?? "", photo ?? "",
     sort_order ?? 0, active ?? true]
  );
  res.status(201).json(rows[0]);
});

router.put("/admin/talents/:id", requireAuth, async (req, res) => {
  const { name, role, category, tagline, instagram, tags, verified, featured, bio, wa, photo, sort_order, active } = req.body;
  const { rows } = await pool.query(
    `UPDATE talents SET name=$1, role=$2, category=$3, tagline=$4, instagram=$5, tags=$6,
     verified=$7, featured=$8, bio=$9, wa=$10, photo=$11, sort_order=$12, active=$13, updated_at=NOW()
     WHERE id=$14 RETURNING *`,
    [name, role ?? "", category ?? "mc", tagline ?? "", instagram ?? "", toArray(tags),
     verified ?? false, featured ?? false, bio ?? "", wa ?? "", photo ?? "",
     sort_order ?? 0, active ?? true, req.params.id]
  );
  if (!rows[0]) return res.status(404).json({ error: "Not found" });
  res.json(rows[0]);
});

router.delete("/admin/talents/bulk", requireAuth, async (req, res) => {
  const { ids } = req.body;
  if (!Array.isArray(ids) || ids.length === 0) return res.status(400).json({ error: "ids harus array tidak kosong" });
  const placeholders = ids.map((_: unknown, i: number) => `$${i + 1}`).join(",");
  const result = await pool.query(`DELETE FROM talents WHERE id IN (${placeholders})`, ids);
  res.json({ deleted: result.rowCount });
});

router.delete("/admin/talents/:id", requireAuth, async (req, res) => {
  await pool.query("DELETE FROM talents WHERE id = $1", [req.params.id]);
  res.json({ success: true });
});

/* ── Talent Portfolio ── */
async function ensurePortfolioTable() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS talent_portfolio (
      id          SERIAL PRIMARY KEY,
      type        VARCHAR(10)  NOT NULL DEFAULT 'photo',
      title       TEXT         NOT NULL DEFAULT '',
      talent_name VARCHAR(200) NOT NULL DEFAULT '',
      role        VARCHAR(200) NOT NULL DEFAULT '',
      thumb       TEXT         NOT NULL DEFAULT '',
      youtube_id  VARCHAR(100),
      duration    VARCHAR(20),
      category    VARCHAR(100) NOT NULL DEFAULT '',
      sort_order  INTEGER      NOT NULL DEFAULT 0,
      active      BOOLEAN      NOT NULL DEFAULT true,
      created_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW()
    )
  `);
}
ensurePortfolioTable().catch(() => {});

router.get("/talent-portfolio", async (_req, res) => {
  try {
    const { rows } = await pool.query(
      "SELECT * FROM talent_portfolio WHERE active = true ORDER BY sort_order ASC, id ASC"
    );
    res.json(rows);
  } catch { res.status(500).json({ error: "Server error" }); }
});

router.get("/admin/talent-portfolio", requireAuth, async (_req, res) => {
  const { rows } = await pool.query("SELECT * FROM talent_portfolio ORDER BY sort_order ASC, id ASC");
  res.json(rows);
});

router.post("/admin/talent-portfolio", requireAuth, async (req, res) => {
  const { type, title, talent_name, role, thumb, youtube_id, duration, category, sort_order, active } = req.body;
  const { rows } = await pool.query(
    `INSERT INTO talent_portfolio (type, title, talent_name, role, thumb, youtube_id, duration, category, sort_order, active)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *`,
    [type ?? "photo", title ?? "", talent_name ?? "", role ?? "", thumb ?? "",
     youtube_id || null, duration || null, category ?? "", sort_order ?? 0, active ?? true]
  );
  res.status(201).json(rows[0]);
});

router.put("/admin/talent-portfolio/:id", requireAuth, async (req, res) => {
  const { type, title, talent_name, role, thumb, youtube_id, duration, category, sort_order, active } = req.body;
  const { rows } = await pool.query(
    `UPDATE talent_portfolio SET type=$1, title=$2, talent_name=$3, role=$4, thumb=$5,
     youtube_id=$6, duration=$7, category=$8, sort_order=$9, active=$10 WHERE id=$11 RETURNING *`,
    [type, title, talent_name, role, thumb, youtube_id || null, duration || null,
     category, sort_order ?? 0, active ?? true, req.params.id]
  );
  if (!rows[0]) return res.status(404).json({ error: "Not found" });
  res.json(rows[0]);
});

router.delete("/admin/talent-portfolio/:id", requireAuth, async (req, res) => {
  await pool.query("DELETE FROM talent_portfolio WHERE id=$1", [req.params.id]);
  res.json({ success: true });
});

/* ── Talent Banner ── */
async function ensureBannerTable() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS talent_banner (
      id         SERIAL PRIMARY KEY,
      video_url  TEXT NOT NULL DEFAULT '',
      poster_url TEXT NOT NULL DEFAULT '',
      active     BOOLEAN NOT NULL DEFAULT true,
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);
  // seed default row
  await pool.query(`
    INSERT INTO talent_banner (video_url, poster_url, active)
    SELECT '/banner-talent.mp4', '/banner-talent-poster.webp', true
    WHERE NOT EXISTS (SELECT 1 FROM talent_banner)
  `);
}
ensureBannerTable().catch(() => {});

router.get("/talent-banner", async (_req, res) => {
  try {
    const { rows } = await pool.query("SELECT * FROM talent_banner WHERE active = true LIMIT 1");
    res.json(rows[0] ?? null);
  } catch { res.status(500).json({ error: "Server error" }); }
});

router.get("/admin/talent-banner", requireAuth, async (_req, res) => {
  const { rows } = await pool.query("SELECT * FROM talent_banner ORDER BY id ASC");
  res.json(rows);
});

router.post("/admin/talent-banner", requireAuth, async (req, res) => {
  const { video_url, poster_url, active } = req.body;
  const { rows } = await pool.query(
    "INSERT INTO talent_banner (video_url, poster_url, active) VALUES ($1,$2,$3) RETURNING *",
    [video_url ?? "", poster_url ?? "", active ?? true]
  );
  res.status(201).json(rows[0]);
});

router.put("/admin/talent-banner/:id", requireAuth, async (req, res) => {
  const { video_url, poster_url, active } = req.body;
  const { rows } = await pool.query(
    "UPDATE talent_banner SET video_url=COALESCE(NULLIF($1,''), video_url), poster_url=COALESCE(NULLIF($2,''), poster_url), active=$3, updated_at=NOW() WHERE id=$4 RETURNING *",
    [video_url ?? "", poster_url ?? "", active ?? true, req.params.id]
  );
  if (!rows[0]) return res.status(404).json({ error: "Not found" });
  res.json(rows[0]);
});

router.delete("/admin/talent-banner/:id", requireAuth, async (req, res) => {
  await pool.query("DELETE FROM talent_banner WHERE id=$1", [req.params.id]);
  res.json({ success: true });
});

export default router;
