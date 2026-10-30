import { Router } from "express";
import bcrypt from "bcryptjs";
import multer from "multer";
import { randomUUID } from "crypto";
import pool from "../lib/db";
import { signToken, verifyToken } from "../lib/auth";
import { requireAuth } from "../middlewares/auth";
import { creditWalletForMitraOrder } from "./wallet";
import { IMAGE_UPLOAD_POLICY, processImageToWebp } from "../lib/media";

const uploadMiddleware = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: IMAGE_UPLOAD_POLICY.maxInputBytes },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith("image/")) cb(null, true);
    else cb(new Error("Hanya file gambar yang diizinkan"));
  },
});

const router = Router();

const MITRA_FIELDS = "id, username, business_name, contact_name, phone, category, listing_type, listing_id, active, created_at, updated_at, last_login_at, mou_status";

async function ensureColumns() {
  await pool.query(`ALTER TABLE mitra ADD COLUMN IF NOT EXISTS listing_type VARCHAR(20)`);
  await pool.query(`ALTER TABLE mitra ADD COLUMN IF NOT EXISTS listing_id INTEGER`);
  await pool.query(`ALTER TABLE mitra ADD COLUMN IF NOT EXISTS mou_status VARCHAR(30) DEFAULT 'dalam_proses'`);
  await pool.query(`ALTER TABLE vouchers ADD COLUMN IF NOT EXISTS mitra_id INTEGER`);
  // Junction table: satu mitra bisa punya banyak listing
  await pool.query(`
    CREATE TABLE IF NOT EXISTS mitra_listings (
      id SERIAL PRIMARY KEY,
      mitra_id INTEGER NOT NULL,
      listing_type VARCHAR(20) NOT NULL,
      listing_id INTEGER NOT NULL,
      created_at TIMESTAMP NOT NULL DEFAULT NOW(),
      UNIQUE(mitra_id, listing_type, listing_id)
    )
  `);
  // Migrasi data lama: pindahkan listing_type/listing_id yang sudah ada ke tabel baru
  await pool.query(`
    INSERT INTO mitra_listings (mitra_id, listing_type, listing_id)
    SELECT id, listing_type, listing_id FROM mitra
    WHERE listing_type IS NOT NULL AND listing_id IS NOT NULL
    ON CONFLICT DO NOTHING
  `);
  // Galeri foto mitra
  await pool.query(`
    CREATE TABLE IF NOT EXISTS mitra_gallery (
      id SERIAL PRIMARY KEY,
      mitra_id INTEGER NOT NULL,
      image_url VARCHAR(500) NOT NULL,
      position INTEGER NOT NULL DEFAULT 0,
      created_at TIMESTAMP NOT NULL DEFAULT NOW()
    )
  `);
  // Tanggal terblokir penginapan
  await pool.query(`
    CREATE TABLE IF NOT EXISTS penginapan_blocked_dates (
      id SERIAL PRIMARY KEY,
      penginapan_id INTEGER NOT NULL,
      blocked_date DATE NOT NULL,
      reason VARCHAR(200),
      created_at TIMESTAMP NOT NULL DEFAULT NOW(),
      UNIQUE(penginapan_id, blocked_date)
    )
  `);
}
ensureColumns().catch(() => {});

/* ── Sinkronkan listing pertama di mitra_listings ke kolom listing_type/listing_id di tabel mitra (kompatibilitas kode lama: wallet, orders, dll.) ── */
async function syncPrimaryListing(mitraId: number) {
  const { rows } = await pool.query(
    `SELECT listing_type, listing_id FROM mitra_listings WHERE mitra_id=$1 ORDER BY id ASC LIMIT 1`,
    [mitraId]
  );
  if (rows[0]) {
    await pool.query(
      `UPDATE mitra SET listing_type=$1, listing_id=$2, updated_at=NOW() WHERE id=$3`,
      [rows[0].listing_type, rows[0].listing_id, mitraId]
    );
  } else {
    await pool.query(`UPDATE mitra SET listing_type=NULL, listing_id=NULL, updated_at=NOW() WHERE id=$1`, [mitraId]);
  }
}

/* ─────────── Listing type -> table config (shared by admin picker + mitra self-service editing) ─────────── */
const LISTING_TABLES: Record<string, string> = {
  wisata: "wisata",
  kuliner: "kuliner",
  penginapan: "penginapan",
  event: "events",
};

// Fields a mitra is allowed to edit on their own listing (name/media/description always included).
const EDITABLE_FIELDS: Record<string, string[]> = {
  wisata: ["name", "image", "location", "description", "opening_hours", "facilities", "phone", "google_maps_url"],
  kuliner: ["name", "image", "location", "description", "hours", "price_range", "facilities", "phone", "google_maps_url"],
  penginapan: ["name", "image", "location", "description", "price_per_night", "amenities"],
  event: ["name", "title", "image", "location", "description", "price", "date", "date_end", "time_start", "time_end"],
};

function isValidListingType(t: unknown): t is keyof typeof LISTING_TABLES {
  return typeof t === "string" && t in LISTING_TABLES;
}

/* ── Admin: search listings of a given type (for the mitra-linking picker) ── */
router.get("/admin/listing-options/:type", requireAuth, async (req, res) => {
  const type = req.params.type;
  if (!isValidListingType(type)) return res.status(400).json({ error: "Tipe listing tidak valid" });
  const table = LISTING_TABLES[type];
  const { rows } = await pool.query(`SELECT id, name FROM ${table} ORDER BY name ASC`);
  res.json(rows);
});

