import { Router } from "express";
import pool from "../lib/db";
import { logger } from "../lib/logger";
import { requireAuth } from "../middlewares/auth";
import { authenticateMitra } from "./mitra";
import { iris, irisConfigured, isProduction as midtransIsProduction } from "../lib/midtrans";

const router = Router();

const MIN_WITHDRAWAL = 50000;
const DEFAULT_COMMISSION_PERCENT = 5;

async function ensureWalletSchema() {
  await pool.query(`ALTER TABLE mitra ADD COLUMN IF NOT EXISTS saldo BIGINT NOT NULL DEFAULT 0`);
  await pool.query(`ALTER TABLE mitra ADD COLUMN IF NOT EXISTS bank_name VARCHAR(60)`);
  await pool.query(`ALTER TABLE mitra ADD COLUMN IF NOT EXISTS bank_account_no VARCHAR(40)`);
  await pool.query(`ALTER TABLE mitra ADD COLUMN IF NOT EXISTS bank_account_name VARCHAR(120)`);
  await pool.query(`
    CREATE TABLE IF NOT EXISTS mitra_wallet_ledger (
      id SERIAL PRIMARY KEY,
      mitra_id INTEGER NOT NULL REFERENCES mitra(id) ON DELETE CASCADE,
      type VARCHAR(30) NOT NULL,
      amount BIGINT NOT NULL,
      balance_after BIGINT NOT NULL,
      ref_order_code VARCHAR(40),
      ref_withdrawal_id INTEGER,
      note TEXT,
      created_at TIMESTAMP NOT NULL DEFAULT NOW()
    )
  `);
  await pool.query(`
    CREATE TABLE IF NOT EXISTS mitra_withdrawals (
      id SERIAL PRIMARY KEY,
      mitra_id INTEGER NOT NULL REFERENCES mitra(id) ON DELETE CASCADE,
      amount BIGINT NOT NULL,
      bank_name VARCHAR(60),
      bank_account_no VARCHAR(40),
      bank_account_name VARCHAR(120),
      status VARCHAR(20) NOT NULL DEFAULT 'pending',
      admin_note TEXT,
      disbursement_reference VARCHAR(120),
      requested_at TIMESTAMP NOT NULL DEFAULT NOW(),
      approved_at TIMESTAMP,
      processed_at TIMESTAMP,
      created_at TIMESTAMP NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMP NOT NULL DEFAULT NOW()
    )
  `);
}
ensureWalletSchema().catch((err) => logger.error({ err: err?.message }, "ensureWalletSchema failed"));

async function getCommissionPercent(): Promise<number> {
  const { rows } = await pool.query(`SELECT value FROM site_settings WHERE key = 'mitra_commission_percent'`);
  const raw = rows[0]?.value;
  const n = Number(raw);
  return Number.isFinite(n) && n >= 0 && n <= 100 ? n : DEFAULT_COMMISSION_PERCENT;
}

/* ── Dipanggil dari webhook Midtrans saat pesanan tiket event terkonfirmasi.
   Mengkredit saldo mitra yang ditautkan ke event tersebut (jika ada), dikurangi komisi platform. ── */
export async function creditWalletForEventOrder(eventId: number, totalAmount: number, orderCode: string) {
  if (!eventId || totalAmount <= 0) return;
  try {
    const { rows } = await pool.query(
      `SELECT id, saldo FROM mitra WHERE listing_type = 'event' AND listing_id = $1 AND active = true LIMIT 1`,
      [eventId]
    );
    const mitra = rows[0];
    if (!mitra) return; // Event tidak ditautkan ke mitra manapun — dana tetap di platform

    const commissionPercent = await getCommissionPercent();
    const commission = Math.round((totalAmount * commissionPercent) / 100);
    const net = totalAmount - commission;
    if (net <= 0) return;

    const { rows: updated } = await pool.query(
      `UPDATE mitra SET saldo = saldo + $1, updated_at = NOW() WHERE id = $2 RETURNING saldo`,
      [net, mitra.id]
    );
    await pool.query(
      `INSERT INTO mitra_wallet_ledger (mitra_id, type, amount, balance_after, ref_order_code, note)
       VALUES ($1, 'credit', $2, $3, $4, $5)`,
      [mitra.id, net, updated[0].saldo, orderCode, `Tiket event terjual (komisi platform ${commissionPercent}%)`]
    );
    logger.info({ mitraId: mitra.id, net, orderCode }, "Mitra wallet credited from event order");
  } catch (err: any) {
    logger.error({ err: err?.message, eventId, orderCode }, "creditWalletForEventOrder failed");
  }
}

