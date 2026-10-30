import { Router } from "express";
import pool from "../lib/db";
import { requireAuth } from "../middlewares/auth";

const router = Router();

// Public: list active vouchers
router.get("/vouchers", async (_req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT *, CASE type
        WHEN 'new_user'     THEN 1
        WHEN 'point_reward' THEN 2
        ELSE 3
       END AS _priority
       FROM vouchers
       WHERE active = true AND (expiry_date IS NULL OR expiry_date >= CURRENT_DATE)
       ORDER BY _priority ASC, discount_value DESC`
    );
    res.json(rows);
  } catch (e) {
    res.status(500).json({ error: "Server error" });
  }
});

// Public: list active vouchers for a specific category, optionally filtered by kuliner_id
router.get("/vouchers/campaign/:type", async (req, res) => {
  try {
    const { type } = req.params;
    const normalizedType = type === "jajan-yuk" ? "kuliner" : type;
    const kulinerIdRaw = req.query.kuliner_id;
    const kuliner_id = kulinerIdRaw ? Number(kulinerIdRaw) : null;

    let query: string;
    let params: unknown[];

    // Exclude account-level vouchers (point_reward, new_user) from listing banners —
    // those only apply during checkout for logged-in users, not browsing pages.
    const excludedTypes = `('point_reward', 'new_user')`;

    if ((normalizedType === "kuliner" || normalizedType === "cafe") && kuliner_id) {
      // Cafe vouchers historically used applicable_type=kuliner, so accept both values.
      const applicableClause = normalizedType === "cafe"
        ? "(applicable_type IN ('cafe', 'kuliner') OR applicable_type IS NULL)"
        : normalizedType === "kuliner"
          ? "(applicable_type IN ('kuliner', 'jajan-yuk', 'umum', 'all') OR applicable_type IS NULL)"
          : "(applicable_type = $1 OR applicable_type IS NULL)";
      query = `SELECT * FROM vouchers
               WHERE active = true
                 AND (expiry_date IS NULL OR expiry_date >= CURRENT_DATE)
                 AND type NOT IN ${excludedTypes}
                  AND ${applicableClause}
                  AND (kuliner_id = $${type === "cafe" ? 1 : 2} OR kuliner_id IS NULL)
               ORDER BY kuliner_id DESC NULLS LAST, discount_value DESC`;
      params = normalizedType === "cafe" || normalizedType === "kuliner"
        ? [kuliner_id]
        : [normalizedType, kuliner_id];
    } else {
      const applicableClause = normalizedType === "cafe"
        ? "(applicable_type IN ('cafe', 'kuliner') OR applicable_type IS NULL)"
        : normalizedType === "kuliner"
          ? "(applicable_type IN ('kuliner', 'jajan-yuk', 'umum', 'all') OR applicable_type IS NULL)"
          : "(applicable_type = $1 OR applicable_type IS NULL)";
      query = `SELECT * FROM vouchers
               WHERE active = true
                 AND (expiry_date IS NULL OR expiry_date >= CURRENT_DATE)
                 AND type NOT IN ${excludedTypes}
                  AND ${applicableClause}
               ORDER BY discount_value DESC`;
      params = normalizedType === "cafe" || normalizedType === "kuliner"
        ? []
        : [normalizedType];
    }

    const { rows } = await pool.query(query, params);
    res.set("Cache-Control", "no-store");
    res.json(rows);
  } catch (e) {
    res.status(500).json({ error: "Server error" });
  }
});

// Public: validate a voucher code
router.post("/vouchers/validate", async (req, res) => {
  try {
    const { code, type, amount, kuliner_id } = req.body as {
      code: string;
      type?: string;
      amount?: number;
      kuliner_id?: number;
    };
    if (!code) return res.status(400).json({ valid: false, error: "Kode voucher wajib diisi" });

    const { rows } = await pool.query(
      `SELECT * FROM vouchers
       WHERE code = $1
         AND active = true
         AND (expiry_date IS NULL OR expiry_date >= CURRENT_DATE)`,
      [code.trim().toUpperCase()]
    );

    if (!rows[0]) return res.status(404).json({ valid: false, error: "Kode voucher tidak ditemukan atau sudah tidak berlaku" });

    const voucher = rows[0];
    const normalizedType = type === "jajan-yuk" ? "kuliner" : type;

    // Check applicable_type restriction
    const culinaryVoucherType = normalizedType === "kuliner" && ["cafe", "kuliner", "jajan-yuk"].includes(voucher.applicable_type);
    const cafeVoucherType = normalizedType === "cafe" && ["cafe", "kuliner", "jajan-yuk"].includes(voucher.applicable_type);
    const isGlobalVoucher = !voucher.applicable_type || ["umum", "all"].includes(voucher.applicable_type);
    if (voucher.applicable_type && normalizedType && voucher.applicable_type !== normalizedType && !culinaryVoucherType && !cafeVoucherType && !isGlobalVoucher) {
      const TYPE_LABEL: Record<string, string> = {
        wisata: "Wisata", kuliner: "Kuliner", cafe: "Cafe", penginapan: "Penginapan", event: "Event",
      };
      return res.status(400).json({
        valid: false,
        error: `Voucher ini hanya berlaku untuk ${TYPE_LABEL[voucher.applicable_type] ?? voucher.applicable_type}`,
      });
    }

    if (
      kuliner_id != null &&
      voucher.kuliner_id != null &&
      Number(voucher.kuliner_id) !== Number(kuliner_id)
    ) {
      return res.status(400).json({
        valid: false,
        error: "Voucher ini hanya berlaku untuk merchant kuliner tertentu.",
      });
    }

    // Check min_purchase only when a non-zero amount is provided
    const purchaseAmount = Number(amount) || 0;
    if (purchaseAmount > 0 && voucher.min_purchase > 0 && purchaseAmount < voucher.min_purchase) {
      return res.status(400).json({
        valid: false,
        error: `Minimum pembelian Rp ${Number(voucher.min_purchase).toLocaleString("id-ID")} untuk voucher ini`,
        min_purchase: voucher.min_purchase,
      });
    }

    // Calculate discount (only when amount is known)
    let discount = 0;
    if (purchaseAmount > 0) {
      if (voucher.discount_type === "persen") {
        discount = Math.round(purchaseAmount * voucher.discount_value / 100);
      } else {
        discount = Math.min(Number(voucher.discount_value), purchaseAmount);
      }
    }

    res.json({
      valid: true,
      voucher: {
        id: voucher.id,
        title: voucher.title,
        code: voucher.code,
        discount_type: voucher.discount_type,
        discount_value: voucher.discount_value,
        min_purchase: voucher.min_purchase,
        applicable_type: voucher.applicable_type,
        description: voucher.description,
        expiry_date: voucher.expiry_date,
      },
      discount,
    });
  } catch (e) {
    res.status(500).json({ valid: false, error: "Server error" });
  }
});

router.get("/admin/vouchers", requireAuth, async (_req, res) => {
  const { rows } = await pool.query("SELECT * FROM vouchers ORDER BY id ASC");
  res.json(rows);
});

router.post("/admin/vouchers", requireAuth, async (req, res) => {
  const { title, code, type, discount_type, discount_value, min_purchase, expiry_date, description, active, kuliner_id } = req.body;
  const { rows } = await pool.query(
    "INSERT INTO vouchers (title, code, type, discount_type, discount_value, min_purchase, expiry_date, description, active, kuliner_id) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *",
    [title, code, type ?? "wisata", discount_type ?? "persen", discount_value ?? 0, min_purchase ?? 0, expiry_date || null, description, active ?? true, kuliner_id || null]
  );
  res.status(201).json(rows[0]);
});

router.put("/admin/vouchers/:id", requireAuth, async (req, res) => {
  const { title, code, type, discount_type, discount_value, min_purchase, expiry_date, description, active, kuliner_id } = req.body;
  const { rows } = await pool.query(
    "UPDATE vouchers SET title=$1, code=$2, type=$3, discount_type=$4, discount_value=$5, min_purchase=$6, expiry_date=$7, description=$8, active=$9, kuliner_id=$10, updated_at=NOW() WHERE id=$11 RETURNING *",
    [title, code, type, discount_type, discount_value, min_purchase, expiry_date || null, description, active, kuliner_id || null, req.params.id]
  );
  if (!rows[0]) return res.status(404).json({ error: "Not found" });
  res.json(rows[0]);
});

router.delete("/admin/vouchers/:id", requireAuth, async (req, res) => {
  await pool.query("DELETE FROM vouchers WHERE id=$1", [req.params.id]);
  res.json({ success: true });
});

export default router;
