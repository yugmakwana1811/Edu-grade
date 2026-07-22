import Link from "next/link";
import {
  ArrowRight,
  BookOpenCheck,
  CheckCircle2,
  Clock3,
  Flame,
  GraduationCap,
  Megaphone,
  School,
  Sparkles,
} from "lucide-react";
import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { learningStreak, topicPerformance } from "@/lib/analytics";
import { PageHeader, StatCard } from "@/components/ui";
import { formatDate, relativeDue } from "@/lib/utils";

export default async function StudentDashboard() {
  const user = await requireUser("STUDENT");
  const studentId = user.studentProfile!.id;
  const [enrollments, assignments, submissions, announcements, activities] =
    await Promise.all([
      db.classEnrollment.findMany({
        where: { studentId },
        include: { class: true },
      }),
      db.assignment.findMany({
        where: {
          status: "PUBLISHED",
          class: { enrollments: { some: { studentId } } },
        },
        include: { class: true },
        orderBy: { dueAt: "asc" },
      }),
      db.submission.findMany({
        where: { studentId },
        include: { result: true, assignment: true },
        orderBy: { updatedAt: "desc" },
      }),
      db.announcement.findMany({
        where: { class: { enrollments: { some: { studentId } } } },
        include: { class: true },
        orderBy: { publishedAt: "desc" },
        take: 4,
      }),
      db.activityLog.findMany({
        where: { userId: user.id },
        select: { createdAt: true },
        orderBy: { createdAt: "desc" },
        take: 120,
      }),
    ]);
  const completedIds = new Set(
    submissions
      .filter((submission) => submission.status !== "DRAFT")
      .map((submission) => submission.assignmentId),
  );
  const pending = assignments.filter(
    (assignment) => !completedIds.has(assignment.id),
  );
  const completed = submissions.filter(
    (submission) => submission.status !== "DRAFT",
  );
  const results = submissions.filter(
    (submission) => submission.result?.published,
  );
  const recent = results[0];
  const average = results.length
    ? Math.round(
        results.reduce(
          (sum, submission) =>
            sum +
            (Number(submission.result!.marks) /
              submission.assignment.maxMarks) *
              100,
          0,
        ) / results.length,
      )
    : 0;
  const topics = topicPerformance(
    results.map((submission) => ({
      topic: submission.assignment.topic,
      title: submission.assignment.title,
      marks: Number(submission.result!.marks),
      maxMarks: submission.assignment.maxMarks,
    })),
  );
  const weakTopic = topics[0];
  const streak = learningStreak(
    activities.map((activity) => activity.createdAt),
  );
  return (
    <div className="page">
      <PageHeader
        eyebrow="Student overview"
        title="Learn with a clear next step"
        description="See what is due, submit work with confidence, and use teacher-published feedback to guide revision."
        action={
          <Link className="btn btn-primary" href="/student/ai-help">
            <Sparkles size={16} /> Ask study assistant
          </Link>
        }
      />
      <div className="grid-auto">
        <StatCard
          label="Joined classes"
          value={enrollments.length}
          icon={School}
        />
        <StatCard
          label="Pending assignments"
          value={pending.length}
          detail={pending[0] ? relativeDue(pending[0].dueAt) : "Nothing due"}
          icon={Clock3}
          tone="coral"
        />
        <StatCard
          label="Completed"
          value={completed.length}
          icon={CheckCircle2}
        />
        <StatCard
          label="Recent mark"
          value={
            recent
              ? `${Number(recent.result!.marks)}/${recent.assignment.maxMarks}`
              : "—"
          }
          detail={recent?.assignment.title ?? "No published result"}
          icon={GraduationCap}
          tone="gold"
        />
        <StatCard
          label="Average score"
          value={results.length ? `${average}%` : "—"}
          icon={BookOpenCheck}
        />
        <StatCard
          label="Learning streak"
          value={`${streak} day${streak === 1 ? "" : "s"}`}
          detail={streak ? "Keep the rhythm" : "Start with one learning action"}
          icon={Flame}
          tone="coral"
        />
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(0,1.25fr) minmax(300px,.75fr)",
          gap: "1rem",
          marginTop: "1rem",
        }}
      >
        <section className="card card-pad">
          <div className="eyebrow">Upcoming work</div>
          <h2
            className="display"
            style={{ fontSize: "1.8rem", margin: ".3rem 0 1rem" }}
          >
            Your next deadlines
          </h2>
          {pending.length ? (
            pending.slice(0, 5).map((assignment) => (
              <Link
                key={assignment.id}
                href={`/student/assignments/${assignment.id}`}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: ".9rem 0",
                  borderBottom: "1px solid var(--line)",
                }}
              >
                <div>
                  <strong>{assignment.title}</strong>
                  <div className="hint">
                    {assignment.class.name} · {assignment.maxMarks} marks
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <span className="badge badge-coral">
                    {relativeDue(assignment.dueAt)}
                  </span>
                  <div className="hint" style={{ marginTop: 4 }}>
                    {formatDate(assignment.dueAt)}
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <div
              style={{
                padding: "1rem",
                background: "var(--teal-soft)",
                borderRadius: 10,
              }}
            >
              <strong>You’re up to date.</strong>
              <p className="hint" style={{ marginBottom: 0 }}>
                Use this time for a short retrieval practice session.
              </p>
            </div>
          )}
          <Link
            href="/student/assignments"
            style={{
              display: "inline-flex",
              gap: 5,
              alignItems: "center",
              color: "var(--teal)",
              fontWeight: 800,
              fontSize: ".82rem",
              marginTop: "1rem",
            }}
          >
            View all assigned work <ArrowRight size={15} />
          </Link>
        </section>
        <aside style={{ display: "grid", gap: "1rem" }}>
          <section className="card card-pad">
            <div className="eyebrow">Study tip</div>
            <h2
              className="display"
              style={{ fontSize: "1.55rem", margin: ".3rem 0 .5rem" }}
            >
              {weakTopic
                ? `Revisit ${weakTopic.topic}`
                : "Build your first evidence trail"}
            </h2>
            <p style={{ color: "var(--muted)", lineHeight: 1.6 }}>
              {weakTopic
                ? `Your published results currently average ${weakTopic.average}% for this topic. Redo one example without notes, compare it with feedback, then explain the corrected step aloud.`
                : "Complete assigned work and quizzes. Once results are published, EduGrade will identify topics worth revisiting without making final learning decisions for you."}
            </p>
            <Link
              href="/student/ai-help"
              style={{
                color: "var(--teal)",
                fontWeight: 800,
                fontSize: ".82rem",
              }}
            >
              Build a revision plan
            </Link>
          </section>
          <section className="card card-pad">
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <Megaphone size={18} color="var(--coral)" />
              <div className="eyebrow">Announcements</div>
            </div>
            {announcements.length ? (
              announcements.slice(0, 2).map((announcement) => (
                <div
                  key={announcement.id}
                  style={{
                    padding: ".8rem 0",
                    borderBottom: "1px solid var(--line)",
                  }}
                >
                  <strong style={{ fontSize: ".84rem" }}>
                    {announcement.title}
                  </strong>
                  <div className="hint">{announcement.class.name}</div>
                </div>
              ))
            ) : (
              <p className="hint">No announcements yet.</p>
            )}
          </section>
        </aside>
      </div>
    </div>
  );
}