/* ── Dipanggil dari mitra.ts saat pesanan wisata/penginapan dikonfirmasi mitra.
   Mengkredit saldo mitra secara langsung (pembayaran offline/tunai di tempat), dikurangi komisi platform. ── */
export async function creditWalletForMitraOrder(
  mitraId: number,
  totalAmount: number,
  orderRef: string,
  listingType: string
) {
  if (!mitraId || totalAmount <= 0) return;
  try {
    const { rows: mitraRows } = await pool.query(`SELECT saldo FROM mitra WHERE id = $1`, [mitraId]);
    if (!mitraRows[0]) return;

    const commissionPercent = await getCommissionPercent();
    const commission = Math.round((totalAmount * commissionPercent) / 100);
    const net = totalAmount - commission;
    if (net <= 0) return;

    const { rows: updated } = await pool.query(
      `UPDATE mitra SET saldo = saldo + $1, updated_at = NOW() WHERE id = $2 RETURNING saldo`,
      [net, mitraId]
    );
    await pool.query(
      `INSERT INTO mitra_wallet_ledger (mitra_id, type, amount, balance_after, ref_order_code, note)
       VALUES ($1, 'credit', $2, $3, $4, $5)`,
      [mitraId, net, updated[0].saldo, orderRef, `Pesanan ${listingType} dikonfirmasi (komisi platform ${commissionPercent}%)`]
    );
    logger.info({ mitraId, net, orderRef, listingType }, "Mitra wallet credited from confirmed order");
  } catch (err: any) {
    logger.error({ err: err?.message, mitraId, orderRef }, "creditWalletForMitraOrder failed");
  }
}

/* ══════════════════ Mitra: dompet saya ══════════════════ */

router.get("/auth/mitra-me/wallet", async (req: any, res: any) => {
  const mitra = await authenticateMitra(req, res);
  if (!mitra) return;
  const commissionPercent = await getCommissionPercent();
  const { rows: pendingRows } = await pool.query(
    `SELECT id, amount, status, requested_at FROM mitra_withdrawals
     WHERE mitra_id = $1 AND status IN ('pending','approved') ORDER BY requested_at DESC LIMIT 1`,
    [mitra.id]
  );
  res.json({
    saldo: Number(mitra.saldo ?? 0),
    bank_name: mitra.bank_name ?? "",
    bank_account_no: mitra.bank_account_no ?? "",
    bank_account_name: mitra.bank_account_name ?? "",
    commission_percent: commissionPercent,
    min_withdrawal: MIN_WITHDRAWAL,
    pending_withdrawal: pendingRows[0] ?? null,
  });
});

router.put("/auth/mitra-me/wallet/bank", async (req: any, res: any) => {
  const mitra = await authenticateMitra(req, res);
  if (!mitra) return;
  const { bank_name, bank_account_no, bank_account_name } = req.body;
  if (!bank_name || !bank_account_no || !bank_account_name) {
    return res.status(400).json({ error: "Nama bank, nomor rekening, dan nama pemilik rekening wajib diisi" });
  }
  await pool.query(
    `UPDATE mitra SET bank_name=$1, bank_account_no=$2, bank_account_name=$3, updated_at=NOW() WHERE id=$4`,
    [bank_name, bank_account_no, bank_account_name, mitra.id]
  );
  res.json({ ok: true });
});

