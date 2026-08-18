import { Router } from "express";
import { query } from "../db.js";
import { asyncHandler } from "../asyncHandler.js";

export const myOrdersRouter = Router();

// Public — customers look up their own orders by the phone number
// they checked out with. No authentication required.
myOrdersRouter.get("/", asyncHandler(async (req, res) => {
  const phone = req.query.phone?.trim();
  if (!phone) return res.status(400).json({ error: "Missing phone" });

  const { rows } = await query(
    `SELECT paystack_reference, status, total_cents, created_at
     FROM orders
     WHERE customer_phone = $1
     ORDER BY created_at DESC`,
    [phone]
  );

  res.json({ orders: rows });
}));