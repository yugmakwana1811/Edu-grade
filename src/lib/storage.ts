import { put } from "@vercel/blob";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";

const MAX_SIZE = 10 * 1024 * 1024;
const ALLOWED = new Set(["image/jpeg", "image/png", "image/webp", "application/pdf", "text/plain"]);

export function validateFile(file: File, imageOnly = false) {
  if (!file.size) throw new Error("The selected file is empty.");
  if (file.size > MAX_SIZE) throw new Error("Files must be 10 MB or smaller.");
  if (!ALLOWED.has(file.type) || (imageOnly && !file.type.startsWith("image/"))) throw new Error(imageOnly ? "Upload a JPG, PNG, or WebP image." : "Upload a JPG, PNG, WebP, PDF, or text file.");
}
export async function storeFile(file: File, folder: string, privateAccess = false) {
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "-");
  const filename = `${folder}/${randomUUID()}-${safeName}`;
  if (process.env.BLOB_READ_WRITE_TOKEN) {
    const blob = await put(filename, file, { access: privateAccess ? "private" : "public", token: process.env.BLOB_READ_WRITE_TOKEN, addRandomSuffix: false });
    return blob.url;
  }
  if (process.env.NODE_ENV === "production") throw new Error("File storage is not configured. Set BLOB_READ_WRITE_TOKEN.");
  const dir = path.join(process.cwd(), "public", "uploads", folder); await mkdir(dir, { recursive: true });
  await writeFile(path.join(dir, path.basename(filename)), Buffer.from(await file.arrayBuffer()));
  return `/uploads/${folder}/${path.basename(filename)}`;
}
