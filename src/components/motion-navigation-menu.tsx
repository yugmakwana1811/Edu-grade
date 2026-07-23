"use client";

import Link from "next/link";
import {
  BarChart3,
  Bot,
  Camera,
  ChevronDown,
  GraduationCap,
  Presentation,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

const menus = [
  {
    id: "platform-menu",
    label: "Platform",
    items: [
      {
        href: "#ai-studio",
        label: "AI teaching studio",
        description: "Plan lessons and create editable teaching material.",
        icon: Bot,
      },
      {
        href: "#answer-review",
        label: "Answer review",
        description: "Collect handwritten work and review every page.",
        icon: Camera,
      },
      {
        href: "#learning-signals",
        label: "Learning signals",
        description: "Turn classroom evidence into useful next steps.",
        icon: BarChart3,
      },
    ],
  },
  {
    id: "workspace-menu",
    label: "Workspaces",
    items: [
      {
        href: "#teacher-workspace",
        label: "For teachers",
        description: "Run classes, content, assessment, and communication.",
        icon: Presentation,
      },
      {
        href: "#student-workspace",
        label: "For students",
        description: "See work, submit answers, revise, and track progress.",
        icon: GraduationCap,
      },
    ],
  },
] as const;

export function MotionNavigationMenu() {
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const navRef = useRef<HTMLElement>(null);
  const activeMenu = menus.find((menu) => menu.id === openMenu);

  useEffect(() => {
    function closeOnOutsideInteraction(event: PointerEvent) {
      if (!navRef.current?.contains(event.target as Node)) setOpenMenu(null);
    }

    function closeOnEscape(event: KeyboardEvent) {
      if (event.key !== "Escape") return;
      setOpenMenu(null);
      (navRef.current?.querySelector("[aria-expanded='true']") as HTMLElement | null)?.focus();
    }

    document.addEventListener("pointerdown", closeOnOutsideInteraction);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("pointerdown", closeOnOutsideInteraction);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, []);

  return (
    <nav
      className="marketing-links motion-navigation"
      aria-label="Product navigation"
      ref={navRef}
      onMouseLeave={() => setOpenMenu(null)}
    >
      {menus.map((menu) => {
        const isOpen = openMenu === menu.id;
        return (
          <button
            className="motion-nav-trigger"
            type="button"
            key={menu.id}
            aria-expanded={isOpen}
            aria-controls="motion-navigation-viewport"
            onClick={() => setOpenMenu(isOpen ? null : menu.id)}
            onMouseEnter={() => setOpenMenu(menu.id)}
            onFocus={() => setOpenMenu(menu.id)}
          >
            {menu.label}
            <ChevronDown size={14} aria-hidden="true" />
          </button>
        );
      })}
      <a className="motion-nav-link" href="#trust" onFocus={() => setOpenMenu(null)}>
        Trust & AI safety
      </a>
      <Link className="motion-nav-link" href="/about" onFocus={() => setOpenMenu(null)}>
        About
      </Link>

      <div
        className={`motion-nav-viewport${activeMenu ? " is-open" : ""}`}
        id="motion-navigation-viewport"
        aria-hidden={!activeMenu}
      >
        {activeMenu ? (
          <div className="motion-nav-panel" key={activeMenu.id}>
            {activeMenu.items.map(({ href, label, description, icon: Icon }) => (
              <a
                className="motion-nav-card"
                href={href}
                key={href}
                onClick={() => setOpenMenu(null)}
              >
                <span className="motion-nav-card-icon" aria-hidden="true">
                  <Icon size={17} />
                </span>
                <span>
                  <strong>{label}</strong>
                  <small>{description}</small>
                </span>
              </a>
            ))}
          </div>
        ) : null}
      </div>
    </nav>
  );
}
