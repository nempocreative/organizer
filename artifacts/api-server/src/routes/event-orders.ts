import { Router } from "express";
import multer from "multer";
import { randomUUID } from "crypto";
import { requireAuth } from "../middlewares/auth";
import pool from "../lib/db";
import { logger } from "../lib/logger";
import { IMAGE_UPLOAD_POLICY, processImageToWebp } from "../lib/media";
import { snap, coreApi } from "../lib/midtrans";
import { creditWalletForEventOrder } from "./wallet";
import { sendEventTicket } from "../lib/mailer";

function generateOrderCode(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let r = "NGT";
  for (let i = 0; i < 7; i++) r += chars[Math.floor(Math.random() * chars.length)];
  return r;
}

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: IMAGE_UPLOAD_POLICY.maxInputBytes },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith("image/")) cb(null, true);
    else cb(new Error("Hanya file gambar"));
  },
});

const router = Router();

/* ── Kuota tiket: reservasi/pelepasan atomik untuk mencegah race condition
   saat dua pembeli checkout tiket terakhir hampir bersamaan. `sold` di sini
   berarti "terjual + sedang dalam proses pembayaran (pending)". ── */
async function reserveTicketQuota(ticketId: number, qty: number): Promise<{ ok: boolean; name?: string }> {
  const r = await pool.query(
    `UPDATE event_tickets SET sold = sold + $1
     WHERE id = $2 AND sold + $1 <= quota
     RETURNING name`,
    [qty, ticketId]
  );
  if (r.rows.length === 0) return { ok: false };
  return { ok: true, name: r.rows[0].name };
}

async function releaseTicketQuota(ticketId: number | null, qty: number): Promise<void> {
  if (!ticketId) return;
  await pool.query(
    `UPDATE event_tickets SET sold = GREATEST(0, sold - $1) WHERE id = $2`,
    [qty, ticketId]
  );
}

/* ── Ambil event yang sedang ditandai aktif untuk tim crew/tiketing di lokasi ── */
async function getCrewEventId(): Promise<number | null> {
  const r = await pool.query(`SELECT id FROM events WHERE crew_active = true LIMIT 1`);
  return r.rows[0]?.id ?? null;
}

