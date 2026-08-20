"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const STATUS_OPTIONS = {
  pending: ["cancelled"],
  paid: ["shipped", "cancelled"],
  shipped: ["delivered"],
  delivered: [],
  cancelled: [],
  failed: [],
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      router.push("/admin/login");
      return;
    }

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/orders`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (res.status === 401) {
          localStorage.removeItem("adminToken");
          router.push("/admin/login");
          return null;
        }
        return res.json();
      })
      .then((data) => {
        if (data) setOrders(data.orders);
      })
      .catch(() => setError("Failed to load orders"))
      .finally(() => setLoading(false));
  }, [router]);

  async function handleStatusChange(orderId, newStatus) {
    const token = localStorage.getItem("adminToken");
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/orders/${orderId}/status`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      }
    );

    if (res.ok) {
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
      );
    }
  }

  if (loading) return <main style={{ padding: "2rem" }}>Loading orders...</main>;
  if (error) return <main style={{ padding: "2rem", color: "crimson" }}>{error}</main>;

  return (
    <main style={{ maxWidth: 900, margin: "0 auto", padding: "2rem" }}>
      <h1>Manage Orders</h1>

      <table style={{ width: "100%", marginTop: "1.5rem", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ textAlign: "left", borderBottom: "2px solid #eee" }}>
            <th style={{ padding: "0.5rem" }}>Reference</th>
            <th style={{ padding: "0.5rem" }}>Customer</th>
            <th style={{ padding: "0.5rem" }}>Total</th>
            <th style={{ padding: "0.5rem" }}>Status</th>
            <th style={{ padding: "0.5rem" }}>Action</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id} style={{ borderBottom: "1px solid #f0f0f0" }}>
              <td style={{ padding: "0.5rem", fontSize: "0.85rem" }}>
                {order.paystack_reference.slice(0, 20)}…
              </td>
              <td style={{ padding: "0.5rem" }}>{order.customer_name}</td>
              <td style={{ padding: "0.5rem" }}>
                KSh {(order.total_cents / 100).toLocaleString()}
              </td>
              <td style={{ padding: "0.5rem", textTransform: "capitalize" }}>
                {order.status}
              </td>
              <td style={{ padding: "0.5rem" }}>
                {STATUS_OPTIONS[order.status]?.length > 0 && (
                  <select
                    defaultValue=""
                    onChange={(e) => {
                      if (e.target.value) handleStatusChange(order.id, e.target.value);
                    }}
                    style={{ padding: "0.3rem" }}
                  >
                    <option value="" disabled>
                      Change status
                    </option>
                    {STATUS_OPTIONS[order.status].map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}