/* ── Admin: list all listings linked to a mitra ── */
router.get("/admin/mitra/:id/listings", requireAuth, async (req, res) => {
  const { rows: links } = await pool.query(
    `SELECT id, listing_type, listing_id FROM mitra_listings WHERE mitra_id=$1 ORDER BY id ASC`,
    [req.params.id]
  );
  const listings = await Promise.all(links.map(async (link: any) => ({
    ...link,
    listing_name: await resolveLinkName(link),
  })));
  res.json(listings);
});

/* ── Admin: tambah satu listing ke mitra ── */
router.post("/admin/mitra/:id/listings", requireAuth, async (req, res) => {
  const { listing_type, listing_id } = req.body;
  if (!isValidListingType(listing_type) || !listing_id) {
    return res.status(400).json({ error: "listing_type dan listing_id wajib diisi" });
  }
  try {
    const { rows } = await pool.query(
      `INSERT INTO mitra_listings (mitra_id, listing_type, listing_id) VALUES ($1,$2,$3) RETURNING id, listing_type, listing_id`,
      [req.params.id, listing_type, Number(listing_id)]
    );
    await syncPrimaryListing(Number(req.params.id));
    const listing_name = await resolveLinkName(rows[0]);
    res.status(201).json({ ...rows[0], listing_name });
  } catch (err: any) {
    if (err.code === "23505") return res.status(409).json({ error: "Listing ini sudah ditautkan ke mitra ini" });
    throw err;
  }
});

/* ── Admin: hapus satu listing dari mitra ── */
router.delete("/admin/mitra/:id/listings/:linkId", requireAuth, async (req, res) => {
  await pool.query(`DELETE FROM mitra_listings WHERE id=$1 AND mitra_id=$2`, [req.params.linkId, req.params.id]);
  await syncPrimaryListing(Number(req.params.id));
  res.status(204).send();
});

/* ── Admin: list mitra (with resolved listing name) ── */
router.get("/admin/mitra", requireAuth, async (_req, res) => {
  const { rows } = await pool.query(`SELECT ${MITRA_FIELDS} FROM mitra ORDER BY created_at DESC`);
  await attachListingNames(rows);
  res.json(rows);
});

async function resolveLinkName(link: { listing_type: string; listing_id: number }): Promise<string | null> {
  if (!isValidListingType(link.listing_type)) return null;
  const table = LISTING_TABLES[link.listing_type];
  const { rows } = await pool.query(`SELECT name FROM ${table} WHERE id=$1`, [link.listing_id]);
  return rows[0]?.name ?? null;
}

async function attachListingNames(rows: any[]) {
  await Promise.all(rows.map(async (row) => {
    const { rows: links } = await pool.query(
      `SELECT id, listing_type, listing_id FROM mitra_listings WHERE mitra_id=$1 ORDER BY id ASC`,
      [row.id]
    );
    row.listings = await Promise.all(links.map(async (link: any) => ({
      ...link,
      listing_name: await resolveLinkName(link),
    })));
    // Backwards compat: kolom listing_name tunggal untuk tabel daftar admin
    row.listing_name = row.listings.length > 0
      ? row.listings.map((l: any) => l.listing_name ?? `${l.listing_type}#${l.listing_id}`).join(", ")
      : null;
  }));
}

/* ── Admin: get one mitra ── */
router.get("/admin/mitra/:id", requireAuth, async (req, res) => {
  const { rows } = await pool.query(`SELECT ${MITRA_FIELDS} FROM mitra WHERE id=$1`, [req.params.id]);
  if (!rows[0]) return res.status(404).json({ error: "Mitra tidak ditemukan" });
  await attachListingNames(rows);
  res.json(rows[0]);
});

/* ── Admin: create mitra account (id/username + password issued by admin) ── */
router.post("/admin/mitra", requireAuth, async (req, res) => {
  const { username, password, business_name, contact_name, phone, category, listing_type, listing_id } = req.body;
  if (!username || !password || !business_name) {
    return res.status(400).json({ error: "Username, password, dan nama usaha wajib diisi" });
  }
  if (password.length < 6) return res.status(400).json({ error: "Password minimal 6 karakter" });
  if (listing_type && !isValidListingType(listing_type)) return res.status(400).json({ error: "Tipe listing tidak valid" });
  const exists = await pool.query("SELECT id FROM mitra WHERE username=$1", [username]);
  if (exists.rows[0]) return res.status(409).json({ error: "Username sudah digunakan" });
  const hash = await bcrypt.hash(password, 10);
  const { rows } = await pool.query(
    `INSERT INTO mitra (username, password_hash, business_name, contact_name, phone, category, listing_type, listing_id)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING ${MITRA_FIELDS}`,
    [username, hash, business_name, contact_name ?? null, phone ?? null, category ?? null, listing_type ?? null, listing_id ?? null]
  );
  res.status(201).json(rows[0]);
});

