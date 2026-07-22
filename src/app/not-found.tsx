import Link from "next/link";
export default function NotFound() {
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        padding: "1rem",
      }}
    >
      <div style={{ textAlign: "center" }}>
        <div className="eyebrow">404 · Page not found</div>
        <h1
          className="display"
          style={{ fontSize: "clamp(3rem,8vw,6rem)", margin: ".5rem" }}
        >
          This page missed class.
        </h1>
        <p style={{ color: "var(--muted)" }}>
          The link may be old or you may not have access to it.
        </p>
        <Link className="btn btn-primary" href="/">
          Return home
        </Link>
      </div>
    </main>
  );
}
