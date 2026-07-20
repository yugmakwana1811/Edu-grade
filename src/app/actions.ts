"use server";

import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { createSession, destroySession, requireUser } from "@/lib/auth";
import { aiSchema, announcementSchema, assignmentSchema, classSchema, joinClassSchema, loginSchema, resourceSchema, reviewSchema } from "@/lib/validation";
import { generateAI } from "@/lib/ai";
import { storeFile, validateFile } from "@/lib/storage";
import type { AIContentType } from "@prisma/client";

function text(form: FormData, key: string) { return String(form.get(key) ?? ""); }
function fail(path: string, message: string): never { redirect(`${path}?error=${encodeURIComponent(message)}`); }
function messageOf(error: unknown) { return error instanceof Error ? error.message : "Something went wrong. Please try again."; }

export async function loginAction(form: FormData) {
  const result = loginSchema.safeParse({ email: text(form, "email"), password: text(form, "password") });
  if (!result.success) fail("/login", result.error.issues[0]?.message ?? "Check your details.");
  const user = await db.user.findUnique({ where: { email: result.data.email } });
  if (!user || !(await bcrypt.compare(result.data.password, user.passwordHash))) fail("/login", "Email or password is incorrect.");
  await createSession(user.id);
  await db.activityLog.create({ data: { userId: user.id, action: "Signed in", entityType: "Session" } });
  redirect(user.role === "TEACHER" ? "/teacher" : "/student");
}

export async function logoutAction() { await destroySession(); redirect("/login"); }

export async function createClassAction(form: FormData) {
  const user = await requireUser("TEACHER");
  const parsed = classSchema.safeParse({ name: text(form, "name"), subject: text(form, "subject"), grade: text(form, "grade"), description: text(form, "description") });
  if (!parsed.success) fail("/teacher/classes", parsed.error.issues[0]?.message ?? "Check the class details.");
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; let code = "";
  do { code = Array.from({ length: 6 }, () => alphabet[Math.floor(Math.random() * alphabet.length)]).join(""); } while (await db.classRoom.findUnique({ where: { code } }));
  const classroom = await db.classRoom.create({ data: { ...parsed.data, code, teacherId: user.teacherProfile!.id } });
  await db.activityLog.create({ data: { userId: user.id, action: "Created class", entityType: "ClassRoom", entityId: classroom.id } });
  redirect(`/teacher/classes/${classroom.id}?success=Class created`);
}

export async function joinClassAction(form: FormData) {
  const user = await requireUser("STUDENT");
  const parsed = joinClassSchema.safeParse({ code: text(form, "code") });
  if (!parsed.success) fail("/student/classes", parsed.error.issues[0]?.message ?? "Invalid class code.");
  const classroom = await db.classRoom.findUnique({ where: { code: parsed.data.code } });
  if (!classroom) fail("/student/classes", "No class was found with that code.");
  await db.classEnrollment.upsert({ where: { classId_studentId: { classId: classroom.id, studentId: user.studentProfile!.id } }, update: {}, create: { classId: classroom.id, studentId: user.studentProfile!.id } });
  await db.activityLog.create({ data: { userId: user.id, action: "Joined class", entityType: "ClassRoom", entityId: classroom.id } });
  redirect(`/student/classes/${classroom.id}?success=You joined the class`);
}

export async function createAssignmentAction(form: FormData) {
  const user = await requireUser("TEACHER");
  const parsed = assignmentSchema.safeParse({ classId: text(form, "classId"), title: text(form, "title"), description: text(form, "description"), instructions: text(form, "instructions"), type: text(form, "type"), maxMarks: text(form, "maxMarks"), dueAt: text(form, "dueAt"), publish: form.get("publish") === "on" });
  if (!parsed.success) fail("/teacher/assignments/new", parsed.error.issues[0]?.message ?? "Check the assignment details.");
  const owns = await db.classRoom.findFirst({ where: { id: parsed.data.classId, teacherId: user.teacherProfile!.id } });
  if (!owns) fail("/teacher/assignments/new", "You cannot add work to that class.");
  const file = form.get("attachment"); let assignmentId = "";
  try {
    const assignment = await db.assignment.create({ data: { classId: parsed.data.classId, title: parsed.data.title, description: parsed.data.description, instructions: parsed.data.instructions, type: parsed.data.type, maxMarks: parsed.data.maxMarks, dueAt: parsed.data.dueAt, status: parsed.data.publish ? "PUBLISHED" : "DRAFT" } });
    assignmentId = assignment.id;
    if (file instanceof File && file.size) { validateFile(file); const url = await storeFile(file, "assignments"); await db.assignmentAttachment.create({ data: { assignmentId: assignment.id, name: file.name, url, mimeType: file.type, size: file.size } }); }
    await db.activityLog.create({ data: { userId: user.id, action: parsed.data.publish ? "Published assignment" : "Saved assignment draft", entityType: "Assignment", entityId: assignment.id } });
  } catch (error) { fail("/teacher/assignments/new", messageOf(error)); }
  redirect(`/teacher/assignments/${assignmentId}?success=Assignment saved`);
}