/* ── Admin: update mitra (optionally reset password) ── */
router.put("/admin/mitra/:id", requireAuth, async (req, res) => {
  const { username, password, business_name, contact_name, phone, category, listing_type, listing_id, active } = req.body;
  if (username) {
    const exists = await pool.query("SELECT id FROM mitra WHERE username=$1 AND id<>$2", [username, req.params.id]);
    if (exists.rows[0]) return res.status(409).json({ error: "Username sudah digunakan" });
  }
  if (listing_type && !isValidListingType(listing_type)) return res.status(400).json({ error: "Tipe listing tidak valid" });
  let passwordHash: string | null = null;
  if (password) {
    if (password.length < 6) return res.status(400).json({ error: "Password minimal 6 karakter" });
    passwordHash = await bcrypt.hash(password, 10);
  }
  // listing_type/listing_id: allow explicitly clearing the link by sending listing_type: null
  const clearingListing = Object.prototype.hasOwnProperty.call(req.body, "listing_type") && !listing_type;
  const { rows } = await pool.query(
    `UPDATE mitra SET
       username=COALESCE($1, username),
       password_hash=COALESCE($2, password_hash),
       business_name=COALESCE($3, business_name),
       contact_name=COALESCE($4, contact_name),
       phone=COALESCE($5, phone),
       category=COALESCE($6, category),
       listing_type=CASE WHEN $9::boolean THEN NULL ELSE COALESCE($7, listing_type) END,
       listing_id=CASE WHEN $9::boolean THEN NULL ELSE COALESCE($8, listing_id) END,
       active=COALESCE($10, active),
       updated_at=NOW()
     WHERE id=$11 RETURNING ${MITRA_FIELDS}`,
    [username ?? null, passwordHash, business_name ?? null, contact_name ?? null, phone ?? null, category ?? null,
     listing_type ?? null, listing_id ?? null, clearingListing, active ?? null, req.params.id]
  );
  if (!rows[0]) return res.status(404).json({ error: "Mitra tidak ditemukan" });
  res.json(rows[0]);
});

/* ── Admin: toggle active ── */
router.put("/admin/mitra/:id/toggle-active", requireAuth, async (req, res) => {
  const { rows } = await pool.query(
    `UPDATE mitra SET active = NOT active, updated_at=NOW() WHERE id=$1 RETURNING ${MITRA_FIELDS}`,
    [req.params.id]
  );
  if (!rows[0]) return res.status(404).json({ error: "Mitra tidak ditemukan" });
  res.json(rows[0]);
});

/* ── Admin: delete mitra ── */
router.delete("/admin/mitra/:id", requireAuth, async (req, res) => {
  await pool.query("DELETE FROM mitra WHERE id=$1", [req.params.id]);
  res.status(204).send();
});

/* ── Public: mitra login (username + password issued by admin) ── */
router.post("/auth/mitra-login", async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ error: "Username dan password wajib diisi" });
  const { rows } = await pool.query("SELECT * FROM mitra WHERE username=$1", [username]);
  const mitra = rows[0];
  if (!mitra || !mitra.active) return res.status(401).json({ error: "Username atau password salah" });
  const valid = await bcrypt.compare(password, mitra.password_hash);
  if (!valid) return res.status(401).json({ error: "Username atau password salah" });
  await pool.query("UPDATE mitra SET last_login_at=NOW() WHERE id=$1", [mitra.id]);
  const token = signToken({ id: mitra.id, username: mitra.username, role: "mitra" });
  res.json({
    token,
    mitra: {
      id: mitra.id,
      username: mitra.username,
      business_name: mitra.business_name,
      contact_name: mitra.contact_name,
      phone: mitra.phone,
      category: mitra.category,
      listing_type: mitra.listing_type,
      listing_id: mitra.listing_id,
      mou_status: mitra.mou_status,
    },
  });
});

/* ── Shared: authenticate a mitra request, return its DB row or send an error response ── */
export async function authenticateMitra(req: any, res: any): Promise<any | null> {
  const auth = req.headers.authorization;
  if (!auth?.startsWith("Bearer ")) { res.status(401).json({ error: "Unauthorized" }); return null; }
  try {
    const payload = verifyToken(auth.slice(7)) as any;
    if (payload.role !== "mitra") { res.status(401).json({ error: "Token invalid" }); return null; }
    const { rows } = await pool.query("SELECT * FROM mitra WHERE id=$1 AND active=true", [payload.id]);
    if (!rows[0]) { res.status(404).json({ error: "Mitra tidak ditemukan" }); return null; }
    return rows[0];
  } catch {
    res.status(401).json({ error: "Token invalid" });
    return null;
  }
}

/* ── Public: get current mitra session ── */
router.get("/auth/mitra-me", async (req, res) => {
  const mitra = await authenticateMitra(req, res);
  if (!mitra) return;
  const { password_hash, ...safe } = mitra;
  res.json(safe);
});

/* ── Public: mitra updates own profile (business_name, contact_name, phone only) ── */
router.put("/auth/mitra-me", async (req, res) => {
  const mitra = await authenticateMitra(req, res);
  if (!mitra) return;
  const { business_name, contact_name, phone } = req.body;
  if (!business_name) return res.status(400).json({ error: "Nama usaha wajib diisi" });
  const { rows } = await pool.query(
    `UPDATE mitra SET business_name=$1, contact_name=$2, phone=$3, updated_at=NOW()
     WHERE id=$4 AND active=true RETURNING ${MITRA_FIELDS}`,
    [business_name, contact_name ?? null, phone ?? null, mitra.id]
  );
  res.json(rows[0]);
});

