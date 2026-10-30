import { Router } from "express";
import pool from "../lib/db";
import { requireAuth } from "../middlewares/auth";
import { optimizeImageUrl } from "../lib/media";

const router = Router();

router.get("/promo-banners", async (_req, res) => {
  const { rows } = await pool.query("SELECT * FROM promo_banners WHERE active=true ORDER BY sort_order ASC");
  res.json(rows.map((row: any) => ({ ...row, image: optimizeImageUrl(row.image) ?? row.image })));
});

router.get("/admin/promo-banners", requireAuth, async (_req, res) => {
  const { rows } = await pool.query("SELECT * FROM promo_banners ORDER BY sort_order ASC");
  res.json(rows.map((row: any) => ({ ...row, image: optimizeImageUrl(row.image) ?? row.image })));
});

router.post("/admin/promo-banners", requireAuth, async (req, res) => {
  const { image, link, sort_order, active } = req.body;
  const { rows } = await pool.query(
    "INSERT INTO promo_banners (image, link, sort_order, active) VALUES ($1,$2,$3,$4) RETURNING *",
    [image ?? "", link ?? "/", sort_order ?? 0, active ?? true]
  );
  res.status(201).json(rows[0]);
});

router.put("/admin/promo-banners/:id", requireAuth, async (req, res) => {
  const { image, link, sort_order, active } = req.body;
  const { rows } = await pool.query(
    "UPDATE promo_banners SET image=$1, link=$2, sort_order=$3, active=$4, updated_at=NOW() WHERE id=$5 RETURNING *",
    [image, link, sort_order, active, req.params.id]
  );
  if (!rows[0]) return res.status(404).json({ error: "Not found" });
  res.json(rows[0]);
});

router.delete("/admin/promo-banners/:id", requireAuth, async (req, res) => {
  await pool.query("DELETE FROM promo_banners WHERE id=$1", [req.params.id]);
  res.json({ success: true });
});

export default router;