export async function publishAssignmentAction(form: FormData) {
  const user = await requireUser("TEACHER"); const id = text(form, "id");
  const assignment = await db.assignment.findFirst({ where: { id, class: { teacherId: user.teacherProfile!.id } } });
  if (!assignment) fail("/teacher/assignments", "Assignment not found.");
  await db.assignment.update({ where: { id }, data: { status: "PUBLISHED" } }); revalidatePath(`/teacher/assignments/${id}`);
}

export async function generateContentAction(form: FormData) {
  const user = await requireUser();
  const parsed = aiSchema.safeParse({ type: text(form, "type"), topic: text(form, "topic"), grade: text(form, "grade") || "12", details: text(form, "details") });
  const base = user.role === "TEACHER" ? "/teacher/ai-tools" : "/student/ai-help";
  if (!parsed.success) fail(base, parsed.error.issues[0]?.message ?? "Check your prompt.");
  if (user.role === "STUDENT" && !["DOUBT_HELP", "REVISION_HELP", "EXPLANATION"].includes(parsed.data.type)) fail(base, "That tool is available to teachers only.");
  const generated = await generateAI({ ...parsed.data, type: parsed.data.type as AIContentType });
  const record = await db.aIContentGeneration.create({ data: { userId: user.id, type: parsed.data.type as AIContentType, prompt: { topic: parsed.data.topic, grade: parsed.data.grade, details: parsed.data.details }, output: generated.content, provider: generated.provider } });
  await db.activityLog.create({ data: { userId: user.id, action: "Generated AI suggestion", entityType: "AIContentGeneration", entityId: record.id } });
  redirect(`${base}?generation=${record.id}`);
}

export async function saveGeneratedContentAction(form: FormData) {
  const user = await requireUser(); const id = text(form, "id"); const output = text(form, "output");
  const record = await db.aIContentGeneration.findFirst({ where: { id, userId: user.id } });
  if (!record) fail(user.role === "TEACHER" ? "/teacher/ai-tools" : "/student/ai-help", "Content not found.");
  await db.aIContentGeneration.update({ where: { id }, data: { output, approved: form.get("approved") === "on" } });
  revalidatePath(user.role === "TEACHER" ? "/teacher/ai-tools" : "/student/ai-help");
}

export async function createAnnouncementAction(form: FormData) {
  const user = await requireUser("TEACHER");
  const parsed = announcementSchema.safeParse({ classId: text(form, "classId"), title: text(form, "title"), content: text(form, "content") });
  if (!parsed.success) fail("/teacher/announcements", parsed.error.issues[0]?.message ?? "Check the announcement.");
  const owns = await db.classRoom.findFirst({ where: { id: parsed.data.classId, teacherId: user.teacherProfile!.id } }); if (!owns) fail("/teacher/announcements", "Class not found.");
  await db.announcement.create({ data: { ...parsed.data, authorId: user.id } });
  redirect("/teacher/announcements?success=Announcement sent");
}

export async function uploadResourceAction(form: FormData) {
  const user = await requireUser("TEACHER"); const parsed = resourceSchema.safeParse({ classId: text(form, "classId"), title: text(form, "title"), description: text(form, "description"), type: text(form, "type") });
  if (!parsed.success) fail("/teacher/resources", parsed.error.issues[0]?.message ?? "Check the resource details.");
  const file = form.get("file"); if (!(file instanceof File)) fail("/teacher/resources", "Select a file to upload.");
  const owns = await db.classRoom.findFirst({ where: { id: parsed.data.classId, teacherId: user.teacherProfile!.id } }); if (!owns) fail("/teacher/resources", "Class not found.");
  try { validateFile(file); const url = await storeFile(file, "resources"); await db.resource.create({ data: { ...parsed.data, url, mimeType: file.type, size: file.size } }); } catch (error) { fail("/teacher/resources", messageOf(error)); }
  redirect("/teacher/resources?success=Resource uploaded");
}

export async function submitWorkAction(form: FormData) {
  const user = await requireUser("STUDENT"); const assignmentId = text(form, "assignmentId"); const note = text(form, "note");
  const assignment = await db.assignment.findFirst({ where: { id: assignmentId, status: "PUBLISHED", class: { enrollments: { some: { studentId: user.studentProfile!.id } } } } });
  if (!assignment) fail("/student/assignments", "Assignment not found.");
  const files = form.getAll("pages").filter((f): f is File => f instanceof File && f.size > 0);
  if (!files.length) fail(`/student/assignments/${assignmentId}`, "Upload at least one answer-page image.");
  if (files.length > 20) fail(`/student/assignments/${assignmentId}`, "Upload no more than 20 pages.");
  try {
    files.forEach((file) => validateFile(file, true));
    const submission = await db.submission.upsert({ where: { assignmentId_studentId: { assignmentId, studentId: user.studentProfile!.id } }, update: { note, status: "DRAFT" }, create: { assignmentId, studentId: user.studentProfile!.id, note } });
    await db.submissionPage.deleteMany({ where: { submissionId: submission.id } });
    for (const [index, file] of files.entries()) { const url = await storeFile(file, "submissions", true); await db.submissionPage.create({ data: { submissionId: submission.id, pageNumber: index + 1, name: file.name, url, mimeType: file.type, size: file.size } }); }
    await db.submission.update({ where: { id: submission.id }, data: { status: "SUBMITTED", submittedAt: new Date() } });
    await db.activityLog.create({ data: { userId: user.id, action: "Submitted answer pages", entityType: "Submission", entityId: submission.id, metadata: { pageCount: files.length } } });
  } catch (error) { fail(`/student/assignments/${assignmentId}`, messageOf(error)); }
  redirect(`/student/assignments/${assignmentId}?success=Submission received`);
}

