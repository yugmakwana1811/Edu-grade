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
import { AppNavLink } from "./app-nav-link";
import { FloatingTooltip } from "./floating-tooltip";
import { logoutAction } from "@/app/actions";
import { initials } from "@/lib/utils";
import type { Role } from "@prisma/client";

type LinkItem = { href: string; label: string; icon: LucideIcon };
type LinkGroup = { label: string; items: LinkItem[] };
const teacherGroups: LinkGroup[] = [
  {
    label: "Workspace",
    items: [
      { href: "/teacher", label: "Overview", icon: Home },
      { href: "/teacher/classes", label: "Classes", icon: Users },
    ],
  },
  {
    label: "Plan & teach",
    items: [
      { href: "/teacher/ai-tools", label: "AI studio", icon: Bot },
      { href: "/teacher/resources", label: "Resources", icon: Library },
    ],
  },
  {
    label: "Assess",
    items: [
      { href: "/teacher/assignments", label: "Assignments", icon: FileText },
      { href: "/teacher/quizzes", label: "Quizzes", icon: FileQuestion },
      { href: "/teacher/review", label: "Review work", icon: ClipboardCheck },
    ],
  },
  {
    label: "Operations",
    items: [
      { href: "/teacher/announcements", label: "Announcements", icon: Megaphone },
      { href: "/teacher/attendance", label: "Attendance", icon: CalendarCheck },
      {
        href: "/teacher/analytics",
        label: "Analytics",
        icon: ChartNoAxesCombined,
      },
    ],
  },
];
const studentGroups: LinkGroup[] = [
  {
    label: "Workspace",
    items: [
      { href: "/student", label: "Overview", icon: Home },
      { href: "/student/classes", label: "My classes", icon: School },
    ],
  },
  {
    label: "Learning",
    items: [
      { href: "/student/assignments", label: "Assignments", icon: FileText },
      { href: "/student/quizzes", label: "Quizzes", icon: BookOpen },
      { href: "/student/results", label: "Results", icon: ClipboardCheck },
    ],
  },
  {
    label: "Support & insights",
    items: [
      { href: "/student/ai-help", label: "AI study help", icon: Bot },
      { href: "/student/analytics", label: "Progress", icon: ChartNoAxesCombined },
    ],
  },
];
export function AppShell({
  user,
  children,
}: {
  user: { name: string; role: Role };
  children: React.ReactNode;
}) {
  const groups = user.role === "TEACHER" ? teacherGroups : studentGroups;
  const links = groups.flatMap((group) => group.items);
  const mobile = [
    links[0],
    links[1],
    user.role === "TEACHER" ? links[2] : links[2],
    links[links.length - 1],
  ];
  return (
    <div className="shell">
      <a className="skip-link" href="#main-content">
        Skip to main content
      </a>
      <aside className="sidebar">
        <div className="sidebar-brand">
          <Logo light />
          <span className="workspace-chip">
            {user.role === "TEACHER" ? "Teacher" : "Student"} workspace
          </span>
        </div>
        <nav aria-label="Workspace navigation">
          {groups.map((group) => (
            <div className="nav-group" key={group.label}>
              <div className="nav-group-label">{group.label}</div>
              {group.items.map(({ href, label, icon: Icon }) => (
                <AppNavLink
                  href={href}
                  label={label}
                  icon={<Icon size={18} />}
                  key={href}
                />
              ))}
            </div>
          ))}
        </nav>
        <div className="sidebar-account">
          <span className="avatar">{initials(user.name)}</span>
          <div className="account-copy">
            <strong>{user.name}</strong>
            <Link href="/account">
              <Settings size={11} /> Account settings
            </Link>
          </div>
          <form action={logoutAction}>
            <FloatingTooltip content="Sign out" placement="right">
              <button aria-label="Sign out" className="icon-button icon-button-dark">
                <LogOut size={17} />
              </button>
            </FloatingTooltip>
          </form>
        </div>
      </aside>
      <main className="shell-main" id="main-content">
        <header className="topbar">
          <div className="topbar-greeting">
            <strong>
              Good{" "}
              {new Date().getHours() < 12
                ? "morning"
                : new Date().getHours() < 17
                  ? "afternoon"
                  : "evening"}
              , {user.name.split(" ")[0]}
            </strong>
            <div className="hint hide-mobile">
              Smart Teaching. Faster Feedback. Better Learning.
            </div>
          </div>
          <div className="topbar-actions">
            <span className="secure-status">
              <span aria-hidden="true" />
              Protected workspace
            </span>
            <Link href="/about" className="topbar-link">
              Help & about
            </Link>
          </div>
        </header>
        {children}
      </main>
      <nav className="mobile-nav">
        {mobile.map(({ href, label, icon: Icon }) => (
          <AppNavLink
            href={href}
            label={label}
            icon={<Icon size={18} />}
            key={href}
          />
        ))}
      </nav>
    </div>
  );
}
