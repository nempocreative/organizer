# Nempo.id — Workspace

## Overview

pnpm workspace monorepo — aplikasi pariwisata Garut (nempo.id).

## Artifacts

| Artifact | Path | Keterangan |
|---|---|---|
| `nempo-garut` | `/` | Frontend React/Vite — website utama |
| `api-server` | `/api` | Express 5 REST API + PostgreSQL |
| `admin-panel` | `/admin-panel/` | CMS Admin Panel dengan JWT auth |

## Stack

- **Monorepo**: pnpm workspaces + TypeScript 5.9
- **Frontend**: React 19, Vite, Tailwind CSS v4, Wouter, Embla Carousel
- **API**: Express 5, PostgreSQL (pg pool), JWT, Multer (image upload)
- **Admin CMS**: React 19, Vite, Tailwind CSS, Wouter

## Database Tables (20 total)

| Tabel | Keterangan |
|---|---|
| `banners` | Slider banner beranda |
| `wisata` | Destinasi wisata |
| `kuliner` | Kuliner & restoran |
| `penginapan` | Hotel & penginapan |
| `events` | Event & perlombaan |
| `berita` | Berita & artikel |
| `site_settings` | Pengaturan situs (key-value) |
| `admin_users` | User admin CMS |
| `vouchers` | Voucher & kupon diskon |
| `perlombaan` | Info perlombaan |
| `kamus_sunda` | Kamus bahasa Sunda |
| `transportasi` | Info transportasi |
| `price_list` | Daftar harga |
| `digital_services` | Layanan digital |
| `notifications` | Notifikasi publik |
| `users` | Akun user publik (email/password + Google OAuth) |
| `user_activities` | Log aktivitas setiap user |
| `user_wishlist` | Wishlist user (tersimpan ke DB per user, sync dari localStorage saat login) |
| `password_reset_requests` | Pengajuan ganti password dari user |
| `delete_account_requests` | Pengajuan hapus akun dari user |

## Admin CMS

- **URL**: `/admin-panel/`
- **Akun admin**: atur atau reset password melalui perintah lokal `pnpm --filter @workspace/api-server run admin:set-password`; tidak ada password bawaan.
- **JWT secret**: gunakan Replit Secret `JWT_SECRET`; bila belum disetel, API memakai `SESSION_SECRET`.
- **Upload gambar**: Disimpan di `artifacts/api-server/public/uploads/`, URL: `/api/uploads/<filename>`

## Sidebar Groups (Admin)

- **Konten Utama**: Dashboard, Banner Beranda, Wisata, Kuliner, Penginapan, Event, Berita
- **Fitur Lainnya**: Voucher, Perlombaan, Kamus Sunda, Transportasi, Daftar Harga, Layanan Digital
- **Sistem**: Pengaturan

## Catatan Penting

- Dark mode **dihapus permanen** — tidak ada toggle, context selalu mengembalikan `false`
- Banner beranda diambil dari API `/api/banners` (publik, tanpa auth)
- Fallback ke `defaultBanners` jika API tidak tersedia
- Semua route admin protected dengan `requireAuth` middleware (Bearer JWT)

## Pembayaran Midtrans (Tiket Event)

- Checkout tiket event (`/event/:slug/checkout`) memakai **Midtrans Snap** (popup), bukan lagi transfer manual + upload bukti.
- Tiket gratis (`total_amount <= 0`) langsung auto-confirmed tanpa Midtrans.
- Backend: `POST /api/event-orders` membuat order (dengan cek kuota server-side) lalu buat Snap transaction, balas `{ order_code, snap_token, redirect_url }`.
- Webhook Midtrans: `POST /api/payments/notification` — verifikasi signature SHA-512, update status order, tambah `event_tickets.sold` hanya saat capture/settlement, idempotent.
- Client key publik: `GET /api/payments/client-key`.
- Kredensial `MIDTRANS_SERVER_KEY` / `MIDTRANS_CLIENT_KEY` disimpan sebagai Replit Secrets — **saat ini pakai key production Midtrans** (bukan sandbox), jadi transaksi test akan jadi transaksi nyata.
- **Wajib disetel manual** di Merchant Portal Midtrans: Payment Notification URL → `https://<domain-produksi>/api/payments/notification`, agar status order otomatis update setelah dibayar.
- Kolom `payment_proof_url` & flow upload manual masih ada di DB/kode sebagai fallback yang tidak dipakai lagi di UI event checkout.