export async function generateFeedbackAction(form: FormData) {
  const user = await requireUser("TEACHER"); const submissionId = text(form, "submissionId");
  const submission = await db.submission.findFirst({ where: { id: submissionId, assignment: { class: { teacherId: user.teacherProfile!.id } } }, include: { assignment: { include: { class: true } }, student: { include: { user: true } } } });
  if (!submission) fail("/teacher/review", "Submission not found.");
  const generated = await generateAI({ type: "FEEDBACK", topic: submission.assignment.topic ?? submission.assignment.title, grade: submission.assignment.class.grade, details: `Learner: ${submission.student.user.name}. Use supportive, specific language. Do not decide marks.` });
  await db.feedback.create({ data: { submissionId, content: generated.content, isAiSuggested: true } });
  revalidatePath(`/teacher/review/${submissionId}`);
}

export async function saveReviewAction(form: FormData) {
  const user = await requireUser("TEACHER"); const parsed = reviewSchema.safeParse({ submissionId: text(form, "submissionId"), marks: text(form, "marks"), maxMarks: text(form, "maxMarks"), feedback: text(form, "feedback"), publish: form.get("publish") === "on" });
  if (!parsed.success) fail(`/teacher/review/${text(form, "submissionId")}`, parsed.error.issues[0]?.message ?? "Check the review.");
  const submission = await db.submission.findFirst({ where: { id: parsed.data.submissionId, assignment: { class: { teacherId: user.teacherProfile!.id } } } }); if (!submission) fail("/teacher/review", "Submission not found.");
  await db.$transaction([
    db.result.upsert({ where: { submissionId: submission.id }, update: { marks: parsed.data.marks, published: parsed.data.publish, publishedAt: parsed.data.publish ? new Date() : null }, create: { submissionId: submission.id, marks: parsed.data.marks, published: parsed.data.publish, publishedAt: parsed.data.publish ? new Date() : null } }),
    db.feedback.create({ data: { submissionId: submission.id, content: parsed.data.feedback, approved: true } }),
    db.submission.update({ where: { id: submission.id }, data: { status: parsed.data.publish ? "PUBLISHED" : "REVIEWED" } }),
    db.activityLog.create({ data: { userId: user.id, action: parsed.data.publish ? "Published result" : "Saved review", entityType: "Submission", entityId: submission.id } }),
  ]);
  redirect(`/teacher/review/${submission.id}?success=${parsed.data.publish ? "Result published" : "Review saved"}`);
}

export async function markAttendanceAction(form: FormData) {
  const user = await requireUser("TEACHER"); const classId = text(form, "classId"); const date = new Date(text(form, "date"));
  const classroom = await db.classRoom.findFirst({ where: { id: classId, teacherId: user.teacherProfile!.id }, include: { enrollments: true } }); if (!classroom) fail("/teacher/attendance", "Class not found.");
  date.setHours(0,0,0,0);
  await Promise.all(classroom.enrollments.map((e) => db.attendanceRecord.upsert({ where: { classId_studentId_date: { classId, studentId: e.studentId, date } }, update: { status: text(form, `status-${e.studentId}`) as "PRESENT" | "ABSENT" | "LATE" | "EXCUSED" }, create: { classId, studentId: e.studentId, date, status: text(form, `status-${e.studentId}`) as "PRESENT" | "ABSENT" | "LATE" | "EXCUSED" } })));
  redirect("/teacher/attendance?success=Attendance saved");
}

export async function submitQuizAction(form: FormData) {
  const user = await requireUser("STUDENT"); const quizId = text(form, "quizId");
  const quiz = await db.quiz.findFirst({ where: { id: quizId, published: true, class: { enrollments: { some: { studentId: user.studentProfile!.id } } } }, include: { questions: true } });
  if (!quiz) fail("/student/quizzes", "Quiz not found.");
  const answers: Record<string,string> = {}; let score = 0; let max = 0;
  for (const question of quiz.questions) { const answer = text(form, `answer-${question.id}`); if (!answer) fail(`/student/quizzes/${quiz.id}`, "Answer every question before submitting."); answers[question.id] = answer; max += question.marks; if (answer === question.correctAnswer) score += question.marks; }
  const attempt = await db.quizAttempt.create({ data: { quizId: quiz.id, studentId: user.studentProfile!.id, answers, score } });
  await db.activityLog.create({ data: { userId: user.id, action: "Completed quiz", entityType: "QuizAttempt", entityId: attempt.id, metadata: { score, max } } });
  redirect(`/student/quizzes/${quiz.id}?attempt=${attempt.id}`);
}