/* ── POST /event-orders — buat pesanan baru + mulai pembayaran Midtrans (publik, no auth needed) ── */
router.post("/event-orders", upload.single("proof"), async (req: any, res: any) => {
  try {
    const { event_id, ticket_id, ticket_name, qty, buyer_name, buyer_email, buyer_phone, attendee_names, total_amount } = req.body;

    if (!buyer_name || !buyer_email || !buyer_phone || !event_id || !ticket_id) {
      return res.status(400).json({ error: "Data pesanan tidak lengkap" });
    }

    const qtyNum = Math.max(1, Number(qty) || 1);
    const totalAmount = Math.max(0, Number(total_amount) || 0);

    // Reservasi kuota tiket secara atomik sebelum membuat pesanan & transaksi pembayaran.
    // Ini mencegah dua pembeli lolos sekaligus untuk tiket terakhir (race condition).
    const reservation = await reserveTicketQuota(ticket_id, qtyNum);
    if (!reservation.ok) {
      return res.status(409).json({ error: "Kuota tiket tidak mencukupi" });
    }

    // Dari titik ini, kuota sudah direservasi — pastikan dilepas lagi jika terjadi error
    // sebelum pesanan berhasil dibuat, supaya kuota tidak "hilang" karena gagal di tengah jalan.
    try {

    // Bukti transfer manual (opsional, fallback lama) — biasanya tidak dipakai lagi karena pembayaran via Midtrans
    let proofUrl: string | null = null;
    if (req.file?.buffer?.length > 0) {
      const filename = `proof-${Date.now()}-${randomUUID()}.webp`;
      const webpBuffer = await processImageToWebp(req.file.buffer, {
        maxDimension: 1200,
        maxOutputBytes: 700 * 1024,
      });
      await pool.query(
        `INSERT INTO file_uploads (id, data, mime_type, size) VALUES ($1, $2, $3, $4)`,
        [filename, webpBuffer, "image/webp", webpBuffer.length]
      );
      proofUrl = `/api/uploads/${filename}`;
    }

    let orderCode = generateOrderCode();
    for (let i = 0; i < 10; i++) {
      const ex = await pool.query(`SELECT id FROM event_orders WHERE order_code = $1`, [orderCode]);
      if (ex.rows.length === 0) break;
      orderCode = generateOrderCode();
    }

    let parsedAttendees: string[] = [];
    try { parsedAttendees = JSON.parse(attendee_names || "[]"); } catch { parsedAttendees = []; }

    // Tiket gratis (total 0) — langsung konfirmasi tanpa pembayaran
    const isFree = totalAmount <= 0;

    const result = await pool.query(`
      INSERT INTO event_orders
        (order_code, event_id, ticket_id, ticket_name, qty, buyer_name, buyer_email, buyer_phone, attendee_names, total_amount, payment_proof_url, status, confirmed_at)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)
      RETURNING id, order_code
    `, [
      orderCode, event_id, ticket_id, ticket_name ?? "", qtyNum, buyer_name, buyer_email, buyer_phone,
      JSON.stringify(parsedAttendees), totalAmount, proofUrl,
      isFree ? "confirmed" : "pending",
      isFree ? new Date() : null,
    ]);

    // Isi event_order_items — satu baris per peserta tiket
    const pricePerItem = Math.round(totalAmount / qtyNum);
    const itemNames = parsedAttendees.length > 0 ? parsedAttendees : Array(qtyNum).fill(null);
    for (const attendeeName of itemNames) {
      await pool.query(
        `INSERT INTO event_order_items (order_id, ticket_id, ticket_name, attendee_name, price) VALUES ($1,$2,$3,$4,$5)`,
        [result.rows[0].id, ticket_id, ticket_name ?? "", attendeeName || null, pricePerItem]
      );
    }

    if (isFree) {
      // Kuota sudah direservasi di atas (reserveTicketQuota), tidak perlu increment lagi
      logger.info({ orderCode, event_id, buyer_name }, "Free event order confirmed");
      return res.json({ id: result.rows[0].id, order_code: result.rows[0].order_code, free: true });
    }

    // Buat transaksi Snap Midtrans
    try {
      const snapResponse = await snap.createTransaction({
        transaction_details: {
          order_id: orderCode,
          gross_amount: totalAmount,
        },
        customer_details: {
          first_name: buyer_name,
          email: buyer_email,
          phone: buyer_phone,
        },
        item_details: [
          {
            id: String(ticket_id),
            price: totalAmount,
            quantity: 1,
            name: `${ticket_name ?? "Tiket"}`.slice(0, 50),
          },
        ],
      });

      logger.info({ orderCode, event_id, buyer_name }, "Event order created, Midtrans transaction started");
      res.json({
        id: result.rows[0].id,
        order_code: result.rows[0].order_code,
        snap_token: snapResponse.token,
        redirect_url: snapResponse.redirect_url,
      });
    } catch (midtransErr: any) {
      logger.error({ err: midtransErr?.message, orderCode }, "Midtrans createTransaction error");
      // Pesanan tetap tersimpan sebagai pending; hapus agar user bisa coba lagi tanpa kode nyangkut
      await pool.query(`DELETE FROM event_orders WHERE id = $1`, [result.rows[0].id]);
      await releaseTicketQuota(ticket_id, qtyNum);
      res.status(502).json({ error: "Gagal memulai pembayaran. Coba lagi." });
    }
    } catch (innerErr: any) {
      // Gagal di tengah proses setelah kuota direservasi — lepas lagi supaya tidak hangus
      await releaseTicketQuota(ticket_id, qtyNum);
      throw innerErr;
    }
  } catch (err: any) {
    logger.error({ err: err?.message }, "Create event order error");
    res.status(500).json({ error: "Gagal membuat pesanan. Coba lagi." });
  }
});

/* ── GET /event-orders — admin: daftar pesanan, opsional ?source=online|ots|offline ── */
router.get("/event-orders", requireAuth, async (req: any, res: any) => {
  try {
    const source = req.query.source as string | undefined;
    let whereClause = "";
    if (source === "ots")     whereClause = "WHERE eo.notes = 'ots-tiketing'";
    else if (source === "offline") whereClause = "WHERE eo.notes = 'offline-crew'";
    else if (source === "online")  whereClause = "WHERE (eo.notes IS NULL OR (eo.notes != 'ots-tiketing' AND eo.notes != 'offline-crew'))";

    const result = await pool.query(`
      SELECT eo.*, e.name AS event_name, e.date AS event_date, e.location AS event_location, e.image AS event_image
      FROM event_orders eo
      LEFT JOIN events e ON eo.event_id = e.id
      ${whereClause}
      ORDER BY eo.created_at DESC
    `);
    res.json(result.rows);
  } catch (err: any) {
    res.status(500).json({ error: "Gagal mengambil data" });
  }
});

