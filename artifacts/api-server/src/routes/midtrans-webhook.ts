import { Router } from "express";
import { createHash } from "crypto";
import pool from "../lib/db";
import { logger } from "../lib/logger";
import { sendEventTicket } from "../lib/mailer";
import { creditWalletForEventOrder } from "./wallet";
import { handleJajanYukPaymentNotification } from "./jajan-yuk";

const router = Router();

function verifySignature(
  orderId: string,
  statusCode: string,
  grossAmount: string,
  serverKey: string,
  signatureKey: string
): boolean {
  const hash = createHash("sha512")
    .update(`${orderId}${statusCode}${grossAmount}${serverKey}`)
    .digest("hex");
  return hash === signatureKey;
}

/* ── POST /midtrans/notification
   Webhook Midtrans — dipanggil server Midtrans saat status transaksi berubah.
   Konfigurasi URL ini di Midtrans Dashboard → Settings → Configuration:
     Production : https://<domain>/api/midtrans/notification
     Sandbox    : https://<domain>/api/midtrans/notification
── */
router.post("/midtrans/notification", async (req: any, res: any) => {
  const body = req.body;

  const {
    order_id,
    status_code,
    gross_amount,
    signature_key,
    transaction_status,
    fraud_status,
    payment_type,
  } = body;

  // Selalu balas 200 dulu agar Midtrans tidak retry terus
  res.status(200).json({ ok: true });

  // Verifikasi signature
  const serverKey = process.env.MIDTRANS_SERVER_KEY ?? "";
  if (!verifySignature(order_id, status_code, gross_amount, serverKey, signature_key)) {
    logger.warn({ order_id }, "Midtrans webhook: signature tidak valid — diabaikan");
    return;
  }

  if (String(order_id ?? "").startsWith("JY")) {
    try {
      await handleJajanYukPaymentNotification(body);
    } catch {
      // Midtrans will retry with the normal HTTP response path if this webhook fails.
    }
    return;
  }

  // Hanya proses kalau pembayaran benar-benar settle
  const isSettled =
    (transaction_status === "settlement") ||
    (transaction_status === "capture" && fraud_status !== "deny");

  if (!isSettled) {
    logger.info({ order_id, transaction_status, fraud_status }, "Midtrans webhook: status bukan settlement — diabaikan");
    return;
  }

  logger.info({ order_id, payment_type, transaction_status }, "Midtrans webhook: pembayaran diterima");

  // order_id di Midtrans = order_code di event_orders
  const orderCode = String(order_id).toUpperCase();

  try {
    const { rows } = await pool.query(
      `SELECT eo.id, eo.order_code, eo.buyer_name, eo.buyer_email,
              eo.ticket_name, eo.qty, eo.total_amount, eo.attendee_names,
              eo.status, eo.event_id,
              COALESCE(e.name, e.title) AS event_name
       FROM event_orders eo
       LEFT JOIN events e ON e.id = eo.event_id
       WHERE eo.order_code = $1`,
      [orderCode]
    );

    if (!rows[0]) {
      logger.warn({ order_id }, "Midtrans webhook: order tidak ditemukan");
      return;
    }

    const order = rows[0];

    // Atomic confirm: hanya update jika status masih 'pending'.
    // Jika payment-success frontend sudah lebih dulu konfirmasi, UPDATE ini return 0 rows
    // dan kita skip wallet-credit + email agar tidak ada duplikat.
    const confirmRes = await pool.query(
      `UPDATE event_orders SET status = 'confirmed', confirmed_at = NOW()
       WHERE id = $1 AND status = 'pending'
       RETURNING id`,
      [order.id]
    );
    if (confirmRes.rows.length === 0) {
      logger.info({ order_id }, "Midtrans webhook: order sudah confirmed — skip");
      return;
    }
    await creditWalletForEventOrder(order.event_id, Number(order.total_amount) || 0, order.order_code);

    // Kirim email hanya jika belum pernah terkirim (email_sent_at IS NULL)
    if (order.buyer_email) {
      const emailCheck = await pool.query(
        `SELECT email_sent_at FROM event_orders WHERE id = $1`,
        [order.id]
      );
      if (emailCheck.rows[0]?.email_sent_at) {
        logger.info({ orderCode }, "Midtrans webhook: email sudah terkirim sebelumnya — skip");
        return;
      }
      try {
        await sendEventTicket({
          buyerName:     order.buyer_name    ?? "Pembeli",
          buyerEmail:    order.buyer_email,
          orderCode:     order.order_code,
          eventName:     order.event_name   ?? "Event",
          ticketName:    order.ticket_name  ?? "Tiket",
          qty:           order.qty          ?? 1,
          totalAmount:   Number(order.total_amount) || 0,
          attendeeNames: Array.isArray(order.attendee_names) ? order.attendee_names : [],
        });
        await pool.query(`UPDATE event_orders SET email_sent_at = NOW() WHERE id = $1`, [order.id]);
        logger.info({ orderCode }, "Midtrans webhook: tiket email terkirim");
      } catch (emailErr: any) {
        logger.error({ err: emailErr?.message, orderCode }, "Midtrans webhook: gagal kirim email tiket");
      }
    }
  } catch (err: any) {
    logger.error({ err: err?.message, order_id }, "Midtrans webhook: error saat proses");
  }
});

export default router;
