import "server-only";
import { get } from "@vercel/blob";
import { NextRequest, NextResponse } from "next/server";

export async function storedFileResponse(request: NextRequest, url: string, name: string) {
  if (url.startsWith("/")) return NextResponse.redirect(new URL(url, request.url));
  if (!process.env.BLOB_READ_WRITE_TOKEN) return NextResponse.json({ error: "Private storage is not configured" }, { status: 503 });
  const blob = await get(url, { access: "private", token: process.env.BLOB_READ_WRITE_TOKEN });
  if (!blob?.stream) return NextResponse.json({ error: "File not found" }, { status: 404 });
  const headers = new Headers();
  blob.headers.forEach((value, key) => headers.set(key, value));
  headers.set("Cache-Control", "private, max-age=300");
  headers.set("Content-Disposition", `inline; filename="${name.replaceAll('"', "")}"`);
  headers.set("X-Content-Type-Options", "nosniff");
  return new Response(blob.stream, { headers });
}
