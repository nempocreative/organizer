import { Router } from "express";
import bcrypt from "bcryptjs";
import pool from "../lib/db";
import { signToken } from "../lib/auth";

const router = Router();

router.post("/admin/auth/login", async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    res.status(400).json({ error: "Missing fields" });
    return;
  }
  const { rows } = await pool.query("SELECT * FROM admin_users WHERE username = $1", [username]);
  const user = rows[0];
  if (!user) {
    res.status(401).json({ error: "Invalid credentials" });
    return;
  }
  const valid = await bcrypt.compare(password, user.password_hash);
  if (!valid) {
    res.status(401).json({ error: "Invalid credentials" });
    return;
  }
  const token = signToken({ id: user.id, username: user.username });
  res.json({ token, username: user.username });
});

export default router;
