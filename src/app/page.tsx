import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  Bot,
  Camera,
  ClipboardCheck,
  Clock3,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";
import { Logo } from "@/components/logo";

const cycle = [
  "Plan",
  "Teach",
  "Assign",
  "Collect",
  "Evaluate",
  "Support",
  "Communicate",
  "Analyse",
];
export default function Home() {
  return (
    <main>
      <header
        style={{
          height: 74,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 clamp(1rem,5vw,5rem)",
          background: "white",
          borderBottom: "1px solid var(--line)",
        }}
      >
        <Logo />
        <nav style={{ display: "flex", gap: ".65rem" }}>
          <Link className="btn btn-secondary hide-mobile" href="/about">
            How it works
          </Link>
          <Link className="btn btn-primary" href="/login">
            Sign in <ArrowRight size={17} />
          </Link>
        </nav>
      </header>
      <section
        className="hero-pattern"
        style={{
          minHeight: "78vh",
          padding: "clamp(4rem,10vw,8rem) clamp(1rem,8vw,8rem)",
          display: "grid",
          placeItems: "center",
          textAlign: "center",
          backgroundColor: "#f8fbf9",
        }}
      >
        <div style={{ maxWidth: 940 }}>
          <div className="eyebrow">
            The full-cycle teacher assistant · Classes 6–12
          </div>
          <h1
            className="display"
            style={{
              fontSize: "clamp(3.1rem,8.5vw,7.3rem)",
              lineHeight: 0.92,
              margin: "1rem 0 1.4rem",
            }}
          >
            Make more room for{" "}
            <em style={{ color: "var(--teal)" }}>teaching.</em>
          </h1>
          <p
            style={{
              color: "var(--muted)",
              fontSize: "clamp(1.05rem,2vw,1.3rem)",
              lineHeight: 1.7,
              maxWidth: 760,
              margin: "0 auto 2rem",
            }}
          >
            EduGrade AI brings planning, classroom work, handwritten
            submissions, teacher-reviewed feedback, communication, and learning
            insights for CBSE Classes 6–12 into one calm workspace.
          </p>
          <div
            style={{
              display: "flex",
              gap: ".75rem",
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <Link className="btn btn-primary" href="/register">
              Create your account <ArrowRight size={17} />
            </Link>
            <Link className="btn btn-secondary" href="/login">
              Sign in
            </Link>
            <a className="btn btn-secondary" href="#cycle">
              See the teaching cycle
            </a>
          </div>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: ".5rem",
              justifyContent: "center",
              marginTop: "2.4rem",
            }}
          >
            {cycle.map((item, index) => (
              <span
                key={item}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: ".5rem",
                  color: "var(--navy)",
                  fontSize: ".8rem",
                  fontWeight: 800,
                }}
              >
                <span
                  style={{
                    width: 25,
                    height: 25,
                    display: "grid",
                    placeItems: "center",
                    borderRadius: 7,
                    background:
                      index % 2 ? "var(--coral-soft)" : "var(--teal-soft)",
                  }}
                >
                  {index + 1}
                </span>
                {item}
              </span>
            ))}
          </div>
        </div>
      </section>
      <section
        id="cycle"
        style={{
          padding: "clamp(4rem,8vw,7rem) clamp(1rem,6vw,6rem)",
          background: "var(--navy)",
          color: "white",
        }}
      >
        <div style={{ maxWidth: 1200, margin: "auto" }}>
          <div className="eyebrow" style={{ color: "#81ded5" }}>
            One connected classroom
          </div>
          <h2
            className="display"
            style={{
              fontSize: "clamp(2.4rem,5vw,4.4rem)",
              margin: ".5rem 0 2.5rem",
              maxWidth: 720,
            }}
          >
            Less tool-hopping. More useful teaching signals.
          </h2>
          <div className="grid-auto">
            {[
              [
                Bot,
                "Editable AI teaching tools",
                "Plans, explanations, notes, questions, quizzes and revision sheets.",
              ],
              [
                Camera,
                "Photo answer submission",
                "Ordered previews, upload checks, and a teacher-friendly review surface.",
              ],
              [
                ClipboardCheck,
                "Teacher-controlled feedback",
                "AI can suggest. Teachers edit, decide marks, and control publishing.",
              ],
              [
                BarChart3,
                "Actionable progress",
                "Completion, scores, attendance, weak topics, and workload saved.",
              ],
              [
                Users,
                "Real class workflows",
                "Class codes, enrollment, announcements, resources and participation.",
              ],
              [
                ShieldCheck,
                "Built for trust",
                "Role protection, server validation, secure sessions and honest AI limits.",
              ],
            ].map(([Icon, title, copy]) => {
              const I = Icon as typeof Sparkles;
              return (
                <article
                  key={String(title)}
                  style={{
                    borderTop: "1px solid #53647a",
                    padding: "1.3rem 0",
                  }}
                >
                  <I color="#7fd9d1" />
                  <h3 style={{ margin: ".8rem 0 .5rem" }}>{String(title)}</h3>
                  <p style={{ color: "#b9c5d2", lineHeight: 1.6, margin: 0 }}>
                    {String(copy)}
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      </section>
      <section
        style={{ padding: "clamp(4rem,8vw,7rem) 1rem", textAlign: "center" }}
      >
        <Clock3 size={34} color="var(--coral)" style={{ margin: "auto" }} />
        <h2
          className="display"
          style={{
            fontSize: "clamp(2.5rem,6vw,5rem)",
            margin: "1rem auto",
            maxWidth: 850,
          }}
        >
          Smart Teaching. Faster Feedback. Better Learning.
        </h2>
        <p
          style={{
            color: "var(--muted)",
            maxWidth: 620,
            margin: "0 auto 1.5rem",
            lineHeight: 1.7,
          }}
        >
          Create a protected Class 6–12 teacher or student workspace, or use
          the optional seeded Class 12 Accountancy preview.
        </p>
        <Link className="btn btn-primary" href="/login">
          Enter EduGrade AI <ArrowRight size={17} />
        </Link>
      </section>
      <footer
        style={{
          borderTop: "1px solid var(--line)",
          padding: "1.5rem clamp(1rem,5vw,5rem)",
          display: "flex",
          justifyContent: "space-between",
          gap: "1rem",
          flexWrap: "wrap",
          color: "var(--muted)",
          fontSize: ".8rem",
        }}
      >
        <Logo />
        <span>AI assists. Teachers decide.</span>
      </footer>
    </main>
  );
}
