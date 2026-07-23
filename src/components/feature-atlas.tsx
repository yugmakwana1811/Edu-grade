"use client";

import {
  BarChart3,
  BookOpenCheck,
  BrainCircuit,
  Check,
  ClipboardCheck,
  FileUp,
  LibraryBig,
  MessagesSquare,
  School,
  ShieldCheck,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useRef, useState, type KeyboardEvent } from "react";

type Audience = "teacher" | "student" | "ai" | "shared";
type Filter = "all" | Audience;

type CapabilityGroup = {
  title: string;
  phase: string;
  icon: LucideIcon;
  features: Array<{ label: string; audiences: Audience[] }>;
};

const groups: CapabilityGroup[] = [
  {
    title: "Secure foundation",
    phase: "Access",
    icon: ShieldCheck,
    features: [
      { label: "Authentication and role selection", audiences: ["shared"] },
      { label: "Protected teacher and student routes", audiences: ["shared"] },
      { label: "Email and password security dashboards", audiences: ["shared"] },
      { label: "Persistent data and seeded demo workspace", audiences: ["shared"] },
    ],
  },
  {
    title: "Classroom operations",
    phase: "Organise",
    icon: School,
    features: [
      { label: "Create and manage classes", audiences: ["teacher"] },
      { label: "Join classes with secure class codes", audiences: ["student"] },
      { label: "Enrollment rosters and class workspaces", audiences: ["teacher"] },
      { label: "Complete Class 6–12 subject catalog", audiences: ["shared"] },
    ],
  },
  {
    title: "AI planning studio",
    phase: "Plan",
    icon: Sparkles,
    features: [
      { label: "Lesson plan generator", audiences: ["teacher", "ai"] },
      { label: "Explanation generator", audiences: ["teacher", "ai"] },
      { label: "Notes and summary generator", audiences: ["teacher", "ai"] },
      { label: "Revision sheet generator", audiences: ["teacher", "ai"] },
    ],
  },
  {
    title: "Assessment creation",
    phase: "Assign",
    icon: BookOpenCheck,
    features: [
      {
        label: "Assignments, homework, tests and worksheets",
        audiences: ["teacher"],
      },
      { label: "Question generator", audiences: ["teacher", "ai"] },
      { label: "Quiz generator and editable builder", audiences: ["teacher", "ai"] },
      { label: "Published student quiz attempts", audiences: ["student"] },
    ],
  },
  {
    title: "Resources & communication",
    phase: "Teach",
    icon: LibraryBig,
    features: [
      { label: "Resource and question-paper library", audiences: ["teacher", "student"] },
      { label: "Announcements and reminders", audiences: ["teacher", "student", "ai"] },
      { label: "Attendance and participation records", audiences: ["teacher"] },
      { label: "Class updates in the student workspace", audiences: ["student"] },
    ],
  },
  {
    title: "Handwritten submission",
    phase: "Collect",
    icon: FileUp,
    features: [
      { label: "Multi-page answer photo upload", audiences: ["student"] },
      { label: "Page preview, ordering and removal", audiences: ["student"] },
      { label: "Submission checklist and status tracking", audiences: ["student"] },
      { label: "Private, validated file handling", audiences: ["shared"] },
    ],
  },
  {
    title: "Review & results",
    phase: "Evaluate",
    icon: ClipboardCheck,
    features: [
      { label: "Teacher page-by-page submission review", audiences: ["teacher"] },
      { label: "AI-assisted feedback suggestions", audiences: ["teacher", "ai"] },
      { label: "Editable marks and teacher feedback", audiences: ["teacher"] },
      { label: "Teacher-controlled result publishing", audiences: ["teacher", "student"] },
    ],
  },
  {
    title: "Learning support",
    phase: "Support",
    icon: BrainCircuit,
    features: [
      { label: "Student doubt assistant", audiences: ["student", "ai"] },
      { label: "Student revision assistant", audiences: ["student", "ai"] },
      { label: "Subject-aware approved model routing", audiences: ["ai"] },
      { label: "Editable, reviewable AI outputs", audiences: ["teacher", "ai"] },
    ],
  },
  {
    title: "Progress intelligence",
    phase: "Analyse",
    icon: BarChart3,
    features: [
      { label: "Teacher class and workload analytics", audiences: ["teacher"] },
      { label: "Student score and progress trends", audiences: ["student"] },
      { label: "Weak-topic and attention signals", audiences: ["teacher", "student"] },
      { label: "Activity log and time-saved estimates", audiences: ["teacher"] },
    ],
  },
  {
    title: "Teacher-owned AI",
    phase: "Control",
    icon: MessagesSquare,
    features: [
      { label: "Feedback and announcement generators", audiences: ["teacher", "ai"] },
      { label: "Approval before assignment or publishing", audiences: ["teacher", "ai"] },
      { label: "Honest fallback and limitation messaging", audiences: ["shared", "ai"] },
      { label: "Final academic decisions stay human", audiences: ["shared", "ai"] },
    ],
  },
];

