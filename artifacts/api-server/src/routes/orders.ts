import { Router } from "express";
import pool from "../lib/db";
import { snap } from "../lib/midtrans";
import { logger } from "../lib/logger";
import { sendWisataTicket, sendPenginapanConfirmation } from "../lib/mailer";

const router = Router();

function genCode(prefix: string): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let r = prefix;
  for (let i = 0; i < 7; i++) r += chars[Math.floor(Math.random() * chars.length)];
  return r;
}

async function uniqueCode(table: string, prefix: string): Promise<string> {
  for (let i = 0; i < 10; i++) {
    const code = genCode(prefix);
    const ex = await pool.query(`SELECT id FROM ${table} WHERE order_code=$1`, [code]);
    if (ex.rows.length === 0) return code;
  }
  return genCode(prefix) + Date.now();
}

/* ── POST /wisata-orders ── */
router.post("/wisata-orders", async (req, res) => {
  const { wisata_id, buyer_name, buyer_email, buyer_phone, ticket_type, qty, total_amount, visit_date, notes } = req.body;
  if (!wisata_id || !buyer_name || !buyer_phone) {
    return res.status(400).json({ error: "Data pemesanan tidak lengkap" });
  }

  const qtyNum = Math.max(1, Number(qty) || 1);
  const totalAmount = Math.max(0, Number(total_amount) || 0);
  const isFree = totalAmount <= 0;

  const order_code = await uniqueCode("wisata_orders", "NGW");
  const { rows } = await pool.query(
    `INSERT INTO wisata_orders (wisata_id, order_code, buyer_name, buyer_email, buyer_phone, ticket_type, qty, total_amount, visit_date, notes, status)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) RETURNING *`,
    [wisata_id, order_code, buyer_name, buyer_email || null, buyer_phone,
     ticket_type || "dewasa", qtyNum, totalAmount,
     visit_date || null, notes || null,
     isFree ? "confirmed" : "pending"]
  );

  if (isFree) {
    // Kirim tiket wisata gratis ke email pembeli (fire-and-forget dengan retry)
    if (buyer_email) {
      const wisataRes = await pool.query(`SELECT name FROM wisata WHERE id = $1`, [wisata_id]);
      const wisataName = wisataRes.rows[0]?.name ?? "Wisata";
      sendWisataTicket({
        buyerName: buyer_name,
        buyerEmail: buyer_email,
        orderCode: order_code,
        wisataName,
        ticketType: ticket_type || "dewasa",
        qty: qtyNum,
        totalAmount,
        visitDate: visit_date ? new Date(visit_date).toLocaleDateString("id-ID", { weekday: "long", year: "numeric", month: "long", day: "numeric" }) : "-",
      })
        .then(() => {
          pool.query(
            `UPDATE wisata_orders SET email_sent_at = NOW() WHERE id = $1`,
            [rows[0].id]
          ).catch((e: any) => logger.error({ err: e?.message, order_code }, "Gagal update email_sent_at wisata gratis"));
        })
        .catch((err: any) => logger.error({ err: err?.message, order_code }, "Gagal kirim tiket wisata gratis setelah retry"));
    }
    return res.status(201).json(rows[0]);
  }

  // Buat transaksi Midtrans Snap
  try {
    const snapResponse = await snap.createTransaction({
      transaction_details: { order_id: order_code, gross_amount: totalAmount },
      customer_details: {
        first_name: buyer_name,
        email: buyer_email || undefined,
        phone: buyer_phone,
      },
      item_details: [
        {
          id: String(wisata_id),
          price: totalAmount,
          quantity: 1,
          name: `Tiket Wisata (${ticket_type || "dewasa"} ×${qtyNum})`.slice(0, 50),
        },
      ],
    });
    logger.info({ order_code, wisata_id, buyer_name }, "Wisata order created, Midtrans started");
    res.status(201).json({ ...rows[0], snap_token: snapResponse.token });
  } catch (midtransErr: any) {
    logger.error({ err: midtransErr?.message, order_code }, "Midtrans createTransaction error (wisata)");
    await pool.query(`DELETE FROM wisata_orders WHERE id = $1`, [rows[0].id]);
    res.status(502).json({ error: "Gagal memulai pembayaran. Coba lagi." });
  }
});