/* ── GET /event-orders/counts — admin: jumlah per sumber ── */
router.get("/event-orders/counts", requireAuth, async (_req: any, res: any) => {
  try {
    const r = await pool.query(`
      SELECT
        COUNT(*) FILTER (WHERE notes = 'ots-tiketing') AS ots,
        COUNT(*) FILTER (WHERE notes = 'offline-crew') AS offline,
        COUNT(*) FILTER (WHERE notes IS NULL OR (notes != 'ots-tiketing' AND notes != 'offline-crew')) AS online,
        COUNT(*) AS total
      FROM event_orders
    `);
    const row = r.rows[0];
    res.json({
      ots:     Number(row.ots),
      offline: Number(row.offline),
      online:  Number(row.online),
      total:   Number(row.total),
    });
  } catch {
    res.status(500).json({ error: "Gagal mengambil statistik" });
  }
});

/* ── GET /event-orders/status/:code — publik: cek status pesanan ── */
router.get("/event-orders/status/:code", async (req: any, res: any) => {
  try {
    const result = await pool.query(`
      SELECT eo.order_code, eo.buyer_name, eo.ticket_name, eo.qty, eo.total_amount, eo.status, eo.created_at, eo.confirmed_at,
             e.name AS event_name, e.slug AS event_slug
      FROM event_orders eo
      LEFT JOIN events e ON eo.event_id = e.id
      WHERE eo.order_code = $1
    `, [req.params.code]);
    if (result.rows.length === 0) return res.status(404).json({ error: "Pesanan tidak ditemukan" });
    res.json(result.rows[0]);
  } catch {
    res.status(500).json({ error: "Gagal mengambil data" });
  }
});

/* ── GET /event-orders/by-email?email=xxx — publik: cek pesanan by email ── */
router.get("/event-orders/by-email", async (req: any, res: any) => {
  try {
    const email = (req.query.email ?? "").toString().trim().toLowerCase();
    if (!email || !email.includes("@")) return res.status(400).json({ error: "Email tidak valid" });
    const result = await pool.query(`
      SELECT eo.order_code, eo.buyer_name, eo.ticket_name, eo.qty, eo.total_amount, eo.status, eo.created_at, eo.confirmed_at,
             e.name AS event_name, e.slug AS event_slug
      FROM event_orders eo
      LEFT JOIN events e ON eo.event_id = e.id
      WHERE LOWER(eo.buyer_email) = $1
      ORDER BY eo.created_at DESC
      LIMIT 20
    `, [email]);
    res.json(result.rows);
  } catch {
    res.status(500).json({ error: "Gagal mengambil data" });
  }
});

/* ── POST /event-orders/:code/cancel — publik: user batalkan pesanan pending ── */
router.post("/event-orders/:code/cancel", async (req: any, res: any) => {
  const { code } = req.params;
  try {
    const result = await pool.query(
      `UPDATE event_orders SET status = 'rejected'
       WHERE order_code = $1 AND status = 'pending'
       RETURNING id, ticket_id, qty`,
      [code]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Pesanan tidak ditemukan atau sudah tidak bisa dibatalkan" });
    }
    const { ticket_id, qty } = result.rows[0];
    await releaseTicketQuota(ticket_id, qty);
    res.json({ ok: true });
  } catch (err: any) {
    logger.error({ err: err?.message, code }, "Gagal membatalkan pesanan");
    res.status(500).json({ error: "Gagal membatalkan pesanan" });
  }
});

