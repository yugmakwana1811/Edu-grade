import Link from "next/link";
import { ArrowLeft, CheckCircle2, ShieldCheck } from "lucide-react";
import { Logo } from "@/components/logo";
import { Alert } from "@/components/ui";
import { RegisterForm } from "@/components/register-form";

export default async function RegisterPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "grid",
        gridTemplateColumns: "minmax(0,.85fr) minmax(420px,1.15fr)",
      }}
    >
      <section
        className="hero-pattern hide-mobile"
        style={{
          backgroundColor: "var(--navy)",
          color: "white",
          padding: "clamp(2rem,6vw,6rem)",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Logo light />
        <div style={{ margin: "auto 0", maxWidth: 580 }}>
          <div className="eyebrow" style={{ color: "#83ddd4" }}>
            Your secure workspace
          </div>
          <h1
            className="display"
            style={{
              fontSize: "clamp(3rem,5vw,5rem)",
              lineHeight: 0.96,
              margin: ".8rem 0 1.4rem",
            }}
          >
            Start teaching or learning with less friction.
          </h1>
          {[
            "Role-protected teacher and student workspaces",
            "Private classroom resources and submissions",
            "Teacher-controlled AI suggestions",
          ].map((item) => (
            <div
              key={item}
              style={{
                display: "flex",
                gap: ".7rem",
                alignItems: "center",
                margin: ".8rem 0",
                color: "#cad4df",
              }}
            >
              <CheckCircle2 size={18} color="#82ddd4" />
              {item}
            </div>
          ))}
        </div>
        <small
          style={{
            color: "#97a7b8",
            display: "flex",
            gap: 6,
            alignItems: "center",
          }}
        >
          <ShieldCheck size={14} /> Passwords are hashed and sessions use
          HTTP-only cookies.
        </small>
      </section>
      <section
        style={{ padding: "clamp(1.2rem,6vw,5rem)", background: "white" }}
      >
        <div style={{ width: "min(620px,100%)", margin: "auto" }}>
          <Link
            href="/login"
            className="hint"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 5,
              marginBottom: "1.3rem",
            }}
          >
            <ArrowLeft size={15} /> Back to sign in
          </Link>
          <div className="eyebrow">Create account</div>
          <h1
            className="display"
            style={{
              fontSize: "clamp(2.4rem,5vw,3.8rem)",
              margin: ".3rem 0 .5rem",
            }}
          >
            Build your EduGrade workspace
          </h1>
          <p style={{ color: "var(--muted)", lineHeight: 1.6 }}>
            Choose your role carefully. It controls which classroom data and
            actions your account can access.
          </p>
          <Alert error={error} />
          <RegisterForm />
          <p
            className="hint"
            style={{ textAlign: "center", marginTop: "1.2rem" }}
          >
            Already have an account?{" "}
            <Link
              href="/login"
              style={{ color: "var(--teal)", fontWeight: 800 }}
            >
              Sign in
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}
