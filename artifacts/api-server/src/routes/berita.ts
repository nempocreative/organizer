import { Router } from "express";
import pool from "../lib/db";
import { requireAuth } from "../middlewares/auth";
import { verifyToken } from "../lib/auth";
import { optimizeImageUrl, processImageToWebp } from "../lib/media";

const router = Router();
const SOURCE_IMAGE_CACHE_TTL_MS = 60 * 60 * 1000;
const NEWS_SOURCE_IMAGE_MAX_BYTES = 280 * 1024;
const NEWS_SOURCE_IMAGE_MAX_DIMENSION = 1280;
const sourceImageCache = new Map<number, {
  expiresAt: number;
  contentType: string;
  body: Buffer;
}>();

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[àáâãäå]/g, "a").replace(/[èéêë]/g, "e")
    .replace(/[ìíîï]/g, "i").replace(/[òóôõö]/g, "o")
    .replace(/[ùúûü]/g, "u").replace(/[ñ]/g, "n")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim().replace(/[\s_-]+/g, "-").replace(/^-+|-+$/g, "");
}

function optionalUser(req: any): number | null {
  const auth = req.headers.authorization;
  if (!auth?.startsWith("Bearer ")) return null;
  try { return (verifyToken(auth.slice(7)) as any).id ?? null; } catch { return null; }
}

function clientIp(req: any): string {
  return (req.headers["x-forwarded-for"] as string)?.split(",")[0]?.trim()
    || req.socket?.remoteAddress || "unknown";
}

/* ── helpers ─────────────────────────────────────────────── */
async function enrichBerita(rows: any[]) {
  if (!rows.length) return rows;
  const ids = rows.map(r => r.id);
  const { rows: lk } = await pool.query(
    `SELECT berita_id, COUNT(*)::int AS cnt FROM berita_likes WHERE berita_id = ANY($1) GROUP BY berita_id`,
    [ids]
  );
  const { rows: cm } = await pool.query(
    `SELECT berita_id, COUNT(*)::int AS cnt FROM berita_comments WHERE berita_id = ANY($1) AND visible=true GROUP BY berita_id`,
    [ids]
  );
  const likeMap: Record<number,number> = {};
  const cmtMap:  Record<number,number> = {};
  lk.forEach((r: any) => { likeMap[r.berita_id] = r.cnt; });
  cm.forEach((r: any) => { cmtMap[r.berita_id]  = r.cnt; });
  return rows.map(r => ({
    ...r,
    image: beritaImageUrl(r),
    like_count: likeMap[r.id] ?? 0,
    comment_count: cmtMap[r.id] ?? 0,
  }));
}