router.get("/auth/mitra-me/wallet/history", async (req: any, res: any) => {
  const mitra = await authenticateMitra(req, res);
  if (!mitra) return;
  const { rows: ledger } = await pool.query(
    `SELECT id, type, amount, balance_after, ref_order_code, note, created_at
     FROM mitra_wallet_ledger WHERE mitra_id = $1 ORDER BY created_at DESC LIMIT 50`,
    [mitra.id]
  );
  const { rows: withdrawals } = await pool.query(
    `SELECT id, amount, status, admin_note, disbursement_reference, requested_at, approved_at, processed_at
     FROM mitra_withdrawals WHERE mitra_id = $1 ORDER BY requested_at DESC LIMIT 50`,
    [mitra.id]
  );
  res.json({ ledger, withdrawals });
});

router.post("/auth/mitra-me/withdrawals", async (req: any, res: any) => {
  const mitra = await authenticateMitra(req, res);
  if (!mitra) return;
  try {
    const amount = Math.floor(Number(req.body.amount) || 0);
    if (amount < MIN_WITHDRAWAL) {
      return res.status(400).json({ error: `Minimal penarikan adalah Rp${MIN_WITHDRAWAL.toLocaleString("id")}` });
    }
    if (amount > Number(mitra.saldo ?? 0)) {
      return res.status(400).json({ error: "Saldo tidak cukup" });
    }
    if (!mitra.bank_name || !mitra.bank_account_no || !mitra.bank_account_name) {
      return res.status(400).json({ error: "Lengkapi data rekening bank terlebih dahulu di menu Dompet Saya" });
    }
    const { rows: existingPending } = await pool.query(
      `SELECT id FROM mitra_withdrawals WHERE mitra_id = $1 AND status IN ('pending','approved')`,
      [mitra.id]
    );
    if (existingPending.length > 0) {
      return res.status(409).json({ error: "Kamu masih punya permintaan penarikan yang sedang diproses" });
    }

    const client = await pool.connect();
    try {
      await client.query("BEGIN");
      const { rows: updated } = await client.query(
        `UPDATE mitra SET saldo = saldo - $1, updated_at = NOW() WHERE id = $2 AND saldo >= $1 RETURNING saldo`,
        [amount, mitra.id]
      );
      if (updated.length === 0) {
        await client.query("ROLLBACK");
        return res.status(400).json({ error: "Saldo tidak cukup" });
      }
      const { rows: wd } = await client.query(
        `INSERT INTO mitra_withdrawals (mitra_id, amount, bank_name, bank_account_no, bank_account_name, status)
         VALUES ($1,$2,$3,$4,$5,'pending') RETURNING *`,
        [mitra.id, amount, mitra.bank_name, mitra.bank_account_no, mitra.bank_account_name]
      );
      await client.query(
        `INSERT INTO mitra_wallet_ledger (mitra_id, type, amount, balance_after, ref_withdrawal_id, note)
         VALUES ($1, 'withdrawal_request', $2, $3, $4, 'Permintaan tarik saldo diajukan')`,
        [mitra.id, -amount, updated[0].saldo, wd[0].id]
      );
      await client.query("COMMIT");
      res.status(201).json(wd[0]);
    } catch (err) {
      await client.query("ROLLBACK");
      throw err;
    } finally {
      client.release();
    }
  } catch (err: any) {
    logger.error({ err: err?.message }, "Create withdrawal error");
    res.status(500).json({ error: "Gagal mengajukan penarikan. Coba lagi." });
  }
});

