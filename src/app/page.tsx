import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  Bot,
  Camera,
  CheckCircle2,
  ClipboardCheck,
  FileText,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";
import { DiaTextReveal } from "@/components/dia-text-reveal";
import { FloatingTooltip } from "@/components/floating-tooltip";
import { FeatureAtlas } from "@/components/feature-atlas";
import { HoverExpand } from "@/components/hover-expand";
import { Logo } from "@/components/logo";
import { MotionAccordion } from "@/components/motion-accordion";
import { MotionNavigationMenu } from "@/components/motion-navigation-menu";

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

const teachingMoments = [
  {
    label: "Plan with a strong starting point",
    sublabel: "Plan",
    image: "/marketing/teacher-planning.jpg",
    imageAlt: "Teacher planning a lesson with a tablet and notebook",
    description: "Create editable lessons, notes, questions, and revision material.",
  },
  {
    label: "Teach with the right explanation",
    sublabel: "Teach",
    image: "/marketing/classroom-teaching.jpg",
    imageAlt: "Teacher leading an engaged classroom discussion",
    description: "Adapt explanations and resources to the class in front of you.",
  },
  {
    label: "Collect work without the paper chase",
    sublabel: "Collect",
    image: "/marketing/answer-upload.jpg",
    imageAlt: "Student photographing ordered handwritten answer pages",
    description: "Students submit ordered handwritten pages from any device.",
  },
  {
    label: "Turn evidence into the next action",
    sublabel: "Analyse",
    image: "/marketing/learning-analytics.jpg",
    imageAlt: "Teacher reviewing classroom progress analytics on a laptop",
    description: "See progress patterns while keeping every decision teacher-led.",
  },
];

const frequentlyAskedQuestions = [
  {
    question: "Does EduGrade AI decide marks or final feedback?",
    answer:
      "No. AI creates editable suggestions only. Teachers review the work, decide marks, edit feedback, and explicitly publish the final result.",
  },
  {
    question: "Which classes and subjects are supported?",
    answer:
      "EduGrade supports Classes 6 through 12 with grade-aware CBSE subject catalogs, including core subjects, languages, electives, skill subjects, and internal-assessment areas.",
  },
  {
    question: "How does subject-aware AI model selection work?",
    answer:
      "EduGrade selects from a server-controlled allowlist based on the subject and task. Users cannot override the chosen model, and safe fallback content remains available if every permitted provider request fails.",
  },
  {
    question: "Can students submit handwritten answers?",
    answer:
      "Yes. Students can upload multiple answer-page images, preview the order, remove incorrect pages, complete a submission checklist, and track the submission after it is sent.",
  },
  {
    question: "Is classroom information protected by role?",
    answer:
      "Yes. Teacher and student routes are protected separately, requests are validated on the server, sessions use secure cookies, and private files are served through authenticated endpoints.",
  },
  {
    question: "Can AI-generated material be edited before use?",
    answer:
      "Always. Lesson plans, notes, explanations, questions, feedback, revision sheets, and announcements remain reviewable drafts until a teacher approves the next action.",
  },
];

