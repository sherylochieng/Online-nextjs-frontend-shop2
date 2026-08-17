import Link from "next/link";

export default function ProductNotFound() {
  return (
    <div style={{ textAlign: "center", padding: "4rem 0" }}>
      <h1 style={{ fontSize: "2rem" }}>Product not found</h1>
      <p style={{ color: "#666", marginTop: "0.75rem", lineHeight: 1.6 }}>
        We could not find the product you were looking for.
        <br />
        It may have been sold, removed, or the link may be incorrect.
      </p>
      <Link
        href="/products"
        style={{
          display: "inline-block",
          marginTop: "2rem",
          background: "#000",
          color: "#fff",
          padding: "0.75rem 1.5rem",
          borderRadius: 4,
          fontWeight: 500,
        }}
      >
        Browse all products
      </Link>
    </div>
  );
}