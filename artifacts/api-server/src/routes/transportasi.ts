import { Router } from "express";
import pool from "../lib/db";
import { requireAuth } from "../middlewares/auth";

const router = Router();

router.get("/transportasi", async (_req, res) => {
  const { rows } = await pool.query("SELECT * FROM transportasi WHERE active=true ORDER BY id ASC");
  res.json(rows);
});

router.get("/admin/transportasi", requireAuth, async (_req, res) => {
  const { rows } = await pool.query("SELECT * FROM transportasi ORDER BY id ASC");
  res.json(rows);
});

router.post("/admin/transportasi", requireAuth, async (req, res) => {
  const { name, type, kode, asal, tujuan, via, tarif, jam, frekuensi, description, active } = req.body;
  const { rows } = await pool.query(
    "INSERT INTO transportasi (name, type, kode, asal, tujuan, via, tarif, jam, frekuensi, description, active) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) RETURNING *",
    [name, type ?? "Angkot", kode, asal, tujuan, via, tarif ?? 0, jam, frekuensi, description, active ?? true]
  );
  res.status(201).json(rows[0]);
});

router.put("/admin/transportasi/:id", requireAuth, async (req, res) => {
  const { name, type, kode, asal, tujuan, via, tarif, jam, frekuensi, description, active } = req.body;
  const { rows } = await pool.query(
    "UPDATE transportasi SET name=$1, type=$2, kode=$3, asal=$4, tujuan=$5, via=$6, tarif=$7, jam=$8, frekuensi=$9, description=$10, active=$11, updated_at=NOW() WHERE id=$12 RETURNING *",
    [name, type, kode, asal, tujuan, via, tarif, jam, frekuensi, description, active, req.params.id]
  );
  if (!rows[0]) return res.status(404).json({ error: "Not found" });
  res.json(rows[0]);
});

router.delete("/admin/transportasi/:id", requireAuth, async (req, res) => {
  await pool.query("DELETE FROM transportasi WHERE id=$1", [req.params.id]);
  res.json({ success: true });
});

export default router;