/* ── Public: mitra changes own password ── */
router.put("/auth/mitra-me/password", async (req, res) => {
  const mitra = await authenticateMitra(req, res);
  if (!mitra) return;
  const { current_password, new_password } = req.body;
  if (!current_password || !new_password) return res.status(400).json({ error: "Password lama dan baru wajib diisi" });
  if (new_password.length < 6) return res.status(400).json({ error: "Password baru minimal 6 karakter" });
  const valid = await bcrypt.compare(current_password, mitra.password_hash);
  if (!valid) return res.status(401).json({ error: "Password lama salah" });
  const hash = await bcrypt.hash(new_password, 10);
  await pool.query("UPDATE mitra SET password_hash=$1, updated_at=NOW() WHERE id=$2", [hash, mitra.id]);
  res.json({ ok: true });
});

/* ══════════════════ Pengelolaan usaha (business management) ══════════════════ */

/* ── Mitra: fetch all linked listings summary ── */
router.get("/auth/mitra-me/listings", async (req, res) => {
  const mitra = await authenticateMitra(req, res);
  if (!mitra) return;
  const { rows } = await pool.query(
    `SELECT ml.id, ml.listing_type, ml.listing_id,
      CASE ml.listing_type
        WHEN 'wisata'     THEN (SELECT name  FROM wisata     WHERE id = ml.listing_id)
        WHEN 'kuliner'    THEN (SELECT name  FROM kuliner    WHERE id = ml.listing_id)
        WHEN 'penginapan' THEN (SELECT name  FROM penginapan WHERE id = ml.listing_id)
        WHEN 'event'      THEN (SELECT name  FROM events     WHERE id = ml.listing_id)
      END AS listing_name,
      CASE ml.listing_type
        WHEN 'wisata'     THEN (SELECT image FROM wisata     WHERE id = ml.listing_id)
        WHEN 'kuliner'    THEN (SELECT image FROM kuliner    WHERE id = ml.listing_id)
        WHEN 'penginapan' THEN (SELECT image FROM penginapan WHERE id = ml.listing_id)
        WHEN 'event'      THEN (SELECT image FROM events     WHERE id = ml.listing_id)
      END AS listing_image
    FROM mitra_listings ml
    WHERE ml.mitra_id = $1
    ORDER BY ml.id ASC`,
    [mitra.id]
  );
  res.json(rows);
});

/* ── Helper: verify mitra owns a specific listing (junction table or legacy primary) ── */
async function mitraOwnsListing(mitraId: number, listingType: string, listingId: number): Promise<boolean> {
  const { rows } = await pool.query(
    `SELECT id FROM mitra_listings WHERE mitra_id = $1 AND listing_type = $2 AND listing_id = $3`,
    [mitraId, listingType, listingId]
  );
  return rows.length > 0;
}

/* ── Mitra: fetch own linked listing for editing.
   Accepts optional ?type=X&id=Y to select a specific linked listing (multi-listing support). ── */
router.get("/auth/mitra-me/listing", async (req, res) => {
  const mitra = await authenticateMitra(req, res);
  if (!mitra) return;

  const qType = req.query.type as string | undefined;
  const qId   = req.query.id ? Number(req.query.id) : null;

  let listingType: string;
  let listingId: number;

  if (qType && qId) {
    if (!isValidListingType(qType)) return res.status(400).json({ error: "Tipe listing tidak valid" });
    const owns = await mitraOwnsListing(mitra.id, qType, qId);
    if (!owns) return res.status(403).json({ error: "Listing tidak terhubung ke akun mitra ini" });
    listingType = qType;
    listingId   = qId;
  } else {
    if (!mitra.listing_type || !mitra.listing_id || !isValidListingType(mitra.listing_type)) {
      return res.status(404).json({ error: "Usaha belum ditautkan oleh admin. Hubungi admin Nempo.id untuk menautkan listing usahamu." });
    }
    listingType = mitra.listing_type;
    listingId   = mitra.listing_id;
  }

  const table = LISTING_TABLES[listingType];
  const { rows } = await pool.query(`SELECT * FROM ${table} WHERE id=$1`, [listingId]);
  if (!rows[0]) return res.status(404).json({ error: "Listing usaha tidak ditemukan (mungkin sudah dihapus admin)" });
  res.json({ listing_type: listingType, listing: rows[0] });
});

/* ── Mitra: update own listing (scoped to allowed fields per listing type).
   Accepts optional ?type=X&id=Y for multi-listing support. ── */
