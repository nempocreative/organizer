import { Router } from "express";
import pool from "../lib/db";

const router = Router();

router.get("/stats", async (_req, res) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    const [wisataRes, kulinerRes, cafeRes, eventsRes, visitorRes] = await Promise.all([
      client.query("SELECT COUNT(*)::int AS count FROM wisata WHERE active=true"),
      client.query("SELECT COUNT(*)::int AS count FROM kuliner WHERE active=true AND category IS DISTINCT FROM 'Cafe'"),
      client.query("SELECT COUNT(*)::int AS count FROM kuliner WHERE active=true AND category='Cafe'"),
      client.query("SELECT COUNT(*)::int AS count FROM events WHERE active=true"),
      client.query(
        "UPDATE site_settings SET value = (value::int + 1)::text, updated_at = NOW() WHERE key='visitor_count' RETURNING value::int AS count"
      ),
    ]);

    await client.query("COMMIT");

    res.json({
      destinasi: wisataRes.rows[0]?.count ?? 0,
      kuliner:   kulinerRes.rows[0]?.count ?? 0,
      cafe:      cafeRes.rows[0]?.count ?? 0,
      events:    eventsRes.rows[0]?.count ?? 0,
      visitors:  visitorRes.rows[0]?.count ?? 10000,
    });
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
});

export default router;
