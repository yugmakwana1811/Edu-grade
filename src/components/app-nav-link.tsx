"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

export function AppNavLink({
  href,
  label,
  icon,
}: {
  href: string;
  label: string;
  icon: ReactNode;
}) {
  const pathname = usePathname();
  const isOverview = href === "/teacher" || href === "/student";
  const active = isOverview ? pathname === href : pathname.startsWith(href);

  return (
    <Link
      className="nav-link"
      href={href}
      aria-current={active ? "page" : undefined}
    >
      <span className="nav-icon" aria-hidden="true">
        {icon}
      </span>
      <span>{label}</span>
    </Link>
  );
}
