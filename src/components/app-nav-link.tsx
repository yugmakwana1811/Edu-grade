"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { FloatingTooltip } from "./floating-tooltip";

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

  const link = (
    <Link
      className="nav-link"
      href={href}
      aria-label={label}
      aria-current={active ? "page" : undefined}
    >
      <span className="nav-icon" aria-hidden="true">
        {icon}
      </span>
      <span>{label}</span>
    </Link>
  );

  return (
    <FloatingTooltip
      className="nav-floating-tooltip"
      content={label}
      placement="right"
      showWhen="(min-width: 861px) and (max-width: 1080px)"
    >
      {link}
    </FloatingTooltip>
  );
}
