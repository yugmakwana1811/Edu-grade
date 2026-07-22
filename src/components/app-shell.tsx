import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import {
  BookOpen,
  Bot,
  CalendarCheck,
  ChartNoAxesCombined,
  ClipboardCheck,
  FileQuestion,
  FileText,
  Home,
  Library,
  LogOut,
  Megaphone,
  School,
  Settings,
  Users,
} from "lucide-react";
import { Logo } from "./logo";
import { logoutAction } from "@/app/actions";
import { initials } from "@/lib/utils";
import type { Role } from "@prisma/client";

type LinkItem = { href: string; label: string; icon: LucideIcon };
const teacherLinks: LinkItem[] = [
  { href: "/teacher", label: "Overview", icon: Home },
  { href: "/teacher/classes", label: "Classes", icon: Users },
  { href: "/teacher/ai-tools", label: "AI studio", icon: Bot },
  { href: "/teacher/assignments", label: "Assignments", icon: FileText },
  { href: "/teacher/quizzes", label: "Quizzes", icon: FileQuestion },
  { href: "/teacher/review", label: "Review work", icon: ClipboardCheck },
  { href: "/teacher/resources", label: "Resources", icon: Library },
  { href: "/teacher/announcements", label: "Announcements", icon: Megaphone },
  { href: "/teacher/attendance", label: "Attendance", icon: CalendarCheck },
  { href: "/teacher/analytics", label: "Analytics", icon: ChartNoAxesCombined },
];
const studentLinks: LinkItem[] = [
  { href: "/student", label: "Overview", icon: Home },
  { href: "/student/classes", label: "My classes", icon: School },
  { href: "/student/assignments", label: "Assignments", icon: FileText },
  { href: "/student/results", label: "Results", icon: ClipboardCheck },
  { href: "/student/quizzes", label: "Quizzes", icon: BookOpen },
  { href: "/student/ai-help", label: "AI study help", icon: Bot },
  { href: "/student/analytics", label: "Progress", icon: ChartNoAxesCombined },
];
export function AppShell({
  user,
  children,
}: {
  user: { name: string; role: Role };
  children: React.ReactNode;
}) {
  const links = user.role === "TEACHER" ? teacherLinks : studentLinks;
  const mobile = [
    links[0],
    links[1],
    user.role === "TEACHER" ? links[2] : links[2],
    links[links.length - 1],
  ];
  return (
    <div className="shell">
      <aside className="sidebar">
        <Logo light />
        <div
          className="eyebrow"
          style={{ color: "#80d6ce", marginTop: "1.6rem" }}
        >
          {user.role === "TEACHER" ? "Teacher workspace" : "Student workspace"}
        </div>
        <nav>
          {links.map(({ href, label, icon: Icon }) => (
            <Link className="nav-link" href={href} key={href}>
              <Icon size={18} />
              {label}
            </Link>
          ))}
        </nav>
        <div
          style={{
            marginTop: "auto",
            borderTop: "1px solid rgba(255,255,255,.12)",
            paddingTop: "1rem",
            display: "flex",
            alignItems: "center",
            gap: ".7rem",
          }}
        >
          <span
            style={{
              width: 37,
              height: 37,
              display: "grid",
              placeItems: "center",
              background: "var(--coral)",
              borderRadius: 10,
              fontWeight: 900,
            }}
          >
            {initials(user.name)}
          </span>
          <div style={{ minWidth: 0, flex: 1 }}>
            <strong
              style={{
                display: "block",
                fontSize: ".83rem",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {user.name}
            </strong>
            <Link
              href="/account"
              style={{
                fontSize: ".72rem",
                color: "#aebdcb",
                display: "inline-flex",
                gap: 4,
                alignItems: "center",
              }}
            >
              <Settings size={11} /> Account settings
            </Link>
          </div>
          <form action={logoutAction}>
            <button
              aria-label="Sign out"
              style={{
                border: 0,
                color: "#dbe3eb",
                background: "transparent",
                cursor: "pointer",
              }}
            >
              <LogOut size={17} />
            </button>
          </form>
        </div>
      </aside>
      <main className="shell-main">
        <header className="topbar">
          <div>
            <strong style={{ fontSize: ".9rem" }}>
              Good{" "}
              {new Date().getHours() < 12
                ? "morning"
                : new Date().getHours() < 17
                  ? "afternoon"
                  : "evening"}
              , {user.name.split(" ")[0]}
            </strong>
            <div className="hint hide-mobile">
              Smart teaching, one thoughtful step at a time.
            </div>
          </div>
          <Link
            href="/about"
            className="btn btn-secondary"
            style={{
              minHeight: 38,
              padding: ".45rem .8rem",
              fontSize: ".8rem",
            }}
          >
            About EduGrade
          </Link>
        </header>
        {children}
      </main>
      <nav className="mobile-nav">
        {mobile.map(({ href, label, icon: Icon }) => (
          <Link href={href} key={href}>
            <Icon size={20} />
            <span>{label}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
}
