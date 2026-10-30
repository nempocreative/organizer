import { Router } from "express";
import pool from "../lib/db";
import { requireAuth } from "../middlewares/auth";
import { optimizeImageUrl, parsePhotoList } from "../lib/media";
import { cleanDescription, cleanLocation, cleanPlaceName, cleanText } from "../lib/text";

const router = Router();
const MAX_WISATA_PHOTOS = 4;

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
    w.*,
    COALESCE(r.review_count, 0) AS review_count,
    CASE WHEN COALESCE(r.review_count, 0) >= 5 THEN ROUND(r.avg_rating::numeric, 1) ELSE NULL END AS computed_rating
  FROM wisata w
  LEFT JOIN (
    SELECT item_id, COUNT(*) AS review_count, AVG(rating) AS avg_rating
    FROM reviews
    WHERE item_type = 'wisata' AND visible = true
    GROUP BY item_id
  ) r ON r.item_id = w.id
`;

function photoIdentity(photo: string): string {
  const value = optimizeImageUrl(photo) ?? "";
  if (!value) return "";
  try {
    const url = new URL(value);
    url.hash = "";
    url.search = "";
    return url.toString().replace(/\/$/, "").toLowerCase();
  } catch {
    return value.replace(/\s+/g, " ").replace(/\/$/, "").toLowerCase();
  }
}

function normalizeWisataPhotos(photos: unknown, mainImage?: unknown): string[] {
  const seen = new Set<string>();
  const mainKey = typeof mainImage === "string" ? photoIdentity(mainImage) : "";
  return parsePhotoList(photos)
    .map(photo => optimizeImageUrl(photo))
    .filter((photo): photo is string => Boolean(photo))
    .filter(photo => {
      const key = photoIdentity(photo);
      if (!key || key === mainKey || seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .slice(0, Math.max(0, MAX_WISATA_PHOTOS - (optimizeImageUrl(mainImage) ? 1 : 0)));
}

function sanitizeRow<T extends {
  image?: unknown;
  photos?: unknown;
  name?: unknown;
  category?: unknown;
  location?: unknown;
  description?: unknown;
  opening_hours?: unknown;
}>(row: T): T {
  const image = optimizeImageUrl(row.image) ?? row.image;
  return {
    ...row,
    name: cleanPlaceName(row.name) ?? row.name,
    category: cleanPlaceName(row.category) ?? row.category,
    location: cleanLocation(row.location) ?? row.location,
    description: cleanDescription(row.description, row.name, cleanPlaceName(row.name) ?? "") ?? row.description,
    opening_hours: cleanText(row.opening_hours) ?? row.opening_hours,
    image,
    photos: normalizeWisataPhotos(row.photos, image),
  };
}

router.get("/wisata", async (_req, res) => {
  const { rows } = await pool.query(
    `${RATING_QUERY} WHERE w.active = true
     ORDER BY (
       (
         COALESCE(r.review_count, 0)::numeric
         / (COALESCE(r.review_count, 0) + 5)
       ) * COALESCE(r.avg_rating, w.rating, 0)
       + (
         5::numeric / (COALESCE(r.review_count, 0) + 5)
       ) * 4.0
     ) DESC,
     COALESCE(r.review_count, 0) DESC,
     COALESCE(r.avg_rating, w.rating, 0) DESC,
     w.id ASC`
  );
  res.json(rows.map(sanitizeRow));
});

router.get("/wisata/:id", async (req, res) => {
  const param = req.params.id;
  const isNum = /^\d+$/.test(param);
  const { rows } = await pool.query(
    `${RATING_QUERY} WHERE (${isNum ? "w.id = $1::int" : "w.slug = $1"}) AND w.active = true`,
    [param]
  );
  if (!rows[0]) return res.status(404).json({ error: "Not found" });
  res.json(sanitizeRow(rows[0]));
});

router.get("/admin/wisata", requireAuth, async (_req, res) => {
  const { rows } = await pool.query(
    `${RATING_QUERY} ORDER BY w.id ASC`
  );
  res.json(rows.map(sanitizeRow));
});

router.post("/admin/wisata", requireAuth, async (req, res) => {
  const { name, category, image, location, description, partner, active,
          phone, website, opening_hours, facilities, maps_embed_url, google_maps_url, instagram, photos } = req.body;
  const cleanName = cleanPlaceName(name) ?? "";
  const cleanCategory = cleanPlaceName(category) ?? "";
  const cleanLocationValue = cleanLocation(location);
  const cleanDescriptionValue = cleanDescription(description, name, cleanName);
  const cleanHours = cleanText(opening_hours);
  const cleanImage = optimizeImageUrl(image);
  const cleanPhotos = normalizeWisataPhotos(photos, cleanImage);
  const ins = await pool.query(
    `INSERT INTO wisata (name,category,image,location,description,partner,active,
      phone,website,opening_hours,facilities,maps_embed_url,google_maps_url,instagram,photos)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15) RETURNING id`,
    [cleanName, cleanCategory, cleanImage, cleanLocationValue, cleanDescriptionValue, partner ?? false, active ?? true,
     phone ?? null, website ?? null, cleanHours ?? "08.00 - 17.00",
     facilities ?? null, maps_embed_url ?? null, google_maps_url ?? null, instagram ?? null, JSON.stringify(cleanPhotos)]
  );
  const id = ins.rows[0].id;
  const slug = `${slugify(cleanName)}-${id}`;
  const { rows } = await pool.query(
    `UPDATE wisata SET slug=$1 WHERE id=$2 RETURNING *`,
    [slug, id]
  );
  res.status(201).json(sanitizeRow(rows[0]));
});

router.put("/admin/wisata/:id", requireAuth, async (req, res) => {
  const { name, category, image, location, description, partner, active,
          phone, website, opening_hours, facilities, maps_embed_url, google_maps_url, instagram, photos } = req.body;
  const existing = await pool.query("SELECT image, photos FROM wisata WHERE id=$1", [req.params.id]);
  if (!existing.rows[0]) return res.status(404).json({ error: "Not found" });
  const sourceImage = image === undefined ? existing.rows[0].image : image;
  const sourcePhotos = photos === undefined ? existing.rows[0].photos : photos;
  const cleanName = cleanPlaceName(name) ?? "";
  const cleanCategory = cleanPlaceName(category) ?? "";
  const cleanLocationValue = cleanLocation(location);
  const cleanDescriptionValue = cleanDescription(description, name, cleanName);
  const cleanHours = cleanText(opening_hours);
  const cleanImage = optimizeImageUrl(sourceImage);
  const cleanPhotos = normalizeWisataPhotos(sourcePhotos, cleanImage);
  const slug = `${slugify(cleanName)}-${req.params.id}`;
  const { rows } = await pool.query(
    `UPDATE wisata SET name=$1, category=$2, image=$3, location=$4, description=$5,
      partner=$6, active=$7, phone=$8, website=$9, opening_hours=$10,
      facilities=$11, maps_embed_url=$12, google_maps_url=$13, instagram=$14, photos=$15,
      slug=$16, updated_at=NOW()
     WHERE id=$17 RETURNING *`,
    [cleanName, cleanCategory, cleanImage, cleanLocationValue, cleanDescriptionValue, partner, active,
     phone ?? null, website ?? null, cleanHours ?? "08.00 - 17.00",
     facilities ?? null, maps_embed_url ?? null, google_maps_url ?? null, instagram ?? null,
     JSON.stringify(cleanPhotos), slug, req.params.id]
  );
  if (!rows[0]) return res.status(404).json({ error: "Not found" });
  res.json(sanitizeRow(rows[0]));
});

router.delete("/admin/wisata/bulk", requireAuth, async (req, res) => {
  const { ids } = req.body;
  if (!Array.isArray(ids) || ids.length === 0) return res.status(400).json({ error: "ids harus array tidak kosong" });
  const placeholders = ids.map((_: unknown, i: number) => `$${i + 1}`).join(",");
  const result = await pool.query(`DELETE FROM wisata WHERE id IN (${placeholders})`, ids);
  res.json({ deleted: result.rowCount });
});

router.delete("/admin/wisata/:id", requireAuth, async (req, res) => {
  await pool.query("DELETE FROM wisata WHERE id=$1", [req.params.id]);
  res.json({ success: true });
});

export default router;
