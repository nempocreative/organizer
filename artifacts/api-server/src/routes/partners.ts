import { Router } from "express";
import pool from "../lib/db";
import { requireAuth } from "../middlewares/auth";

const router = Router();

router.get("/partners", async (_req, res) => {
  const { rows } = await pool.query("SELECT * FROM partners WHERE active=true ORDER BY sort_order ASC");
  res.json(rows);
});

router.get("/admin/partners", requireAuth, async (_req, res) => {
  const { rows } = await pool.query("SELECT * FROM partners ORDER BY sort_order ASC");
  res.json(rows);
});

router.post("/admin/partners", requireAuth, async (req, res) => {
  const { name, color, sort_order, active } = req.body;
  const { rows } = await pool.query(
    "INSERT INTO partners (name, color, sort_order, active) VALUES ($1,$2,$3,$4) RETURNING *",
    [name ?? "", color ?? "#0194f3", sort_order ?? 0, active ?? true]
  );
  res.status(201).json(rows[0]);
});

router.put("/admin/partners/:id", requireAuth, async (req, res) => {
  const { name, color, sort_order, active } = req.body;
  const { rows } = await pool.query(
    "UPDATE partners SET name=$1, color=$2, sort_order=$3, active=$4, updated_at=NOW() WHERE id=$5 RETURNING *",
    [name, color, sort_order, active, req.params.id]
  );
  if (!rows[0]) return res.status(404).json({ error: "Not found" });
  res.json(rows[0]);
});

router.delete("/admin/partners/:id", requireAuth, async (req, res) => {
  await pool.query("DELETE FROM partners WHERE id=$1", [req.params.id]);
  res.json({ success: true });
});

export default router;