/* ── POST /event-orders/:code/payment-success
   Dipanggil frontend setelah Midtrans onSuccess/onPending.
   Mengkonfirmasi pesanan + kirim email tiket secara otomatis tanpa admin.
── */
router.post("/event-orders/:code/payment-success", async (req: any, res: any) => {
  const { code } = req.params;
  try {
    const { rows } = await pool.query(
      `SELECT eo.id, eo.order_code, eo.buyer_name, eo.buyer_email,
              eo.ticket_name, eo.qty, eo.total_amount, eo.attendee_names,
              eo.status, eo.event_id,
              COALESCE(e.name, e.title) AS event_name
       FROM event_orders eo
       LEFT JOIN events e ON e.id = eo.event_id
       WHERE eo.order_code = $1`,
      [code.toUpperCase()]
    );

    if (!rows[0]) return res.status(404).json({ error: "Pesanan tidak ditemukan" });
    const o = rows[0];

    // Jika pesanan sudah confirmed sebelumnya (mis. webhook lebih cepat), langsung return
    if (o.status === "confirmed") {
      return res.json({ ok: true, emailSent: false, reason: "already_confirmed" });
    }

    // ── Verifikasi ke Midtrans API ──────────────────────────────────────────────────
    // Sebelum mengonfirmasi, tanya langsung ke Midtrans apakah transaksi ini
    // benar-benar sudah settlement/capture. Ini mencegah seseorang yang hanya
    // tahu order_code bisa memaksa pesanan terkonfirmasi tanpa bayar.
    try {
      const txStatus = await coreApi.transaction.status(o.order_code);
      const settled =
        txStatus.transaction_status === "settlement" ||
        (txStatus.transaction_status === "capture" && txStatus.fraud_status !== "deny");

      if (!settled) {
        logger.warn(
          { orderCode: o.order_code, transaction_status: txStatus.transaction_status },
          "payment-success ditolak: status Midtrans bukan settlement"
        );
        return res.status(402).json({ error: "Pembayaran belum terkonfirmasi oleh Midtrans" });
      }
    } catch (verifyErr: any) {
      // Jika Midtrans tidak mengenal transaksi ini (404) → tolak
      // Jika ada error jaringan sementara → tolak juga dan biarkan webhook yang proses
      logger.warn(
        { orderCode: o.order_code, err: verifyErr?.message },
        "payment-success: gagal verifikasi ke Midtrans — ditolak"
      );
      return res.status(402).json({ error: "Tidak dapat memverifikasi pembayaran. Tiket akan dikirim otomatis setelah pembayaran dikonfirmasi." });
    }
    // ───────────────────────────────────────────────────────────────────────────────

    // Atomic confirm: hanya jika masih pending. Jika webhook Midtrans sudah lebih dulu
    // mengonfirmasi, UPDATE ini tidak mengubah apa-apa (0 rows) dan kita skip agar
    // tidak ada double wallet-credit maupun double email.
    const confirmRes = await pool.query(
      `UPDATE event_orders SET status = 'confirmed', confirmed_at = NOW()
       WHERE id = $1 AND status = 'pending'
       RETURNING id`,
      [o.id]
    );
    const justConfirmed = confirmRes.rows.length > 0;
    if (justConfirmed) {
      await creditWalletForEventOrder(o.event_id, Number(o.total_amount) || 0, o.order_code);
    }

    // Kirim email tiket hanya jika:
    //   a) email tersedia, dan
    //   b) belum pernah terkirim sebelumnya (email_sent_at IS NULL)
    // Ini mencegah double email jika webhook Midtrans tiba hampir bersamaan.
    if (!o.buyer_email) {
      return res.json({ ok: true, emailSent: false, reason: "no_email" });
    }

    const emailCheck = await pool.query(
      `SELECT email_sent_at FROM event_orders WHERE id = $1`,
      [o.id]
    );
    if (emailCheck.rows[0]?.email_sent_at) {
      logger.info({ orderCode: o.order_code }, "Email tiket sudah terkirim sebelumnya — skip double send");
      return res.json({ ok: true, emailSent: false, reason: "already_sent" });
    }

    try {
      await sendEventTicket({
        buyerName:    o.buyer_name    ?? "Pembeli",
        buyerEmail:   o.buyer_email,
        orderCode:    o.order_code,
        eventName:    o.event_name   ?? "Event",
        ticketName:   o.ticket_name  ?? "Tiket",
        qty:          o.qty          ?? 1,
        totalAmount:  Number(o.total_amount) || 0,
        attendeeNames: Array.isArray(o.attendee_names) ? o.attendee_names : [],
      });
      await pool.query(`UPDATE event_orders SET email_sent_at = NOW() WHERE id = $1`, [o.id]);
      logger.info({ orderCode: o.order_code }, "Tiket email terkirim otomatis setelah pembayaran");
      res.json({ ok: true, emailSent: true });
    } catch (emailErr: any) {
      logger.error({ err: emailErr?.message, orderCode: o.order_code }, "Gagal kirim email tiket otomatis");
      // Order tetap confirmed, email masuk antrian email-failures untuk admin resend
      res.json({ ok: true, emailSent: false, reason: "send_failed" });
    }
  } catch (err: any) {
    logger.error({ err: err?.message, code }, "Gagal payment-success callback");
    res.status(500).json({ error: "Gagal memproses pembayaran" });
  }
});

