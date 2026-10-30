import { Router } from "express";
import pool from "../lib/db";
import { verifyToken } from "../lib/auth";

const router = Router();

function requireUser(req: any, res: any, next: any) {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) return res.status(401).json({ error: "Login terlebih dahulu" });
  try {
    const payload = verifyToken(header.slice(7)) as any;
    if (payload.role !== "user") return res.status(403).json({ error: "Hanya pengguna yang bisa menggunakan wishlist" });
    req.userId = payload.id;
    next();
  } catch {
    return res.status(401).json({ error: "Token tidak valid" });
  }
}

function rowToItem(r: any) {
  return {
    id: r.item_id,
    type: r.item_type,
    name: r.item_name,
    image: r.item_image,
    location: r.item_location,
    category: r.item_category,
    savedAt: new Date(r.created_at).getTime(),
  };
}

/* GET /api/wishlist — get user's wishlist */
router.get("/wishlist", requireUser, async (req: any, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT item_type, item_id, item_name, item_image, item_location, item_category, created_at
       FROM user_wishlist WHERE user_id=$1 ORDER BY created_at DESC`,
      [req.userId]
    );
    res.json(rows.map(rowToItem));
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

/* GET /api/wishlist/count */
router.get("/wishlist/count", requireUser, async (req: any, res) => {
  try {
    const { rows } = await pool.query(
      "SELECT COUNT(*) FROM user_wishlist WHERE user_id=$1",
      [req.userId]
    );
    res.json({ count: parseInt(rows[0].count) });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

/* POST /api/wishlist — add item */
router.post("/wishlist", requireUser, async (req: any, res) => {
  const { id, type, name, image, location, category } = req.body;
  if (!id || !type || !name) return res.status(400).json({ error: "id, type, name wajib diisi" });
  try {
    await pool.query(
      `INSERT INTO user_wishlist (user_id, item_type, item_id, item_name, item_image, item_location, item_category)
       VALUES ($1,$2,$3,$4,$5,$6,$7)
       ON CONFLICT (user_id, item_type, item_id) DO NOTHING`,
      [req.userId, type, String(id), name, image ?? null, location ?? null, category ?? null]
    );
    res.status(201).json({ ok: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

/* DELETE /api/wishlist/:type/:id — remove item */
router.delete("/wishlist/:type/:id", requireUser, async (req: any, res) => {
  const { type, id } = req.params;
  try {
    await pool.query(
      "DELETE FROM user_wishlist WHERE user_id=$1 AND item_type=$2 AND item_id=$3",
      [req.userId, type, id]
    );
    res.json({ ok: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

/* POST /api/wishlist/sync — bulk import localStorage items after login */
router.post("/wishlist/sync", requireUser, async (req: any, res) => {
  const { items } = req.body;
  if (!Array.isArray(items)) return res.status(400).json({ error: "items must be an array" });
  try {
    for (const item of items) {
      const { id, type, name, image, location, category } = item;
      if (!id || !type || !name) continue;
      await pool.query(
        `INSERT INTO user_wishlist (user_id, item_type, item_id, item_name, item_image, item_location, item_category)
         VALUES ($1,$2,$3,$4,$5,$6,$7)
         ON CONFLICT (user_id, item_type, item_id) DO NOTHING`,
        [req.userId, type, String(id), name, image ?? null, location ?? null, category ?? null]
      );
    }
    res.json({ ok: true, synced: items.length });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
