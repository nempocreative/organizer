import { Router } from "express";
import pool from "../lib/db";
import { requireAuth } from "../middlewares/auth";
import { optimizeImageUrl } from "../lib/media";

const router = Router();

function slugify(text: string): string {
  return text.toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

async function resolveEventId(idOrSlug: string): Promise<number | null> {
  if (/^\d+$/.test(idOrSlug)) return parseInt(idOrSlug);
  const { rows } = await pool.query("SELECT id FROM events WHERE slug=$1", [idOrSlug]);
  return rows[0]?.id ?? null;
}

const RATING_QUERY = `
  SELECT
    e.*,
    COALESCE(r.review_count, 0) AS review_count,
    CASE WHEN COALESCE(r.review_count, 0) >= 5 THEN ROUND(r.avg_rating::numeric, 1) ELSE NULL END AS computed_rating
  FROM events e
  LEFT JOIN (
    SELECT item_id, COUNT(*) AS review_count, AVG(rating) AS avg_rating
    FROM reviews
    WHERE item_type = 'events' AND visible = true
    GROUP BY item_id
  ) r ON r.item_id = e.id
`;

function normalizeEvent(row: any) {
  return {
    ...row,
    image: optimizeImageUrl(row.image) ?? row.image,
    banner_image: optimizeImageUrl(row.banner_image) ?? row.banner_image,
  };
}

router.get("/events", async (_req, res) => {
  const { rows } = await pool.query(`${RATING_QUERY} WHERE e.active=true ORDER BY e.id ASC`);
  res.json(rows.map(normalizeEvent));
});

router.get("/events/:id", async (req, res) => {
  const isNum = /^\d+$/.test(req.params.id);
  const { rows } = await pool.query(
    isNum
      ? `${RATING_QUERY} WHERE e.id=$1 AND e.active=true`
      : `${RATING_QUERY} WHERE e.slug=$1 AND e.active=true`,
    [isNum ? parseInt(req.params.id) : req.params.id]
  );
  if (!rows[0]) return res.status(404).json({ error: "Not found" });
  res.json(normalizeEvent(rows[0]));
});

router.get("/admin/events", requireAuth, async (_req, res) => {
  const { rows } = await pool.query(`${RATING_QUERY} ORDER BY e.id ASC`);
  res.json(rows.map(normalizeEvent));
});

router.post("/admin/events", requireAuth, async (req, res) => {
  const { name, title, category, date, date_end, time_start, time_end, location, image, banner_image, description, price,
          organizer, organizer_ig, featured, active, maps_url, allow_voucher, crew_active,
          guest_stars, prohibited_items, rundown, transportation_info, menu_items, payment_info, visitors,
          service_fee_percent } = req.body;
  const baseSlug = slugify(name);
  let slug = baseSlug;
  let suffix = 1;
  while (true) {
    const { rows: existing } = await pool.query("SELECT id FROM events WHERE slug=$1", [slug]);
    if (!existing[0]) break;
    slug = `${baseSlug}-${++suffix}`;
  }
  // Hanya boleh ada satu event dengan crew_active=true (dipakai tim tiketing/crew di lokasi)
  if (crew_active) {
    await pool.query(`UPDATE events SET crew_active = false WHERE crew_active = true`);
  }
  const { rows } = await pool.query(
    `INSERT INTO events (name, title, category, date, date_end, time_start, time_end, location, image, banner_image, description, price,
      organizer, organizer_ig, featured, active, maps_url, allow_voucher, crew_active,
      guest_stars, prohibited_items, rundown, transportation_info, menu_items, payment_info, slug, visitors, service_fee_percent)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23,$24,$25,$26,$27,$28) RETURNING *`,
    [name, title ?? "", category, date, date_end ?? "", time_start ?? "", time_end ?? "",
     location, image, banner_image ?? null, description, price ?? 0,
     organizer, organizer_ig ?? "",
     featured ?? false, active ?? true,
     maps_url ?? null, allow_voucher ?? false, crew_active ?? false,
     guest_stars ? JSON.stringify(guest_stars) : '[]',
     prohibited_items ? JSON.stringify(prohibited_items) : '[]',
     rundown ? JSON.stringify(rundown) : '[]',
     transportation_info ? JSON.stringify(transportation_info) : '[]',
     menu_items ? JSON.stringify(menu_items) : '[]',
     payment_info ? JSON.stringify(payment_info) : '{}',
     slug, visitors ?? 0, service_fee_percent ?? 2]
  );
  res.status(201).json(rows[0]);
});

router.put("/admin/events/:id", requireAuth, async (req, res) => {
  const { name, title, category, date, date_end, time_start, time_end, location, image, banner_image, description, price,
          organizer, organizer_ig, featured, active, maps_url, allow_voucher, crew_active,
          guest_stars, prohibited_items, rundown, transportation_info, menu_items, payment_info, visitors,
          service_fee_percent } = req.body;
  const baseSlug = slugify(name);
  let slug = baseSlug;
  let suffix = 1;
  while (true) {
    const { rows: existing } = await pool.query("SELECT id FROM events WHERE slug=$1 AND id!=$2", [slug, req.params.id]);
    if (!existing[0]) break;
    slug = `${baseSlug}-${++suffix}`;
  }
  // Hanya boleh ada satu event dengan crew_active=true (dipakai tim tiketing/crew di lokasi)
  if (crew_active) {
    await pool.query(`UPDATE events SET crew_active = false WHERE crew_active = true AND id != $1`, [req.params.id]);
  }
  const { rows } = await pool.query(
    `UPDATE events SET name=$1, title=$2, category=$3, date=$4, date_end=$5, time_start=$6, time_end=$7,
     location=$8, image=$9, banner_image=$10, description=$11, price=$12, organizer=$13, organizer_ig=$14,
     featured=$15, active=$16, maps_url=$17, allow_voucher=$18, crew_active=$19,
     guest_stars=$20, prohibited_items=$21, rundown=$22, transportation_info=$23, menu_items=$24, payment_info=$25, slug=$26, visitors=$27,
     service_fee_percent=$28, updated_at=NOW()
     WHERE id=$29 RETURNING *`,
    [name, title ?? "", category, date, date_end ?? "", time_start ?? "", time_end ?? "",
     location, image, banner_image ?? null, description, price, organizer, organizer_ig ?? "",
     featured, active,
     maps_url ?? null, allow_voucher ?? false, crew_active ?? false,
     guest_stars ? JSON.stringify(guest_stars) : '[]',
     prohibited_items ? JSON.stringify(prohibited_items) : '[]',
     rundown ? JSON.stringify(rundown) : '[]',
     transportation_info ? JSON.stringify(transportation_info) : '[]',
     menu_items ? JSON.stringify(menu_items) : '[]',
     payment_info ? JSON.stringify(payment_info) : '{}',
     slug, visitors ?? 0, service_fee_percent ?? 2, req.params.id]
  );
  if (!rows[0]) return res.status(404).json({ error: "Not found" });
  res.json(rows[0]);
});

router.delete("/admin/events/bulk", requireAuth, async (req, res) => {
  const { ids } = req.body;
  if (!Array.isArray(ids) || ids.length === 0) return res.status(400).json({ error: "ids harus array tidak kosong" });
  const placeholders = ids.map((_: unknown, i: number) => `$${i + 1}`).join(",");
  const result = await pool.query(`DELETE FROM events WHERE id IN (${placeholders})`, ids);
  res.json({ deleted: result.rowCount });
});

router.delete("/admin/events/:id", requireAuth, async (req, res) => {
  await pool.query("DELETE FROM events WHERE id=$1", [req.params.id]);
  res.json({ success: true });
});

/* ─────────────── EVENT TICKETS ─────────────── */

router.get("/events/:id/tickets", async (req, res) => {
  const eventId = await resolveEventId(req.params.id);
  if (!eventId) return res.status(404).json({ error: "Not found" });
  const { rows } = await pool.query(
    "SELECT * FROM event_tickets WHERE event_id=$1 AND active=true ORDER BY sort_order ASC",
    [eventId]
  );
  res.json(rows);
});

router.get("/admin/events/:id/tickets", requireAuth, async (req, res) => {
  const { rows } = await pool.query(
    "SELECT * FROM event_tickets WHERE event_id=$1 ORDER BY sort_order ASC",
    [req.params.id]
  );
  res.json(rows);
});

router.post("/admin/events/:id/tickets", requireAuth, async (req, res) => {
  const { name, description, price, quota, sold, sale_start, sale_end, sort_order, active } = req.body;
  const { rows } = await pool.query(
    `INSERT INTO event_tickets (event_id, name, description, price, quota, sold, sale_start, sale_end, sort_order, active)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *`,
    [req.params.id, name, description ?? "", price ?? 0, quota ?? 0, sold ?? 0, sale_start ?? null, sale_end ?? null, sort_order ?? 0, active ?? true]
  );
  res.status(201).json(rows[0]);
});

router.put("/admin/event-tickets/:ticketId", requireAuth, async (req, res) => {
  const { name, description, price, quota, sold, sale_start, sale_end, sort_order, active } = req.body;
  const { rows } = await pool.query(
    `UPDATE event_tickets SET name=$1, description=$2, price=$3, quota=$4, sold=$5,
     sale_start=$6, sale_end=$7, sort_order=$8, active=$9 WHERE id=$10 RETURNING *`,
    [name, description, price, quota, sold, sale_start ?? null, sale_end ?? null, sort_order, active, req.params.ticketId]
  );
  if (!rows[0]) return res.status(404).json({ error: "Not found" });
  res.json(rows[0]);
});

router.delete("/admin/event-tickets/:ticketId", requireAuth, async (req, res) => {
  await pool.query("DELETE FROM event_tickets WHERE id=$1", [req.params.ticketId]);
  res.json({ success: true });
});

export default router;
