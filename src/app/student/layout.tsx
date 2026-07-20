import { requireUser } from "@/lib/auth";
import { AppShell } from "@/components/app-shell";
export default async function StudentLayout({ children }: { children: React.ReactNode }) { const user = await requireUser("STUDENT"); return <AppShell user={user}>{children}</AppShell>; }
