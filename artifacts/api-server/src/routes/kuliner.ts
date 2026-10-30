import { Router } from "express";
import pool from "../lib/db";
import { requireAuth } from "../middlewares/auth";
import { optimizeImageUrl, parsePhotoList } from "../lib/media";
import { cleanCommaList, cleanDescription, cleanLocation, cleanPlaceName, cleanText } from "../lib/text";
import sharp from "sharp";

const router = Router();
const CAFE_PHOTO_POLICY_ERROR = "Foto Cafe hanya boleh menampilkan lokasi dan suasana, tanpa makanan atau minuman";
const CAFE_PHOTO_DUPLICATE_ERROR = "Foto Cafe tidak boleh menggunakan foto yang sama lebih dari sekali";
const CAFE_PHOTO_LIMIT_ERROR = "Foto Cafe maksimal 4 foto termasuk foto utama";
const MAX_CAFE_PHOTOS = 4;
const CAFE_PHOTO_HOSTS_TO_VERIFY = ["googleusercontent.com", "ggpht.com", "wanderlogstatic.com"];
const CAFE_PHOTO_HASH_DISTANCE_THRESHOLD = 16;

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
    k.*,
    COALESCE(r.review_count, 0) AS review_count,
    CASE WHEN COALESCE(r.review_count, 0) >= 5 THEN ROUND(r.avg_rating::numeric, 1) ELSE NULL END AS computed_rating
  FROM kuliner k
  LEFT JOIN (
    SELECT item_id, COUNT(*) AS review_count, AVG(rating) AS avg_rating
    FROM reviews
    WHERE item_type = 'kuliner' AND visible = true
    GROUP BY item_id
  ) r ON r.item_id = k.id
