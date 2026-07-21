import { z } from "zod";

export const loginSchema = z.object({
  email: z.email().transform((v) => v.toLowerCase()),
  password: z.string().min(8, "Password must contain at least 8 characters"),
});
export const classSchema = z.object({
  name: z.string().min(3).max(80),
  subject: z.string().min(2).max(60),
  grade: z.string().min(1).max(20),
  description: z.string().max(300).optional(),
});
export const joinClassSchema = z.object({
  code: z
    .string()
    .trim()
    .toUpperCase()
    .regex(/^[A-Z0-9]{6}$/, "Enter a valid 6-character class code"),
});
export const assignmentSchema = z.object({
  classId: z.string().min(1),
  title: z.string().min(4).max(120),
  description: z.string().min(10).max(2000),
  instructions: z.string().max(2000).optional(),
  type: z.enum(["Assignment", "Homework", "Test", "Worksheet", "Practice"]),
  maxMarks: z.coerce.number().int().min(1).max(500),
  dueAt: z.coerce
    .date()
    .refine((d) => d > new Date(), "Deadline must be in the future"),
  publish: z.coerce.boolean().default(false),
});
export const reviewSchema = z
  .object({
    submissionId: z.string().min(1),
    marks: z.coerce.number().min(0),
    maxMarks: z.coerce.number().positive(),
    feedback: z.string().min(10).max(3000),
    publish: z.coerce.boolean().default(false),
  })
  .refine((v) => v.marks <= v.maxMarks, {
    message: "Marks cannot exceed the maximum",
    path: ["marks"],
  });
export const aiSchema = z.object({
  type: z.enum([
    "LESSON_PLAN",
    "EXPLANATION",
    "NOTES",
    "QUESTIONS",
    "QUIZ",
    "FEEDBACK",
    "REVISION_SHEET",
    "ANNOUNCEMENT",
    "DOUBT_HELP",
    "REVISION_HELP",
  ]),
  topic: z.string().min(3).max(160),
  grade: z.string().min(1).max(30).default("12"),
  details: z.string().max(1000).optional(),
});
export const announcementSchema = z.object({
  classId: z.string().min(1),
  title: z.string().min(3).max(100),
  content: z.string().min(5).max(1000),
});
export const resourceSchema = z.object({
  classId: z.string().min(1),
  title: z.string().min(3).max(120),
  description: z.string().max(500).optional(),
  type: z.enum([
    "Notes",
    "Worksheet",
    "Question Paper",
    "Reference",
    "Revision",
  ]),
});
export const attendanceStatusSchema = z.enum([
  "PRESENT",
  "ABSENT",
  "LATE",
  "EXCUSED",
]);
export const attendanceDateSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Enter a valid attendance date")
  .transform((value) => new Date(`${value}T00:00:00.000Z`))
  .refine(
    (value) => !Number.isNaN(value.getTime()),
    "Enter a valid attendance date",
  );
export const generatedContentSchema = z.object({
  id: z.string().min(1),
  output: z
    .string()
    .trim()
    .min(10, "Generated content cannot be empty")
    .max(20000, "Generated content is too long"),
  approved: z.boolean(),
});
export const submissionNoteSchema = z
  .string()
  .max(500, "The note must be 500 characters or fewer");
export const uploadedPageSchema = z.object({
  url: z.url(),
  name: z.string().min(1).max(255),
  pageNumber: z.number().int().min(1).max(20),
});
export const uploadedPagesSchema = z
  .array(uploadedPageSchema)
  .min(1, "Upload at least one answer page")
  .max(20, "Upload no more than 20 pages")
  .superRefine((pages, ctx) => {
    const numbers = new Set(pages.map((page) => page.pageNumber));
    if (
      numbers.size !== pages.length ||
      pages.some((page, index) => page.pageNumber !== index + 1)
    )
      ctx.addIssue({
        code: "custom",
        message: "Answer pages must be in order without duplicates",
      });
  });
