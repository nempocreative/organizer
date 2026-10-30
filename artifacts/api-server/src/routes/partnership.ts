import { Router } from "express";
import pool from "../lib/db";
import { requireAuth } from "../middlewares/auth";

const router = Router();

let tableReady: Promise<void> | null = null;

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function hasStringFields(value: unknown, fields: string[]): boolean {
  return isRecord(value) && fields.every(field => typeof value[field] === "string");
}

function validateContent(content: unknown): string | null {
  if (!isRecord(content)) return "Konten harus berupa object";
  if (!hasStringFields(content.hero, ["eyebrow", "titleLine1", "titleLine2", "description", "primaryLabel", "primaryHref", "secondaryLabel", "secondaryHref"])) {
    return "Struktur hero tidak valid";
  }
  if (!hasStringFields(content.cta, ["eyebrow", "titleLine1", "titleLine2", "description", "buttonLabel", "emailText"])) {
    return "Struktur CTA tidak valid";
  }
  if (!Array.isArray(content.heroImages) || content.heroImages.some(item => typeof item !== "string")) {
    return "Daftar foto hero tidak valid";
  }
  if (!Array.isArray(content.heroStats) || content.heroStats.some(item => !hasStringFields(item, ["value", "label"]))) {
    return "Statistik hero tidak valid";
  }

  const listSchemas: Record<string, string[]> = {
    themes: ["title", "desc", "color"],
    collabSteps: ["no", "title", "desc", "color"],
    collaborationModels: ["label", "title", "desc", "note"],
    whyUs: ["title", "desc"],
    portfolio: ["title", "category", "location", "image", "services", "result"],
    services: ["no", "title"],
    socialPackages: ["name", "price"],
    websitePackages: ["name"],
    packageCards: ["name", "originalPrice", "price"],
    features: ["title", "desc"],
  };
  for (const [key, fields] of Object.entries(listSchemas)) {
    if (!Array.isArray(content[key]) || content[key].some(item => !hasStringFields(item, fields))) {
      return `Struktur ${key} tidak valid`;
    }
  }
  if (
    !Array.isArray(content.partnershipAreas) ||
    content.partnershipAreas.length === 0 ||
    content.partnershipAreas.some(item =>
      !hasStringFields(item, ["id", "no", "title", "description"]) ||
      !Array.isArray((item as Record<string, unknown>).offerings) ||
      ((item as Record<string, unknown>).offerings as unknown[]).length === 0 ||
      ((item as Record<string, unknown>).offerings as unknown[]).some(entry => typeof entry !== "string" || !entry.trim()),
    )
  ) {
    return "Struktur bidang kerja sama tidak valid";
  }
  if ((content.services as unknown[]).some(item => !Array.isArray((item as Record<string, unknown>).items) || ((item as Record<string, unknown>).items as unknown[]).some(entry => typeof entry !== "string"))) {
    return "Daftar item layanan tidak valid";
  }
  if ((content.collaborationModels as unknown[]).some(item => !Array.isArray((item as Record<string, unknown>).points) || ((item as Record<string, unknown>).points as unknown[]).some(entry => typeof entry !== "string"))) {
    return "Poin sistem kerja sama tidak valid";
  }
  if ((content.socialPackages as unknown[]).some(item => !Array.isArray((item as Record<string, unknown>).features) || ((item as Record<string, unknown>).features as unknown[]).some(entry => typeof entry !== "string"))) {
    return "Fitur paket social media tidak valid";
  }
  if ((content.websitePackages as unknown[]).some(item =>
    !Array.isArray((item as Record<string, unknown>).features) ||
    ((item as Record<string, unknown>).features as unknown[]).some(entry => typeof entry !== "string") ||
    !Array.isArray((item as Record<string, unknown>).prices) ||
    ((item as Record<string, unknown>).prices as unknown[]).some(price => !hasStringFields(price, ["duration", "price"]))
  )) {
    return "Struktur paket website tidak valid";
  }
  if (!isRecord(content.hero) || !Array.isArray(content.hero.bottomItems) || content.hero.bottomItems.some(item => typeof item !== "string")) {
    return "Daftar informasi hero tidak valid";
  }
  return null;
}

function ensureTable(): Promise<void> {
  if (!tableReady) {
    tableReady = pool.query(`
      CREATE TABLE IF NOT EXISTS partnership_page (
        id          INTEGER PRIMARY KEY DEFAULT 1 CHECK (id = 1),
        content     JSONB NOT NULL DEFAULT '{}'::jsonb,
        created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `).then(() => undefined);
  }
  return tableReady;
}

void ensureTable().catch(() => {});

router.get("/partnership", async (_req, res) => {
  await ensureTable();
  const { rows } = await pool.query("SELECT content, updated_at FROM partnership_page WHERE id = 1");
  res.json({ content: rows[0]?.content ?? {}, updated_at: rows[0]?.updated_at ?? null });
});

router.get("/admin/partnership", requireAuth, async (_req, res) => {
  await ensureTable();
  const { rows } = await pool.query("SELECT content, updated_at FROM partnership_page WHERE id = 1");
  res.json({ content: rows[0]?.content ?? {}, updated_at: rows[0]?.updated_at ?? null });
});

router.put("/admin/partnership", requireAuth, async (req, res) => {
  await ensureTable();
  const content = req.body?.content;
  const validationError = validateContent(content);
  if (validationError) {
    res.status(400).json({ error: validationError });
    return;
  }

  const { rows } = await pool.query(
    `INSERT INTO partnership_page (id, content, updated_at)
     VALUES (1, $1::jsonb, NOW())
     ON CONFLICT (id) DO UPDATE SET content = EXCLUDED.content, updated_at = NOW()
     RETURNING content, updated_at`,
    [JSON.stringify(content)],
  );
  res.json(rows[0]);
});

export default router;