/* ── PUT /event-orders/:id/confirm — admin: konfirmasi pesanan + kirim email tiket ── */
router.put("/event-orders/:id/confirm", requireAuth, async (req: any, res: any) => {
  try {
    const orderRes = await pool.query(
      `SELECT eo.id, eo.ticket_id, eo.event_id, eo.qty, eo.total_amount, eo.order_code,
              eo.buyer_name, eo.buyer_email, eo.ticket_name, eo.attendee_names, eo.status,
              COALESCE(e.name, e.title) AS event_name
       FROM event_orders eo
       LEFT JOIN events e ON e.id = eo.event_id
       WHERE eo.id = $1`,
      [req.params.id]
    );
    if (orderRes.rows.length === 0) return res.status(404).json({ error: "Pesanan tidak ditemukan" });
    const order = orderRes.rows[0];
    if (order.status === "confirmed") return res.status(400).json({ error: "Pesanan sudah dikonfirmasi" });

    // Kuota tiket sudah direservasi saat pesanan dibuat (lihat POST /event-orders), jadi tidak
    // di-increment lagi di sini — hanya mengubah status pesanan.
    await pool.query(`UPDATE event_orders SET status = 'confirmed', confirmed_at = NOW() WHERE id = $1`, [req.params.id]);
    await creditWalletForEventOrder(order.event_id, Number(order.total_amount) || 0, order.order_code);

    // Kirim email tiket otomatis setelah konfirmasi (QRIS manual, transfer, dsb)
    if (order.buyer_email) {
      sendEventTicket({
        buyerName:     order.buyer_name    ?? "Pembeli",
        buyerEmail:    order.buyer_email,
        orderCode:     order.order_code,
        eventName:     order.event_name   ?? "Event",
        ticketName:    order.ticket_name  ?? "Tiket",
        qty:           order.qty          ?? 1,
        totalAmount:   Number(order.total_amount) || 0,
        attendeeNames: Array.isArray(order.attendee_names) ? order.attendee_names : [],
      }).then(() =>
        pool.query(`UPDATE event_orders SET email_sent_at = NOW() WHERE id = $1`, [req.params.id])
      ).catch((e: any) =>
        logger.error({ err: e?.message, orderCode: order.order_code }, "Gagal kirim email tiket saat konfirmasi admin")
      );
    }

    res.json({ ok: true });
  } catch {
    res.status(500).json({ error: "Gagal konfirmasi" });
  }
});

/* ── POST /event-orders/:id/mark-pdf-sent — admin: tandai PDF tiket sudah dikirim manual ── */
router.post("/event-orders/:id/mark-pdf-sent", requireAuth, async (req: any, res: any) => {
  try {
    const r = await pool.query(
      `UPDATE event_orders SET pdf_sent_at = NOW() WHERE id = $1 AND status = 'confirmed' RETURNING id`,
      [req.params.id]
    );
    if (r.rows.length === 0) return res.status(404).json({ error: "Pesanan tidak ditemukan atau belum dikonfirmasi" });
    res.json({ ok: true });
  } catch {
    res.status(500).json({ error: "Gagal menandai PDF terkirim" });
  }
});

/* ── PUT /event-orders/:id/reject — admin: tolak pesanan ── */
router.put("/event-orders/:id/reject", requireAuth, async (req: any, res: any) => {
  try {
    const { notes } = req.body;
    const orderRes = await pool.query(
      `SELECT ticket_id, qty, status FROM event_orders WHERE id = $1`,
      [req.params.id]
    );
    if (orderRes.rows.length === 0) return res.status(404).json({ error: "Pesanan tidak ditemukan" });
    const order = orderRes.rows[0];

    await pool.query(
      `UPDATE event_orders SET status = 'rejected', notes = $1 WHERE id = $2`,
      [notes || null, req.params.id]
    );
    // Lepas kuota yang sudah direservasi saat pesanan dibuat, kecuali pesanan itu
    // sebelumnya sudah "confirmed" (yang berarti kuota memang benar-benar terjual).
    if (order.status !== "confirmed" && order.status !== "rejected") {
      await releaseTicketQuota(order.ticket_id, order.qty);
    }
    res.json({ ok: true });
  } catch {
    res.status(500).json({ error: "Gagal menolak pesanan" });
  }
});