const filters: Array<{ id: Filter; label: string }> = [
  { id: "all", label: "Complete platform" },
  { id: "teacher", label: "Teacher" },
  { id: "student", label: "Student" },
  { id: "ai", label: "AI & safety" },
  { id: "shared", label: "Foundation" },
];

export function FeatureAtlas() {
  const [filter, setFilter] = useState<Filter>("all");
  const reduceMotion = useReducedMotion();
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);

  function handleTabKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    let nextIndex: number | null = null;

    if (event.key === "ArrowRight") nextIndex = (index + 1) % filters.length;
    if (event.key === "ArrowLeft") nextIndex = (index - 1 + filters.length) % filters.length;
    if (event.key === "Home") nextIndex = 0;
    if (event.key === "End") nextIndex = filters.length - 1;

    if (nextIndex === null) return;
    event.preventDefault();
    const nextFilter = filters[nextIndex];
    setFilter(nextFilter.id);
    tabRefs.current[nextIndex]?.focus();
  }

  const visibleGroups = groups
    .map((group) => ({
      ...group,
      features:
        filter === "all"
          ? group.features
          : group.features.filter((feature) => feature.audiences.includes(filter)),
    }))
    .filter((group) => group.features.length > 0);

  return (
    <div className="feature-atlas">
      <div className="feature-atlas-toolbar">
        <div className="feature-atlas-filters" role="tablist" aria-label="Filter capabilities">
          {filters.map((item) => {
            const active = item.id === filter;
            return (
              <button
                className="feature-atlas-filter"
                type="button"
                role="tab"
                aria-selected={active}
                aria-controls="feature-atlas-panel"
                id={`feature-atlas-tab-${item.id}`}
                tabIndex={active ? 0 : -1}
                key={item.id}
                onClick={() => setFilter(item.id)}
                onKeyDown={(event) => handleTabKeyDown(event, filters.indexOf(item))}
                ref={(element) => {
                  tabRefs.current[filters.indexOf(item)] = element;
                }}
              >
                {active ? (
                  <motion.span
                    className="feature-atlas-filter-active"
                    layoutId="feature-atlas-filter"
                    transition={
                      reduceMotion
                        ? { duration: 0 }
                        : { type: "spring", stiffness: 420, damping: 34 }
                    }
                  />
                ) : null}
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
        <span className="feature-atlas-count" aria-live="polite">
          {visibleGroups.reduce((total, group) => total + group.features.length, 0)} capabilities
        </span>
      </div>

      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          className="feature-atlas-grid"
          data-filter={filter}
          id="feature-atlas-panel"
          key={filter}
          role="tabpanel"
          aria-labelledby={`feature-atlas-tab-${filter}`}
          initial={reduceMotion ? false : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -4 }}
          transition={
            reduceMotion
              ? { duration: 0 }
              : { duration: 0.2, ease: [0.22, 1, 0.36, 1] }
          }
        >
          {visibleGroups.map((group, index) => {
            const Icon = group.icon;
            return (
              <motion.article
                className="feature-atlas-card"
                key={group.title}
                initial={reduceMotion ? false : { opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: reduceMotion ? 0 : 0.25,
                  delay: reduceMotion ? 0 : Math.min(index * 0.025, 0.15),
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                <div className="feature-atlas-card-head">
                  <span className="feature-atlas-icon" aria-hidden="true">
                    <Icon size={19} />
                  </span>
                  <span className="feature-atlas-phase">{group.phase}</span>
                </div>
                <h3>{group.title}</h3>
                <ul>
                  {group.features.map((feature) => (
                    <li key={feature.label}>
                      <Check size={14} aria-hidden="true" />
                      <span>{feature.label}</span>
                    </li>
                  ))}
                </ul>
              </motion.article>
            );
          })}
        </motion.div>
      </AnimatePresence>

      <div className="feature-atlas-summary">
        <span>10 connected capability areas</span>
        <span>2 protected role workspaces</span>
        <span>1 teacher-controlled learning record</span>
      </div>
    </div>
  );
}
