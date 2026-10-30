import { Router } from "express";
import pool from "../lib/db";
import { requireAuth } from "../middlewares/auth";
import { optimizeImageUrl, parsePhotoList } from "../lib/media";

const router = Router();

function toArray(val: unknown): string[] {
  if (Array.isArray(val)) return val.map(String).map(s => s.trim()).filter(Boolean);
  if (typeof val === "string") return val.split(",").map(s => s.trim()).filter(Boolean);
  return [];
}

function normalizeInfluencer(row: any) {
  return {
    ...row,
    photos: parsePhotoList(row.photos).map(photo => optimizeImageUrl(photo) ?? photo),
  };
}

router.get("/influencers", async (_req, res) => {
  const { rows } = await pool.query(
    `SELECT * FROM influencers WHERE active = true ORDER BY sort_order ASC, id ASC`
  );
  res.json(rows.map(normalizeInfluencer));
});

router.get("/influencers/:id", async (req, res) => {
  const { rows } = await pool.query(
    `SELECT * FROM influencers WHERE id = $1 AND active = true`,
    [req.params.id]
  );
  if (!rows[0]) return res.status(404).json({ error: "Not found" });
  res.json(normalizeInfluencer(rows[0]));
});

router.get("/admin/influencers", requireAuth, async (_req, res) => {
  const { rows } = await pool.query(
    `SELECT * FROM influencers ORDER BY sort_order ASC, id ASC`
  );
  res.json(rows.map(normalizeInfluencer));
});

router.post("/admin/influencers", requireAuth, async (req, res) => {
  const {
    name, handle, instagram, tiktok, verified, color, color2,
    niches, location, rating, rate, bio, photos, active, sort_order,
  } = req.body;
  const { rows } = await pool.query(
    `INSERT INTO influencers
      (name, handle, instagram, tiktok, verified, color, color2, niches, location, rating, rate, bio, photos, active, sort_order)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15)
     RETURNING *`,
    [
      name, handle ?? "", instagram ?? "", tiktok ?? "", verified ?? false,
      color ?? "#EC4899", color2 ?? "#be185d", toArray(niches), location ?? "",
      rating ?? 0, rate ?? "", bio ?? "", toArray(photos), active ?? true, sort_order ?? 0,
    ]
  );
  res.status(201).json(rows[0]);
});

router.put("/admin/influencers/:id", requireAuth, async (req, res) => {
  const {
    name, handle, instagram, tiktok, verified, color, color2,
    niches, location, rating, rate, bio, photos, active, sort_order,
  } = req.body;
  const existing = await pool.query("SELECT photos FROM influencers WHERE id=$1", [req.params.id]);
  if (!existing.rows[0]) return res.status(404).json({ error: "Not found" });
  const sourcePhotos = photos === undefined ? existing.rows[0].photos : photos;
  const { rows } = await pool.query(
    `UPDATE influencers SET
      name=$1, handle=$2, instagram=$3, tiktok=$4, verified=$5, color=$6, color2=$7,
      niches=$8, location=$9, rating=$10, rate=$11, bio=$12, photos=$13, active=$14,
      sort_order=$15, updated_at=NOW()
     WHERE id=$16 RETURNING *`,
    [
      name, handle ?? "", instagram ?? "", tiktok ?? "", verified ?? false,
      color ?? "#EC4899", color2 ?? "#be185d", toArray(niches), location ?? "",
      rating ?? 0, rate ?? "", bio ?? "", parsePhotoList(sourcePhotos), active ?? true, sort_order ?? 0,
      req.params.id,
    ]
  );
  if (!rows[0]) return res.status(404).json({ error: "Not found" });
  res.json(rows[0]);
});

router.delete("/admin/influencers/bulk", requireAuth, async (req, res) => {
  const { ids } = req.body;
  if (!Array.isArray(ids) || ids.length === 0) return res.status(400).json({ error: "ids harus array tidak kosong" });
  const placeholders = ids.map((_: unknown, i: number) => `$${i + 1}`).join(",");
  const result = await pool.query(`DELETE FROM influencers WHERE id IN (${placeholders})`, ids);
  res.json({ deleted: result.rowCount });
});

router.delete("/admin/influencers/:id", requireAuth, async (req, res) => {
  await pool.query("DELETE FROM influencers WHERE id=$1", [req.params.id]);
  res.json({ success: true });
});

/* ── Influencer Banner Photos ── */
async function ensureBannerPhotosTable() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS influencer_banner_photos (
      id          SERIAL PRIMARY KEY,
      url         TEXT        NOT NULL DEFAULT '',
      use_as_hero BOOLEAN     NOT NULL DEFAULT false,
      sort_order  INTEGER     NOT NULL DEFAULT 0,
      active      BOOLEAN     NOT NULL DEFAULT true,
      created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);
}
ensureBannerPhotosTable().catch(() => {});

router.get("/influencer-banner-photos", async (_req, res) => {
  try {
    const { rows } = await pool.query(
      "SELECT * FROM influencer_banner_photos WHERE active = true ORDER BY sort_order ASC, id ASC"
    );
    res.json(rows.map((row: any) => ({ ...row, url: optimizeImageUrl(row.url) ?? row.url })));
  } catch { res.status(500).json({ error: "Server error" }); }
});

router.get("/admin/influencer-banner-photos", requireAuth, async (_req, res) => {
  const { rows } = await pool.query(
    "SELECT * FROM influencer_banner_photos ORDER BY sort_order ASC, id ASC"
  );
  res.json(rows);
});

router.post("/admin/influencer-banner-photos", requireAuth, async (req, res) => {
  const { url, use_as_hero, sort_order, active } = req.body;
  const { rows } = await pool.query(
    "INSERT INTO influencer_banner_photos (url, use_as_hero, sort_order, active) VALUES ($1,$2,$3,$4) RETURNING *",
    [url ?? "", use_as_hero ?? false, sort_order ?? 0, active ?? true]
  );
  res.status(201).json(rows[0]);
});

router.put("/admin/influencer-banner-photos/:id", requireAuth, async (req, res) => {
  const { url, use_as_hero, sort_order, active } = req.body;
  const { rows } = await pool.query(
    "UPDATE influencer_banner_photos SET url=$1, use_as_hero=$2, sort_order=$3, active=$4 WHERE id=$5 RETURNING *",
    [url, use_as_hero ?? false, sort_order ?? 0, active ?? true, req.params.id]
  );
  if (!rows[0]) return res.status(404).json({ error: "Not found" });
  res.json(rows[0]);
});

router.delete("/admin/influencer-banner-photos/bulk", requireAuth, async (req, res) => {
  const { ids } = req.body;
  if (!Array.isArray(ids) || ids.length === 0) return res.status(400).json({ error: "ids harus array" });
  const placeholders = ids.map((_: unknown, i: number) => `$${i + 1}`).join(",");
  const result = await pool.query(`DELETE FROM influencer_banner_photos WHERE id IN (${placeholders})`, ids);
  res.json({ deleted: result.rowCount });
});

router.delete("/admin/influencer-banner-photos/:id", requireAuth, async (req, res) => {
  await pool.query("DELETE FROM influencer_banner_photos WHERE id=$1", [req.params.id]);
  res.json({ success: true });
});

export default router;
