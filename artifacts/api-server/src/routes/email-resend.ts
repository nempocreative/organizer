import { Router } from "express";
import pool from "../lib/db";
import { logger } from "../lib/logger";
import { requireAuth } from "../middlewares/auth";
import { sendEventTicket, sendWisataTicket, sendPenginapanConfirmation } from "../lib/mailer";

const router = Router();

/* ── GET /admin/email-failures/count
   Kembalikan jumlah order confirmed yang email_sent_at masih NULL (ringkas)
── */
router.get("/admin/email-failures/count", requireAuth, async (_req: any, res: any) => {
  try {
    const { rows } = await pool.query(
      `SELECT (
         (SELECT COUNT(*) FROM event_orders      WHERE status = 'confirmed' AND email_sent_at IS NULL AND buyer_email IS NOT NULL AND buyer_email != '') +
         (SELECT COUNT(*) FROM wisata_orders     WHERE status = 'confirmed' AND email_sent_at IS NULL AND buyer_email IS NOT NULL AND buyer_email != '') +
         (SELECT COUNT(*) FROM penginapan_bookings WHERE status = 'confirmed' AND email_sent_at IS NULL AND guest_email IS NOT NULL AND guest_email != '')
       ) AS total`
    );
    res.json({ count: Number(rows[0]?.total ?? 0) });
  } catch (err: any) {
    logger.error({ err: err?.message }, "Gagal ambil jumlah email failures");
    res.status(500).json({ error: "Gagal mengambil data" });
  }
});

/* ── GET /admin/email-failures
   Kembalikan semua order yang sudah confirmed tapi email_sent_at masih NULL
   (dari 3 tabel: event_orders, wisata_orders, penginapan_bookings)
── */
router.get("/admin/email-failures", requireAuth, async (_req: any, res: any) => {
  try {
    const [evtRes, wisataRes, penginapanRes] = await Promise.all([
      pool.query(
        `SELECT eo.id, 'event' AS order_type, eo.order_code,
                eo.buyer_name AS customer_name, eo.buyer_email AS customer_email,
                eo.total_amount, eo.confirmed_at AS confirmed_at,
                e.title AS product_name
         FROM event_orders eo
         LEFT JOIN events e ON e.id = eo.event_id
         WHERE eo.status = 'confirmed' AND eo.email_sent_at IS NULL
           AND eo.buyer_email IS NOT NULL AND eo.buyer_email != ''
         ORDER BY eo.confirmed_at DESC`
      ),
      pool.query(
        `SELECT wo.id, 'wisata' AS order_type, wo.order_code,
                wo.buyer_name AS customer_name, wo.buyer_email AS customer_email,
                wo.total_amount, wo.updated_at AS confirmed_at,
                w.name AS product_name
         FROM wisata_orders wo
         LEFT JOIN wisata w ON w.id = wo.wisata_id
         WHERE wo.status = 'confirmed' AND wo.email_sent_at IS NULL
           AND wo.buyer_email IS NOT NULL AND wo.buyer_email != ''
         ORDER BY wo.updated_at DESC`
      ),
      pool.query(
        `SELECT pb.id, 'penginapan' AS order_type, pb.order_code,
                pb.guest_name AS customer_name, pb.guest_email AS customer_email,
                pb.total_amount, pb.updated_at AS confirmed_at,
                p.name AS product_name
         FROM penginapan_bookings pb
         LEFT JOIN penginapan p ON p.id = pb.penginapan_id
         WHERE pb.status = 'confirmed' AND pb.email_sent_at IS NULL
           AND pb.guest_email IS NOT NULL AND pb.guest_email != ''
         ORDER BY pb.updated_at DESC`
      ),
    ]);

    const rows = [
      ...evtRes.rows,
      ...wisataRes.rows,
      ...penginapanRes.rows,
    ].sort((a, b) => new Date(b.confirmed_at).getTime() - new Date(a.confirmed_at).getTime());

    res.json(rows);
  } catch (err: any) {
    logger.error({ err: err?.message }, "Gagal ambil daftar email failures");
    res.status(500).json({ error: "Gagal mengambil data" });
  }
});

