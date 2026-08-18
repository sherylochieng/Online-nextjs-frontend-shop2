import "dotenv/config";
import express from "express";
import cors from "cors";
import { productsRouter } from "./routes/products.js";
import { cartRouter } from "./routes/cart.js";
import { checkoutRouter } from "./routes/checkout.js";
import { paystackRouter } from "./routes/paystack.js";
import { ordersRouter } from "./routes/orders.js";

// CRITICAL: webhook must get the raw Buffer BEFORE express.json() parses anything —
// the HMAC signature check needs the exact original bytes.
const app = express();

app.use(cors({ origin: process.env.SHOP_URL, credentials: true }));

// CRITICAL: The webhook route must be registered BEFORE express.json().
// express.raw() gives us the raw Buffer for HMAC signature verification.
// Once express.json() runs, the original bytes are gone.
app.post(
  "/api/paystack/webhook",
  express.raw({ type: "application/json" })
);
app.use("/api/paystack", paystackRouter);



// All other routes get the JSON body parser
app.use(express.json());
app.use("/api/products", productsRouter);
app.use("/api/cart", cartRouter);
app.use("/api/checkout", checkoutRouter);
app.use("/api/orders", ordersRouter);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: err.message || "Internal server error" });
});

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Shop API listening on http://localhost:${port}`);
});