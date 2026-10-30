import nodemailer from "nodemailer";
import { logger } from "./logger";

const transporter = nodemailer.createTransport({
  host: "smtp.hostinger.com",
  port: 465,
  secure: true,
  auth: {
    user: "tiket@nempo.id",
    pass: process.env.SMTP_PASSWORD ?? "",
  },
});

/* ── Retry helper: 3 attempts with exponential backoff (1s, 2s, 4s) ── */
async function sendMailWithRetry(options: nodemailer.SendMailOptions, maxAttempts = 3): Promise<void> {
  let lastErr: unknown;
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      await transporter.sendMail(options);
      return; // success
    } catch (err: any) {
      lastErr = err;
      logger.warn(
        { err: err?.message, attempt, maxAttempts, to: options.to },
        `Email gagal terkirim (percobaan ${attempt}/${maxAttempts})`
      );
      if (attempt < maxAttempts) {
        // Exponential backoff: 1s, 2s, 4s, …
        await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, attempt - 1)));
      }
    }
  }
  throw lastErr;
}

/* ── Format rupiah ── */
function formatRupiah(amount: number): string {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(amount);
}

/* ── Wrapper HTML email ── */
function htmlWrapper(content: string): string {
  return `
<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Nempo.id</title>
</head>
<body style="margin:0;padding:0;background:#f5f5f5;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f5;padding:32px 0;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08);">
        <!-- Header -->
        <tr>
          <td style="background:linear-gradient(135deg,#16a34a,#15803d);padding:28px 32px;text-align:center;">
            <h1 style="margin:0;color:#ffffff;font-size:24px;letter-spacing:0.5px;">🎟️ Nempo.id</h1>
            <p style="margin:6px 0 0;color:#bbf7d0;font-size:13px;">Tiket Resmi Anda</p>
          </td>
        </tr>
        <!-- Content -->
        <tr><td style="padding:32px;">${content}</td></tr>
        <!-- Footer -->
        <tr>
          <td style="background:#f9fafb;padding:20px 32px;text-align:center;border-top:1px solid #e5e7eb;">
            <p style="margin:0;color:#9ca3af;font-size:12px;">Email ini dikirim otomatis oleh sistem Nempo.id.<br/>Pertanyaan? Hubungi kami di <a href="mailto:tiket@nempo.id" style="color:#16a34a;">tiket@nempo.id</a></p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

/* ── Baris detail tiket ── */
function detailRow(label: string, value: string): string {
  return `
  <tr>
    <td style="padding:8px 0;color:#6b7280;font-size:14px;width:160px;">${label}</td>
    <td style="padding:8px 0;color:#111827;font-size:14px;font-weight:600;">${value}</td>
  </tr>`;
}

/* ══════════════════════════════════════════════
   KIRIM TIKET EVENT
═══════════════════════════════════════════════ */
export async function sendEventTicket(params: {
  buyerName: string;
  buyerEmail: string;
  orderCode: string;
  eventName: string;
  ticketName: string;
  qty: number;
  totalAmount: number;
  attendeeNames?: string[];
}): Promise<void> {
  const { buyerName, buyerEmail, orderCode, eventName, ticketName, qty, totalAmount, attendeeNames } = params;

  const attendeeSection = attendeeNames && attendeeNames.length > 0
    ? `<p style="margin:16px 0 8px;font-size:14px;color:#374151;font-weight:600;">Nama Peserta:</p>
       <ul style="margin:0;padding-left:20px;">${attendeeNames.map(n => `<li style="color:#374151;font-size:14px;margin:4px 0;">${n}</li>`).join("")}</ul>`
    : "";

  const content = `
    <h2 style="margin:0 0 4px;color:#16a34a;font-size:20px;">Pembayaran Berhasil! 🎉</h2>
    <p style="margin:0 0 24px;color:#6b7280;font-size:14px;">Halo <strong>${buyerName}</strong>, tiket Anda sudah dikonfirmasi.</p>

    <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px;padding:20px;margin-bottom:20px;">
      <p style="margin:0 0 12px;font-size:13px;font-weight:700;color:#16a34a;text-transform:uppercase;letter-spacing:0.5px;">Detail Tiket</p>
      <table width="100%" cellpadding="0" cellspacing="0">
        ${detailRow("Event", eventName)}
        ${detailRow("Tipe Tiket", ticketName)}
        ${detailRow("Jumlah Tiket", `${qty} tiket`)}
        ${detailRow("Total Bayar", formatRupiah(totalAmount))}
      </table>
      ${attendeeSection}
    </div>

    <!-- Kotak kode pesanan — menonjol agar mudah disimpan -->
    <div style="background:#0f172a;border-radius:10px;padding:20px;text-align:center;margin-bottom:20px;">
      <p style="margin:0 0 6px;font-size:11px;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:1px;">Simpan Kode Pesanan Ini</p>
      <p style="margin:0 0 6px;font-family:monospace;font-size:26px;font-weight:900;color:#ffffff;letter-spacing:4px;">${orderCode}</p>
      <p style="margin:0;font-size:11px;color:#64748b;">Gunakan kode ini untuk cek status tiket di <a href="https://nempo.id/cek-tiket" style="color:#38bdf8;">nempo.id/cek-tiket</a></p>
    </div>

    <!-- Info PDF dari admin -->
    <div style="background:#eff6ff;border:1px solid #bfdbfe;border-radius:8px;padding:16px;margin-bottom:20px;">
      <p style="margin:0 0 6px;font-size:13px;font-weight:700;color:#1d4ed8;">📄 E-Tiket PDF (dengan QR Check-in)</p>
      <p style="margin:0;font-size:13px;color:#1e40af;line-height:1.6;">PDF tiket resmi beserta QR code untuk check-in akan dikirimkan oleh <strong>Admin Nempo.id</strong> ke email ini setelah diverifikasi. Harap tunggu dan cek inbox/spam Anda.</p>
    </div>

    <div style="background:#fffbeb;border:1px solid #fde68a;border-radius:8px;padding:14px;font-size:13px;color:#92400e;">
      ⚠️ Simpan email ini dan tunjukkan <strong>kode pesanan ${orderCode}</strong> kepada panitia saat check-in jika PDF belum diterima.
    </div>`;

  await sendMailWithRetry({
    from: '"Nempo.id Tiket" <tiket@nempo.id>',
    to: buyerEmail,
    subject: `✅ Pesanan Dikonfirmasi: ${eventName} — ${orderCode}`,
    html: htmlWrapper(content),
  });

  logger.info({ orderCode, buyerEmail }, "E-tiket event terkirim (tanpa QR/PDF, admin kirim terpisah)");
}

/* ══════════════════════════════════════════════
   KIRIM TIKET WISATA
═══════════════════════════════════════════════ */
export async function sendWisataTicket(params: {
  buyerName: string;
  buyerEmail: string;
  orderCode: string;
  wisataName: string;
  ticketType: string;
  qty: number;
  totalAmount: number;
  visitDate: string;
}): Promise<void> {
  const { buyerName, buyerEmail, orderCode, wisataName, ticketType, qty, totalAmount, visitDate } = params;

  const content = `
    <h2 style="margin:0 0 4px;color:#16a34a;font-size:20px;">Pembayaran Berhasil! 🌿</h2>
    <p style="margin:0 0 24px;color:#6b7280;font-size:14px;">Halo <strong>${buyerName}</strong>, tiket wisata Anda sudah dikonfirmasi.</p>

    <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px;padding:20px;margin-bottom:24px;">
      <p style="margin:0 0 12px;font-size:13px;font-weight:700;color:#16a34a;text-transform:uppercase;letter-spacing:0.5px;">Detail Tiket Wisata</p>
      <table width="100%" cellpadding="0" cellspacing="0">
        ${detailRow("Kode Pesanan", orderCode)}
        ${detailRow("Destinasi", wisataName)}
        ${detailRow("Tipe Tiket", ticketType)}
        ${detailRow("Jumlah", `${qty} tiket`)}
        ${detailRow("Tanggal Kunjungan", visitDate)}
        ${detailRow("Total Bayar", formatRupiah(totalAmount))}
      </table>
    </div>

    <div style="background:#fffbeb;border:1px solid #fde68a;border-radius:8px;padding:16px;font-size:13px;color:#92400e;">
      ⚠️ Tunjukkan <strong>kode pesanan</strong> ini saat tiba di lokasi wisata.
    </div>`;

  await sendMailWithRetry({
    from: '"Nempo.id Tiket" <tiket@nempo.id>',
    to: buyerEmail,
    subject: `✅ Tiket Wisata: ${wisataName} — ${orderCode}`,
    html: htmlWrapper(content),
  });

  logger.info({ orderCode, buyerEmail }, "Tiket wisata terkirim");
}

/* ══════════════════════════════════════════════
   KIRIM KONFIRMASI PENGINAPAN
═══════════════════════════════════════════════ */
export async function sendPenginapanConfirmation(params: {
  guestName: string;
  guestEmail: string;
  orderCode: string;
  penginapanName: string;
  roomType: string;
  checkinDate: string;
  checkoutDate: string;
  numGuests: number;
  totalAmount: number;
}): Promise<void> {
  const { guestName, guestEmail, orderCode, penginapanName, roomType, checkinDate, checkoutDate, numGuests, totalAmount } = params;

  const content = `
    <h2 style="margin:0 0 4px;color:#16a34a;font-size:20px;">Pemesanan Dikonfirmasi! 🏨</h2>
    <p style="margin:0 0 24px;color:#6b7280;font-size:14px;">Halo <strong>${guestName}</strong>, pemesanan penginapan Anda sudah dikonfirmasi.</p>

    <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px;padding:20px;margin-bottom:24px;">
      <p style="margin:0 0 12px;font-size:13px;font-weight:700;color:#16a34a;text-transform:uppercase;letter-spacing:0.5px;">Detail Pemesanan</p>
      <table width="100%" cellpadding="0" cellspacing="0">
        ${detailRow("Kode Pesanan", orderCode)}
        ${detailRow("Penginapan", penginapanName)}
        ${detailRow("Tipe Kamar", roomType)}
        ${detailRow("Check-in", checkinDate)}
        ${detailRow("Check-out", checkoutDate)}
        ${detailRow("Jumlah Tamu", `${numGuests} orang`)}
        ${detailRow("Total Bayar", formatRupiah(totalAmount))}
      </table>
    </div>

    <div style="background:#fffbeb;border:1px solid #fde68a;border-radius:8px;padding:16px;font-size:13px;color:#92400e;">
      ⚠️ Tunjukkan <strong>kode pesanan</strong> ini saat check-in di penginapan.
    </div>`;

  await sendMailWithRetry({
    from: '"Nempo.id Tiket" <tiket@nempo.id>',
    to: guestEmail,
    subject: `✅ Konfirmasi Penginapan: ${penginapanName} — ${orderCode}`,
    html: htmlWrapper(content),
  });

  logger.info({ orderCode, guestEmail }, "Konfirmasi penginapan terkirim");
}