export default function Home() {
  return (
    <main className="marketing">
      <header className="marketing-nav">
        <Logo />
        <MotionNavigationMenu />
        <div className="marketing-actions">
          <Link className="btn btn-secondary" href="/login">
            Sign in
          </Link>
          <Link className="btn btn-primary" href="/register">
            Start free <ArrowRight size={16} />
          </Link>
        </div>
      </header>

      <section className="marketing-hero hero-pattern">
        <div className="hero-copy">
          <div className="hero-kicker">
            <Sparkles size={14} /> AI-powered classroom operations · Classes
            6–12
          </div>
          <h1 className="display hero-title">
            Run every teaching day from one{" "}
            <DiaTextReveal text="intelligent workspace." />
          </h1>
          <p>
            Plan lessons, create material, assign work, collect handwritten
            answers, review with context, communicate clearly, and understand
            progress—without stitching together five different tools.
          </p>
          <div className="hero-actions">
            <Link className="btn btn-primary" href="/register">
              Start teaching smarter <ArrowRight size={17} />
            </Link>
            <a className="btn btn-secondary" href="#platform">
              Explore the classroom OS
            </a>
          </div>
          <div className="trust-note">
            <FloatingTooltip
              content="AI output remains a suggestion until a teacher reviews it."
              placement="top"
            >
              <ShieldCheck size={16} color="var(--teal)" />
            </FloatingTooltip>
            AI suggests. Teachers review, edit, and decide.
          </div>
        </div>

        <div className="product-stage" aria-label="EduGrade teacher workspace preview">
          <div className="product-window">
            <div className="window-bar">
              <span />
              <span />
              <span />
              <div className="window-title">Teacher workspace · Live preview</div>
            </div>
            <div className="preview-shell">
              <div className="preview-nav">
                <div className="preview-logo">EduGrade AI</div>
                {["Overview", "Classes", "AI studio", "Assignments", "Review", "Analytics"].map(
                  (label, index) => (
                    <span
                      className={`preview-link${index === 0 ? " active" : ""}`}
                      key={label}
                    >
                      {label}
                    </span>
                  ),
                )}
              </div>
              <div className="preview-content">
                <h3>Your teaching command centre</h3>
                <p>Four items need your attention today.</p>
                <div className="preview-metrics">
                  <div className="preview-metric">
                    <span>Review queue</span>
                    <strong>12</strong>
                  </div>
                  <div className="preview-metric">
                    <span>Class average</span>
                    <strong>78%</strong>
                  </div>
                  <div className="preview-metric">
                    <span>Time assisted</span>
                    <strong>86m</strong>
                  </div>
                </div>
                <div className="preview-grid">
                  <div className="preview-panel">
                    <strong>Priority queue</strong>
                    {[
                      "Review Partnership Test responses",
                      "Publish Unit 3 assignment",
                      "Complete Class 8 attendance",
                    ].map((task) => (
                      <div className="preview-task" key={task}>
                        <i /> {task}
                      </div>
                    ))}
                  </div>
                  <div className="preview-panel">
                    <strong>Completion pulse</strong>
                    <div className="preview-chart" aria-hidden="true">
                      {[44, 62, 55, 74, 66, 82, 91].map((height, index) => (
                        <span key={index} style={{ height: `${height}%` }} />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="cycle-rail" aria-label="Complete teaching cycle">
        {cycle.map((item, index) => (
          <div className="cycle-step" key={item}>
            <span>0{index + 1}</span>
            {item}
          </div>
        ))}
      </div>

      <section className="marketing-section feature-atlas-section" id="features">
        <div className="section-inner">
          <div className="feature-atlas-intro">
            <div>
              <div className="eyebrow">The complete EduGrade platform</div>
              <h2 className="display section-heading">
                Every feature, connected to the work around it.
              </h2>
            </div>
            <p>
              Explore the complete teacher, student, AI, and platform
              foundation—from secure access and planning to published results
              and progress intelligence.
            </p>
          </div>
          <FeatureAtlas />
        </div>
      </section>

      <section className="marketing-section" id="platform">
        <div className="section-inner">
          <div className="eyebrow">One connected classroom</div>
          <h2 className="display section-heading">
            Less coordination overhead. More useful teaching signals.
          </h2>
          <div className="feature-bento">
            <article
              className="feature-card feature-card-large"
              id="ai-studio"
            >
              <div className="feature-number">01 / AI STUDIO</div>
              <Bot size={32} color="#8ce1d5" style={{ marginTop: "2rem" }} />
              <h3>From rough idea to teacher-ready draft.</h3>
              <p>
                Create lesson plans, explanations, notes, questions, quizzes,
                revision sheets, feedback, and announcements in a guided
                workspace. Every AI output stays editable and clearly marked as
                a suggestion.
              </p>
              <div className="approval-flow">
                <div className="approval-step">
                  <span>Drafted</span>
                  AI prepares a starting point
                </div>
                <div className="approval-step">
                  <span>Reviewed</span>
                  Teacher checks and edits
                </div>
                <div className="approval-step">
                  <span>Approved</span>
                  Teacher controls publishing
                </div>
              </div>
            </article>
            <article className="feature-card" id="answer-review">
              <div className="feature-number">02 / ANSWER REVIEW</div>
              <Camera size={26} color="var(--teal)" style={{ marginTop: "1.4rem" }} />
              <h3>Handwritten work, organised.</h3>
              <p>
                Students upload ordered answer pages with previews and checks.
                Teachers review every page in context before marks or feedback
                are published.
              </p>
            </article>
            <article className="feature-card" id="learning-signals">
              <div className="feature-number">03 / LEARNING SIGNALS</div>
              <BarChart3 size={26} color="var(--indigo)" style={{ marginTop: "1.4rem" }} />
              <h3>Evidence that leads to a useful next step.</h3>
              <p>
                See completion, results, attendance, topic patterns, and
                workload assistance without turning suggestions into academic
                decisions.
              </p>
            </article>
          </div>
        </div>
      </section>

      <section className="marketing-section" id="roles">
        <div className="section-inner">
          <div className="eyebrow">Built for both sides of the classroom</div>
          <h2 className="display section-heading">
            A precise workspace for teachers. A clear next step for students.
          </h2>
          <div className="role-grid">
            <article
              className="role-card role-card-teacher"
              id="teacher-workspace"
            >
              <Users size={28} color="#8ce1d5" />
              <h3 className="display">Teacher command centre</h3>
              <p>
                Manage classes, create material, publish assignments, review
                submissions, track participation, and act on evidence from one
                protected workspace.
              </p>
              <Link href="/register" className="btn btn-secondary">
                Create teacher account <ArrowRight size={16} />
              </Link>
            </article>
            <article
              className="role-card role-card-student"
              id="student-workspace"
            >
              <FileText size={28} color="var(--indigo)" />
              <h3 className="display">Student learning path</h3>
              <p>
                Join classes, see upcoming work, upload answer pages, attempt
                quizzes, read published feedback, and revise with transparent
                AI support.
              </p>
              <Link href="/register" className="btn btn-primary">
                Create student account <ArrowRight size={16} />
              </Link>
            </article>
          </div>
        </div>
      </section>

      <section className="marketing-section workflow-showcase">
        <div className="section-inner">
          <div className="workflow-showcase-head">
            <div>
              <div className="eyebrow">The workflow, not another tool</div>
              <h2 className="display section-heading">
                Built around the moments that shape a teaching day.
              </h2>
            </div>
            <p>
              Move across the complete classroom cycle without losing context,
              control, or the human judgment learning depends on.
            </p>
          </div>
          <HoverExpand items={teachingMoments} />
        </div>
      </section>

      <section className="marketing-section marketing-section-dark" id="trust">
        <div className="section-inner">
          <div className="eyebrow" style={{ color: "#8ce1d5" }}>
            Designed around teacher control
          </div>
          <h2 className="display section-heading">
            Useful AI should strengthen judgment—not replace it.
          </h2>
          <div className="grid-auto">
            {[
              [
                Sparkles,
                "Reviewable suggestions",
                "Generated content is labelled, editable, and never published automatically.",
              ],
              [
                ClipboardCheck,
                "Teacher-owned decisions",
                "Final teaching choices, evaluation, marks, and feedback remain under teacher control.",
              ],
              [
                ShieldCheck,
                "Protected workflows",
                "Role-based access, server validation, secure sessions, and private file handling protect classroom work.",
              ],
              [
                CheckCircle2,
                "Honest learning support",
                "Student assistance guides understanding and revision without claiming perfect or final answers.",
              ],
            ].map(([Icon, title, copy]) => {
              const I = Icon as typeof Sparkles;
              return (
                <article key={String(title)} style={{ padding: "1rem 0" }}>
                  <I color="#8ce1d5" />
                  <h3 style={{ margin: ".85rem 0 .45rem" }}>{String(title)}</h3>
                  <p style={{ color: "#b9c5d6", lineHeight: 1.7, margin: 0 }}>
                    {String(copy)}
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="marketing-section faq-section" id="faq">
        <div className="section-inner faq-layout">
          <div className="faq-intro">
            <div className="eyebrow">Clear answers, upfront</div>
            <h2 className="display section-heading">
              What schools, teachers, and students usually ask.
            </h2>
            <p>
              EduGrade combines practical classroom workflows with explicit
              teacher control, protected access, and honest AI boundaries.
            </p>
            <Link href="/about" className="text-link">
              Read product information & AI safety{" "}
              <ArrowRight size={15} aria-hidden="true" />
            </Link>
          </div>
          <MotionAccordion items={frequentlyAskedQuestions} />
        </div>
      </section>

      <section className="marketing-section" style={{ textAlign: "center" }}>
        <div className="section-inner">
          <div className="eyebrow">Ready for the complete teaching cycle</div>
          <h2
            className="display section-heading"
            style={{ marginInline: "auto" }}
          >
            Smart Teaching. Faster Feedback. Better Learning.
          </h2>
          <p
            style={{
              maxWidth: 650,
              margin: "0 auto 1.6rem",
              color: "var(--muted)",
              lineHeight: 1.75,
            }}
          >
            Create a protected Class 6–12 workspace or use the seeded expo
            scenario to explore the full teacher-to-student flow.
          </p>
          <Link className="btn btn-primary" href="/login">
            Enter EduGrade AI <ArrowRight size={17} />
          </Link>
        </div>
      </section>

      <footer className="marketing-footer">
        <span>© 2026 EduGrade AI</span>
        <span>Smart Teaching. Faster Feedback. Better Learning.</span>
        <Link href="/about">Product information & AI safety</Link>
      </footer>
    </main>
  );
}
