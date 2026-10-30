import { Router } from "express";
import pool from "../lib/db";
import { requireAuth } from "../middlewares/auth";

const router = Router();

/* ── Public: expose only safe, non-sensitive site settings ── */
const PUBLIC_SETTING_KEYS = [
  "contact_phone", "site_name", "site_tagline", "contact_email", "social_instagram", "social_facebook",
  "jajan_yuk_manual_whatsapp", "jajan_yuk_manual_bank_name",
  "jajan_yuk_manual_bank_account_no", "jajan_yuk_manual_bank_account_name",
  "jajan_yuk_manual_qris_image",
];

router.get("/server-location", async (_req, res) => {
  const configuredEnvironmentCity = process.env.NEMPO_SERVER_CITY?.trim();
  if (configuredEnvironmentCity) {
    res.json({ city: configuredEnvironmentCity, source: "server" });
    return;
  }

  try {
    const { rows } = await pool.query(
      "SELECT value FROM site_settings WHERE key = 'server_city' LIMIT 1",
    );
    const configuredDatabaseCity = typeof rows[0]?.value === "string"
      ? rows[0].value.trim()
      : "";

    res.json({
      city: configuredDatabaseCity || "Garut",
      source: configuredDatabaseCity ? "server-settings" : "server-default",
    });
  } catch {
    res.json({ city: "Garut", source: "server-default" });
  }
});

router.get("/settings/public", async (_req, res) => {
  const { rows } = await pool.query(
    `SELECT key, value FROM site_settings WHERE key = ANY($1)`,
    [PUBLIC_SETTING_KEYS]
  );
  const settings: Record<string, string> = {};
  rows.forEach(r => { settings[r.key] = r.value; });
  res.json(settings);
});

router.get("/admin/settings", requireAuth, async (req, res) => {
  const { rows } = await pool.query("SELECT key, value FROM site_settings ORDER BY key");
  const settings: Record<string, string> = {};
  rows.forEach(r => { settings[r.key] = r.value; });
  res.json(settings);
});

router.put("/admin/settings", requireAuth, async (req, res) => {
  const entries = Object.entries(req.body);
  for (const [key, value] of entries) {
    await pool.query(
      "INSERT INTO site_settings (key, value, updated_at) VALUES ($1,$2,NOW()) ON CONFLICT (key) DO UPDATE SET value=$2, updated_at=NOW()",
      [key, value]
    );
  }
  res.json({ success: true });
});

router.get("/admin/stats", requireAuth, async (_req, res) => {
  const [wisata, kuliner, cafe, penginapan, events, berita, vouchers, perlombaan, kamusSunda, transportasi, priceList, digitalServices] = await Promise.all([
    pool.query("SELECT COUNT(*) FROM wisata"),
    pool.query("SELECT COUNT(*) FROM kuliner WHERE category IS DISTINCT FROM 'Cafe'"),
    pool.query("SELECT COUNT(*) FROM kuliner WHERE category = 'Cafe'"),
    pool.query("SELECT COUNT(*) FROM penginapan"),
    pool.query("SELECT COUNT(*) FROM events"),
    pool.query("SELECT COUNT(*) FROM berita"),
    pool.query("SELECT COUNT(*) FROM vouchers"),
    pool.query("SELECT COUNT(*) FROM perlombaan"),
    pool.query("SELECT COUNT(*) FROM kamus_sunda"),
    pool.query("SELECT COUNT(*) FROM transportasi"),
    pool.query("SELECT COUNT(*) FROM price_list"),
    pool.query("SELECT COUNT(*) FROM digital_services"),
  ]);
  res.json({
    wisata: parseInt(wisata.rows[0].count),
    kuliner: parseInt(kuliner.rows[0].count),
    cafe: parseInt(cafe.rows[0].count),
    penginapan: parseInt(penginapan.rows[0].count),
    events: parseInt(events.rows[0].count),
    berita: parseInt(berita.rows[0].count),
    vouchers: parseInt(vouchers.rows[0].count),
    perlombaan: parseInt(perlombaan.rows[0].count),
    kamusSunda: parseInt(kamusSunda.rows[0].count),
    transportasi: parseInt(transportasi.rows[0].count),
    priceList: parseInt(priceList.rows[0].count),
    digitalServices: parseInt(digitalServices.rows[0].count),
  });
});

export default router;
