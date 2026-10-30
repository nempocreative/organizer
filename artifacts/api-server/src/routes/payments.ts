import { Router } from "express";
import crypto from "crypto";
import pool from "../lib/db";
import { logger } from "../lib/logger";
import { getClientConfig } from "../lib/midtrans";
import { creditWalletForEventOrder, creditWalletForMitraOrder } from "./wallet";
import { sendEventTicket, sendWisataTicket, sendPenginapanConfirmation } from "../lib/mailer";
import { handleJajanYukPaymentNotification } from "./jajan-yuk";

/* ── Lepas kuota tiket yang direservasi saat pesanan dibuat (lihat event-orders.ts) ── */
async function releaseTicketQuota(ticketId: number | null, qty: number): Promise<void> {
  if (!ticketId) return;
  await pool.query(`UPDATE event_tickets SET sold = GREATEST(0, sold - $1) WHERE id = $2`, [qty, ticketId]);
}

const router = Router();

/* ── GET /payments/client-key — publik: client key Midtrans untuk Snap.js ── */
router.get("/payments/client-key", (_req, res) => {
  res.json(getClientConfig());
});

/* ── Verifikasi signature notifikasi Midtrans ── */
function isValidSignature(body: any): boolean {
  const serverKey = process.env.MIDTRANS_SERVER_KEY ?? "";
  const { order_id, status_code, gross_amount, signature_key } = body;
  if (!order_id || !status_code || !gross_amount || !signature_key) return false;
  const expected = crypto
    .createHash("sha512")
    .update(`${order_id}${status_code}${gross_amount}${serverKey}`)
    .digest("hex");
  return expected === signature_key;
}

/* ── Tentukan tipe order dari prefix kode ── */
function detectOrderType(orderId: string): "event" | "wisata" | "penginapan" | "jajan-yuk" | null {
  if (orderId.startsWith("NGT")) return "event";
  if (orderId.startsWith("NGW")) return "wisata";
  if (orderId.startsWith("NGP")) return "penginapan";
  if (orderId.startsWith("JY")) return "jajan-yuk";
  return null;
}

/* ── POST /payments/notification — webhook Midtrans (semua tipe order) ── */
router.post("/payments/notification", async (req: any, res: any) => {
  try {
    const body = req.body;
    if (!isValidSignature(body)) {
      logger.warn({ order_id: body?.order_id }, "Midtrans notification: invalid signature");
      return res.status(403).json({ error: "Invalid signature" });
    }

    const { order_id, transaction_status, fraud_status, payment_type } = body;
    const orderType = detectOrderType(order_id);

    if (!orderType) {
      logger.warn({ order_id }, "Midtrans notification: unknown order prefix");
      return res.status(404).json({ error: "Unknown order type" });
    }

    // ── Resolve new status ──
    let newStatus: string | null = null;
    if (transaction_status === "capture") {
      newStatus = fraud_status === "accept" ? "confirmed" : "pending";
    } else if (transaction_status === "settlement") {
      newStatus = "confirmed";
    } else if (transaction_status === "pending") {
      newStatus = "pending";
    } else if (["deny", "cancel", "expire", "failure"].includes(transaction_status)) {
      newStatus = "rejected";
    }

    // ── Dispatch ke handler tipe order yang sesuai ──
    if (orderType === "event") {
      await handleEventOrder(order_id, newStatus, body, payment_type);
    } else if (orderType === "wisata") {
      await handleWisataOrder(order_id, newStatus, payment_type);
    } else if (orderType === "penginapan") {
      await handlePenginapanOrder(order_id, newStatus, payment_type);
    } else if (orderType === "jajan-yuk") {
      await handleJajanYukPaymentNotification(body);
    }

    res.json({ ok: true });
  } catch (err: any) {
    logger.error({ err: err?.message }, "Midtrans notification error");
    res.status(500).json({ error: "Gagal memproses notifikasi" });
  }
});