function beritaImageUrl(row: any): string | null {
  // Garut government articles use short-lived signed object-storage URLs.
  // Expose our durable proxy path instead of returning null or a stale local
  // asset. Remote media images use the same endpoint for one size/format policy.
  if (
    Number.isInteger(Number(row.id)) &&
    (
      (typeof row.source_url === "string" &&
        /^https:\/\/(?:www\.)?garutkab\.go\.id\/berita\//i.test(row.source_url)) ||
      (typeof row.image === "string" && /^https:\/\//i.test(row.image))
    )
  ) {
    return `/api/berita/${Number(row.id)}/source-image`;
  }

  return optimizeImageUrl(row.image);
}

/* ── PUBLIC ──────────────────────────────────────────────── */

/* GET /berita */
router.get("/berita", async (_req, res) => {
  const { rows } = await pool.query(
    "SELECT *, TO_CHAR(published_at, 'DD Mon YYYY') AS date FROM berita WHERE active=true AND (status IS NULL OR status='published') ORDER BY id DESC"
  );
  res.json(await enrichBerita(rows));
});

/* POST /berita/submit — public user submission */
router.post("/berita/submit", async (req, res) => {
  const { judul, penulis, email, kategori, isi, foto, lokasi } = req.body;
  if (!judul?.trim() || !penulis?.trim() || !isi?.trim()) {
    return res.status(400).json({ error: "Judul, penulis, dan isi wajib diisi" });
  }
  const summary = isi.trim().slice(0, 200) + (isi.trim().length > 200 ? "…" : "");
  const { rows } = await pool.query(
    `INSERT INTO berita (title, category, image, content, summary, author, location, featured, active, status, submitter_name, submitter_email)
     VALUES ($1,$2,$3,$4,$5,$6,$7,false,false,'pending',$8,$9) RETURNING id`,
    [judul.trim(), kategori || "Umum", foto || null, isi.trim(), summary, penulis.trim(), lokasi?.trim() || "Garut", penulis.trim(), email?.trim() || null]
  );
  res.status(201).json({ success: true, id: rows[0].id });
});

/* GET /berita/trending — top 5 by like count */
router.get("/berita/trending", async (_req, res) => {
  const { rows } = await pool.query(`
    SELECT b.*, TO_CHAR(b.published_at, 'DD Mon YYYY') AS date,
           COALESCE(l.cnt, 0) AS like_count,
           COALESCE(c.cnt, 0) AS comment_count
    FROM berita b
    LEFT JOIN (SELECT berita_id, COUNT(*)::int cnt FROM berita_likes GROUP BY berita_id) l ON l.berita_id = b.id
    LEFT JOIN (SELECT berita_id, COUNT(*)::int cnt FROM berita_comments WHERE visible=true GROUP BY berita_id) c ON c.berita_id = b.id
    WHERE b.active = true
    ORDER BY like_count DESC, b.id DESC
    LIMIT 5
  `);
  res.json(rows.map((row: any) => ({ ...row, image: beritaImageUrl(row) })));
});

/* GET /berita/:id/like-status */
router.get("/berita/:id/like-status", async (req, res) => {
  const userId = optionalUser(req);
  const ip = clientIp(req);
  const id = parseInt(req.params.id);
  if (isNaN(id)) return res.json({ liked: false, count: 0 });

  const [{ rows: lk }, { rows: cnt }] = await Promise.all([
    userId
      ? pool.query("SELECT id FROM berita_likes WHERE berita_id=$1 AND user_id=$2", [id, userId])
      : pool.query("SELECT id FROM berita_likes WHERE berita_id=$1 AND ip_address=$2 AND user_id IS NULL", [id, ip]),
    pool.query("SELECT COUNT(*)::int AS c FROM berita_likes WHERE berita_id=$1", [id]),
  ]);
  res.json({ liked: lk.length > 0, count: cnt[0]?.c ?? 0 });
});

/* POST /berita/:id/like — toggle */
router.post("/berita/:id/like", async (req, res) => {
  const userId = optionalUser(req);
  const ip = clientIp(req);
  const id = parseInt(req.params.id);
  if (isNaN(id)) return res.status(400).json({ error: "Invalid id" });

  // check existing
  const checkQ = userId
    ? pool.query("SELECT id FROM berita_likes WHERE berita_id=$1 AND user_id=$2", [id, userId])
    : pool.query("SELECT id FROM berita_likes WHERE berita_id=$1 AND ip_address=$2 AND user_id IS NULL", [id, ip]);
  const { rows: existing } = await checkQ;

  if (existing.length > 0) {
    // unlike
    if (userId) await pool.query("DELETE FROM berita_likes WHERE berita_id=$1 AND user_id=$2", [id, userId]);
    else await pool.query("DELETE FROM berita_likes WHERE berita_id=$1 AND ip_address=$2 AND user_id IS NULL", [id, ip]);
  } else {
    // like
    try {
      await pool.query(
        "INSERT INTO berita_likes (berita_id, user_id, ip_address) VALUES ($1,$2,$3)",
        [id, userId || null, userId ? null : ip]
      );
    } catch { /* ignore unique conflict */ }
  }

  const { rows: cnt } = await pool.query("SELECT COUNT(*)::int AS c FROM berita_likes WHERE berita_id=$1", [id]);
  res.json({ liked: existing.length === 0, count: cnt[0]?.c ?? 0 });
});

/* GET /berita/:id/comments */
router.get("/berita/:id/comments", async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) return res.json([]);
  const { rows } = await pool.query(
    "SELECT id, user_name, user_avatar, comment, created_at FROM berita_comments WHERE berita_id=$1 AND visible=true ORDER BY created_at DESC",
    [id]
  );
  res.json(rows);
});

