"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    const form = new FormData(e.target);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: form.get("email"),
          password: form.get("password"),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Login failed");
        setSubmitting(false);
        return;
      }

      localStorage.setItem("adminToken", data.token);
      router.push("/admin/transactions");
    } catch {
      setError("Something went wrong. Please try again.");
      setSubmitting(false);
    }
  }

  return (
    <main style={{ maxWidth: 360, margin: "4rem auto", padding: "2rem" }}>
      <h1>Admin Login</h1>

      <form onSubmit={handleSubmit} style={{ display: "grid", gap: "1rem", marginTop: "1.5rem" }}>
        <label style={{ display: "grid", gap: "0.3rem", fontSize: "0.9rem" }}>
          Email
          <input
            name="email"
            type="email"
            required
            style={{ padding: "0.6rem", border: "1px solid #ddd", borderRadius: 4 }}
          />
        </label>

        <label style={{ display: "grid", gap: "0.3rem", fontSize: "0.9rem" }}>
          Password
          <input
            name="password"
            type="password"
            required
            style={{ padding: "0.6rem", border: "1px solid #ddd", borderRadius: 4 }}
          />
        </label>

        {error && (
          <p style={{ color: "crimson", fontSize: "0.9rem", margin: 0 }}>{error}</p>
        )}

        <button
          type="submit"
          disabled={submitting}
          style={{
            background: "#000",
            color: "#fff",
            padding: "0.75rem",
            borderRadius: 4,
            border: "none",
            cursor: submitting ? "default" : "pointer",
            opacity: submitting ? 0.7 : 1,
          }}
        >
          {submitting ? "Logging in..." : "Log in"}
        </button>
      </form>
    </main>
  );
}