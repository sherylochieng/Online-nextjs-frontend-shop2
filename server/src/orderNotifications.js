// import { query } from "./db.js";
// import { sendText } from "./whatsapp.js";

// // Meta's Graph API wants digits only — no "+", no spaces.
// // Customer phone is stored however they typed it at checkout (e.g. "+254 712 345 678"),
// // so strip everything except digits before sending.
// function toMetaFormat(phone) {
//   return phone.replace(/\D/g, "");
// }

// export async function sendOrderConfirmation(orderId) {
//   const { rows: orderRows } = await query(
//     `SELECT id, paystack_reference, customer_name, customer_phone, total_cents
//      FROM orders WHERE id = $1`,
//     [orderId]
//   );
//   const order = orderRows[0];
//   if (!order) throw new Error("Order not found");

//   if (!order.customer_phone) {
//     console.warn(`No phone number on order ${orderId} — skipping WhatsApp confirmation`);
//     return;
//   }

//   const { rows: items } = await query(
//     `SELECT oi.quantity, p.name
//      FROM order_items oi
//      JOIN products p ON p.id = oi.product_id
//      WHERE oi.order_id = $1`,
//     [orderId]
//   );

//   const itemsText = items.map((i) => `${i.quantity}x ${i.name}`).join(", ");
//   const totalKsh = (order.total_cents / 100).toLocaleString();
//   const firstName = order.customer_name.split(" ")[0];
//   const shortRef = order.paystack_reference.slice(0, 14).toUpperCase();

//   const body = `Asante ${firstName}! Your order ${shortRef} has been confirmed.

// Total: KSh ${totalKsh}
// Items: ${itemsText}

// We'll notify you here when your order ships. Reply to this message if you have any questions.`;

//   await sendText(toMetaFormat(order.customer_phone), body);


  
// const formattedPhone = toMetaFormat(order.customer_phone);
// console.log("Sending WhatsApp to:", formattedPhone);
// await sendText(formattedPhone, body);
// }

import { query } from "./db.js";
import { sendTemplate } from "./whatsapp.js";

// Meta's Graph API wants digits only — no "+", no spaces.
// Customer phone is stored however they typed it at checkout (e.g. "+254 712 345 678"),
// so strip everything except digits before sending.
function toMetaFormat(phone) {
  return phone.replace(/\D/g, "");
}

export async function sendOrderConfirmation(orderId) {
  const { rows: orderRows } = await query(
    `SELECT id, paystack_reference, customer_name, customer_phone, total_cents
     FROM orders WHERE id = $1`,
    [orderId]
  );
  const order = orderRows[0];
  if (!order) throw new Error("Order not found");

  if (!order.customer_phone) {
    console.warn(`No phone number on order ${orderId} — skipping WhatsApp confirmation`);
    return;
  }

  const { rows: items } = await query(
    `SELECT oi.quantity, p.name
     FROM order_items oi
     JOIN products p ON p.id = oi.product_id
     WHERE oi.order_id = $1`,
    [orderId]
  );

  const itemsText = items.map((i) => `${i.quantity}x ${i.name}`).join(", ");
  const totalKsh = (order.total_cents / 100).toLocaleString();
  const firstName = order.customer_name.split(" ")[0];
  const shortRef = order.paystack_reference.slice(0, 14).toUpperCase();

  const formattedPhone = toMetaFormat(order.customer_phone);
  await sendTemplate(formattedPhone, "order_confirmation", [
    firstName,
    shortRef,
    totalKsh,
    itemsText,
  ]);
}
