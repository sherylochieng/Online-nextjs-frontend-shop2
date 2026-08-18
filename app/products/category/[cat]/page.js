import { notFound } from "next/navigation";
import Link from "next/link";
import { apiFetch } from "@/lib/api";
import Image from "next/image";

export async function generateMetadata({ params }) {
  // params is a Promise in Next.js 16 — unwrap it first
  const { cat } = await params;
  const categoryName = cat.charAt(0).toUpperCase() + cat.slice(1);
  return { title: categoryName };
}

export default async function CategoryPage({ params }) {
  // Same unwrap here — cat comes straight from the URL, no extra fetch needed
  const { cat } = await params;

  const { products } = await apiFetch(
    `/api/products?category=${encodeURIComponent(cat)}`
  );

  // Empty category = either invalid, or valid with nothing in it yet — either way, not found
  if (products.length === 0) {
    notFound();
  }

  return (
    <div>
      <h1 style={{ textTransform: "capitalize", margin: "0 0 1.5rem 0" }}>
        {cat}
      </h1>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
        gap: "1rem",
      }}>
        {products.map((p) => (
          <Link
            key={p.id}
            href={`/products/${p.slug}`}
            style={{
              border: "1px solid #eee",
              borderRadius: 8,
              padding: "0.75rem",
              color: "inherit",
              textDecoration: "none",
              display: "block",
            }}
          >
               <Image
                            src={p.image_url}
                            alt={p.name}
                            width={200}
                            height={200}
                            style={{
                            width: "100%",
                            height: "auto",
                            aspectRatio: "1 / 1",
                            objectFit: "contain",
                            display: "block",
                            }}
                            />

            <div style={{ fontWeight: 600 }}>{p.name}</div>
            <div style={{ color: "#666", fontSize: "0.9rem", marginTop: "0.25rem" }}>
              KSh {(p.price_cents / 100).toLocaleString()}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}