/* ── Handler: event_orders (logika lama) ── */
async function handleEventOrder(order_id: string, newStatus: string | null, body: any, payment_type: string | null) {
  const orderRes = await pool.query(
    `SELECT eo.id, eo.ticket_id, eo.event_id, eo.qty, eo.total_amount, eo.status,
            eo.buyer_name, eo.buyer_email, eo.ticket_name, eo.attendee_names,
            e.title AS event_name
     FROM event_orders eo
     LEFT JOIN events e ON e.id = eo.event_id
     WHERE eo.order_code = $1`,
    [order_id]
  );
  if (orderRes.rows.length === 0) {
    logger.warn({ order_id }, "Event order not found");
    return;
  }
  const order = orderRes.rows[0];
  if (order.status === "confirmed" || order.status === "rejected") return;

  if (newStatus === "confirmed") {
    // Kuota tiket sudah direservasi saat pesanan dibuat (POST /event-orders), jadi di sini
    // hanya mengubah status pesanan — tidak increment `sold` lagi.
    await pool.query(
      `UPDATE event_orders
       SET status = 'confirmed', confirmed_at = NOW(), paid_at = NOW(),
           payment_method = $2, midtrans_transaction_id = $3
       WHERE id = $1`,
      [order.id, payment_type ?? null, body.transaction_id ?? null]
    );
    await creditWalletForEventOrder(order.event_id, Number(order.total_amount) || 0, order_id);
    logger.info({ order_id }, "Event order confirmed via Midtrans");

    // Kirim e-tiket ke email pembeli (dengan retry 3x)
    if (order.buyer_email) {
      const attendeeNames: string[] = Array.isArray(order.attendee_names) ? order.attendee_names : [];
      sendEventTicket({
        buyerName: order.buyer_name ?? "Pembeli",
        buyerEmail: order.buyer_email,
        orderCode: order_id,
        eventName: order.event_name ?? "Event",
        ticketName: order.ticket_name ?? "Tiket",
        qty: order.qty ?? 1,
        totalAmount: Number(order.total_amount) || 0,
        attendeeNames,
      })
        .then(() => {
          pool.query(
            `UPDATE event_orders SET email_sent_at = NOW() WHERE id = $1`,
            [order.id]
          ).catch((e: any) => logger.error({ err: e?.message, order_id }, "Gagal update email_sent_at event"));
        })
        .catch((err: any) => logger.error({ err: err?.message, order_id }, "Gagal kirim e-tiket event setelah retry"));
    }
  } else if (newStatus === "rejected") {
    await pool.query(
      `UPDATE event_orders SET status = 'rejected', payment_method = $2, notes = $3 WHERE id = $1`,
      [order.id, payment_type ?? null, `Midtrans: ${body.transaction_status}`]
    );
    // Pembayaran gagal/expired/dibatalkan — lepas kuota yang tadi direservasi
    await releaseTicketQuota(order.ticket_id, order.qty);
  } else if (newStatus === "pending") {
    await pool.query(`UPDATE event_orders SET payment_method = $2 WHERE id = $1`, [order.id, payment_type ?? null]);
  }
}

/* ── Handler: wisata_orders ── */
async function handleWisataOrder(order_id: string, newStatus: string | null, payment_type: string | null) {
  const orderRes = await pool.query(
    `SELECT wo.id, wo.wisata_id, wo.total_amount, wo.status,
            wo.buyer_name, wo.buyer_email, wo.ticket_type, wo.qty, wo.visit_date,
            w.name AS wisata_name
     FROM wisata_orders wo
     LEFT JOIN wisata w ON w.id = wo.wisata_id
     WHERE wo.order_code = $1`,
    [order_id]
  );
  if (orderRes.rows.length === 0) { logger.warn({ order_id }, "Wisata order not found"); return; }
  const order = orderRes.rows[0];
  if (order.status === "confirmed" || order.status === "rejected") return;

  if (newStatus === "confirmed") {
    await pool.query(
      `UPDATE wisata_orders SET status = 'confirmed', updated_at = NOW() WHERE id = $1`,
      [order.id]
    );
    // Credit wallet mitra yang punya listing wisata ini
    const mitraRes = await pool.query(
      `SELECT id FROM mitra WHERE listing_type = 'wisata' AND listing_id = $1 LIMIT 1`,
      [order.wisata_id]
    );
    if (mitraRes.rows[0]) {
      await creditWalletForMitraOrder(mitraRes.rows[0].id, Number(order.total_amount) || 0, order_id, "wisata");
    }
    logger.info({ order_id }, "Wisata order confirmed via Midtrans");

    // Kirim tiket wisata ke email pembeli (dengan retry 3x)
    if (order.buyer_email) {
      sendWisataTicket({
        buyerName: order.buyer_name ?? "Pembeli",
        buyerEmail: order.buyer_email,
        orderCode: order_id,
        wisataName: order.wisata_name ?? "Wisata",
        ticketType: order.ticket_type ?? "Umum",
        qty: order.qty ?? 1,
        totalAmount: Number(order.total_amount) || 0,
        visitDate: order.visit_date ? new Date(order.visit_date).toLocaleDateString("id-ID", { weekday: "long", year: "numeric", month: "long", day: "numeric" }) : "-",
      })
        .then(() => {
          pool.query(
            `UPDATE wisata_orders SET email_sent_at = NOW() WHERE id = $1`,
            [order.id]
          ).catch((e: any) => logger.error({ err: e?.message, order_id }, "Gagal update email_sent_at wisata"));
        })
        .catch((err: any) => logger.error({ err: err?.message, order_id }, "Gagal kirim tiket wisata setelah retry"));
    }
  } else if (newStatus === "rejected") {
    await pool.query(
      `UPDATE wisata_orders SET status = 'rejected', notes = $2, updated_at = NOW() WHERE id = $1`,
      [order.id, `Midtrans: ${payment_type ?? "failed"}`]
    );
  }
}

