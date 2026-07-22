export default function Loading() {
  return (
    <div className="page">
      <div
        style={{
          height: 45,
          width: "35%",
          background: "#ecece8",
          borderRadius: 10,
          marginBottom: 24,
        }}
      />
      <div className="grid-auto">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            className="card"
            key={i}
            style={{ height: 140, background: "#f2f2ef" }}
          />
        ))}
      </div>
    </div>
  );
}
