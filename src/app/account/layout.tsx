import { AppShell } from "@/components/app-shell";
import { requireUser } from "@/lib/auth";

export default async function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireUser();
  return (
    <AppShell user={{ name: user.name, role: user.role }}>{children}</AppShell>
  );
}