/* ── POST /event-orders/checkin/:code — admin: scan masuk ── */
router.post("/event-orders/checkin/:code", requireAuth, async (req: any, res: any) => {
  try {
    const result = await pool.query(`
      SELECT eo.*, e.name AS event_name, e.date AS event_date, e.location AS event_location
      FROM event_orders eo
      LEFT JOIN events e ON eo.event_id = e.id
      WHERE eo.order_code = $1
    `, [req.params.code]);

    if (result.rows.length === 0) return res.status(404).json({ error: "Kode tiket tidak ditemukan" });

    const order = result.rows[0];

    if (order.status !== "confirmed") {
      return res.status(400).json({ error: "Tiket belum dikonfirmasi / tidak valid", order });
    }

    if (order.checked_in) {
      return res.status(409).json({ error: "Tiket sudah digunakan untuk masuk", order });
    }

    await pool.query(
      `UPDATE event_orders SET checked_in = TRUE, checked_in_at = NOW() WHERE id = $1`,
      [order.id]
    );

    const updated = { ...order, checked_in: true, checked_in_at: new Date().toISOString() };
    res.json({ ok: true, order: updated });
  } catch (err: any) {
    logger.error({ err: err?.message }, "Checkin error");
    res.status(500).json({ error: "Gagal proses scan masuk" });
  }
});

/* ── POST /event-orders/crew-scan/:code — crew: scan tanpa admin JWT ── */
const CREW_SCAN_KEY = process.env.CREW_SCAN_KEY || "nempo-crew-2024";
router.post("/event-orders/crew-scan/:code", async (req: any, res: any) => {
  if (req.headers["x-crew-key"] !== CREW_SCAN_KEY) {
    return res.status(401).json({ error: "Akses ditolak" });
  }
  try {
    const result = await pool.query(`
      SELECT eo.*, e.name AS event_name, e.date AS event_date, e.location AS event_location
      FROM event_orders eo
      LEFT JOIN events e ON eo.event_id = e.id
      WHERE eo.order_code = $1
    `, [req.params.code.toUpperCase()]);

    if (result.rows.length === 0) return res.status(404).json({ error: "Kode tiket tidak ditemukan" });

    const order = result.rows[0];
    if (order.status !== "confirmed") {
      return res.status(400).json({ error: "Tiket belum dikonfirmasi / tidak valid", order });
    }
    if (order.checked_in) {
      return res.status(409).json({ error: "Tiket sudah digunakan", order });
    }

    await pool.query(
      `UPDATE event_orders SET checked_in = TRUE, checked_in_at = NOW() WHERE id = $1`,
      [order.id]
    );

    res.json({ ok: true, order: { ...order, checked_in: true, checked_in_at: new Date().toISOString() } });
  } catch (err: any) {
    logger.error({ err: err?.message }, "Crew scan error");
    res.status(500).json({ error: "Gagal proses scan" });
  }
});

/* ── GET /event-orders/crew-checkins — crew: daftar tamu yang sudah masuk ── */
router.get("/event-orders/crew-checkins", async (req: any, res: any) => {
  if (req.headers["x-crew-key"] !== CREW_SCAN_KEY) {
    return res.status(401).json({ error: "Akses ditolak" });
  }
  try {
    const result = await pool.query(`
      SELECT eo.id, eo.order_code, eo.buyer_name, eo.buyer_phone,
             eo.qty, eo.checked_in_at,
             et.name AS ticket_name
      FROM event_orders eo
      LEFT JOIN event_tickets et ON eo.ticket_id = et.id
      WHERE eo.checked_in = TRUE
      ORDER BY eo.checked_in_at DESC
    `);
    res.json({ ok: true, checkins: result.rows, total: result.rows.length });
  } catch (err: any) {
    logger.error({ err: err?.message }, "Crew checkins error");
    res.status(500).json({ error: "Gagal mengambil data" });
  }
});

