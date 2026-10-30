import { Router } from "express";
import multer from "multer";
import { createHash, randomUUID } from "crypto";
import { requireAuth } from "../middlewares/auth";
import { verifyToken } from "../lib/auth";
import pool from "../lib/db";
import { logger } from "../lib/logger";
import { IMAGE_UPLOAD_POLICY, processImageToWebp } from "../lib/media";

const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: { fileSize: IMAGE_UPLOAD_POLICY.maxInputBytes },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith("image/")) cb(null, true);
    else cb(new Error("Hanya file gambar yang diizinkan"));
  },
});

const uploadVideo = multer({
  storage,
  limits: { fileSize: 200 * 1024 * 1024 }, // 200 MB
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith("video/") || file.mimetype === "application/octet-stream") cb(null, true);
    else cb(new Error("Hanya file video yang diizinkan"));
  },
});

async function processAndStore(buffer: Buffer): Promise<string> {
  const webpBuffer = await processImageToWebp(buffer);

  // The processed bytes identify the photo. Re-uploading the same photo,
  // including from another source format, therefore resolves to one URL.
  const fingerprint = createHash("sha256").update(webpBuffer).digest("hex");
  const filename = `image-${fingerprint}.webp`;

  await pool.query(
    `INSERT INTO file_uploads (id, data, mime_type, size)
     VALUES ($1, $2, $3, $4)
     ON CONFLICT (id) DO NOTHING`,
    [filename, webpBuffer, "image/webp", webpBuffer.length]
  );

  logger.info({ filename, fingerprint, bytes: webpBuffer.length }, "Image stored in database");
  return `/api/uploads/${filename}`;
}

function requireUser(req: any, res: any, next: any) {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) return res.status(401).json({ error: "Login terlebih dahulu" });
  try {
    const payload = verifyToken(header.slice(7)) as any;
    if (payload.role !== "user") return res.status(403).json({ error: "Akses ditolak" });
    req.userId = payload.id;
    next();
  } catch {
    return res.status(401).json({ error: "Token tidak valid" });
  }
}

const router = Router();

router.post("/admin/upload-video", requireAuth, uploadVideo.single("file"), async (req: any, res: any) => {
  if (!req.file) return res.status(400).json({ error: "Tidak ada file yang diterima" });
  const buf: Buffer = req.file.buffer ?? Buffer.alloc(0);
  if (buf.length === 0) return res.status(400).json({ error: "File video kosong" });
  try {
    const ext = req.file.originalname.split(".").pop()?.toLowerCase() || "mp4";
    const filename = `${Date.now()}-${randomUUID()}.${ext}`;
    const mime = req.file.mimetype || "video/mp4";
    await pool.query(
      `INSERT INTO file_uploads (id, data, mime_type, size) VALUES ($1, $2, $3, $4)`,
      [filename, buf, mime, buf.length]
    );
    logger.info({ filename, bytes: buf.length }, "Video stored in database");
    res.json({ url: `/api/uploads/${filename}` });
  } catch (err: any) {
    logger.error({ err: err?.message }, "Video upload error");
    res.status(500).json({ error: "Gagal menyimpan video. Coba lagi." });
  }
});

router.post("/admin/upload", requireAuth, upload.single("file"), async (req: any, res: any) => {
  if (!req.file) return res.status(400).json({ error: "Tidak ada file yang diterima" });
  const buf: Buffer = req.file.buffer ?? Buffer.alloc(0);
  if (buf.length === 0) return res.status(400).json({ error: "File gambar kosong atau tidak valid" });
  try {
    const url = await processAndStore(buf);
    res.json({ url });
  } catch (err: any) {
    logger.error({ err: err?.message }, "Upload error");
    const message = err?.message?.includes("File gambar")
      ? err.message
      : "Gagal memproses gambar. Coba lagi.";
    res.status(400).json({ error: message });
  }
});

router.post("/upload", requireUser, upload.single("file"), async (req: any, res: any) => {
  if (!req.file) return res.status(400).json({ error: "Tidak ada file yang diterima" });
  const buf: Buffer = req.file.buffer ?? Buffer.alloc(0);
  if (buf.length === 0) return res.status(400).json({ error: "File gambar kosong atau tidak valid" });
  try {
    const url = await processAndStore(buf);
    res.json({ url });
  } catch (err: any) {
    logger.error({ err: err?.message }, "Upload error");
    const message = err?.message?.includes("File gambar")
      ? err.message
      : "Gagal memproses gambar. Coba lagi.";
    res.status(400).json({ error: message });
  }
});

export default router;