/* ── POST /admin/email-failures/:type/:id/resend
   Kirim ulang email untuk satu order (type: event | wisata | penginapan)
── */
router.post("/admin/email-failures/:type/:id/resend", requireAuth, async (req: any, res: any) => {
  const { type, id } = req.params;
  const numId = parseInt(id, 10);

  if (!["event", "wisata", "penginapan"].includes(type) || isNaN(numId)) {
    return res.status(400).json({ error: "Parameter tidak valid" });
  }

  try {
    if (type === "event") {
      const { rows } = await pool.query(
        `SELECT eo.id, eo.order_code, eo.buyer_name, eo.buyer_email,
                eo.ticket_name, eo.qty, eo.total_amount, eo.attendee_names,
                e.title AS event_name
         FROM event_orders eo
         LEFT JOIN events e ON e.id = eo.event_id
         WHERE eo.id = $1 AND eo.status = 'confirmed'`,
        [numId]
      );
      if (!rows[0]) return res.status(404).json({ error: "Order tidak ditemukan atau belum confirmed" });
      const o = rows[0];
      if (!o.buyer_email) return res.status(400).json({ error: "Pembeli tidak memiliki email" });

      await sendEventTicket({
        buyerName: o.buyer_name ?? "Pembeli",
        buyerEmail: o.buyer_email,
        orderCode: o.order_code,
        eventName: o.event_name ?? "Event",
        ticketName: o.ticket_name ?? "Tiket",
        qty: o.qty ?? 1,
        totalAmount: Number(o.total_amount) || 0,
        attendeeNames: Array.isArray(o.attendee_names) ? o.attendee_names : [],
      });
      await pool.query(`UPDATE event_orders SET email_sent_at = NOW() WHERE id = $1`, [numId]);

    } else if (type === "wisata") {
      const { rows } = await pool.query(
        `SELECT wo.id, wo.order_code, wo.buyer_name, wo.buyer_email,
                wo.ticket_type, wo.qty, wo.total_amount, wo.visit_date,
                w.name AS wisata_name
         FROM wisata_orders wo
         LEFT JOIN wisata w ON w.id = wo.wisata_id
         WHERE wo.id = $1 AND wo.status = 'confirmed'`,
        [numId]
      );
      if (!rows[0]) return res.status(404).json({ error: "Order tidak ditemukan atau belum confirmed" });
      const o = rows[0];
      if (!o.buyer_email) return res.status(400).json({ error: "Pembeli tidak memiliki email" });

      await sendWisataTicket({
        buyerName: o.buyer_name ?? "Pembeli",
        buyerEmail: o.buyer_email,
        orderCode: o.order_code,
        wisataName: o.wisata_name ?? "Wisata",
        ticketType: o.ticket_type ?? "Umum",
        qty: o.qty ?? 1,
        totalAmount: Number(o.total_amount) || 0,
        visitDate: o.visit_date ? new Date(o.visit_date).toLocaleDateString("id-ID", { weekday: "long", year: "numeric", month: "long", day: "numeric" }) : "-",
      });
      await pool.query(`UPDATE wisata_orders SET email_sent_at = NOW() WHERE id = $1`, [numId]);

    } else if (type === "penginapan") {
      const { rows } = await pool.query(
        `SELECT pb.id, pb.order_code, pb.guest_name, pb.guest_email,
                pb.room_type, pb.checkin_date, pb.checkout_date, pb.num_guests, pb.total_amount,
                p.name AS penginapan_name
         FROM penginapan_bookings pb
         LEFT JOIN penginapan p ON p.id = pb.penginapan_id
         WHERE pb.id = $1 AND pb.status = 'confirmed'`,
        [numId]
      );
      if (!rows[0]) return res.status(404).json({ error: "Order tidak ditemukan atau belum confirmed" });
      const o = rows[0];
      if (!o.guest_email) return res.status(400).json({ error: "Tamu tidak memiliki email" });

      const fmt = (d: any) => d ? new Date(d).toLocaleDateString("id-ID", { weekday: "long", year: "numeric", month: "long", day: "numeric" }) : "-";
      await sendPenginapanConfirmation({
        guestName: o.guest_name ?? "Tamu",
        guestEmail: o.guest_email,
        orderCode: o.order_code,
        penginapanName: o.penginapan_name ?? "Penginapan",
        roomType: o.room_type ?? "-",
        checkinDate: fmt(o.checkin_date),
        checkoutDate: fmt(o.checkout_date),
        numGuests: o.num_guests ?? 1,
        totalAmount: Number(o.total_amount) || 0,
      });
      await pool.query(`UPDATE penginapan_bookings SET email_sent_at = NOW() WHERE id = $1`, [numId]);
    }

    logger.info({ type, id: numId }, "Email berhasil dikirim ulang oleh admin");
    res.json({ ok: true, message: "Email berhasil dikirim ulang" });
  } catch (err: any) {
    logger.error({ err: err?.message, type, id }, "Gagal kirim ulang email");
    res.status(500).json({ error: err?.message || "Gagal mengirim email" });
  }
});

export default router;
