import { Router } from "express";
import pool from "../lib/db";
import { verifyToken } from "../lib/auth";
import { requireAuth } from "../middlewares/auth";
import { awardPoints, checkMilestoneVouchers } from "./user-points";

const router = Router();

function requireUser(req: any, res: any, next: any) {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) return res.status(401).json({ error: "Login terlebih dahulu" });
  try {
    const payload = verifyToken(header.slice(7));
    if ((payload as any).role !== "user") return res.status(403).json({ error: "Hanya user yang bisa memberi ulasan" });
    (req as any).user = payload;
    next();
  } catch {
    return res.status(401).json({ error: "Token tidak valid" });
  }
}

/* GET summary stats for logged-in user (reviews, favorites, vouchers, orders) */
router.get("/user/stats", requireUser, async (req: any, res) => {
  const userId = req.user.id;
  try {
    const { rows } = await pool.query(`
      SELECT
        (SELECT COUNT(*)::int FROM reviews WHERE user_id = $1) AS review_count,
        (SELECT COUNT(*)::int FROM user_wishlist WHERE user_id = $1) AS favorite_count,
        (SELECT COUNT(*)::int FROM user_vouchers WHERE user_id = $1 AND (expires_at IS NULL OR expires_at > NOW())) AS voucher_count,
        0 AS order_count
    `, [userId]);
    res.json(rows[0]);
  } catch { res.status(500).json({ error: "Server error" }); }
});

/* GET reviews by logged-in user */
router.get("/user/reviews", requireUser, async (req: any, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT r.id, r.item_type, r.item_id, r.rating, r.comment, r.created_at,
              CASE r.item_type
                WHEN 'wisata'     THEN (SELECT name FROM wisata     WHERE id=r.item_id)
                WHEN 'kuliner'    THEN (SELECT name FROM kuliner    WHERE id=r.item_id)
                WHEN 'penginapan' THEN (SELECT name FROM penginapan WHERE id=r.item_id)
                WHEN 'event'      THEN (SELECT name FROM events     WHERE id=r.item_id)
                ELSE NULL
              END AS item_name
       FROM reviews r WHERE r.user_id = $1 ORDER BY r.created_at DESC`,
      [req.user.id]
    );
    res.json(rows);
  } catch { res.status(500).json({ error: "Server error" }); }
});

/* GET reviews for an item */
router.get("/reviews/:itemType/:itemId", async (req, res) => {
  try {
    const { itemType, itemId } = req.params;
    const { rows } = await pool.query(
      `SELECT id, user_name, user_avatar, rating, comment, created_at
       FROM reviews
       WHERE item_type=$1 AND item_id=$2 AND visible=true
       ORDER BY created_at DESC`,
      [itemType, parseInt(itemId)]
    );
    const formatted = rows.map(r => ({
      id: String(r.id),
      name: r.user_name,
      picture: r.user_avatar,
      rating: r.rating,
      comment: r.comment,
      date: new Date(r.created_at).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" }),
    }));
    res.json(formatted);
  } catch (err) {
    res.status(500).json({ error: "Gagal memuat ulasan" });
  }
});

/* POST submit a review */
router.post("/reviews", requireUser, async (req, res) => {
  try {
    const { item_type, item_id, rating, comment } = req.body;
    const userId = (req as any).user.id;
    if (!item_type || !item_id || !rating || !comment?.trim()) {
      return res.status(400).json({ error: "Data tidak lengkap" });
    }
    if (rating < 1 || rating > 5) return res.status(400).json({ error: "Rating harus 1-5" });

    const { rows: userRows } = await pool.query(
      "SELECT name, email, avatar_url FROM users WHERE id=$1", [userId]
    );
    if (!userRows[0]) return res.status(404).json({ error: "User tidak ditemukan" });
    const u = userRows[0];

    const existing = await pool.query(
      "SELECT id FROM reviews WHERE user_id=$1 AND item_type=$2 AND item_id=$3",
      [userId, item_type, parseInt(item_id)]
    );
    let isNew = false;
    if (existing.rows[0]) {
      await pool.query(
        "UPDATE reviews SET rating=$1, comment=$2, created_at=NOW() WHERE id=$3",
        [rating, comment.trim(), existing.rows[0].id]
      );
    } else {
      await pool.query(
        `INSERT INTO reviews (item_type, item_id, user_id, user_name, user_email, user_avatar, rating, comment)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8)`,
        [item_type, parseInt(item_id), userId, u.name, u.email, u.avatar_url, rating, comment.trim()]
      );
      isNew = true;
    }

    // Award +5 points for new review (not edits)
    if (isNew) {
      try {
        await awardPoints(userId, "review", 5, `Menulis ulasan ${item_type} #${item_id} (+5 poin)`);
        const { rows: upd } = await pool.query("SELECT total_points FROM user_points WHERE user_id=$1", [userId]);
        const total = upd[0]?.total_points ?? 0;
        await checkMilestoneVouchers(userId, total);
      } catch { /* non-critical */ }
    }

    res.json({ success: true, points_earned: isNew ? 5 : 0 });
  } catch (err) {
    res.status(500).json({ error: "Gagal menyimpan ulasan" });
  }
});

