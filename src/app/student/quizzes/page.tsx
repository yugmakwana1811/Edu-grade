import Link from "next/link";
import { ArrowRight, BookOpenCheck, Clock3, Trophy } from "lucide-react";
import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { EmptyState, PageHeader } from "@/components/ui";
export default async function Quizzes() {
  const user = await requireUser("STUDENT");
  const quizzes = await db.quiz.findMany({
    where: {
      published: true,
      class: { enrollments: { some: { studentId: user.studentProfile!.id } } },
    },
    include: {
      class: true,
      questions: true,
      attempts: {
        where: { studentId: user.studentProfile!.id },
        orderBy: { submittedAt: "desc" },
      },
    },
  });
  return (
    <div className="page">
      <PageHeader
        eyebrow="Quick learning checks"
        title="Quizzes for practice"
        description="Use quizzes to spot what you understand and what to revise. Each attempt is a learning signal, not a final academic decision."
      />
      {quizzes.length ? (
        <div className="grid-auto">
          {quizzes.map((q) => {
            const total = q.questions.reduce((n, x) => n + x.marks, 0);
            const last = q.attempts[0];
            return (
              <Link
                href={`/student/quizzes/${q.id}`}
                className="card card-pad"
                key={q.id}
              >
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <span className="badge badge-teal">{q.class.name}</span>
                  {last ? (
                    <Trophy size={19} color="var(--gold)" />
                  ) : (
                    <BookOpenCheck size={19} color="var(--teal)" />
                  )}
                </div>
                <h2
                  className="display"
                  style={{ fontSize: "1.6rem", margin: ".8rem 0 .35rem" }}
                >
                  {q.title}
                </h2>
                <p className="hint" style={{ lineHeight: 1.5 }}>
                  {q.description}
                </p>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginTop: "1rem",
                  }}
                >
                  <span className="hint">
                    <Clock3 size={14} style={{ display: "inline" }} />{" "}
                    {q.timeLimit
                      ? `Suggested ${q.timeLimit} min`
                      : "Self-paced"}{" "}
                    · {q.questions.length} questions
                  </span>
                  <span
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 5,
                      fontWeight: 800,
                      fontSize: ".8rem",
                    }}
                  >
                    {last ? `${Number(last.score)}/${total}` : "Start"}
                    <ArrowRight size={15} />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      ) : (
        <EmptyState
          title="No quizzes are published"
          description="Your teacher’s published concept checks will appear here."
        />
      )}
    </div>
  );
}
