import { Router } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { query } from "../db.js";
import { asyncHandler } from "../asyncHandler.js";
import { requireAdmin } from "../requireAdmin.js";


export const adminAuthRouter = Router();

adminAuthRouter.post("/login", asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  const { rows } = await query(
    "SELECT id, password_hash FROM admin_users WHERE email = $1",
    [email]
  );
  const admin = rows[0];

  if (!admin) {
    return res.status(401).json({ error: "Invalid email or password" });
  }

  const passwordMatches = await bcrypt.compare(password, admin.password_hash);
  if (!passwordMatches) {
    return res.status(401).json({ error: "Invalid email or password" });
  }

  const token = jwt.sign(
    { adminId: admin.id },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  res.json({ token });
}));

//add
adminAuthRouter.get("/orders", requireAdmin, asyncHandler(async (req, res) => {
  const { rows } = await query(
    `SELECT id, paystack_reference, customer_name, total_cents, status, created_at
     FROM orders
     ORDER BY created_at DESC`
  );
  res.json({ orders: rows });
}));