import { Router } from "express";
import QRCode from "qrcode";

const router = Router();

/* ── GET /qr?data=... — generate QR code PNG (no auth needed) ── */
router.get("/qr", async (req: any, res: any) => {
  const data = (req.query.data as string || "").trim();
  if (!data) return res.status(400).json({ error: "data param required" });

  try {
    const buf = await QRCode.toBuffer(data, {
      type: "png",
      width: 300,
      margin: 2,
      color: { dark: "#0f172a", light: "#ffffff" },
    });
    res.set("Content-Type", "image/png");
    res.set("Cache-Control", "public, max-age=86400");
    res.send(buf);
  } catch {
    res.status(500).json({ error: "Gagal generate QR" });
  }
});

export default router;
