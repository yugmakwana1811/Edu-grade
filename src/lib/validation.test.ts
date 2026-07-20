import { describe, expect, it } from "vitest";
import { assignmentSchema, joinClassSchema, reviewSchema } from "./validation";

describe("EduGrade validation", () => {
  it("normalizes valid class codes", () => { expect(joinClassSchema.parse({ code: "acc12d" }).code).toBe("ACC12D"); });
  it("rejects malformed class codes", () => { expect(joinClassSchema.safeParse({ code: "A-12" }).success).toBe(false); });
  it("prevents marks above the assignment maximum", () => { expect(reviewSchema.safeParse({ submissionId: "sub-1", marks: 31, maxMarks: 30, feedback: "Specific and actionable feedback", publish: true }).success).toBe(false); });
  it("rejects deadlines in the past", () => { expect(assignmentSchema.safeParse({ classId: "class-1", title: "Valid assignment", description: "A sufficiently detailed learning purpose", type: "Test", maxMarks: 30, dueAt: "2020-01-01T10:00", publish: false }).success).toBe(false); });
});
