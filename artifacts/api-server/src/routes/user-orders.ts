import { Router } from "express";
import pool from "../lib/db";
import { verifyToken } from "../lib/auth";

const router = Router();

function authUser(req: any): { id: number; email: string } | null {
  const auth = req.headers.authorization;
  if (!auth?.startsWith("Bearer ")) return null;
  try {
    const p = verifyToken(auth.slice(7)) as any;
    return p?.id ? { id: p.id, email: p.email } : null;
  } catch { return null; }
}

/* ── GET /user/orders — riwayat semua pesanan pengguna berdasarkan email ── */
router.get("/user/orders", async (req: any, res: any) => {
  const user = authUser(req);
  if (!user) return res.status(401).json({ error: "Unauthorized" });

  try {
    const email = user.email;

    const [wisataRes, kulinerRes, penginapanRes, eventRes] = await Promise.all([
      pool.query(`
        SELECT
          wo.order_code, wo.status, wo.total_amount, wo.created_at,
          COALESCE(w.name, 'Wisata') AS item_name
        FROM wisata_orders wo
        LEFT JOIN wisata w ON wo.wisata_id = w.id
        WHERE wo.buyer_email = $1
        ORDER BY wo.created_at DESC
      `, [email]),

      pool.query(`
        SELECT
          ko.order_code,
          COALESCE(ko.status, 'processing') AS status,
          0 AS total_amount, ko.created_at,
          COALESCE(k.name, 'Kuliner') AS item_name
        FROM kuliner_orders ko
        LEFT JOIN kuliner k ON ko.kuliner_id = k.id
        WHERE ko.customer_email = $1
        ORDER BY ko.created_at DESC
      `, [email]),

      pool.query(`
        SELECT
          pb.order_code, pb.status, pb.total_amount, pb.created_at,
          COALESCE(p.name, 'Penginapan') AS item_name
        FROM penginapan_bookings pb
        LEFT JOIN penginapan p ON pb.penginapan_id = p.id
        WHERE pb.guest_email = $1
        ORDER BY pb.created_at DESC
      `, [email]),

      pool.query(`
        SELECT
          eo.order_code, eo.status, eo.total_amount, eo.created_at,
          COALESCE(e.name, eo.ticket_name, 'Event') AS item_name
        FROM event_orders eo
        LEFT JOIN events e ON eo.event_id = e.id
        WHERE eo.buyer_email = $1
          AND (eo.notes IS NULL OR (eo.notes != 'ots-tiketing' AND eo.notes != 'offline-crew'))
        ORDER BY eo.created_at DESC
      `, [email]),
    ]);

    const normalize = (rows: any[], type: string) =>
      rows.map(r => ({
        order_code: r.order_code,
        type,
        item_name: r.item_name || "—",
        status: r.status,
        total_amount: Number(r.total_amount) || 0,
        created_at: r.created_at,
      }));

    const all = [
      ...normalize(wisataRes.rows, "wisata"),
      ...normalize(kulinerRes.rows, "kuliner"),
      ...normalize(penginapanRes.rows, "penginapan"),
      ...normalize(eventRes.rows, "event"),
    ].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    res.json(all);
  } catch (err: any) {
    res.status(500).json({ error: "Gagal mengambil riwayat pesanan" });
  }
});

/* ── GET /user/event-tickets — tiket event pengguna (semua status, kecuali OTS/offline) ── */
router.get("/user/event-tickets", async (req: any, res: any) => {
  const user = authUser(req);
  if (!user) return res.status(401).json({ error: "Unauthorized" });

  try {
    const result = await pool.query(`
      SELECT
        eo.id, eo.order_code, eo.status, eo.total_amount, eo.created_at, eo.confirmed_at,
        eo.ticket_name, eo.qty, eo.buyer_name, eo.buyer_email, eo.buyer_phone,
        eo.attendee_names, eo.checked_in, eo.checked_in_at,
        e.name AS event_name,
        e.date AS event_date,
        e.time_start,
        e.location AS event_location,
        e.image AS event_image,
        e.organizer
      FROM event_orders eo
      LEFT JOIN events e ON eo.event_id = e.id
      WHERE eo.buyer_email = $1
        AND (eo.notes IS NULL OR (eo.notes != 'ots-tiketing' AND eo.notes != 'offline-crew'))
      ORDER BY eo.created_at DESC
    `, [user.email]);
    res.json(result.rows);
  } catch (err: any) {
    res.status(500).json({ error: "Gagal mengambil data tiket" });
  }
});

export default router;
