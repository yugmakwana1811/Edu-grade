import { PrismaClient, Role, AssignmentStatus, SubmissionStatus, AIContentType, AttendanceStatus } from "@prisma/client";
import bcrypt from "bcryptjs";

const db = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash("EduGrade@123", 12);
  const teacher = await db.user.upsert({
    where: { email: "teacher@edugrade.ai" },
    update: { passwordHash },
    create: { id: "demo-teacher-user", email: "teacher@edugrade.ai", passwordHash, name: "Meera Sharma", role: Role.TEACHER },
  });
  const student = await db.user.upsert({
    where: { email: "student@edugrade.ai" },
    update: { passwordHash },
    create: { id: "demo-student-user", email: "student@edugrade.ai", passwordHash, name: "Arjun Mehta", role: Role.STUDENT },
  });
  const teacherProfile = await db.teacherProfile.upsert({ where: { userId: teacher.id }, update: {}, create: { id: "demo-teacher-profile", userId: teacher.id, school: "Vidya Bharati Senior Secondary School", subject: "Accountancy" } });
  const studentProfile = await db.studentProfile.upsert({ where: { userId: student.id }, update: {}, create: { id: "demo-student-profile", userId: student.id, school: "Vidya Bharati Senior Secondary School", grade: "12", rollNumber: "12-C-17" } });
  const classroom = await db.classRoom.upsert({
    where: { code: "ACC12D" },
    update: {},
    create: { id: "demo-class", name: "Class 12 Commerce", subject: "Accountancy", grade: "12", code: "ACC12D", description: "CBSE Accountancy · Partnership Firms & Company Accounts", teacherId: teacherProfile.id },
  });
  await db.classEnrollment.upsert({ where: { classId_studentId: { classId: classroom.id, studentId: studentProfile.id } }, update: {}, create: { classId: classroom.id, studentId: studentProfile.id } });

  const dueAt = new Date(); dueAt.setDate(dueAt.getDate() + 5); dueAt.setHours(17, 0, 0, 0);
  const assignment = await db.assignment.upsert({
    where: { id: "demo-assignment" }, update: { dueAt },
    create: { id: "demo-assignment", classId: classroom.id, title: "Partnership Fundamentals Test", description: "Apply core principles of partnership accounting, including the profit and loss appropriation account and treatment of goodwill.", instructions: "Answer all questions. Show calculations clearly. Upload each handwritten page in order.", type: "Test", maxMarks: 30, dueAt, status: AssignmentStatus.PUBLISHED, topic: "Partnership Fundamentals" },
  });
  await db.assignmentAttachment.upsert({ where: { id: "demo-paper" }, update: {}, create: { id: "demo-paper", assignmentId: assignment.id, name: "Partnership_Test_Question_Paper.pdf", url: "/demo/partnership-question-paper.txt", mimeType: "text/plain", size: 1840 } });

  const submission = await db.submission.upsert({
    where: { assignmentId_studentId: { assignmentId: assignment.id, studentId: studentProfile.id } },
    update: {}, create: { id: "demo-submission", assignmentId: assignment.id, studentId: studentProfile.id, status: SubmissionStatus.PUBLISHED, note: "All answers attempted. Page 2 contains the working notes.", submittedAt: new Date(Date.now() - 86400000) },
  });
  for (const [index, name] of ["answer-page-1.svg", "answer-page-2.svg"].entries()) {
    await db.submissionPage.upsert({ where: { submissionId_pageNumber: { submissionId: submission.id, pageNumber: index + 1 } }, update: {}, create: { submissionId: submission.id, pageNumber: index + 1, name, url: `/demo/${name}`, mimeType: "image/svg+xml", size: 2840 } });
  }
  await db.result.upsert({ where: { submissionId: submission.id }, update: {}, create: { submissionId: submission.id, marks: 24, published: true, publishedAt: new Date(), teacherNote: "Good conceptual clarity. Revisit the treatment of goodwill on admission of a partner." } });
  if (!(await db.feedback.findFirst({ where: { submissionId: submission.id } }))) {
    await db.feedback.create({ data: { submissionId: submission.id, content: "Your appropriation account format and interest-on-capital calculation are accurate. In Question 4, show the sacrificing ratio before posting the goodwill adjustment. Revise the admission-of-a-partner steps, then retry the linked practice quiz.", isAiSuggested: true, approved: true } });
  }

  if ((await db.announcement.count({ where: { classId: classroom.id } })) === 0) {
    await db.announcement.createMany({ data: [
      { classId: classroom.id, authorId: teacher.id, title: "Revision clinic on Wednesday", content: "Bring your partnership adjustment doubts. We will solve two board-style questions together." },
      { classId: classroom.id, authorId: teacher.id, title: "Test submission checklist", content: "Upload clear, well-lit images in page order and verify every preview before submitting." },
    ] });
  }
  if ((await db.resource.count({ where: { classId: classroom.id } })) === 0) {
    await db.resource.createMany({ data: [
      { classId: classroom.id, title: "Partnership Fundamentals — Quick Notes", description: "Key formulas, journal entries, and common mistakes.", type: "Notes", url: "/demo/partnership-notes.txt", mimeType: "text/plain", size: 2200 },
      { classId: classroom.id, title: "Goodwill Adjustment Practice", description: "Five graduated board-style questions.", type: "Worksheet", url: "/demo/goodwill-practice.txt", mimeType: "text/plain", size: 1600 },
    ] });
  }
  let quiz = await db.quiz.findFirst({ where: { classId: classroom.id, title: "Partnership Concepts Check" } });
  if (!quiz) {
    quiz = await db.quiz.create({ data: { classId: classroom.id, title: "Partnership Concepts Check", description: "A quick 5-mark revision check.", published: true, timeLimit: 10 } });
    await db.quizQuestion.createMany({ data: [
      { quizId: quiz.id, order: 1, prompt: "In the absence of a partnership deed, profits are shared:", options: ["In capital ratio", "Equally", "In old ratio", "By seniority"], correctAnswer: "Equally", explanation: "The Partnership Act provides equal profit sharing when the deed is silent.", marks: 1 },
      { quizId: quiz.id, order: 2, prompt: "Interest on drawings is a:", options: ["Gain to the firm", "Loss to the firm", "Liability", "Reserve"], correctAnswer: "Gain to the firm", explanation: "It is charged to partners and credited to the appropriation account.", marks: 1 },
    ] });
  }
  if ((await db.attendanceRecord.count({ where: { classId: classroom.id } })) === 0) {
    for (let days = 1; days <= 8; days++) {
      const date = new Date(); date.setDate(date.getDate() - days * 2); date.setHours(0,0,0,0);
      await db.attendanceRecord.create({ data: { classId: classroom.id, studentId: studentProfile.id, date, status: days === 5 ? AttendanceStatus.ABSENT : AttendanceStatus.PRESENT } });
    }
  }
  if ((await db.aIContentGeneration.count({ where: { userId: teacher.id } })) === 0) {
    await db.aIContentGeneration.create({ data: { userId: teacher.id, type: AIContentType.LESSON_PLAN, prompt: { topic: "Goodwill valuation", grade: "12" }, output: "A structured 45-minute lesson plan covering goodwill valuation methods.", approved: true } });
  }
  await db.activityLog.createMany({ data: [
    { userId: teacher.id, action: "Published result", entityType: "Submission", entityId: submission.id },
    { userId: teacher.id, action: "Generated lesson plan", entityType: "AIContentGeneration" },
    { userId: student.id, action: "Viewed feedback", entityType: "Result", entityId: submission.id },
  ] });
  console.log("EduGrade AI demo data seeded. Password for both accounts: EduGrade@123");
}

main().finally(() => db.$disconnect());