/* ── POST /event-orders/ots-order — tim tiketing: simpan tiket OTS + barcode ── */
router.post("/event-orders/ots-order", async (req: any, res: any) => {
  if (req.headers["x-crew-key"] !== CREW_SCAN_KEY) {
    return res.status(401).json({ error: "Akses ditolak" });
  }
  try {
    const { order_code, buyer_name, buyer_phone, ticket_name, ticket_price, qty } = req.body;
    if (!order_code || !buyer_name || !buyer_phone || !ticket_name) {
      return res.status(400).json({ error: "Data tidak lengkap" });
    }
    const price   = parseInt(ticket_price) || 0;
    const qtyNum  = Math.max(1, parseInt(qty) || 1);
    const total   = price * qtyNum;
    const exists  = await pool.query(`SELECT id FROM event_orders WHERE order_code = $1`, [order_code]);
    if (exists.rows.length > 0) return res.status(409).json({ error: "Kode sudah digunakan" });

    const crewEventId = await getCrewEventId();
    if (!crewEventId) return res.status(409).json({ error: "Tidak ada event yang ditandai aktif untuk crew/tiketing. Aktifkan salah satu event di admin panel." });

    const result = await pool.query(`
      INSERT INTO event_orders
        (order_code, event_id, ticket_name, qty, buyer_name, buyer_email, buyer_phone,
         attendee_names, total_amount, status, confirmed_at, notes)
      VALUES ($1, $2, $3, $4, $5, '', $6, '[]', $7, 'confirmed', NOW(), 'ots-tiketing')
      RETURNING id, order_code, buyer_name, ticket_name, qty, total_amount, confirmed_at
    `, [order_code.trim(), crewEventId, ticket_name, qtyNum, buyer_name.trim(), buyer_phone.trim(), total]);

    // Isi event_order_items
    for (let i = 0; i < qtyNum; i++) {
      await pool.query(
        `INSERT INTO event_order_items (order_id, ticket_id, ticket_name, attendee_name, price) VALUES ($1,$2,$3,$4,$5)`,
        [result.rows[0].id, null, ticket_name, null, price]
      );
    }

    logger.info({ order_code, buyer: buyer_name, ticket: ticket_name }, "OTS ticket saved");
    res.json({ ok: true, order: result.rows[0] });
  } catch (err: any) {
    logger.error({ err: err?.message }, "OTS order error");
    res.status(500).json({ error: "Gagal menyimpan tiket" });
  }
});

/* ── GET /event-orders/crew-ticket-types — crew: jenis tiket tersedia ── */
router.get("/event-orders/crew-ticket-types", async (req: any, res: any) => {
  if (req.headers["x-crew-key"] !== CREW_SCAN_KEY) {
    return res.status(401).json({ error: "Akses ditolak" });
  }
  try {
    const crewEventId = await getCrewEventId();
    if (!crewEventId) return res.json({ ok: true, tickets: [] });
    const result = await pool.query(`
      SELECT id, name, price, quota, sold
      FROM event_tickets
      WHERE event_id = $1
      ORDER BY price ASC
    `, [crewEventId]);
    res.json({ ok: true, tickets: result.rows });
  } catch (err: any) {
    logger.error({ err: err?.message }, "Crew ticket types error");
    res.status(500).json({ error: "Gagal mengambil jenis tiket" });
  }
});