`;

function photoIdentity(photo: string): string {
  const value = optimizeImageUrl(photo) ?? "";
  if (!value) return "";

  try {
    const url = new URL(value);
    url.hash = "";
    // Google Maps image URLs can have resize/query parameters for the same photo.
    url.search = "";
    return url.toString().replace(/\/$/, "").toLowerCase();
  } catch {
    return value.replace(/\s+/g, " ").replace(/\/$/, "").toLowerCase();
  }
}

function canVerifyPhotoContent(photo: string): boolean {
  try {
    const hostname = new URL(photo).hostname.toLowerCase();
    return CAFE_PHOTO_HOSTS_TO_VERIFY.some(host => hostname === host || hostname.endsWith(`.${host}`));
  } catch {
    return false;
  }
}

async function photoContentIdentity(photo: string): Promise<string | null> {
  const value = optimizeImageUrl(photo);
  if (!value || !canVerifyPhotoContent(value)) return null;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 5000);
  try {
    const response = await fetch(value, {
      signal: controller.signal,
      headers: { Accept: "image/*" },
    });
    if (!response.ok) return null;

    const contentLength = Number(response.headers.get("content-length") ?? 0);
    if (contentLength > 8 * 1024 * 1024) return null;

    const source = Buffer.from(await response.arrayBuffer());
    if (source.length === 0 || source.length > 8 * 1024 * 1024) return null;

    // Reduce to a perceptual hash so the same photo in JPG/WebP, with a
    // different delivery size, or with a small crop has the same identity.
    const { data } = await sharp(source)
      .rotate()
      .resize({ width: 32, height: 32, fit: "cover", position: "centre", withoutEnlargement: false })
      .grayscale()
      .raw()
      .toBuffer({ resolveWithObject: true });
    const average = data.reduce((sum, value) => sum + value, 0) / data.length;
    return [...data].map(value => value >= average ? "1" : "0").join("");
  } catch {
    return null;
  } finally {
    clearTimeout(timeout);
  }
}

function normalizePhotos(photos: unknown, mainImage?: unknown): string[] {
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
    });
}

function normalizeCafePhotos(photos: unknown, mainImage?: unknown): string[] {
  const maxGalleryPhotos = Math.max(0, MAX_CAFE_PHOTOS - (optimizeImageUrl(mainImage) ? 1 : 0));
  return normalizePhotos(photos, mainImage).slice(0, maxGalleryPhotos);
}

function validateCafePhotoLimit(photos: unknown, mainImage?: unknown): string | null {
  const uniquePhotos = new Set<string>();
  const candidates = [
    ...(typeof mainImage === "string" ? [mainImage] : []),
    ...parsePhotoList(photos),
  ];

  for (const photo of candidates) {
    const key = photoIdentity(photo);
    if (key) uniquePhotos.add(key);
  }

  return uniquePhotos.size > MAX_CAFE_PHOTOS ? CAFE_PHOTO_LIMIT_ERROR : null;
}

function sanitizeRow<T extends {
  photos?: unknown;
  image?: unknown;
  name?: unknown;
  category?: unknown;
  location?: unknown;
  description?: unknown;
  hours?: unknown;
  facilities?: unknown;
}>(row: T): T {
  const image = optimizeImageUrl(row.image) ?? row.image;
  return {
    ...row,
    name: cleanPlaceName(row.name) ?? row.name,
    category: cleanPlaceName(row.category) ?? row.category,
    location: cleanLocation(row.location) ?? row.location,
    description: cleanDescription(row.description, row.name, cleanPlaceName(row.name) ?? "") ?? row.description,
    hours: cleanText(row.hours) ?? row.hours,
    facilities: cleanCommaList(row.facilities) ?? row.facilities,
    image,
    photos: cleanPlaceName(row.category) === "Cafe"
      ? normalizeCafePhotos(row.photos, image)
      : normalizePhotos(row.photos, image),
  };
}

function validateCafePhotos(photos: unknown, mainImage?: unknown): string | null {
  const seen = new Set<string>();
  const candidates = [
    ...(typeof mainImage === "string" ? [mainImage] : []),
    ...parsePhotoList(photos),
  ];

  for (const photo of candidates) {
    const key = photoIdentity(photo);
    if (!key) continue;
    if (seen.has(key)) return "Foto Cafe tidak boleh menggunakan foto yang sama lebih dari sekali";
    seen.add(key);
  }

  return null;
}

function validateCafePhotoPolicy(confirmed: unknown): string | null {
  return confirmed === true ? null : CAFE_PHOTO_POLICY_ERROR;
}

async function validateCafePhotoContent(photos: unknown, mainImage?: unknown): Promise<string | null> {
  const candidates = [
    ...(typeof mainImage === "string" ? [mainImage] : []),
    ...parsePhotoValues(photos),
  ];
  const identities = await Promise.all(candidates.map(photoContentIdentity));
  const seen: string[] = [];

  for (const identity of identities) {
    if (!identity) continue;
    if (seen.some(previous => perceptualHashDistance(previous, identity) <= CAFE_PHOTO_HASH_DISTANCE_THRESHOLD)) {
      return CAFE_PHOTO_DUPLICATE_ERROR;
    }
    seen.push(identity);
  }

  return null;
}

function perceptualHashDistance(first: string, second: string): number {
  if (first.length !== second.length) return Number.MAX_SAFE_INTEGER;
  let distance = 0;
  for (let index = 0; index < first.length; index += 1) {
    if (first[index] !== second[index]) distance += 1;
  }
  return distance;
}

router.get("/kuliner", async (_req, res) => {
  const { rows } = await pool.query(
    `${RATING_QUERY} WHERE k.active = true AND k.category IS DISTINCT FROM 'Cafe'
     ORDER BY (
       (
         COALESCE(r.review_count, 0)::numeric
         / (COALESCE(r.review_count, 0) + 5)
       ) * COALESCE(r.avg_rating, k.rating, 0)
       + (
         5::numeric / (COALESCE(r.review_count, 0) + 5)
       ) * 4.0
     ) DESC,
     COALESCE(r.review_count, 0) DESC,
     COALESCE(r.avg_rating, k.rating, 0) DESC,
     k.id ASC`
  );
  res.json(rows.map(sanitizeRow));
});

router.get("/kuliner/:id", async (req, res) => {
  const param = req.params.id;
  const isNum = /^\d+$/.test(param);
  const { rows } = await pool.query(
    `${RATING_QUERY} WHERE (${isNum ? "k.id = $1::int" : "k.slug = $1"}) AND k.active = true AND k.category IS DISTINCT FROM 'Cafe'`,
    [param]
  );
  if (!rows[0]) return res.status(404).json({ error: "Not found" });
  res.json(sanitizeRow(rows[0]));
});

router.get("/cafe", async (_req, res) => {
  const { rows } = await pool.query(
    `${RATING_QUERY} WHERE k.active = true AND k.category = 'Cafe'
     ORDER BY (
       (
         COALESCE(r.review_count, 0)::numeric
         / (COALESCE(r.review_count, 0) + 5)
       ) * COALESCE(r.avg_rating, k.rating, 0)
       + (
         5::numeric / (COALESCE(r.review_count, 0) + 5)
       ) * 4.0
     ) DESC,
     COALESCE(r.review_count, 0) DESC,
     COALESCE(r.avg_rating, k.rating, 0) DESC,
     k.id ASC`
  );
  res.json(rows.map(sanitizeRow));
});

router.get("/cafe/:id", async (req, res) => {
  const param = req.params.id;
  const isNum = /^\d+$/.test(param);
  const { rows } = await pool.query(
    `${RATING_QUERY} WHERE (${isNum ? "k.id = $1::int" : "k.slug = $1"}) AND k.active = true AND k.category = 'Cafe'`,
    [param]
  );
  const cafe = rows[0] ? sanitizeRow(rows[0]) : null;
  if (!cafe) return res.status(404).json({ error: "Cafe tidak ditemukan" });
  res.json(cafe);
});

router.get("/admin/kuliner", requireAuth, async (_req, res) => {
  const { rows } = await pool.query(
    `${RATING_QUERY} WHERE k.category IS DISTINCT FROM 'Cafe' ORDER BY k.id ASC`
  );
  res.json(rows.map(sanitizeRow));
});

router.post("/admin/kuliner", requireAuth, async (req, res) => {
  const { name, category, image, location, description, featured, hours, active,
          phone, google_maps_url, maps_embed_url, price_range, instagram, website, facilities, photos, reservasi_enabled } = req.body;
  if (String(category ?? "").trim().toLowerCase() === "cafe") {
    return res.status(400).json({ error: "Gunakan menu Cafe untuk menambahkan data cafe" });
  }
  const cleanName = cleanPlaceName(name) ?? "";
  const cleanCategory = cleanPlaceName(category) ?? "";
  const cleanLocationValue = cleanLocation(location);
  const cleanDescriptionValue = cleanDescription(description, name, cleanName);
  const cleanHours = cleanText(hours);
  const cleanFacilities = cleanCommaList(facilities);
  const cleanImage = optimizeImageUrl(image);
  const cleanPhotos = normalizePhotos(photos, cleanImage);
  const ins = await pool.query(
    `INSERT INTO kuliner (name, category, image, location, description, featured, hours, active,
      phone, google_maps_url, maps_embed_url, price_range, instagram, website, facilities, photos, reservasi_enabled)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17) RETURNING id`,
     [cleanName, cleanCategory, cleanImage, cleanLocationValue, cleanDescriptionValue, featured ?? false, cleanHours, active ?? true,
     phone ?? null, google_maps_url ?? null, maps_embed_url ?? null, price_range ?? null,
       instagram ?? null, website ?? null, cleanFacilities, JSON.stringify(cleanPhotos), reservasi_enabled ?? false]
  );
  const id = ins.rows[0].id;
  const slug = `${slugify(cleanName)}-${id}`;
  const { rows } = await pool.query(
    `UPDATE kuliner SET slug=$1 WHERE id=$2 RETURNING *`,
    [slug, id]
  );
  res.status(201).json(sanitizeRow(rows[0]));
});

router.put("/admin/kuliner/:id", requireAuth, async (req, res) => {
  const { name, category, image, location, description, featured, hours, active,
          phone, google_maps_url, maps_embed_url, price_range, instagram, website, facilities, photos, reservasi_enabled } = req.body;
  const existing = await pool.query("SELECT category, image, photos FROM kuliner WHERE id=$1", [req.params.id]);
  if (!existing.rows[0]) return res.status(404).json({ error: "Not found" });
  const nextCategory = category === undefined ? existing.rows[0].category : category;
  if (String(nextCategory ?? "").trim().toLowerCase() === "cafe") {
    return res.status(400).json({ error: "Gunakan menu Cafe untuk mengedit data cafe" });
  }
  const sourceImage = image === undefined ? existing.rows[0].image : image;
  const sourcePhotos = photos === undefined ? existing.rows[0].photos : photos;
  const cleanName = cleanPlaceName(name) ?? "";
  const cleanCategory = cleanPlaceName(nextCategory) ?? "";
  const cleanLocationValue = cleanLocation(location);
  const cleanDescriptionValue = cleanDescription(description, name, cleanName);
  const cleanHours = cleanText(hours);
  const cleanFacilities = cleanCommaList(facilities);
  const cleanImage = optimizeImageUrl(sourceImage);
  const cleanPhotos = normalizePhotos(sourcePhotos, cleanImage);
  const slug = `${slugify(cleanName)}-${req.params.id}`;
  const { rows } = await pool.query(
    `UPDATE kuliner SET name=$1, category=$2, image=$3, location=$4, description=$5,
      featured=$6, hours=$7, active=$8, phone=$9, google_maps_url=$10,
      maps_embed_url=$11, price_range=$12, instagram=$13, website=$14, facilities=$15, photos=$16,
      slug=$17, reservasi_enabled=$18, updated_at=NOW()
     WHERE id=$19 RETURNING *`,
    [cleanName, cleanCategory, cleanImage, cleanLocationValue, cleanDescriptionValue, featured, cleanHours, active,
     phone ?? null, google_maps_url ?? null, maps_embed_url ?? null, price_range ?? null,
      instagram ?? null, website ?? null, cleanFacilities, JSON.stringify(cleanPhotos), slug, reservasi_enabled ?? false, req.params.id]
  );
  if (!rows[0]) return res.status(404).json({ error: "Not found" });
  res.json(sanitizeRow(rows[0]));
});

router.get("/admin/cafe", requireAuth, async (_req, res) => {
  const { rows } = await pool.query(
    `${RATING_QUERY} WHERE k.category = 'Cafe' ORDER BY k.id ASC`
  );
  res.json(rows.map(sanitizeRow));
});

router.post("/admin/cafe", requireAuth, async (req, res) => {
  const { name, image, location, description, featured, hours, active,
          phone, google_maps_url, maps_embed_url, price_range, instagram, website, facilities, photos,
          reservasi_enabled, cafe_photo_policy_confirmed } = req.body;
  const policyError = validateCafePhotoPolicy(cafe_photo_policy_confirmed);
  if (policyError) return res.status(400).json({ error: policyError });
  const cleanName = cleanPlaceName(name) ?? "";
  const cleanLocationValue = cleanLocation(location);
  const cleanDescriptionValue = cleanDescription(description, name, cleanName);
  const cleanHours = cleanText(hours);
  const cleanFacilities = cleanCommaList(facilities);
  const cleanImage = optimizeImageUrl(image);
  const limitError = validateCafePhotoLimit(photos, cleanImage);
  if (limitError) return res.status(400).json({ error: limitError });
  const photoError = validateCafePhotos(photos, cleanImage);
  if (photoError) return res.status(400).json({ error: photoError });
  const contentPhotoError = await validateCafePhotoContent(photos, cleanImage);
  if (contentPhotoError) return res.status(400).json({ error: contentPhotoError });
  const cleanPhotos = normalizePhotos(photos, cleanImage);
  const ins = await pool.query(
    `INSERT INTO kuliner (name, category, image, location, description, featured, hours, active,
      phone, google_maps_url, maps_embed_url, price_range, instagram, website, facilities, photos, reservasi_enabled)
     VALUES ($1,'Cafe',$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16) RETURNING id`,
     [cleanName, cleanImage, cleanLocationValue, cleanDescriptionValue, featured ?? false, cleanHours, active ?? true,
     phone ?? null, google_maps_url ?? null, maps_embed_url ?? null, price_range ?? null,
       instagram ?? null, website ?? null, cleanFacilities, JSON.stringify(cleanPhotos), reservasi_enabled ?? false]
  );
  const id = ins.rows[0].id;
  const slug = `${slugify(cleanName)}-${id}`;
  const { rows } = await pool.query(
    `UPDATE kuliner SET slug=$1 WHERE id=$2 RETURNING *`,
    [slug, id]
  );
  res.status(201).json(sanitizeRow(rows[0]));
});

router.put("/admin/cafe/:id", requireAuth, async (req, res) => {
  const { name, image, location, description, featured, hours, active,
          phone, google_maps_url, maps_embed_url, price_range, instagram, website, facilities, photos,
          reservasi_enabled, cafe_photo_policy_confirmed } = req.body;
  const existing = await pool.query("SELECT image, photos FROM kuliner WHERE id=$1 AND category='Cafe'", [req.params.id]);
  if (!existing.rows[0]) return res.status(404).json({ error: "Cafe tidak ditemukan" });
  const sourceImage = image === undefined ? existing.rows[0].image : image;
  const sourcePhotos = photos === undefined ? existing.rows[0].photos : photos;
  const policyError = validateCafePhotoPolicy(cafe_photo_policy_confirmed);
  if (policyError) return res.status(400).json({ error: policyError });
  const cleanName = cleanPlaceName(name) ?? "";
  const cleanLocationValue = cleanLocation(location);
  const cleanDescriptionValue = cleanDescription(description, name, cleanName);
  const cleanHours = cleanText(hours);
  const cleanFacilities = cleanCommaList(facilities);
  const cleanImage = optimizeImageUrl(sourceImage);
  const limitError = validateCafePhotoLimit(sourcePhotos, cleanImage);
  if (limitError) return res.status(400).json({ error: limitError });
  const photoError = validateCafePhotos(sourcePhotos, cleanImage);
  if (photoError) return res.status(400).json({ error: photoError });
  const contentPhotoError = await validateCafePhotoContent(sourcePhotos, cleanImage);
  if (contentPhotoError) return res.status(400).json({ error: contentPhotoError });
  const cleanPhotos = normalizePhotos(sourcePhotos, cleanImage);
  const slug = `${slugify(cleanName)}-${req.params.id}`;
  const { rows } = await pool.query(
    `UPDATE kuliner SET name=$1, category='Cafe', image=$2, location=$3, description=$4,
      featured=$5, hours=$6, active=$7, phone=$8, google_maps_url=$9,
      maps_embed_url=$10, price_range=$11, instagram=$12, website=$13, facilities=$14, photos=$15,
      slug=$16, reservasi_enabled=$17, updated_at=NOW()
     WHERE id=$18 AND category='Cafe' RETURNING *`,
    [cleanName, cleanImage, cleanLocationValue, cleanDescriptionValue, featured, cleanHours, active,
     phone ?? null, google_maps_url ?? null, maps_embed_url ?? null, price_range ?? null,
       instagram ?? null, website ?? null, cleanFacilities, JSON.stringify(cleanPhotos), slug, reservasi_enabled ?? false, req.params.id]
  );
  if (!rows[0]) return res.status(404).json({ error: "Cafe tidak ditemukan" });
  res.json(sanitizeRow(rows[0]));
});

router.delete("/admin/cafe/bulk", requireAuth, async (req, res) => {
  const { ids } = req.body;
  if (!Array.isArray(ids) || ids.length === 0) return res.status(400).json({ error: "ids harus array tidak kosong" });
  const placeholders = ids.map((_: unknown, i: number) => `$${i + 1}`).join(",");
  const result = await pool.query(`DELETE FROM kuliner WHERE category='Cafe' AND id IN (${placeholders})`, ids);
  res.json({ deleted: result.rowCount });
});

router.delete("/admin/cafe/:id", requireAuth, async (req, res) => {
  await pool.query("DELETE FROM kuliner WHERE id=$1 AND category='Cafe'", [req.params.id]);
  res.json({ success: true });
});

router.delete("/admin/kuliner/bulk", requireAuth, async (req, res) => {
  const { ids } = req.body;
  if (!Array.isArray(ids) || ids.length === 0) return res.status(400).json({ error: "ids harus array tidak kosong" });
  const placeholders = ids.map((_: unknown, i: number) => `$${i + 1}`).join(",");
  const result = await pool.query(`DELETE FROM kuliner WHERE id IN (${placeholders})`, ids);
  res.json({ deleted: result.rowCount });
});

router.delete("/admin/kuliner/:id", requireAuth, async (req, res) => {
  await pool.query("DELETE FROM kuliner WHERE id=$1", [req.params.id]);
  res.json({ success: true });
});

export default router;
