import { Router } from "express";
import pool from "../lib/db";
import { requireAuth } from "../middlewares/auth";

const router = Router();

router.get("/price-list", async (_req, res) => {
  const { rows } = await pool.query("SELECT * FROM price_list WHERE active=true ORDER BY sort_order ASC, id ASC");
  res.json(rows);
});

router.get("/admin/price-list", requireAuth, async (_req, res) => {
  const { rows } = await pool.query("SELECT * FROM price_list ORDER BY sort_order ASC, id ASC");
  res.json(rows);
});

router.post("/admin/price-list", requireAuth, async (req, res) => {
  const { item, price, category, description, sort_order, active } = req.body;
  const { rows } = await pool.query(
    "INSERT INTO price_list (item, price, category, description, sort_order, active) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *",
    [item, price, category ?? "Umum", description, sort_order ?? 0, active ?? true]
  );
  res.status(201).json(rows[0]);
});

router.put("/admin/price-list/:id", requireAuth, async (req, res) => {
  const { item, price, category, description, sort_order, active } = req.body;
  const { rows } = await pool.query(
    "UPDATE price_list SET item=$1, price=$2, category=$3, description=$4, sort_order=$5, active=$6, updated_at=NOW() WHERE id=$7 RETURNING *",
    [item, price, category, description, sort_order, active, req.params.id]
  );
  if (!rows[0]) return res.status(404).json({ error: "Not found" });
  res.json(rows[0]);
});

router.delete("/admin/price-list/:id", requireAuth, async (req, res) => {
  await pool.query("DELETE FROM price_list WHERE id=$1", [req.params.id]);
  res.json({ success: true });
});

export default router;