/* ── Mitra: batalkan permintaan penarikan yang masih pending ── */
router.delete("/auth/mitra-me/withdrawals/:id", async (req: any, res: any) => {
  const mitra = await authenticateMitra(req, res);
  if (!mitra) return;
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const { rows } = await client.query(
      `SELECT * FROM mitra_withdrawals WHERE id = $1 AND mitra_id = $2`,
      [req.params.id, mitra.id]
    );
    const wd = rows[0];
    if (!wd) { await client.query("ROLLBACK"); return res.status(404).json({ error: "Permintaan tidak ditemukan" }); }
    if (wd.status !== "pending") { await client.query("ROLLBACK"); return res.status(400).json({ error: "Hanya permintaan berstatus menunggu yang bisa dibatalkan" }); }
    const { rows: updated } = await client.query(
      `UPDATE mitra SET saldo = saldo + $1, updated_at = NOW() WHERE id = $2 RETURNING saldo`,
      [wd.amount, mitra.id]
    );
    await client.query(
      `UPDATE mitra_withdrawals SET status = 'rejected', admin_note = 'Dibatalkan oleh mitra', updated_at = NOW() WHERE id = $1`,
      [wd.id]
    );
    await client.query(
      `INSERT INTO mitra_wallet_ledger (mitra_id, type, amount, balance_after, ref_withdrawal_id, note)
       VALUES ($1, 'withdrawal_cancelled', $2, $3, $4, 'Permintaan penarikan dibatalkan oleh mitra')`,
      [mitra.id, wd.amount, updated[0].saldo, wd.id]
    );
    await client.query("COMMIT");
    res.json({ ok: true });
  } catch (err: any) {
    await client.query("ROLLBACK");
    logger.error({ err: err?.message }, "Cancel withdrawal error");
    res.status(500).json({ error: "Gagal membatalkan permintaan" });
  } finally {
    client.release();
  }
});

/* ══════════════════ Admin: kelola penarikan saldo mitra ══════════════════ */

router.get("/admin/withdrawals", requireAuth, async (req: any, res: any) => {
  const status = req.query.status as string | undefined;
  const where = status ? `WHERE w.status = $1` : "";
  const params = status ? [status] : [];
  const { rows } = await pool.query(
    `SELECT w.*, m.business_name, m.username, m.contact_name, m.phone
     FROM mitra_withdrawals w
     JOIN mitra m ON m.id = w.mitra_id
     ${where}
     ORDER BY w.requested_at DESC`,
    params
  );
  res.json(rows);
});

router.get("/admin/withdrawals/summary", requireAuth, async (_req: any, res: any) => {
  const { rows } = await pool.query(`
    SELECT
      COUNT(*) FILTER (WHERE status = 'pending')::int AS pending,
      COUNT(*) FILTER (WHERE status = 'approved')::int AS approved,
      COALESCE(SUM(amount) FILTER (WHERE status IN ('pending','approved')), 0)::bigint AS outstanding_amount
    FROM mitra_withdrawals
  `);
  res.json(rows[0]);
});

/* ── Admin: setujui permintaan. Jika Iris terkonfigurasi, langsung coba cairkan otomatis. ── */
router.post("/admin/withdrawals/:id/approve", requireAuth, async (req: any, res: any) => {
  try {
    const { rows } = await pool.query(
      `SELECT w.*, m.bank_name AS mitra_bank_name FROM mitra_withdrawals w JOIN mitra m ON m.id = w.mitra_id WHERE w.id = $1`,
      [req.params.id]
    );
    const wd = rows[0];
    if (!wd) return res.status(404).json({ error: "Permintaan tidak ditemukan" });
    if (wd.status !== "pending") return res.status(400).json({ error: "Permintaan sudah diproses" });

    if (irisConfigured && iris) {
      try {
        const payout = await iris.createPayouts({
          payouts: [{
            beneficiary_name: wd.bank_account_name,
            beneficiary_account: wd.bank_account_no,
            beneficiary_bank: (wd.bank_name || "").toLowerCase(),
            beneficiary_email: "",
            amount: String(wd.amount),
            notes: `Pencairan saldo mitra #${wd.id}`,
          }],
        }) as any;
        const ref = payout?.payouts?.[0]?.reference_no ?? null;
        await pool.query(
          `UPDATE mitra_withdrawals SET status='processing', approved_at=NOW(), disbursement_reference=$1, updated_at=NOW() WHERE id=$2`,
          [ref, wd.id]
        );
        return res.json({ ok: true, mode: "auto", reference: ref });
      } catch (irisErr: any) {
        logger.error({ err: irisErr?.message, withdrawalId: wd.id }, "Iris createPayouts failed, falling back to manual");
        await pool.query(
          `UPDATE mitra_withdrawals SET status='approved', approved_at=NOW(), admin_note='Auto-disbursement gagal, perlu transfer manual', updated_at=NOW() WHERE id=$1`,
          [wd.id]
        );
        return res.json({ ok: true, mode: "manual_fallback" });
      }
    }

    await pool.query(
      `UPDATE mitra_withdrawals SET status='approved', approved_at=NOW(), updated_at=NOW() WHERE id=$1`,
      [wd.id]
    );
    res.json({ ok: true, mode: "manual" });
  } catch (err: any) {
    logger.error({ err: err?.message }, "Approve withdrawal error");
    res.status(500).json({ error: "Gagal menyetujui permintaan" });
  }
});