router.put("/auth/mitra-me/listing", async (req, res) => {
  const mitra = await authenticateMitra(req, res);
  if (!mitra) return;

  const qType = req.query.type as string | undefined;
  const qId   = req.query.id ? Number(req.query.id) : null;

  let listingType: string;
  let listingId: number;

  if (qType && qId) {
    if (!isValidListingType(qType)) return res.status(400).json({ error: "Tipe listing tidak valid" });
    const owns = await mitraOwnsListing(mitra.id, qType, qId);
    if (!owns) return res.status(403).json({ error: "Listing tidak terhubung ke akun mitra ini" });
    listingType = qType;
    listingId   = qId;
  } else {
    if (!mitra.listing_type || !mitra.listing_id || !isValidListingType(mitra.listing_type)) {
      return res.status(404).json({ error: "Usaha belum ditautkan oleh admin." });
    }
    listingType = mitra.listing_type;
    listingId   = mitra.listing_id;
  }

  const table   = LISTING_TABLES[listingType];
  const allowed = EDITABLE_FIELDS[listingType];
  const sets: string[] = [];
  const values: unknown[] = [];
  for (const field of allowed) {
    if (Object.prototype.hasOwnProperty.call(req.body, field)) {
      values.push(req.body[field]);
      sets.push(`${field}=$${values.length}`);
    }
  }
  if (sets.length === 0) return res.status(400).json({ error: "Tidak ada data untuk diperbarui" });
  values.push(listingId);
  const { rows } = await pool.query(
    `UPDATE ${table} SET ${sets.join(", ")}, updated_at=NOW() WHERE id=$${values.length} RETURNING *`,
    values
  );
  if (!rows[0]) return res.status(404).json({ error: "Listing usaha tidak ditemukan" });
  res.json({ listing_type: listingType, listing: rows[0] });
});

/* ── Mitra: pesanan / booking masuk — semua tipe listing ── */
const ORDER_TABLES: Record<string, { table: string; idCol: string; nameCol: string; amountCol: string | null; qtyCol: string | null }> = {
  wisata:     { table: "wisata_orders",       idCol: "wisata_id",      nameCol: "buyer_name",    amountCol: "total_amount", qtyCol: "qty" },
  kuliner:    { table: "kuliner_orders",      idCol: "kuliner_id",     nameCol: "customer_name", amountCol: null,           qtyCol: null },
  penginapan: { table: "penginapan_bookings", idCol: "penginapan_id",  nameCol: "guest_name",    amountCol: "total_amount", qtyCol: null },
  event:      { table: "event_orders",        idCol: "event_id",       nameCol: "buyer_name",    amountCol: "total_amount", qtyCol: "qty" },
};

router.get("/auth/mitra-me/orders", async (req, res) => {
  const mitra = await authenticateMitra(req, res);
  if (!mitra) return;
  if (!mitra.listing_type || !mitra.listing_id) {
    return res.json({ supported: true, summary: { total_orders: 0, pending_orders: 0, confirmed_orders: 0, confirmed_revenue: 0 }, recent: [] });
  }
  const cfg = ORDER_TABLES[mitra.listing_type];
  if (!cfg) return res.json({ supported: false, message: "Tipe listing tidak dikenal." });

  const amountSumExpr = cfg.amountCol
    ? `COALESCE(SUM(${cfg.amountCol}) FILTER (WHERE status='confirmed'), 0)::bigint AS confirmed_revenue`
    : "0::bigint AS confirmed_revenue";

  const { rows: summaryRows } = await pool.query(
    `SELECT
       COUNT(*)::int AS total_orders,
       COUNT(*) FILTER (WHERE status='pending')::int AS pending_orders,
       COUNT(*) FILTER (WHERE status='confirmed')::int AS confirmed_orders,
       COUNT(*) FILTER (WHERE status='rejected')::int AS rejected_orders,
       ${amountSumExpr}
     FROM ${cfg.table} WHERE ${cfg.idCol}=$1`,
    [mitra.listing_id]
  );

  const { rows: recentRows } = await pool.query(
    `SELECT * FROM ${cfg.table} WHERE ${cfg.idCol}=$1 ORDER BY created_at DESC LIMIT 30`,
    [mitra.listing_id]
  );

  res.json({ supported: true, listing_type: mitra.listing_type, summary: summaryRows[0], recent: recentRows });
});

/* ── Mitra: ubah status pesanan (konfirmasi / tolak) ── */
router.put("/auth/mitra-me/orders/:id/status", async (req, res) => {
  const mitra = await authenticateMitra(req, res);
  if (!mitra) return;
  if (!mitra.listing_type || !mitra.listing_id) return res.status(404).json({ error: "Usaha belum ditautkan." });
  const cfg = ORDER_TABLES[mitra.listing_type];
  if (!cfg) return res.status(400).json({ error: "Tipe listing tidak dikenal." });
  const { status } = req.body;
  if (!["confirmed", "rejected", "pending"].includes(status)) {
    return res.status(400).json({ error: "Status tidak valid" });
  }
  // Ambil pesanan sebelum update, termasuk status lama dan jumlah (jika ada)
  const existing = await pool.query(
    `SELECT id, status AS old_status${cfg.amountCol ? `, ${cfg.amountCol} AS amount` : ""} FROM ${cfg.table} WHERE id=$1 AND ${cfg.idCol}=$2`,
    [req.params.id, mitra.listing_id]
  );
  if (!existing.rows[0]) return res.status(404).json({ error: "Pesanan tidak ditemukan" });
  const oldOrder = existing.rows[0];

  // Untuk event: set confirmed_at saat dikonfirmasi manual (biasanya diisi Midtrans webhook, tapi kalau manual harus diisi di sini)
  const extraSet = (mitra.listing_type === "event" && status === "confirmed")
    ? ", confirmed_at = COALESCE(confirmed_at, NOW()), paid_at = COALESCE(paid_at, NOW())"
    : "";

  const { rows } = await pool.query(
    `UPDATE ${cfg.table} SET status=$1, updated_at=NOW()${extraSet} WHERE id=$2 RETURNING *`,
    [status, req.params.id]
  );

  // Kredit saldo mitra saat pesanan pertama kali dikonfirmasi (wisata, penginapan, event manual)
  if (
    status === "confirmed" &&
    oldOrder.old_status !== "confirmed" &&
    cfg.amountCol !== null
  ) {
    const amount = Number(oldOrder.amount) || 0;
    const orderRef = `${mitra.listing_type}-order-${req.params.id}`;
    if (amount > 0) {
      await creditWalletForMitraOrder(mitra.id, amount, orderRef, mitra.listing_type);
    }
  }

  res.json(rows[0]);
});

