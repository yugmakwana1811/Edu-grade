import { requireUser } from "@/lib/auth";
import { AppShell } from "@/components/app-shell";
export default async function TeacherLayout({ children }: { children: React.ReactNode }) { const user = await requireUser("TEACHER"); return <AppShell user={user}>{children}</AppShell>; }
