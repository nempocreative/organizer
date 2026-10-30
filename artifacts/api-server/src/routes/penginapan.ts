import { Router } from "express";
import pool from "../lib/db";
import { requireAuth } from "../middlewares/auth";
import { optimizeImageUrl } from "../lib/media";
import { cleanDescription, cleanLocation, cleanPlaceName, cleanText } from "../lib/text";

const router = Router();

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[àáâãäå]/g, "a").replace(/[èéêë]/g, "e")
    .replace(/[ìíîï]/g, "i").replace(/[òóôõö]/g, "o")
    .replace(/[ùúûü]/g, "u").replace(/[ñ]/g, "n")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim().replace(/[\s_-]+/g, "-").replace(/^-+|-+$/g, "");
}

const RATING_QUERY = `
  SELECT
    p.*,
    COALESCE(r.review_count, 0) AS review_count,
    CASE WHEN COALESCE(r.review_count, 0) >= 5 THEN ROUND(r.avg_rating::numeric, 1) ELSE NULL END AS computed_rating
  FROM penginapan p
  LEFT JOIN (
    SELECT item_id, COUNT(*) AS review_count, AVG(rating) AS avg_rating
    FROM reviews
    WHERE item_type = 'penginapan' AND visible = true
    GROUP BY item_id
  ) r ON r.item_id = p.id
`;

function sanitizeRow<T extends {
  image?: unknown;
  name?: unknown;
  category?: unknown;
  location?: unknown;
  description?: unknown;
}>(row: T): T {
  return {
    ...row,
    name: cleanPlaceName(row.name) ?? row.name,
    category: cleanPlaceName(row.category) ?? row.category,
    location: cleanLocation(row.location) ?? row.location,
    description: cleanDescription(row.description, row.name, cleanPlaceName(row.name) ?? "") ?? row.description,
    image: optimizeImageUrl(row.image) ?? row.image,
  };
}

router.get("/penginapan", async (_req, res) => {
  const { rows } = await pool.query(`${RATING_QUERY} WHERE p.active=true ORDER BY p.featured DESC, p.id ASC`);
  res.json(rows.map(sanitizeRow));
});

router.get("/penginapan/:id", async (req, res) => {
  const param = req.params.id;
  const isNum = /^\d+$/.test(param);
  const { rows } = await pool.query(
    `${RATING_QUERY} WHERE (${isNum ? "p.id = $1::int" : "p.slug = $1"})`,
    [param]
  );
  if (!rows[0]) return res.status(404).json({ error: "Not found" });
  res.json(sanitizeRow(rows[0]));
});

router.get("/admin/penginapan", requireAuth, async (_req, res) => {
  const { rows } = await pool.query(`${RATING_QUERY} ORDER BY p.id ASC`);
  res.json(rows.map(sanitizeRow));
});

router.post("/admin/penginapan", requireAuth, async (req, res) => {
  const { name, category, rating, price_per_night, image, location, description, featured, active, instagram, booking_enabled } = req.body;
  const cleanName = cleanPlaceName(name) ?? "";
  const cleanCategory = cleanPlaceName(category) ?? "";
  const cleanLocationValue = cleanLocation(location);
  const cleanDescriptionValue = cleanDescription(description, name, cleanName);
  const cleanImage = optimizeImageUrl(image);
  const ins = await pool.query(
    `INSERT INTO penginapan (name, category, rating, price_per_night, image, location, description, featured, active, instagram, booking_enabled)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) RETURNING id`,
    [cleanName, cleanCategory, rating, price_per_night, cleanImage, cleanLocationValue, cleanDescriptionValue, featured ?? false, active ?? true, instagram ?? null, booking_enabled ?? false]
  );
  const id = ins.rows[0].id;
  const slug = `${slugify(cleanName)}-${id}`;
  const { rows } = await pool.query(
    `UPDATE penginapan SET slug=$1 WHERE id=$2 RETURNING *`,
    [slug, id]
  );
  res.status(201).json(sanitizeRow(rows[0]));
});

router.put("/admin/penginapan/:id", requireAuth, async (req, res) => {
  const { name, category, rating, price_per_night, image, location, description, featured, active, instagram, booking_enabled } = req.body;
  const cleanName = cleanPlaceName(name) ?? "";
  const cleanCategory = cleanPlaceName(category) ?? "";
  const cleanLocationValue = cleanLocation(location);
  const cleanDescriptionValue = cleanDescription(description, name, cleanName);
  const cleanImage = optimizeImageUrl(image);
  const slug = `${slugify(cleanName)}-${req.params.id}`;
  const { rows } = await pool.query(
    "UPDATE penginapan SET name=$1, category=$2, rating=$3, price_per_night=$4, image=$5, location=$6, description=$7, featured=$8, active=$9, instagram=$10, slug=$11, booking_enabled=$12, updated_at=NOW() WHERE id=$13 RETURNING *",
    [cleanName, cleanCategory, rating, price_per_night, cleanImage, cleanLocationValue, cleanDescriptionValue, featured, active, instagram ?? null, slug, booking_enabled ?? false, req.params.id]
  );
  if (!rows[0]) return res.status(404).json({ error: "Not found" });
  res.json(sanitizeRow(rows[0]));
});

router.delete("/admin/penginapan/bulk", requireAuth, async (req, res) => {
  const { ids } = req.body;
  if (!Array.isArray(ids) || ids.length === 0) return res.status(400).json({ error: "ids harus array tidak kosong" });
  const placeholders = ids.map((_: unknown, i: number) => `$${i + 1}`).join(",");
  const result = await pool.query(`DELETE FROM penginapan WHERE id IN (${placeholders})`, ids);
  res.json({ deleted: result.rowCount });
});

router.delete("/admin/penginapan/:id", requireAuth, async (req, res) => {
  await pool.query("DELETE FROM penginapan WHERE id=$1", [req.params.id]);
  res.json({ success: true });
});

export default router;
