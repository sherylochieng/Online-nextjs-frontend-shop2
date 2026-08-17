export default function ProductsLoading() {
  return (
    <main style={{ maxWidth: 900, margin: "0 auto", padding: "2rem" }}>
      <h1>All Products</h1>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
        gap: "1.5rem",
        marginTop: "1.5rem",
      }}>
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            style={{ border: "1px solid #eee", borderRadius: 8, overflow: "hidden" }}
          >
            <div style={{
              width: "100%",
              aspectRatio: "1 / 1",
              background: "#eee",
            }} />
            <div style={{ padding: "0.75rem" }}>
              <div style={{
                height: 14,
                background: "#eee",
                borderRadius: 4,
                width: "75%",
              }} />
              <div style={{
                height: 12,
                background: "#eee",
                borderRadius: 4,
                width: "50%",
                marginTop: 8,
              }} />
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}