/* POST /berita/:id/comments */
router.post("/berita/:id/comments", async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) return res.status(400).json({ error: "Invalid id" });
  const { comment, user_name, user_avatar } = req.body;
  if (!comment?.trim()) return res.status(400).json({ error: "Komentar tidak boleh kosong" });

  const userId = optionalUser(req);
  let displayName = user_name?.trim();
  let avatar = user_avatar || null;

  if (userId) {
    const { rows: u } = await pool.query("SELECT name, avatar_url FROM users WHERE id=$1", [userId]);
    if (u[0]) { displayName = u[0].name; avatar = u[0].avatar_url; }
  }
  if (!displayName) return res.status(400).json({ error: "Nama harus diisi" });

  const { rows } = await pool.query(
    "INSERT INTO berita_comments (berita_id, user_id, user_name, user_avatar, comment) VALUES ($1,$2,$3,$4,$5) RETURNING id, user_name, user_avatar, comment, created_at",
    [id, userId || null, displayName, avatar, comment.trim()]
  );
  res.status(201).json(rows[0]);
});

/*
 * Source photos on garutkab.go.id are delivered through short-lived signed
 * object-storage URLs. Keep the article source as the durable reference and
 * resolve the current photo URL only when the browser requests the image.
 */
router.get("/berita/:id/source-image", async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) return res.status(400).json({ error: "Invalid id" });

  try {
    const cached = sourceImageCache.get(id);
    if (cached && cached.expiresAt > Date.now()) {
      res.setHeader("Content-Type", cached.contentType);
      res.setHeader("Cache-Control", "public, max-age=900, s-maxage=900");
      return res.send(cached.body);
    }
    sourceImageCache.delete(id);

    const storedFilename = `news-source-${id}.webp`;
    const { rows: storedRows } = await pool.query(
      "SELECT data FROM file_uploads WHERE id=$1 AND mime_type='image/webp'",
      [storedFilename],
    );
    if (storedRows[0]?.data) {
      const body = Buffer.isBuffer(storedRows[0].data)
        ? storedRows[0].data
        : Buffer.from(storedRows[0].data);
      sourceImageCache.set(id, {
        expiresAt: Date.now() + SOURCE_IMAGE_CACHE_TTL_MS,
        contentType: "image/webp",
        body,
      });
      res.setHeader("Content-Type", "image/webp");
      res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
      return res.send(body);
    }

    const { rows } = await pool.query("SELECT source_url, image FROM berita WHERE id=$1", [id]);
    const sourceUrl = rows[0]?.source_url;
    const isGarutSource = typeof sourceUrl === "string"
      && /^https:\/\/(?:www\.)?garutkab\.go\.id\/berita\//i.test(sourceUrl);
    const directImageUrl = rows[0]?.image;
    if (!isGarutSource && !(typeof directImageUrl === "string" && /^https:\/\//i.test(directImageUrl))) {
      return res.status(404).json({ error: "Foto sumber tidak tersedia" });
    }

    let imageUrl = directImageUrl;
    if (isGarutSource) {
      const pageResponse = await fetch(sourceUrl, {
        headers: { "User-Agent": "Nempo.id berita image proxy/1.0" },
        signal: AbortSignal.timeout(10000),
      });
      if (!pageResponse.ok) return res.status(502).json({ error: "Gagal membaca halaman sumber" });
      const pageHtml = await pageResponse.text();
      const imageMatches = [...pageHtml.matchAll(/(?:src|content)=["']([^"']*storage-ggi\.garutkab\.go\.id[^"']+)["']/gi)];
      imageUrl = imageMatches
        .map(match => match[1].replace(/&amp;/g, "&"))
        .find(value => /^https:\/\/storage-ggi\.garutkab\.go\.id\//i.test(value));
      if (!imageUrl) return res.status(404).json({ error: "Foto sumber tidak ditemukan" });
    }

    const imageResponse = await fetch(imageUrl, {
      headers: { "User-Agent": "Nempo.id berita image proxy/1.0" },
      signal: AbortSignal.timeout(10000),
    });
    if (!imageResponse.ok) return res.status(502).json({ error: "Gagal mengambil foto sumber" });

    const contentType = imageResponse.headers.get("content-type") || "image/jpeg";
    if (!contentType.startsWith("image/")) return res.status(502).json({ error: "Format foto sumber tidak valid" });
    const body = await processImageToWebp(Buffer.from(await imageResponse.arrayBuffer()), {
      maxOutputBytes: NEWS_SOURCE_IMAGE_MAX_BYTES,
      maxDimension: NEWS_SOURCE_IMAGE_MAX_DIMENSION,
      quality: 74,
    });
    await pool.query(
      `INSERT INTO file_uploads (id, data, mime_type, size)
       VALUES ($1, $2, 'image/webp', $3)
       ON CONFLICT (id) DO NOTHING`,
      [storedFilename, body, body.length],
    );
    sourceImageCache.set(id, {
      expiresAt: Date.now() + SOURCE_IMAGE_CACHE_TTL_MS,
      contentType: "image/webp",
      body,
    });
    res.setHeader("Content-Type", "image/webp");
    res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
    res.send(body);
  } catch {
    res.status(502).json({ error: "Foto sumber sedang tidak tersedia" });
  }
});

/* GET /berita/:id */
router.get("/berita/:id", async (req, res) => {
  const param = req.params.id;
  const isNum = /^\d+$/.test(param);
  const { rows } = await pool.query(
    `SELECT *, TO_CHAR(published_at, 'DD Mon YYYY') AS date FROM berita WHERE (${isNum ? "id=$1::int" : "slug=$1"}) AND active=true AND (status IS NULL OR status='published')`,
    [param]
  );
  if (!rows[0]) return res.status(404).json({ error: "Not found" });
  const [enriched] = await enrichBerita(rows);
  res.json(enriched);
});

/* GET /berita/category/list — distinct active categories */
router.get("/berita/category/list", async (_req, res) => {
  const { rows } = await pool.query(
    "SELECT DISTINCT category FROM berita WHERE active=true AND (status IS NULL OR status='published') ORDER BY category"
  );
  res.json(rows.map((r: any) => r.category));
});

/* ── ADMIN ───────────────────────────────────────────────── */

router.get("/admin/berita", requireAuth, async (_req, res) => {
  const { rows } = await pool.query(
    "SELECT * FROM berita ORDER BY CASE WHEN status='pending' THEN 0 ELSE 1 END, id DESC"
  );
  res.json(await enrichBerita(rows));
});

/* PATCH /admin/berita/:id/approve */
router.patch("/admin/berita/:id/approve", requireAuth, async (req, res) => {
  const { rows: existing } = await pool.query("SELECT title, slug FROM berita WHERE id=$1", [req.params.id]);
  if (!existing[0]) return res.status(404).json({ error: "Not found" });
  const newSlug = (existing[0].slug && existing[0].slug.trim())
    ? existing[0].slug
    : `${slugify(existing[0].title || "berita")}-${req.params.id}`;
  const { rows } = await pool.query(
    "UPDATE berita SET status='published', active=true, published_at=NOW(), updated_at=NOW(), slug=$1 WHERE id=$2 RETURNING *",
    [newSlug, req.params.id]
  );
  res.json(rows[0]);
});

/* PATCH /admin/berita/:id/reject */
router.patch("/admin/berita/:id/reject", requireAuth, async (req, res) => {
  const { rows } = await pool.query(
    "UPDATE berita SET status='rejected', active=false, updated_at=NOW() WHERE id=$1 RETURNING *",
    [req.params.id]
  );
  if (!rows[0]) return res.status(404).json({ error: "Not found" });
  res.json(rows[0]);
});

router.post("/admin/berita", requireAuth, async (req, res) => {
  const { title, category, image, content, summary, author, location, featured, active, event_date, photo_source, source_name, source_url } = req.body;
  if (source_url && !/^https?:\/\/\S+$/i.test(String(source_url).trim())) {
    return res.status(400).json({ error: "Link sumber harus berupa URL http atau https yang valid" });
  }
  const ins = await pool.query(
    "INSERT INTO berita (title, category, image, content, summary, author, location, featured, active, event_date, photo_source, source_name, source_url) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13) RETURNING id",
    [title, category, image, content, summary, author, location?.trim() || "Garut", featured ?? false, active ?? true, event_date || null, photo_source || null, source_name?.trim() || null, source_url?.trim() || null]
  );
  const newId = ins.rows[0].id;
  const slug = `${slugify(title || "berita")}-${newId}`;
  const { rows } = await pool.query("UPDATE berita SET slug=$1 WHERE id=$2 RETURNING *", [slug, newId]);
  res.status(201).json(rows[0]);
});

router.put("/admin/berita/:id", requireAuth, async (req, res) => {
  const { title, category, image, content, summary, author, location, featured, active, event_date, photo_source, source_name, source_url } = req.body;
  if (source_url && !/^https?:\/\/\S+$/i.test(String(source_url).trim())) {
    return res.status(400).json({ error: "Link sumber harus berupa URL http atau https yang valid" });
  }
  const slug = `${slugify(title || "berita")}-${req.params.id}`;
  const { rows } = await pool.query(
    "UPDATE berita SET title=$1, category=$2, image=$3, content=$4, summary=$5, author=$6, location=$7, featured=$8, active=$9, slug=$10, event_date=$11, photo_source=$12, source_name=$13, source_url=$14, updated_at=NOW() WHERE id=$15 RETURNING *",
    [title, category, image, content, summary, author, location?.trim() || "Garut", featured, active, slug, event_date || null, photo_source || null, source_name?.trim() || null, source_url?.trim() || null, req.params.id]
  );
  if (!rows[0]) return res.status(404).json({ error: "Not found" });
  res.json(rows[0]);
});

router.delete("/admin/berita/bulk", requireAuth, async (req, res) => {
  const { ids } = req.body;
  if (!Array.isArray(ids) || ids.length === 0) return res.status(400).json({ error: "ids harus array tidak kosong" });
  const placeholders = ids.map((_: unknown, i: number) => `$${i + 1}`).join(",");
  const result = await pool.query(`DELETE FROM berita WHERE id IN (${placeholders})`, ids);
  res.json({ deleted: result.rowCount });
});

router.delete("/admin/berita/:id", requireAuth, async (req, res) => {
  await pool.query("DELETE FROM berita WHERE id=$1", [req.params.id]);
  res.json({ success: true });
});

/* Admin: all comments */
router.get("/admin/berita-comments", requireAuth, async (_req, res) => {
  const { rows } = await pool.query(`
    SELECT bc.*, b.title AS berita_title
    FROM berita_comments bc
    JOIN berita b ON b.id = bc.berita_id
    ORDER BY bc.created_at DESC
  `);
  res.json(rows);
});

router.patch("/admin/berita-comments/:id/visibility", requireAuth, async (req, res) => {
  const { rows } = await pool.query(
    "UPDATE berita_comments SET visible = NOT visible WHERE id=$1 RETURNING *",
    [req.params.id]
  );
  if (!rows[0]) return res.status(404).json({ error: "Not found" });
  res.json(rows[0]);
});

router.delete("/admin/berita-comments/:id", requireAuth, async (req, res) => {
  await pool.query("DELETE FROM berita_comments WHERE id=$1", [req.params.id]);
  res.json({ success: true });
});

export default router;