/* ── POST /kuliner-orders (reservasi saja, tanpa pembayaran) ── */
router.post("/kuliner-orders", async (req, res) => {
  const {
    kuliner_id, customer_name, customer_email, customer_phone,
    reservation_date, reservation_time, num_guests, order_type, notes,
    voucher_code, estimated_amount,
  } = req.body;
  if (!kuliner_id || !customer_name || !customer_phone) {
    return res.status(400).json({ error: "Data reservasi tidak lengkap" });
  }

  // Validate voucher if provided
  let appliedVoucherCode: string | null = null;
  let discountAmount = 0;
  if (voucher_code) {
    const { rows: vRows } = await pool.query(
      `SELECT * FROM vouchers
       WHERE code = $1 AND active = true
         AND (expiry_date IS NULL OR expiry_date >= CURRENT_DATE)`,
      [String(voucher_code).trim().toUpperCase()]
    );
    if (vRows[0]) {
      const v = vRows[0];
      // Check applicable_type
      if (!v.applicable_type || v.applicable_type === "kuliner") {
        const purchaseAmount = Number(estimated_amount) || 0;
        if (!v.min_purchase || purchaseAmount >= v.min_purchase || purchaseAmount === 0) {
          appliedVoucherCode = v.code;
          if (purchaseAmount > 0) {
            discountAmount = v.discount_type === "persen"
              ? Math.round(purchaseAmount * v.discount_value / 100)
              : Math.min(Number(v.discount_value), purchaseAmount);
          } else {
            // Store discount_value for reference even without amount
            discountAmount = v.discount_type === "nominal" ? Number(v.discount_value) : 0;
          }
        }
      }
    }
  }

  const order_code = await uniqueCode("kuliner_orders", "NGK");
  const { rows } = await pool.query(
    `INSERT INTO kuliner_orders
       (kuliner_id, order_code, customer_name, customer_email, customer_phone,
        reservation_date, reservation_time, num_guests, order_type, notes,
        voucher_code, discount_amount)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12) RETURNING *`,
    [kuliner_id, order_code, customer_name, customer_email || null, customer_phone,
     reservation_date || null, reservation_time || null, num_guests || 1,
     order_type || "reservasi", notes || null,
     appliedVoucherCode, discountAmount]
  );
  res.status(201).json(rows[0]);
});

/* ── POST /penginapan-bookings ── */
router.post("/penginapan-bookings", async (req, res) => {
  const { penginapan_id, guest_name, guest_email, guest_phone, checkin_date, checkout_date, num_guests, room_type, total_amount, notes } = req.body;
  if (!penginapan_id || !guest_name || !guest_phone || !checkin_date || !checkout_date) {
    return res.status(400).json({ error: "Data booking tidak lengkap" });
  }

  const totalAmount = Math.max(0, Number(total_amount) || 0);
  const isFree = totalAmount <= 0;

  const order_code = await uniqueCode("penginapan_bookings", "NGP");
  const { rows } = await pool.query(
    `INSERT INTO penginapan_bookings (penginapan_id, order_code, guest_name, guest_email, guest_phone, checkin_date, checkout_date, num_guests, room_type, total_amount, notes, status)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12) RETURNING *`,
    [penginapan_id, order_code, guest_name, guest_email || null, guest_phone,
     checkin_date, checkout_date, num_guests || 1, room_type || null,
     totalAmount, notes || null,
     isFree ? "confirmed" : "pending"]  // free bookings confirmed immediately; paid ones wait for webhook
  );

  if (isFree) {
    // Kirim konfirmasi penginapan gratis ke email tamu (fire-and-forget dengan retry)
    if (guest_email) {
      const penginapanRes = await pool.query(`SELECT name FROM penginapan WHERE id = $1`, [penginapan_id]);
      const penginapanName = penginapanRes.rows[0]?.name ?? "Penginapan";
      const fmt = (d: any) => d ? new Date(d).toLocaleDateString("id-ID", { weekday: "long", year: "numeric", month: "long", day: "numeric" }) : "-";
      sendPenginapanConfirmation({
        guestName: guest_name,
        guestEmail: guest_email,
        orderCode: order_code,
        penginapanName,
        roomType: room_type ?? "-",
        checkinDate: fmt(checkin_date),
        checkoutDate: fmt(checkout_date),
        numGuests: Number(num_guests) || 1,
        totalAmount,
      })
        .then(() => {
          pool.query(
            `UPDATE penginapan_bookings SET email_sent_at = NOW() WHERE id = $1`,
            [rows[0].id]
          ).catch((e: any) => logger.error({ err: e?.message, order_code }, "Gagal update email_sent_at penginapan gratis"));
        })
        .catch((err: any) => logger.error({ err: err?.message, order_code }, "Gagal kirim konfirmasi penginapan gratis setelah retry"));
    }
    return res.status(201).json(rows[0]);
  }

  // Buat transaksi Midtrans Snap
  try {
    const nights = Math.max(1, Math.round(
      (new Date(checkout_date).getTime() - new Date(checkin_date).getTime()) / (1000 * 60 * 60 * 24)
    ));
    const snapResponse = await snap.createTransaction({
      transaction_details: { order_id: order_code, gross_amount: totalAmount },
      customer_details: {
        first_name: guest_name,
        email: guest_email || undefined,
        phone: guest_phone,
      },
      item_details: [
        {
          id: String(penginapan_id),
          price: totalAmount,
          quantity: 1,
          name: `Booking Penginapan ${nights} malam${room_type ? ` (${room_type})` : ""}`.slice(0, 50),
        },
      ],
    });
    logger.info({ order_code, penginapan_id, guest_name }, "Penginapan booking created, Midtrans started");
    res.status(201).json({ ...rows[0], snap_token: snapResponse.token });
  } catch (midtransErr: any) {
    logger.error({ err: midtransErr?.message, order_code }, "Midtrans createTransaction error (penginapan)");
    await pool.query(`DELETE FROM penginapan_bookings WHERE id = $1`, [rows[0].id]);
    res.status(502).json({ error: "Gagal memulai pembayaran. Coba lagi." });
  }
});

export default router;
