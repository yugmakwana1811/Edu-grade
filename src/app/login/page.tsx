import Link from "next/link";
import { ArrowLeft, CheckCircle2, GraduationCap, ShieldCheck } from "lucide-react";
import { Logo } from "@/components/logo";
import { Alert } from "@/components/ui";
import { SubmitButton } from "@/components/submit-button";
import { loginAction } from "@/app/actions";

export default async function Login({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const { error } = await searchParams;
  return <main style={{ minHeight: "100vh", display: "grid", gridTemplateColumns: "minmax(0,1.05fr) minmax(320px,.95fr)" }}>
    <section className="hero-pattern hide-mobile" style={{ backgroundColor: "var(--navy)", color: "white", padding: "clamp(2rem,6vw,6rem)", display: "flex", flexDirection: "column" }}>
      <Logo light/>
      <div style={{ margin: "auto 0", maxWidth: 620 }}><div className="eyebrow" style={{ color: "#83ddd4" }}>Expo-ready classroom</div><h1 className="display" style={{ fontSize: "clamp(3.3rem,6vw,6rem)", lineHeight: .94, margin: ".8rem 0 1.5rem" }}>A calmer way to run the teaching cycle.</h1><div style={{ display: "grid", gap: ".8rem", color: "#cad4df" }}>{["Plan and create editable teaching material", "Collect and review handwritten work", "Publish teacher-approved feedback and insights"].map((x) => <div key={x} style={{ display: "flex", alignItems: "center", gap: ".7rem" }}><CheckCircle2 size={18} color="#82ddd4"/>{x}</div>)}</div></div>
      <small style={{ color: "#97a7b8" }}>Secure role-based access · Teacher-controlled AI</small>
    </section>
    <section style={{ padding: "clamp(1.2rem,7vw,7rem)", display: "grid", placeItems: "center", background: "white" }}><div style={{ width: "min(440px,100%)" }}>
      <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: ".4rem", color: "var(--muted)", fontSize: ".82rem", marginBottom: "2rem" }}><ArrowLeft size={16}/> Back to home</Link>
      <div className="eyebrow">Welcome back</div><h1 className="display" style={{ fontSize: "clamp(2.5rem,6vw,4rem)", margin: ".4rem 0 .7rem" }}>Open your workspace</h1><p style={{ color: "var(--muted)", lineHeight: 1.6, marginBottom: "1.5rem" }}>Use either seeded expo account. Both share the password <strong style={{ color: "var(--navy)" }}>EduGrade@123</strong>.</p>
      <Alert error={error}/>
      <form action={loginAction} style={{ display: "grid", gap: "1rem" }}><label><span className="label">Email address</span><input className="field" name="email" type="email" autoComplete="email" required defaultValue="teacher@edugrade.ai"/></label><label><span className="label">Password</span><input className="field" name="password" type="password" autoComplete="current-password" minLength={8} required defaultValue="EduGrade@123"/></label><SubmitButton pendingText="Opening workspace…">Sign in securely</SubmitButton></form>
      <div className="grid-auto" style={{ marginTop: "1rem", gridTemplateColumns: "1fr 1fr" }}><div className="card" style={{ padding: ".8rem", background: "#f8fbfa" }}><GraduationCap size={18} color="var(--teal)"/><strong style={{ display: "block", fontSize: ".8rem", marginTop: ".3rem" }}>Teacher demo</strong><small className="hint">teacher@edugrade.ai</small></div><div className="card" style={{ padding: ".8rem", background: "#fff9f7" }}><ShieldCheck size={18} color="var(--coral)"/><strong style={{ display: "block", fontSize: ".8rem", marginTop: ".3rem" }}>Student demo</strong><small className="hint">student@edugrade.ai</small></div></div>
      <p className="hint" style={{ textAlign: "center", marginTop: "1.5rem" }}>Authentication uses hashed passwords, database sessions, and HTTP-only cookies.</p>
    </div></section>
  </main>;
}
