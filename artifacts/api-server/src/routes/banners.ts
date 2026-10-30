import { Router } from "express";
import pool from "../lib/db";
import { requireAuth } from "../middlewares/auth";
import { optimizeImageUrl } from "../lib/media";

const router = Router();

router.get("/banners", async (_req, res) => {
  const { rows } = await pool.query("SELECT * FROM banners WHERE active=true ORDER BY sort_order ASC");
  res.json(rows.map((row: any) => ({ ...row, image: optimizeImageUrl(row.image) ?? row.image })));
});

router.get("/admin/banners", requireAuth, async (_req, res) => {
  const { rows } = await pool.query("SELECT * FROM banners ORDER BY sort_order ASC");
  res.json(rows.map((row: any) => ({ ...row, image: optimizeImageUrl(row.image) ?? row.image })));
});

router.post("/admin/banners", requireAuth, async (req, res) => {
  const { title, link, image, sort_order, active } = req.body;
  const { rows } = await pool.query(
    "INSERT INTO banners (title, link, image, sort_order, active) VALUES ($1,$2,$3,$4,$5) RETURNING *",
    [title ?? "", link ?? "/", image ?? "", sort_order ?? 0, active ?? true]
  );
  res.status(201).json(rows[0]);
});

router.put("/admin/banners/:id", requireAuth, async (req, res) => {
  const { title, link, image, sort_order, active } = req.body;
  const { rows } = await pool.query(
    "UPDATE banners SET title=$1, link=$2, image=$3, sort_order=$4, active=$5, updated_at=NOW() WHERE id=$6 RETURNING *",
    [title, link, image, sort_order, active, req.params.id]
  );
  if (!rows[0]) return res.status(404).json({ error: "Not found" });
  res.json(rows[0]);
});

router.delete("/admin/banners/:id", requireAuth, async (req, res) => {
  await pool.query("DELETE FROM banners WHERE id=$1", [req.params.id]);
  res.json({ success: true });
});

export default router;