/* ── Admin: tolak permintaan — saldo dikembalikan ── */
router.post("/admin/withdrawals/:id/reject", requireAuth, async (req: any, res: any) => {
  const { reason } = req.body;
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const { rows } = await client.query(`SELECT * FROM mitra_withdrawals WHERE id = $1`, [req.params.id]);
    const wd = rows[0];
    if (!wd) { await client.query("ROLLBACK"); return res.status(404).json({ error: "Permintaan tidak ditemukan" }); }
    if (wd.status !== "pending" && wd.status !== "approved") {
      await client.query("ROLLBACK");
      return res.status(400).json({ error: "Permintaan tidak bisa ditolak pada status ini" });
    }
    const { rows: updatedMitra } = await client.query(
      `UPDATE mitra SET saldo = saldo + $1, updated_at = NOW() WHERE id = $2 RETURNING saldo`,
      [wd.amount, wd.mitra_id]
    );
    await client.query(
      `UPDATE mitra_withdrawals SET status='rejected', admin_note=$1, updated_at=NOW() WHERE id=$2`,
      [reason || null, wd.id]
    );
    await client.query(
      `INSERT INTO mitra_wallet_ledger (mitra_id, type, amount, balance_after, ref_withdrawal_id, note)
       VALUES ($1, 'withdrawal_rejected', $2, $3, $4, $5)`,
      [wd.mitra_id, wd.amount, updatedMitra[0].saldo, wd.id, reason ? `Ditolak: ${reason}` : "Permintaan penarikan ditolak"]
    );
    await client.query("COMMIT");
    res.json({ ok: true });
  } catch (err: any) {
    await client.query("ROLLBACK");
    logger.error({ err: err?.message }, "Reject withdrawal error");
    res.status(500).json({ error: "Gagal menolak permintaan" });
  } finally {
    client.release();
  }
});

/* ── Admin: tandai selesai (transfer manual sudah dikirim, atau konfirmasi hasil disbursement otomatis) ── */
router.post("/admin/withdrawals/:id/complete", requireAuth, async (req: any, res: any) => {
  const { reference } = req.body;
  try {
    const { rows } = await pool.query(`SELECT * FROM mitra_withdrawals WHERE id = $1`, [req.params.id]);
    const wd = rows[0];
    if (!wd) return res.status(404).json({ error: "Permintaan tidak ditemukan" });
    if (!["approved", "processing"].includes(wd.status)) {
      return res.status(400).json({ error: "Permintaan belum disetujui" });
    }
    await pool.query(
      `UPDATE mitra_withdrawals SET status='completed', processed_at=NOW(),
         disbursement_reference=COALESCE($1, disbursement_reference), updated_at=NOW() WHERE id=$2`,
      [reference || null, wd.id]
    );
    await pool.query(
      `INSERT INTO mitra_wallet_ledger (mitra_id, type, amount, balance_after, ref_withdrawal_id, note)
       VALUES ($1, 'withdrawal_completed', 0, (SELECT saldo FROM mitra WHERE id=$1), $2, 'Dana telah dicairkan ke rekening mitra')`,
      [wd.mitra_id, wd.id]
    );
    res.json({ ok: true });
  } catch (err: any) {
    logger.error({ err: err?.message }, "Complete withdrawal error");
    res.status(500).json({ error: "Gagal menandai selesai" });
  }
});

router.get("/admin/withdrawals/iris-status", requireAuth, async (_req: any, res: any) => {
  res.json({ configured: irisConfigured, isProduction: midtransIsProduction });
});

export default router;