/* ── POST /event-orders/crew-order — crew: input beli tiket offline ── */
router.post("/event-orders/crew-order", async (req: any, res: any) => {
  if (req.headers["x-crew-key"] !== CREW_SCAN_KEY) {
    return res.status(401).json({ error: "Akses ditolak" });
  }
  try {
    const { ticket_id, qty, buyer_name, buyer_phone, buyer_email, attendee_names, custom_price } = req.body;
    if (!ticket_id || !buyer_name || !buyer_phone) {
      return res.status(400).json({ error: "Nama pemesan dan no WA wajib diisi" });
    }

    const ticketRes = await pool.query(`SELECT * FROM event_tickets WHERE id = $1`, [ticket_id]);
    if (ticketRes.rows.length === 0) return res.status(404).json({ error: "Jenis tiket tidak ditemukan" });
    const ticket = ticketRes.rows[0];

    const qtyNum = Math.max(1, parseInt(qty) || 1);
    const unitPrice = (custom_price != null && parseInt(custom_price) > 0) ? parseInt(custom_price) : ticket.price;
    const totalAmount = unitPrice * qtyNum;

    let orderCode = "";
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    for (let attempt = 0; attempt < 10; attempt++) {
      let code = "OFF";
      for (let i = 0; i < 7; i++) code += chars[Math.floor(Math.random() * chars.length)];
      const exists = await pool.query(`SELECT id FROM event_orders WHERE order_code = $1`, [code]);
      if (exists.rows.length === 0) { orderCode = code; break; }
    }
    if (!orderCode) return res.status(500).json({ error: "Gagal generate kode unik" });

    const result = await pool.query(`
      INSERT INTO event_orders
        (order_code, event_id, ticket_id, ticket_name, qty, buyer_name, buyer_email, buyer_phone, attendee_names, total_amount, status, confirmed_at, notes)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, 'confirmed', NOW(), 'offline-crew')
      RETURNING *
    `, [
      orderCode,
      ticket.event_id,
      ticket_id,
      ticket.name,
      qtyNum,
      buyer_name.trim(),
      (buyer_email || "").trim(),
      buyer_phone.trim(),
      JSON.stringify(Array.isArray(attendee_names) ? attendee_names.filter(Boolean) : []),
      totalAmount,
    ]);

    await pool.query(`UPDATE event_tickets SET sold = sold + $1 WHERE id = $2`, [qtyNum, ticket_id]);

    // Isi event_order_items
    const parsedCrewAttendees: string[] = Array.isArray(attendee_names) ? attendee_names.filter(Boolean) : [];
    const crewItemNames = parsedCrewAttendees.length > 0 ? parsedCrewAttendees : Array(qtyNum).fill(null);
    for (const attendeeName of crewItemNames) {
      await pool.query(
        `INSERT INTO event_order_items (order_id, ticket_id, ticket_name, attendee_name, price) VALUES ($1,$2,$3,$4,$5)`,
        [result.rows[0].id, ticket_id, ticket.name, attendeeName || null, unitPrice]
      );
    }

    logger.info({ order_code: orderCode, buyer: buyer_name, qty: qtyNum }, "Offline crew order created");
    res.json({ ok: true, order: result.rows[0], order_code: orderCode });
  } catch (err: any) {
    logger.error({ err: err?.message }, "Crew order error");
    res.status(500).json({ error: "Gagal menyimpan pesanan" });
  }
});

/* ── GET /event-orders/crew-tickets — crew: semua tiket (kecuali rejected) ── */
router.get("/event-orders/crew-tickets", async (req: any, res: any) => {
  if (req.headers["x-crew-key"] !== CREW_SCAN_KEY) {
    return res.status(401).json({ error: "Akses ditolak" });
  }
  try {
    const result = await pool.query(`
      SELECT
        eo.id, eo.order_code, eo.buyer_name, eo.buyer_phone, eo.buyer_email,
        eo.qty, eo.total_amount, eo.status, eo.checked_in, eo.checked_in_at,
        eo.attendee_names, eo.created_at, eo.confirmed_at, eo.notes,
        COALESCE(et.name, eo.ticket_name)  AS ticket_name,
        COALESCE(et.price, eo.total_amount) AS ticket_price,
        e.name   AS event_name,
        e.date   AS event_date
      FROM event_orders eo
      LEFT JOIN event_tickets et ON eo.ticket_id = et.id
      LEFT JOIN events e ON eo.event_id = e.id
      WHERE eo.status <> 'rejected'
      ORDER BY eo.created_at DESC
    `);
    res.json({ ok: true, orders: result.rows, total: result.rows.length });
  } catch (err: any) {
    logger.error({ err: err?.message }, "Crew tickets error");
    res.status(500).json({ error: "Gagal mengambil data" });
  }
});

/* ── DELETE /event-orders/:id — admin: hapus pesanan ── */
router.delete("/event-orders/:id", requireAuth, async (req: any, res: any) => {
  try {
    const r = await pool.query(`DELETE FROM event_orders WHERE id = $1 RETURNING id`, [req.params.id]);
    if (r.rows.length === 0) return res.status(404).json({ error: "Pesanan tidak ditemukan" });
    res.json({ ok: true });
  } catch {
    res.status(500).json({ error: "Gagal menghapus pesanan" });
  }
});

export default router;