/* ── Mitra: manage own promo/vouchers ── */
router.get("/auth/mitra-me/vouchers", async (req, res) => {
  const mitra = await authenticateMitra(req, res);
  if (!mitra) return;
  const { rows } = await pool.query("SELECT * FROM vouchers WHERE mitra_id=$1 ORDER BY created_at DESC", [mitra.id]);
  res.json(rows);
});

const VOUCHER_TYPE_BY_LISTING: Record<string, string> = { wisata: "wisata", kuliner: "kuliner", penginapan: "hotel", event: "event" };

router.post("/auth/mitra-me/vouchers", async (req, res) => {
  const mitra = await authenticateMitra(req, res);
  if (!mitra) return;
  const { title, code, discount_type, discount_value, min_purchase, expiry_date, description, active } = req.body;
  if (!title || !code || !discount_type || discount_value == null) {
    return res.status(400).json({ error: "Nama, kode, jenis diskon, dan besar diskon wajib diisi" });
  }
  const exists = await pool.query("SELECT id FROM vouchers WHERE code=$1", [code]);
  if (exists.rows[0]) return res.status(409).json({ error: "Kode voucher sudah digunakan" });
  const type = mitra.listing_type ? (VOUCHER_TYPE_BY_LISTING[mitra.listing_type] ?? "umum") : "umum";
  const { rows } = await pool.query(
    `INSERT INTO vouchers (title, code, type, discount_type, discount_value, min_purchase, expiry_date, description, active, mitra_id)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *`,
    [title, code.toUpperCase(), type, discount_type, discount_value, min_purchase ?? 0, expiry_date ?? null, description ?? null, active ?? true, mitra.id]
  );
  res.status(201).json(rows[0]);
});

router.put("/auth/mitra-me/vouchers/:id", async (req, res) => {
  const mitra = await authenticateMitra(req, res);
  if (!mitra) return;
  const owns = await pool.query("SELECT id FROM vouchers WHERE id=$1 AND mitra_id=$2", [req.params.id, mitra.id]);
  if (!owns.rows[0]) return res.status(404).json({ error: "Voucher tidak ditemukan" });
  const { title, code, discount_type, discount_value, min_purchase, expiry_date, description, active } = req.body;
  if (code) {
    const dupe = await pool.query("SELECT id FROM vouchers WHERE code=$1 AND id<>$2", [code, req.params.id]);
    if (dupe.rows[0]) return res.status(409).json({ error: "Kode voucher sudah digunakan" });
  }
  const { rows } = await pool.query(
    `UPDATE vouchers SET
       title=COALESCE($1, title), code=COALESCE($2, code), discount_type=COALESCE($3, discount_type),
       discount_value=COALESCE($4, discount_value), min_purchase=COALESCE($5, min_purchase),
       expiry_date=COALESCE($6, expiry_date), description=COALESCE($7, description), active=COALESCE($8, active),
       updated_at=NOW()
     WHERE id=$9 AND mitra_id=$10 RETURNING *`,
    [title ?? null, code ? code.toUpperCase() : null, discount_type ?? null, discount_value ?? null,
     min_purchase ?? null, expiry_date ?? null, description ?? null, active ?? null, req.params.id, mitra.id]
  );
  if (!rows[0]) return res.status(404).json({ error: "Voucher tidak ditemukan" });
  res.json(rows[0]);
});

router.delete("/auth/mitra-me/vouchers/:id", async (req, res) => {
  const mitra = await authenticateMitra(req, res);
  if (!mitra) return;
  const result = await pool.query("DELETE FROM vouchers WHERE id=$1 AND mitra_id=$2", [req.params.id, mitra.id]);
  if (result.rowCount === 0) return res.status(404).json({ error: "Voucher tidak ditemukan" });
  res.status(204).send();
});

/* ── Mitra: upload foto listing ── */
router.post("/auth/mitra-me/upload", uploadMiddleware.single("file"), async (req: any, res: any) => {
  const mitra = await authenticateMitra(req, res);
  if (!mitra) return;
  if (!req.file) return res.status(400).json({ error: "Tidak ada file yang diterima" });
  const buf: Buffer = req.file.buffer ?? Buffer.alloc(0);
  if (buf.length === 0) return res.status(400).json({ error: "File gambar kosong" });
  try {
    const filename = `${Date.now()}-${randomUUID()}.webp`;
    const webpBuffer = await processImageToWebp(buf);
    await pool.query(
      `INSERT INTO file_uploads (id, data, mime_type, size) VALUES ($1, $2, $3, $4)`,
      [filename, webpBuffer, "image/webp", webpBuffer.length]
    );
    res.json({ url: `/api/uploads/${filename}` });
  } catch (err: any) {
    res.status(500).json({ error: "Gagal memproses gambar. Coba lagi." });
  }
});

