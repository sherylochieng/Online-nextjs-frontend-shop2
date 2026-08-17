import Link from "next/link";
import { apiFetch } from "@/lib/api";

export default async function ProductsLayout({ children }) {
  let categories = [];

  try {
    const data = await apiFetch("/api/products/categories");
    categories = data.categories;
  } catch {
    // If categories fail to load, render without the sidebar list.
    // The layout itself should never crash — it wraps all product pages.
  }

  return (
    <div style={{
      maxWidth: 900,
      margin: "0 auto",
      padding: "2rem",
      display: "grid",
      gridTemplateColumns: "160px 1fr",
      gap: "2rem",
    }}>
      <aside style={{ borderRight: "1px solid #eee", paddingRight: "1.5rem" }}>
        <h3 style={{ fontSize: "0.9rem", marginBottom: "0.75rem", margin: "0 0 0.75rem 0" }}>
          Categories
        </h3>
        <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: "0.5rem", fontSize: "0.9rem" }}>
          <li>
            <Link href="/products">All</Link>
          </li>
          {categories.map((c) => (
            <li key={c}>
              <Link href={`/products/category/${c}`} style={{ textTransform: "capitalize" }}>
                {c}
              </Link>
            </li>
          ))}
        </ul>
      </aside>

      <div>
        {children}
      </div>
    </div>
  );
}