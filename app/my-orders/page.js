import Link from "next/link";
import { apiFetch } from "@/lib/api";

export const metadata = { title: "My Orders" };

export default async function MyOrdersPage({ searchParams }) {
//     const params = await searchParams;//added 
//   const phone = searchParams.phone?.trim() || "";

const params = await searchParams;
const phone = params.phone?.trim() || "";
  let orders = [];
  let error = null;

  if (phone) {
    try {
      ({ orders } = await apiFetch(
        `/api/my-orders?phone=${encodeURIComponent(phone)}`
      ));
    } catch (err) {
      error = err.message;
    }
  }

  return (
    <main style={{ maxWidth: 560, margin: "0 auto", padding: "2rem" }}>
      <h1>My Orders</h1>
      <p style={{ color: "#555", marginTop: "0.25rem", marginBottom: "1.5rem" }}>
        Enter the phone number you used at checkout to find your orders.
      </p>

      {/* Pure HTML form — works without JavaScript */}
      <form action="/my-orders" method="GET">
        <div style={{ display: "flex", gap: "0.5rem" }}>
          <input
            type="tel"
            name="phone"
            defaultValue={phone}
            placeholder="+254 7XX XXX XXX"
            style={{
              flex: 1,
              padding: "0.6rem",
              border: "1px solid #ddd",
              borderRadius: 4,
              fontSize: "1rem",
            }}
          />
          <button
            type="submit"
            style={{
              background: "#000",
              color: "#fff",
              padding: "0.6rem 1.2rem",
              borderRadius: 4,
              border: "none",
              cursor: "pointer",
              fontWeight: 500,
            }}
          >
            Search
          </button>
        </div>
      </form>

      {phone && (
        <div style={{ marginTop: "1.5rem" }}>
          {error ? (
            <p style={{ color: "crimson" }}>Could not load orders. Please try again.</p>
          ) : orders.length === 0 ? (
            <p style={{ color: "#666" }}>
              No orders found for <strong>{phone}</strong>.
            </p>
          ) : (
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              {orders.map((o) => (
                <li
                  key={o.paystack_reference}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "0.75rem 0",
                    borderBottom: "1px solid #eee",
                  }}
                >
                  <Link
                    href={`/orders/${o.paystack_reference}`}
                    style={{ fontSize: "0.9rem" }}
                  >
                    {o.paystack_reference.slice(0, 20)}…
                    <span style={{ color: "#666", marginLeft: "0.5rem" }}>
                      KSh {(o.total_cents / 100).toLocaleString()}
                    </span>
                  </Link>
                  <span
                    style={{
                      textTransform: "capitalize",
                      fontSize: "0.85rem",
                      color: o.status === "paid" ? "#2f855a" : "#666",
                      fontWeight: o.status === "paid" ? 600 : 400,
                    }}
                  >
                    {o.status}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </main>
  );
}