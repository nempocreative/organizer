import { Router } from "express";
import pool from "../lib/db";
import { requireAuth } from "../middlewares/auth";

const router = Router();

router.get("/kamus-sunda", async (_req, res) => {
  const { rows } = await pool.query("SELECT * FROM kamus_sunda WHERE active=true ORDER BY sunda ASC");
  res.json(rows);
});

router.get("/admin/kamus-sunda", requireAuth, async (_req, res) => {
  const { rows } = await pool.query("SELECT * FROM kamus_sunda ORDER BY id ASC");
  res.json(rows);
});

router.post("/admin/kamus-sunda", requireAuth, async (req, res) => {
  const { sunda, indonesia, latin, category, level, example, active } = req.body;
  const { rows } = await pool.query(
    "INSERT INTO kamus_sunda (sunda, indonesia, latin, category, level, example, active) VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *",
    [sunda, indonesia, latin, category ?? "Umum", level ?? "dasar", example, active ?? true]
  );
  res.status(201).json(rows[0]);
});

router.put("/admin/kamus-sunda/:id", requireAuth, async (req, res) => {
  const { sunda, indonesia, latin, category, level, example, active } = req.body;
  const { rows } = await pool.query(
    "UPDATE kamus_sunda SET sunda=$1, indonesia=$2, latin=$3, category=$4, level=$5, example=$6, active=$7, updated_at=NOW() WHERE id=$8 RETURNING *",
    [sunda, indonesia, latin, category, level, example, active, req.params.id]
  );
  if (!rows[0]) return res.status(404).json({ error: "Not found" });
  res.json(rows[0]);
});

router.delete("/admin/kamus-sunda/:id", requireAuth, async (req, res) => {
  await pool.query("DELETE FROM kamus_sunda WHERE id=$1", [req.params.id]);
  res.json({ success: true });
});

export default router;
