import path from "path";
import express, { type Express, type Request, type Response } from "express";
import cors from "cors";
import pinoHttp from "pino-http";
import router from "./routes";
import { logger } from "./lib/logger";
import pool from "./lib/db";
import { processImageToWebp } from "./lib/media";

const app: Express = express();

app.use(
  pinoHttp({
    logger,
    serializers: {
      req(req) {
        return {
          id: req.id,
          method: req.method,
          url: req.url?.split("?")[0],
        };
      },
      res(res) {
        return {
          statusCode: res.statusCode,
        };
      },
    },
  }),
);
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Pastikan semua response /api tidak pernah di-cache oleh browser/CDN
app.use("/api", (_req: Request, res: Response, next) => {
  res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
  res.setHeader("Pragma", "no-cache");
  res.setHeader("Expires", "0");
  next();
});

// Serve uploaded images from PostgreSQL database (works across all environments)
app.get("/api/uploads/:filename", async (req: Request, res: Response) => {
  const { filename } = req.params;
  try {
    const result = await pool.query(
      "SELECT data, mime_type FROM file_uploads WHERE id = $1",
      [filename]
    );
    if (result.rows.length === 0) {
      res.status(404).json({ error: "File tidak ditemukan" });
      return;
    }
    let { data, mime_type } = result.rows[0];
    const isLegacyImage = typeof mime_type === "string"
      && mime_type.startsWith("image/")
      && mime_type !== "image/webp";
    if (isLegacyImage) {
      try {
        const webpData = await processImageToWebp(Buffer.from(data));
        await pool.query(
          "UPDATE file_uploads SET data=$1, mime_type='image/webp', size=$2 WHERE id=$3",
          [webpData, webpData.length, filename],
        );
        data = webpData;
        mime_type = "image/webp";
      } catch (conversionError: any) {
        logger.warn({ filename, err: conversionError?.message }, "Legacy image could not be converted; serving original");
      }
    }
    res.setHeader("Content-Type", mime_type || "image/webp");
    res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
    res.send(data);
  } catch (err: any) {
    logger.error({ err: err?.message, filename }, "Error serving uploaded file");
    res.status(500).json({ error: "Gagal mengambil gambar" });
  }
});

app.use("/api", router);

// ── Produksi: serve built frontend & admin panel ──
if (process.env.NODE_ENV === "production") {
  const root = process.cwd(); // artifacts/api-server/
  const frontendDist = path.resolve(root, "../nempo-garut/dist/public");
  const adminDist    = path.resolve(root, "../admin-panel/dist/public");

  // Admin panel — static assets (prefix /admin-panel/ stripped automatically)
  app.use("/admin-panel", express.static(adminDist));
  // Admin panel — SPA fallback
  app.use("/admin-panel", (_req: Request, res: Response) => {
    res.sendFile(path.join(adminDist, "index.html"));
  });

  // Frontend — static assets
  app.use(express.static(frontendDist));
  // Frontend — SPA fallback (catch-all)
  app.use((_req: Request, res: Response) => {
    res.sendFile(path.join(frontendDist, "index.html"));
  });
}

export default app;
