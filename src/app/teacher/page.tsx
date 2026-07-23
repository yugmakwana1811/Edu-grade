import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Clock3,
  FileCheck2,
  GraduationCap,
  Sparkles,
} from "lucide-react";
import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { PageHeader, SafetyNote, StatCard } from "@/components/ui";
import { formatDateTime } from "@/lib/utils";
import { topicPerformance } from "@/lib/analytics";

export default async function TeacherDashboard() {
  const user = await requireUser("TEACHER");
  const tid = user.teacherProfile!.id;
  const [
    classes,
    students,
    active,
    pending,
    results,
    announcements,
    generations,
    activities,
  ] = await Promise.all([
    db.classRoom.count({ where: { teacherId: tid } }),
    db.classEnrollment.count({ where: { class: { teacherId: tid } } }),
    db.assignment.count({
      where: {
        class: { teacherId: tid },
        status: "PUBLISHED",
        dueAt: { gte: new Date() },
      },
    }),
    db.submission.count({
      where: { assignment: { class: { teacherId: tid } }, status: "SUBMITTED" },
    }),
    db.result.findMany({
      where: {
        submission: { assignment: { class: { teacherId: tid } } },
        published: true,
      },
      select: {
        marks: true,
        submission: {
          select: {
            assignment: {
              select: { maxMarks: true, topic: true, title: true },
            },
          },
        },
      },
    }),
    db.announcement.count({ where: { class: { teacherId: tid } } }),
    db.aIContentGeneration.count({ where: { userId: user.id } }),
    db.activityLog.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      take: 6,
    }),
  ]);
  const average = results.length
    ? Math.round(
        results.reduce(
          (a, r) =>
            a + (Number(r.marks) / r.submission.assignment.maxMarks) * 100,
          0,
        ) / results.length,
      )
    : 0;
  const saved = Math.round(generations * 18 + results.length * 7);
  const weakestTopic = topicPerformance(
    results.map((result) => ({
      topic: result.submission.assignment.topic,
      title: result.submission.assignment.title,
      marks: Number(result.marks),
      maxMarks: result.submission.assignment.maxMarks,
    })),
  )[0];
  return (
    <div className="page">
      <PageHeader
        eyebrow="Teacher overview"
        title="Your teaching command centre"
        description="See what needs attention, pick up where you left off, and keep every class moving."
        action={
          <Link className="btn btn-primary" href="/teacher/ai-tools">
            <Sparkles size={17} /> Create with AI
          </Link>
        }
      />
      <div className="metric-strip">
        <StatCard
          label="Review queue"
          value={pending}
          detail={pending ? "Needs your attention" : "You’re all caught up"}
          icon={Clock3}
          tone="coral"
        />
        <StatCard
          label="Open work"
          value={active}
          detail="Published assignments"
          icon={FileCheck2}
        />
        <StatCard
          label="Class average"
          value={results.length ? `${average}%` : "—"}
          detail={`${results.length} published result${results.length === 1 ? "" : "s"}`}
          icon={GraduationCap}
        />
        <StatCard
          label="Time assisted"
          value={`${saved}m`}
          detail="Estimated workload support"
          icon={Clock3}
          tone="gold"
        />
      </div>
      <div className="facts-strip" aria-label="Supporting teacher metrics">
        <div className="fact">
          <span>Classes</span>
          <strong>{classes}</strong>
        </div>
        <div className="fact">
          <span>Students</span>
          <strong>{students}</strong>
        </div>
        <div className="fact">
          <span>Announcements</span>
          <strong>{announcements}</strong>
        </div>
        <div className="fact">
          <span>AI drafts</span>
          <strong>{generations}</strong>
        </div>
      </div>
      <div className="dashboard-grid">
        <section className="card card-pad">
          <div className="panel-head">
            <div>
              <div className="eyebrow">Priority briefing</div>
              <h2>Your most useful next move</h2>
            </div>
            <Sparkles color="var(--indigo)" />
          </div>
          <div
            className="recommendation-box"
            style={{
              marginBottom: ".7rem",
            }}
          >
            <strong>
              {pending > 0
                ? `Review ${pending} submitted response${pending > 1 ? "s" : ""}`
                : weakestTopic
                  ? `Revisit ${weakestTopic.topic}`
                  : "Create the next learning activity"}
            </strong>
            <p
              style={{
                color: "#42615e",
                lineHeight: 1.55,
                margin: ".35rem 0 .7rem",
              }}
            >
              {pending > 0
                ? "Start with the oldest submissions, use AI for a draft comment, then edit before publishing."
                : weakestTopic
                  ? `Published results currently average ${weakestTopic.average}% for this topic across ${weakestTopic.evidenceCount} result${weakestTopic.evidenceCount === 1 ? "" : "s"}. Verify the need using classroom evidence before acting.`
                  : "There is not enough result evidence for a topic recommendation yet. Create a lesson resource, assignment, or quiz for your next objective."}
            </p>
            <Link
              href={pending > 0 ? "/teacher/review" : "/teacher/ai-tools"}
              style={{
                color: "var(--indigo)",
                fontWeight: 850,
                display: "inline-flex",
                gap: ".35rem",
                alignItems: "center",
              }}
            >
              Open suggested action <ArrowRight size={15} />
            </Link>
          </div>
          <SafetyNote />
        </section>
        <section className="card card-pad">
          <div className="panel-head">
            <div>
              <div className="eyebrow">Recent activity</div>
              <h2>Workspace ledger</h2>
            </div>
            <CheckCircle2 color="var(--teal)" />
          </div>
          <div className="activity-list">
            {activities.length ? (
              activities.map((a) => (
                <div key={a.id} className="activity-item">
                  <span className="activity-icon">
                    <CheckCircle2 size={15} />
                  </span>
                  <div>
                    <strong style={{ display: "block", fontSize: ".83rem" }}>
                      {a.action}
                    </strong>
                    <small className="hint">
                      {formatDateTime(a.createdAt)}
                    </small>
                  </div>
                </div>
              ))
            ) : (
              <p className="hint">
                Your recent account activity will appear here.
              </p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
