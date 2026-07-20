import { get } from "@vercel/blob";
import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  const { id } = await params;
  const page = await db.submissionPage.findFirst({ where: { id, submission: user.role === "STUDENT" ? { studentId: user.studentProfile!.id } : { assignment: { class: { teacherId: user.teacherProfile!.id } } } } });
  if (!page) return NextResponse.json({ error: "File not found" }, { status: 404 });
  if (page.url.startsWith("/")) return NextResponse.redirect(new URL(page.url, request.url));
  if (!process.env.BLOB_READ_WRITE_TOKEN) return NextResponse.json({ error: "Private storage is not configured" }, { status: 503 });
  const blob = await get(page.url, { access: "private", token: process.env.BLOB_READ_WRITE_TOKEN });
  if (!blob?.stream) return NextResponse.json({ error: "File not found" }, { status: 404 });
  const headers = new Headers(); blob.headers.forEach((value, key) => headers.set(key, value)); headers.set("Cache-Control", "private, max-age=300"); headers.set("Content-Disposition", `inline; filename="${page.name.replaceAll('"', '')}"`);
  return new Response(blob.stream, { headers });
}
