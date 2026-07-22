"use server";

import bcrypt from "bcryptjs";
import { Prisma } from "@prisma/client";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { createSession, requireUser } from "@/lib/auth";
import {
  assertAuthAllowed,
  authThrottleKey,
  clearAuthFailures,
  recordAuthFailure,
} from "@/lib/auth-throttle";
import {
  accountSchema,
  emailChangeSchema,
  passwordChangeSchema,
} from "@/lib/validation";

function value(form: FormData, key: string) {
  return String(form.get(key) ?? "");
}
function fail(message: string): never {
  redirect(`/account?error=${encodeURIComponent(message)}`);
}

export async function updateAccountAction(form: FormData) {
  const user = await requireUser();
  const parsed = accountSchema.safeParse({
    name: value(form, "name"),
    school: value(form, "school"),
    subject: value(form, "subject"),
    grade: value(form, "grade"),
    rollNumber: value(form, "rollNumber"),
  });
  if (!parsed.success)
    fail(parsed.error.issues[0]?.message ?? "Check your profile details.");
  if (user.role === "STUDENT" && !parsed.data.grade)
    fail("Choose your grade from Class 6 to 12.");
  await db.$transaction(async (tx) => {
    await tx.user.update({
      where: { id: user.id },
      data: { name: parsed.data.name },
    });
    if (user.role === "TEACHER")
      await tx.teacherProfile.update({
        where: { userId: user.id },
        data: { school: parsed.data.school, subject: parsed.data.subject },
      });
    else
      await tx.studentProfile.update({
        where: { userId: user.id },
        data: {
          school: parsed.data.school,
          grade: parsed.data.grade,
          rollNumber: parsed.data.rollNumber,
        },
      });
    await tx.activityLog.create({
      data: { userId: user.id, action: "Updated profile", entityType: "User" },
    });
  });
  redirect("/account?success=Profile updated");
}

export async function changeEmailAction(form: FormData) {
  const user = await requireUser();
  const parsed = emailChangeSchema.safeParse({
    newEmail: value(form, "newEmail"),
    confirmEmail: value(form, "confirmEmail"),
    currentPassword: value(form, "currentPassword"),
  });
  if (!parsed.success)
    fail(parsed.error.issues[0]?.message ?? "Check the email fields.");
  if (parsed.data.newEmail === user.email)
    fail("Enter an email address different from your current one.");

  const throttleKey = await authThrottleKey("email-change", user.id);
  try {
    await assertAuthAllowed(throttleKey);
  } catch (error) {
    fail(
      error instanceof Error
        ? error.message
        : "Email change is temporarily unavailable.",
    );
  }

  const stored = await db.user.findUnique({
    where: { id: user.id },
    select: { passwordHash: true },
  });
  if (
    !stored ||
    !(await bcrypt.compare(parsed.data.currentPassword, stored.passwordHash))
  ) {
    await recordAuthFailure(throttleKey);
    fail("Current password is incorrect.");
  }
  await clearAuthFailures(throttleKey);

  try {
    await db.$transaction([
      db.user.update({
        where: { id: user.id },
        data: { email: parsed.data.newEmail },
      }),
      db.session.deleteMany({ where: { userId: user.id } }),
      db.activityLog.create({
        data: {
          userId: user.id,
          action: "Changed email address",
          entityType: "User",
        },
      }),
    ]);
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    )
      fail("That email address is already in use.");
    console.error(
      "[EduGrade] Email change failed",
      error instanceof Error ? error.message : "Unknown error",
    );
    fail("Email address could not be changed. Please try again.");
  }

  await createSession(user.id);
  redirect(
    "/account?success=Email changed and other sessions signed out",
  );
}

export async function changePasswordAction(form: FormData) {
  const user = await requireUser();
  const parsed = passwordChangeSchema.safeParse({
    currentPassword: value(form, "currentPassword"),
    newPassword: value(form, "newPassword"),
    confirmPassword: value(form, "confirmPassword"),
  });
  if (!parsed.success)
    fail(parsed.error.issues[0]?.message ?? "Check the password fields.");
  const stored = await db.user.findUnique({
    where: { id: user.id },
    select: { passwordHash: true },
  });
  if (
    !stored ||
    !(await bcrypt.compare(parsed.data.currentPassword, stored.passwordHash))
  )
    fail("Current password is incorrect.");
  const passwordHash = await bcrypt.hash(parsed.data.newPassword, 12);
  await db.$transaction([
    db.user.update({ where: { id: user.id }, data: { passwordHash } }),
    db.session.deleteMany({ where: { userId: user.id } }),
    db.activityLog.create({
      data: { userId: user.id, action: "Changed password", entityType: "User" },
    }),
  ]);
  await createSession(user.id);
  redirect("/account?success=Password changed and other sessions signed out");
}
