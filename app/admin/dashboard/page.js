"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

function StatCard({ label, value, highlight }) {
  return (
    <div
      style={{
        border: "1px solid #eee",
        borderRadius: 8,
        padding: "1.25rem",
        background: highlight ? "#000" : "#fff",
        color: highlight ? "#fff" : "#000",
      }}
    >
      <div style={{ fontSize: "0.85rem", color: highlight ? "#ccc" : "#666" }}>
        {label}
      </div>
      <div style={{ fontSize: "1.6rem", fontWeight: 700, marginTop: "0.25rem" }}>
        {value}
      </div>
    </div>
  );
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      router.push("/admin/login");
      return;
    }

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/dashboard`, {
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
        if (data) setStats(data);
      })
      .catch(() => setError("Failed to load dashboard"))
      .finally(() => setLoading(false));
  }, [router]);

  if (loading) return <main style={{ padding: "2rem" }}>Loading dashboard...</main>;
  if (error) return <main style={{ padding: "2rem", color: "crimson" }}>{error}</main>;

  return (
    <main style={{ maxWidth: 900, margin: "0 auto", padding: "2rem" }}>
      <h1>Dashboard</h1>

      <h2 style={{ fontSize: "1rem", marginTop: "2rem", color: "#666" }}>Today</h2>
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
        gap: "1rem",
        marginTop: "0.75rem",
      }}>
        <StatCard
          label="Today's Revenue"
          value={`KSh ${(stats.todayRevenueCents / 100).toLocaleString()}`}
          highlight
        />
        <StatCard label="Orders Today" value={stats.todayOrderCount} />
        <StatCard label="Paid Today" value={stats.paidToday} />
      </div>

      <h2 style={{ fontSize: "1rem", marginTop: "2rem", color: "#666" }}>All Time</h2>
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
        gap: "1rem",
        marginTop: "0.75rem",
      }}>
        <StatCard
          label="Total Revenue"
          value={`KSh ${(stats.totalRevenueCents / 100).toLocaleString()}`}
        />
        <StatCard label="Total Orders" value={stats.totalOrders} />
        <StatCard label="Paid" value={stats.paidOrders} />
        <StatCard label="Pending" value={stats.pendingOrders} />
        <StatCard label="Failed" value={stats.failedOrders} />
      </div>
    </main>
  );
}