/* ── Mitra: galeri foto ── */
router.get("/auth/mitra-me/gallery", async (req, res) => {
  const mitra = await authenticateMitra(req, res);
  if (!mitra) return;
  const { rows } = await pool.query(
    `SELECT id, image_url, position FROM mitra_gallery WHERE mitra_id=$1 ORDER BY position ASC, id ASC`,
    [mitra.id]
  );
  res.json(rows);
});

router.post("/auth/mitra-me/gallery", uploadMiddleware.single("file"), async (req: any, res: any) => {
  const mitra = await authenticateMitra(req, res);
  if (!mitra) return;
  if (!req.file) return res.status(400).json({ error: "Tidak ada file yang diterima" });
  const buf: Buffer = req.file.buffer ?? Buffer.alloc(0);
  if (buf.length === 0) return res.status(400).json({ error: "File gambar kosong" });
  try {
    const filename = `gallery-${Date.now()}-${randomUUID()}.webp`;
    const webpBuffer = await processImageToWebp(buf);
    await pool.query(
      `INSERT INTO file_uploads (id, data, mime_type, size) VALUES ($1,$2,$3,$4)`,
      [filename, webpBuffer, "image/webp", webpBuffer.length]
    );
    const url = `/api/uploads/${filename}`;
    const { rows: posRows } = await pool.query(
      `SELECT COALESCE(MAX(position),0)+1 AS next_pos FROM mitra_gallery WHERE mitra_id=$1`,
      [mitra.id]
    );
    const { rows } = await pool.query(
      `INSERT INTO mitra_gallery (mitra_id, image_url, position) VALUES ($1,$2,$3) RETURNING id, image_url, position`,
      [mitra.id, url, posRows[0].next_pos]
    );
    res.status(201).json(rows[0]);
  } catch {
    res.status(500).json({ error: "Gagal memproses gambar" });
  }
});

router.delete("/auth/mitra-me/gallery/:id", async (req, res) => {
  const mitra = await authenticateMitra(req, res);
  if (!mitra) return;
  const result = await pool.query(
    `DELETE FROM mitra_gallery WHERE id=$1 AND mitra_id=$2`,
    [req.params.id, mitra.id]
  );
  if (result.rowCount === 0) return res.status(404).json({ error: "Foto tidak ditemukan" });
  res.status(204).send();
});

/* ── Mitra: statistik pesanan 6 bulan terakhir ── */
router.get("/auth/mitra-me/stats", async (req, res) => {
  const mitra = await authenticateMitra(req, res);
  if (!mitra) return;
  if (!mitra.listing_type || !mitra.listing_id) {
    return res.json({ monthly: [], hasRevenue: false, listing_type: null });
  }
  const cfg = ORDER_TABLES[mitra.listing_type];
  if (!cfg) return res.json({ monthly: [], hasRevenue: false, listing_type: mitra.listing_type });

  const hasRevenue = cfg.amountCol !== null;
  const revenueExpr = hasRevenue
    ? `COALESCE(SUM(${cfg.amountCol}) FILTER (WHERE status='confirmed'),0)::bigint AS revenue`
    : "0::bigint AS revenue";

  const { rows } = await pool.query(
    `SELECT
       TO_CHAR(DATE_TRUNC('month', created_at), 'Mon') AS month,
       DATE_TRUNC('month', created_at) AS month_date,
       COUNT(*)::int AS total,
       COUNT(*) FILTER (WHERE status='confirmed')::int AS confirmed,
       ${revenueExpr}
     FROM ${cfg.table}
     WHERE ${cfg.idCol}=$1
       AND created_at >= DATE_TRUNC('month', NOW()) - INTERVAL '5 months'
     GROUP BY 1, 2
     ORDER BY 2 ASC`,
    [mitra.listing_id]
  );
  res.json({ monthly: rows, hasRevenue, listing_type: mitra.listing_type });
});

/* ── Mitra: tanggal terblokir penginapan ── */
router.get("/auth/mitra-me/blocked-dates", async (req, res) => {
  const mitra = await authenticateMitra(req, res);
  if (!mitra) return;
  if (mitra.listing_type !== "penginapan" || !mitra.listing_id) return res.json([]);
  const { rows } = await pool.query(
    `SELECT id, blocked_date::text AS blocked_date, reason
     FROM penginapan_blocked_dates WHERE penginapan_id=$1 ORDER BY blocked_date ASC`,
    [mitra.listing_id]
  );
  res.json(rows);
});