/* ── ADMIN ROUTES ── */

/* GET all reviews (admin) */
router.get("/admin/reviews", requireAuth, async (req, res) => {
  try {
    const page = parseInt((req.query.page as string) ?? "1") || 1;
    const limit = parseInt((req.query.limit as string) ?? "50") || 50;
    const offset = (page - 1) * limit;
    const search = (req.query.search as string) ?? "";
    const itemType = (req.query.item_type as string) ?? "";

    let where = "WHERE 1=1";
    const params: any[] = [];
    let idx = 1;

    if (search) {
      where += ` AND (r.user_name ILIKE $${idx} OR r.comment ILIKE $${idx})`;
      params.push(`%${search}%`);
      idx++;
    }
    if (itemType) {
      where += ` AND r.item_type=$${idx}`;
      params.push(itemType);
      idx++;
    }

    const countRes = await pool.query(`SELECT COUNT(*) FROM reviews r ${where}`, params);
    const total = parseInt(countRes.rows[0].count);

    const { rows } = await pool.query(
      `SELECT r.id, r.item_type, r.item_id, r.user_id, r.user_name, r.user_email, r.user_avatar,
              r.rating, r.comment, r.visible, r.created_at,
              CASE r.item_type
                WHEN 'wisata'     THEN (SELECT name FROM wisata     WHERE id=r.item_id)
                WHEN 'kuliner'    THEN (SELECT name FROM kuliner    WHERE id=r.item_id)
                WHEN 'penginapan' THEN (SELECT name FROM penginapan WHERE id=r.item_id)
                WHEN 'event'      THEN (SELECT name FROM events     WHERE id=r.item_id)
                ELSE NULL
              END as item_name
       FROM reviews r ${where}
       ORDER BY r.created_at DESC
       LIMIT $${idx} OFFSET $${idx + 1}`,
      [...params, limit, offset]
    );
    res.json({ reviews: rows, total, page, limit });
  } catch (err) {
    res.status(500).json({ error: "Gagal memuat ulasan" });
  }
});

/* PATCH toggle visibility */
router.patch("/admin/reviews/:id/visibility", requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const { visible } = req.body;
    await pool.query("UPDATE reviews SET visible=$1 WHERE id=$2", [visible, parseInt(id)]);
    res.json({ success: true });
  } catch {
    res.status(500).json({ error: "Gagal update" });
  }
});

/* DELETE review (admin) */
router.delete("/admin/reviews/:id", requireAuth, async (req, res) => {
  try {
    await pool.query("DELETE FROM reviews WHERE id=$1", [parseInt(req.params.id)]);
    res.json({ success: true });
  } catch {
    res.status(500).json({ error: "Gagal hapus" });
  }
});

export default router;
