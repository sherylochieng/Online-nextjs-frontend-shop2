import { Router } from "express";
import { query } from "../db.js";
import { asyncHandler } from "../asyncHandler.js";

export const productsRouter = Router();

productsRouter.get("/", asyncHandler(async (req, res) => {
  const { rows } = await query(
    `SELECT id, slug, name, price_cents, image_url, stock, category
     FROM products
     ORDER BY created_at DESC`
  );
  res.json({ products: rows });
}));