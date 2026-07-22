import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { Alert, EmptyState, PageHeader, SafetyNote } from "@/components/ui";
import { QuizBuilder } from "@/components/quiz-builder";

export default async function NewQuizPage({
  searchParams,
}: {
  searchParams: Promise<{ classId?: string; error?: string }>;
}) {
  const [{ classId, error }, user] = await Promise.all([
    searchParams,
    requireUser("TEACHER"),
  ]);
  const classes = await db.classRoom.findMany({
    where: { teacherId: user.teacherProfile!.id },
    select: { id: true, name: true, grade: true },
    orderBy: { name: "asc" },
  });
  return (
    <div className="page">
      <Link
        href="/teacher/quizzes"
        className="hint"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 5,
          marginBottom: "1rem",
        }}
      >
        <ArrowLeft size={15} /> All quizzes
      </Link>
      <PageHeader
        eyebrow="Quiz builder"
        title="Create an assessable concept check"
        description="Write precise questions, identify the correct response, and give learners an explanation they can use after submitting."
      />
      <Alert error={error} />
      {classes.length ? (
        <>
          <SafetyNote />
          <div style={{ height: ".8rem" }} />
          <QuizBuilder classes={classes} initialClassId={classId} />
        </>
      ) : (
        <EmptyState
          title="Create a class first"
          description="A quiz must belong to a class before it can be saved or published."
          action={
            <Link className="btn btn-primary" href="/teacher/classes">
              Create class
            </Link>
          }
        />
      )}
    </div>
  );
}
