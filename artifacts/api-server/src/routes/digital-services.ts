import { Router } from "express";
import pool from "../lib/db";
import { requireAuth } from "../middlewares/auth";
import { signToken, verifyToken } from "../lib/auth";

const router = Router();
const DIGITAL_DEMO_PASSWORD = "nemposukses";
const INVITATION_PREVIEW_COOKIE = "nempo_invitation_preview";
const DIGITAL_PREVIEW_COOKIE = "nempo_digital_preview";

function getCookieValue(cookieHeader: string | undefined, name: string): string | null {
  const cookie = cookieHeader
    ?.split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${name}=`));
  return cookie ? decodeURIComponent(cookie.slice(name.length + 1)) : null;
}

router.get("/digital-services/invitation/session", (req, res) => {
  const token = getCookieValue(req.headers.cookie, INVITATION_PREVIEW_COOKIE);
  if (!token) {
    res.status(401).json({ authenticated: false });
    return;
  }

  try {
    const payload = verifyToken(token);
    if (payload?.scope !== "invitation-preview") throw new Error("Invalid preview scope");
    res.json({ authenticated: true });
  } catch {
    res.status(401).json({ authenticated: false });
  }
});

router.post("/digital-services/invitation/unlock", (req, res) => {
  const password = typeof req.body?.password === "string" ? req.body.password : "";
  if (!password || password.length > 128 || password !== DIGITAL_DEMO_PASSWORD) {
    res.status(401).json({ error: "Password salah." });
    return;
  }

  res.cookie(INVITATION_PREVIEW_COOKIE, signToken({ scope: "invitation-preview" }), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: "/",
  });
  res.json({ authenticated: true });
});

router.get("/digital-services/preview/session", (req, res) => {
  const token = getCookieValue(req.headers.cookie, DIGITAL_PREVIEW_COOKIE);
  if (!token) {
    res.status(401).json({ authenticated: false });
    return;
  }

  try {
    const payload = verifyToken(token);
    if (payload?.scope !== "digital-preview") throw new Error("Invalid preview scope");
    res.json({ authenticated: true });
  } catch {
    res.status(401).json({ authenticated: false });
  }
});

router.post("/digital-services/preview/unlock", (req, res) => {
  const password = typeof req.body?.password === "string" ? req.body.password : "";
  if (!password || password.length > 128 || password !== DIGITAL_DEMO_PASSWORD) {
    res.status(401).json({ error: "Password salah." });
    return;
  }

  res.cookie(DIGITAL_PREVIEW_COOKIE, signToken({ scope: "digital-preview" }), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: "/",
  });
  res.json({ authenticated: true });
});

router.get("/digital-services", async (_req, res) => {
  const { rows } = await pool.query(`
    SELECT *
    FROM (
      SELECT DISTINCT ON (LOWER(TRIM(title)), LOWER(TRIM(category))) *
      FROM digital_services
      WHERE active=true
      ORDER BY LOWER(TRIM(title)), LOWER(TRIM(category)), featured DESC, id ASC
    ) unique_services
    ORDER BY featured DESC, id ASC
  `);
  res.json(rows);
});

router.get("/admin/digital-services", requireAuth, async (_req, res) => {
  const { rows } = await pool.query("SELECT * FROM digital_services ORDER BY id ASC");
  res.json(rows);
});

router.post("/admin/digital-services", requireAuth, async (req, res) => {
  const { title, description, price, category, image, whatsapp, featured, active } = req.body;
  const { rows } = await pool.query(
    "INSERT INTO digital_services (title, description, price, category, image, whatsapp, featured, active) VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *",
    [title, description, price, category ?? "Website", image, whatsapp, featured ?? false, active ?? true]
  );
  res.status(201).json(rows[0]);
});

router.put("/admin/digital-services/:id", requireAuth, async (req, res) => {
  const { title, description, price, category, image, whatsapp, featured, active } = req.body;
  const { rows } = await pool.query(
    "UPDATE digital_services SET title=$1, description=$2, price=$3, category=$4, image=$5, whatsapp=$6, featured=$7, active=$8, updated_at=NOW() WHERE id=$9 RETURNING *",
    [title, description, price, category, image, whatsapp, featured, active, req.params.id]
  );
  if (!rows[0]) return res.status(404).json({ error: "Not found" });
  res.json(rows[0]);
});

router.delete("/admin/digital-services/:id", requireAuth, async (req, res) => {
  await pool.query("DELETE FROM digital_services WHERE id=$1", [req.params.id]);
  res.json({ success: true });
});

export default router;
