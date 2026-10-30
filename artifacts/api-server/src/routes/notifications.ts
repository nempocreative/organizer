import { Router } from "express";
import pool from "../lib/db";
import { requireAuth } from "../middlewares/auth";

const router = Router();

router.get("/notifications", async (_req, res) => {
  const { rows } = await pool.query(
    "SELECT * FROM notifications WHERE active=true ORDER BY created_at DESC"
  );
  res.json(rows);
});

router.get("/admin/notifications", requireAuth, async (_req, res) => {
  const { rows } = await pool.query("SELECT * FROM notifications ORDER BY created_at DESC");
  res.json(rows);
});

router.post("/admin/notifications", requireAuth, async (req, res) => {
  const { title, message, type, active } = req.body;
  const { rows } = await pool.query(
    "INSERT INTO notifications (title, message, type, active) VALUES ($1,$2,$3,$4) RETURNING *",
    [title, message, type ?? "info", active ?? true]
  );
  res.status(201).json(rows[0]);
});

router.put("/admin/notifications/:id", requireAuth, async (req, res) => {
  const { title, message, type, active } = req.body;
  const { rows } = await pool.query(
    "UPDATE notifications SET title=$1, message=$2, type=$3, active=$4, updated_at=NOW() WHERE id=$5 RETURNING *",
    [title, message, type, active, req.params.id]
  );
  if (!rows[0]) return res.status(404).json({ error: "Not found" });
  res.json(rows[0]);
});

router.delete("/admin/notifications/:id", requireAuth, async (req, res) => {
  await pool.query("DELETE FROM notifications WHERE id=$1", [req.params.id]);
  res.json({ ok: true });
});

export default router;
