import { checkDatabaseConnection } from "@/lib/db";

export async function GET() {
  const database = await checkDatabaseConnection();
  const storageConfigured = Boolean(process.env.BLOB_READ_WRITE_TOKEN);
  return Response.json({ status: database.ok ? "ready" : "degraded", database: database.ok ? "connected" : "unavailable", storage: storageConfigured ? "configured" : "unavailable" }, { status: database.ok ? 200 : 503, headers: { "Cache-Control": "no-store" } });
}
