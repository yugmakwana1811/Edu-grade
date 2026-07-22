import Link from "next/link";
import {
  ArrowLeft,
  Database,
  LockKeyhole,
  Sparkles,
  UploadCloud,
} from "lucide-react";
import { Logo } from "@/components/logo";
import { SafetyNote } from "@/components/ui";
export default function About() {
  return (
    <main>
      <header
        style={{
          height: 72,
          padding: "0 clamp(1rem,5vw,5rem)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: "1px solid var(--line)",
          background: "white",
        }}
      >
        <Logo />
        <Link href="/login" className="btn btn-primary">
          Open demo
        </Link>
      </header>
      <div
        style={{
          width: "min(1040px,100%)",
          margin: "auto",
          padding: "clamp(2rem,7vw,6rem) 1rem",
        }}
      >
        <Link
          href="/"
          style={{
            display: "inline-flex",
            gap: ".4rem",
            alignItems: "center",
            color: "var(--muted)",
          }}
        >
          <ArrowLeft size={16} /> Home
        </Link>
        <div className="eyebrow" style={{ marginTop: "2.5rem" }}>
          About the project
        </div>
        <h1
          className="display"
          style={{
            fontSize: "clamp(3rem,8vw,6rem)",
            lineHeight: 0.95,
            margin: ".6rem 0 1.5rem",
          }}
        >
          AI assistance, with the teacher firmly in control.
        </h1>
        <p
          style={{
            fontSize: "1.15rem",
            lineHeight: 1.8,
            color: "var(--muted)",
            maxWidth: 800,
          }}
        >
          EduGrade AI is an AI-powered teacher assistant and classroom platform
          for CBSE Classes 6–12, designed around the complete teaching
          cycle—not only evaluation. It helps teachers plan, teach, assign,
          collect, review, support, communicate, and analyse while keeping
          professional judgment where it belongs.
        </p>
        <div className="grid-auto" style={{ margin: "3rem 0" }}>
          {[
            [
              Database,
              "Persistent by design",
              "PostgreSQL models cover people, classes, content, work, results and activity.",
            ],
            [
              LockKeyhole,
              "Role protected",
              "Teacher and student routes check database-backed sessions and ownership.",
            ],
            [
              UploadCloud,
              "Real file flows",
              "Upload adapters support local development and Vercel Blob in production.",
            ],
            [
              Sparkles,
              "Replaceable AI",
              "Vercel AI Gateway is optional; safe deterministic generation keeps the demo functional.",
            ],
          ].map(([I, t, d]) => {
            const Icon = I as typeof Database;
            return (
              <article className="card card-pad" key={String(t)}>
                <Icon color="var(--teal)" />
                <h2 style={{ fontSize: "1rem" }}>{String(t)}</h2>
                <p
                  style={{
                    color: "var(--muted)",
                    lineHeight: 1.6,
                    marginBottom: 0,
                  }}
                >
                  {String(d)}
                </p>
              </article>
            );
          })}
        </div>
        <SafetyNote />
        <h2
          className="display"
          style={{ fontSize: "2.5rem", marginTop: "3rem" }}
        >
          Designed for a CBSE Skill Expo. Engineered beyond one.
        </h2>
        <p style={{ color: "var(--muted)", lineHeight: 1.8 }}>
          The seeded Class 12 Commerce — Accountancy scenario demonstrates a
          connected workflow from teacher planning to a student’s handwritten
          response and a published, teacher-edited result. No AI output is
          silently assigned, and AI never makes the final academic decision.
        </p>
      </div>
    </main>
  );
}
