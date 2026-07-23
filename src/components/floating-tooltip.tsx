"use client";

import { createPortal } from "react-dom";
import { useRef, useState, type ReactNode } from "react";

type Placement = "top" | "right" | "bottom" | "left";

export function FloatingTooltip({
  content,
  children,
  placement = "top",
  className = "",
  showWhen,
}: {
  content: string;
  children: ReactNode;
  placement?: Placement;
  className?: string;
  showWhen?: string;
}) {
  const anchorRef = useRef<HTMLSpanElement>(null);
  const [position, setPosition] = useState<{
    top: number;
    left: number;
    placement: Placement;
  } | null>(null);

  function showTooltip() {
    if (showWhen && !window.matchMedia(showWhen).matches) return;

    const anchor = anchorRef.current;
    if (!anchor) return;

    const target = anchor.firstElementChild ?? anchor;
    const rect = target.getBoundingClientRect();
    let resolvedPlacement = placement;
    if (placement === "right" && rect.right + 250 > window.innerWidth) {
      resolvedPlacement = "left";
    }

    const coordinates = {
      top:
        resolvedPlacement === "top"
          ? rect.top - 10
          : resolvedPlacement === "bottom"
            ? rect.bottom + 10
            : rect.top + rect.height / 2,
      left:
        resolvedPlacement === "left"
          ? rect.left - 10
          : resolvedPlacement === "right"
            ? rect.right + 10
            : rect.left + rect.width / 2,
      placement: resolvedPlacement,
    };
    setPosition(coordinates);
  }

  return (
    <span
      className={`floating-tooltip${className ? ` ${className}` : ""}`}
      ref={anchorRef}
      onMouseEnter={showTooltip}
      onMouseLeave={() => setPosition(null)}
      onFocusCapture={showTooltip}
      onBlurCapture={() => setPosition(null)}
    >
      {children}
      {position
        ? createPortal(
            <span
              className="floating-tooltip-portal"
              data-placement={position.placement}
              role="tooltip"
              style={{ left: position.left, top: position.top }}
            >
              {content}
            </span>,
            document.body,
          )
        : null}
    </span>
  );
}