/* ── Handler: penginapan_bookings ── */
async function handlePenginapanOrder(order_id: string, newStatus: string | null, payment_type: string | null) {
  const orderRes = await pool.query(
    `SELECT pb.id, pb.penginapan_id, pb.total_amount, pb.status,
            pb.guest_name, pb.guest_email, pb.room_type,
            pb.checkin_date, pb.checkout_date, pb.num_guests,
            p.name AS penginapan_name
     FROM penginapan_bookings pb
     LEFT JOIN penginapan p ON p.id = pb.penginapan_id
     WHERE pb.order_code = $1`,
    [order_id]
  );
  if (orderRes.rows.length === 0) { logger.warn({ order_id }, "Penginapan booking not found"); return; }
  const order = orderRes.rows[0];
  if (order.status === "confirmed" || order.status === "rejected") return;

  if (newStatus === "confirmed") {
    await pool.query(
      `UPDATE penginapan_bookings SET status = 'confirmed', updated_at = NOW() WHERE id = $1`,
      [order.id]
    );
    // Credit wallet mitra yang punya listing penginapan ini
    const mitraRes = await pool.query(
      `SELECT id FROM mitra WHERE listing_type = 'penginapan' AND listing_id = $1 LIMIT 1`,
      [order.penginapan_id]
    );
    if (mitraRes.rows[0]) {
      await creditWalletForMitraOrder(mitraRes.rows[0].id, Number(order.total_amount) || 0, order_id, "penginapan");
    }
    logger.info({ order_id }, "Penginapan booking confirmed via Midtrans");

    // Kirim konfirmasi penginapan ke email tamu (dengan retry 3x)
    if (order.guest_email) {
      const fmt = (d: any) => d ? new Date(d).toLocaleDateString("id-ID", { weekday: "long", year: "numeric", month: "long", day: "numeric" }) : "-";
      sendPenginapanConfirmation({
        guestName: order.guest_name ?? "Tamu",
        guestEmail: order.guest_email,
        orderCode: order_id,
        penginapanName: order.penginapan_name ?? "Penginapan",
        roomType: order.room_type ?? "-",
        checkinDate: fmt(order.checkin_date),
        checkoutDate: fmt(order.checkout_date),
        numGuests: order.num_guests ?? 1,
        totalAmount: Number(order.total_amount) || 0,
      })
        .then(() => {
          pool.query(
            `UPDATE penginapan_bookings SET email_sent_at = NOW() WHERE id = $1`,
            [order.id]
          ).catch((e: any) => logger.error({ err: e?.message, order_id }, "Gagal update email_sent_at penginapan"));
        })
        .catch((err: any) => logger.error({ err: err?.message, order_id }, "Gagal kirim konfirmasi penginapan setelah retry"));
    }
  } else if (newStatus === "rejected") {
    await pool.query(
      `UPDATE penginapan_bookings SET status = 'rejected', notes = $2, updated_at = NOW() WHERE id = $1`,
      [order.id, `Midtrans: ${payment_type ?? "failed"}`]
    );
  }
}

export default router;