router.post("/auth/mitra-me/blocked-dates", async (req, res) => {
  const mitra = await authenticateMitra(req, res);
  if (!mitra) return;
  if (mitra.listing_type !== "penginapan" || !mitra.listing_id)
    return res.status(403).json({ error: "Hanya untuk mitra penginapan" });
  const { date, reason } = req.body;
  if (!date) return res.status(400).json({ error: "Tanggal wajib diisi" });
  try {
    const { rows } = await pool.query(
      `INSERT INTO penginapan_blocked_dates (penginapan_id, blocked_date, reason)
       VALUES ($1,$2,$3) ON CONFLICT DO NOTHING
       RETURNING id, blocked_date::text AS blocked_date, reason`,
      [mitra.listing_id, date, reason ?? null]
    );
    res.status(201).json(rows[0] ?? {});
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

router.delete("/auth/mitra-me/blocked-dates/:date", async (req, res) => {
  const mitra = await authenticateMitra(req, res);
  if (!mitra) return;
  if (mitra.listing_type !== "penginapan" || !mitra.listing_id)
    return res.status(403).json({ error: "Hanya untuk mitra penginapan" });
  await pool.query(
    `DELETE FROM penginapan_blocked_dates WHERE penginapan_id=$1 AND blocked_date=$2`,
    [mitra.listing_id, req.params.date]
  );
  res.status(204).send();
});

/* ── Mitra: lihat ulasan listing mereka ── */
router.get("/auth/mitra-me/reviews", async (req, res) => {
  const mitra = await authenticateMitra(req, res);
  if (!mitra) return;
  if (!mitra.listing_type || !mitra.listing_id) {
    return res.json({ reviews: [], summary: { count: 0, avg: 0 } });
  }
  const { rows } = await pool.query(
    `SELECT user_name, user_avatar, rating, comment, created_at
     FROM reviews WHERE item_type=$1 AND item_id=$2 AND visible=true
     ORDER BY created_at DESC LIMIT 30`,
    [mitra.listing_type, mitra.listing_id]
  );
  const { rows: sumRows } = await pool.query(
    `SELECT COUNT(*)::int AS count, ROUND(AVG(rating)::numeric,1)::float AS avg
     FROM reviews WHERE item_type=$1 AND item_id=$2 AND visible=true`,
    [mitra.listing_type, mitra.listing_id]
  );
  res.json({ reviews: rows, summary: sumRows[0] });
});

/* ── Mitra: redeem/verifikasi user voucher ── */
router.post("/auth/mitra-me/redeem-voucher/:code", async (req, res) => {
  const mitra = await authenticateMitra(req, res);
  if (!mitra) return;

  const code = req.params.code.toUpperCase().trim();
  if (!code) return res.status(400).json({ ok: false, error: "Kode tidak boleh kosong" });

  try {
    const { rows } = await pool.query(`
      SELECT uv.*
      FROM user_vouchers uv
      WHERE UPPER(uv.code) = $1
    `, [code]);

    if (!rows[0]) return res.status(404).json({ ok: false, error: "Kode voucher tidak ditemukan" });

    const uv = rows[0];

    // Already used
    if (uv.status === "used") {
      return res.status(409).json({ ok: false, error: "Voucher sudah pernah digunakan", voucher: { title: uv.title, code: uv.code } });
    }

    // Expired by status or by date
    if (uv.status === "expired" || (uv.expires_at && new Date(uv.expires_at) < new Date())) {
      return res.status(400).json({ ok: false, error: "Voucher sudah kedaluwarsa", voucher: { title: uv.title, code: uv.code } });
    }

    // Check applicable type vs mitra listing type
    const mitraType = mitra.listing_type; // wisata | kuliner | penginapan | event
    const voucherType = uv.applicable_type;
    if (voucherType && voucherType !== "all" && voucherType !== mitraType) {
      const TYPE_LABEL: Record<string, string> = { wisata: "Wisata", kuliner: "Kuliner", penginapan: "Penginapan", event: "Event", all: "Semua" };
      return res.status(400).json({
        ok: false,
        error: `Voucher ini hanya berlaku untuk ${TYPE_LABEL[voucherType] || voucherType}, tidak untuk ${TYPE_LABEL[mitraType] || mitraType}`,
      });
    }

    // Mark as used
    await pool.query(
      `UPDATE user_vouchers SET status = 'used' WHERE id = $1`,
      [uv.id]
    );

    res.json({
      ok: true,
      voucher: {
        title: uv.title,
        code: uv.code,
        discount_type: uv.discount_type,
        discount_value: uv.discount_value,
        min_purchase: uv.min_purchase,
        applicable_type: voucherType,
      },
    });
  } catch (err: any) {
    console.error("Redeem voucher error:", err);
    res.status(500).json({ ok: false, error: "Gagal proses verifikasi voucher" });
  }
});

/* ── Mitra event: scan tiket masuk ── */
router.post("/auth/mitra-me/scan/:code", async (req, res) => {
  const mitra = await authenticateMitra(req, res);
  if (!mitra) return;
  if (mitra.listing_type !== "event" || !mitra.listing_id)
    return res.status(403).json({ ok: false, error: "Fitur ini hanya untuk mitra event" });

  try {
    const { rows } = await pool.query(`
      SELECT eo.*, e.name AS event_name
      FROM event_orders eo
      LEFT JOIN events e ON eo.event_id = e.id
      WHERE eo.order_code = $1 AND eo.event_id = $2
    `, [req.params.code.toUpperCase().trim(), mitra.listing_id]);

    if (!rows[0]) return res.status(404).json({ ok: false, error: "Kode tiket tidak ditemukan untuk event ini" });

    const order = rows[0];
    if (order.status !== "confirmed")
      return res.status(400).json({ ok: false, error: "Tiket belum dikonfirmasi / belum dibayar", order });
    if (order.checked_in)
      return res.status(409).json({ ok: false, error: "Tiket sudah digunakan untuk masuk", order });

    await pool.query(
      `UPDATE event_orders SET checked_in = TRUE, checked_in_at = NOW() WHERE id = $1`,
      [order.id]
    );
    res.json({ ok: true, order: { ...order, checked_in: true, checked_in_at: new Date().toISOString() } });
  } catch (err: any) {
    res.status(500).json({ ok: false, error: "Gagal proses scan" });
  }
});

export default router;
