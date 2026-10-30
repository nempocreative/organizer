import { Router } from "express";
import pool from "../lib/db";
import { requireAuth } from "../middlewares/auth";

const router = Router();

router.post("/bpjs-registrations", async (req, res) => {
  const {
    match_no, jenis_peserta, nomor_identitas,
    nama_lengkap, tempat_lahir, tgl_lahir,
    handphone, email,
  } = req.body;

  if (!nama_lengkap || !jenis_peserta || !tempat_lahir || !tgl_lahir || !handphone) {
    return res.status(400).json({ error: "Field wajib belum lengkap" });
  }

  if (jenis_peserta === "dewasa" && !nomor_identitas) {
    return res.status(400).json({ error: "NIK wajib diisi untuk peserta dewasa" });
  }

  const { rows } = await pool.query(
    `INSERT INTO bpjs_registrations
      (match_no, jenis_peserta, nomor_identitas, nama_lengkap, tempat_lahir, tgl_lahir, handphone, email)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING id`,
    [
      match_no ? Number(match_no) : null,
      jenis_peserta,
      nomor_identitas || null,
      nama_lengkap,
      tempat_lahir,
      tgl_lahir,
      handphone,
      email || null,
    ]
  );
  res.status(201).json({ success: true, id: rows[0].id });
});

router.get("/admin/bpjs-registrations", requireAuth, async (_req, res) => {
  const { rows } = await pool.query(
    "SELECT * FROM bpjs_registrations ORDER BY created_at DESC"
  );
  res.json(rows);
});

router.delete("/admin/bpjs-registrations/:id", requireAuth, async (req, res) => {
  await pool.query("DELETE FROM bpjs_registrations WHERE id=$1", [req.params.id]);
  res.json({ success: true });
});

export default router;
