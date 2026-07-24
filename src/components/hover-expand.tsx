"use client";

import * as React from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface HoverExpandItem {
  label: string;
  sublabel?: string;
  image: string;
  imageAlt?: string;
  description?: string;
}

export interface HoverExpandProps {
  items: HoverExpandItem[];
  collapsedHeight?: number;
  expandedHeight?: number;
  className?: string;
}

export function HoverExpand({
  items,
  collapsedHeight = 76,
  expandedHeight = 350,
  className,
}: HoverExpandProps) {
  const [activeIndex, setActiveIndex] = React.useState<number | null>(null);
  const reduceMotion = useReducedMotion();

  return (
    <div className={cn("hover-expand", className)}>
      {items.map((item, index) => {
        const isActive = activeIndex === index;
        const isMuted = activeIndex !== null && !isActive;

        return (
          <motion.button
            className="hover-expand-item"
            type="button"
            key={item.label}
            aria-expanded={isActive}
            aria-label={`${item.label}${item.description ? `: ${item.description}` : ""}`}
            animate={{
              height: isActive ? expandedHeight : collapsedHeight,
              opacity: isMuted ? 0.48 : 1,
            }}
            initial={false}
            transition={
              reduceMotion
                ? { duration: 0 }
                : {
                    height: {
                      type: "spring",
                      stiffness: 280,
                      damping: 32,
                      mass: 0.9,
                    },
                    opacity: { duration: 0.2, ease: "easeOut" },
                  }
            }
            onMouseEnter={() => setActiveIndex(index)}
            onMouseLeave={(event) => {
              if (document.activeElement !== event.currentTarget) {
                setActiveIndex(null);
              }
            }}
            onFocus={() => setActiveIndex(index)}
            onBlur={() => setActiveIndex(null)}
            onClick={() => setActiveIndex(index)}
          >
            <motion.span
              className="hover-expand-image"
              aria-hidden="true"
              animate={{
                opacity: isActive ? 1 : 0,
                scale: isActive ? 1 : 1.045,
              }}
              initial={false}
              transition={
                reduceMotion
                  ? { duration: 0 }
                  : {
                      opacity: { duration: 0.38, ease: "easeOut" },
                      scale: {
                        duration: 0.52,
                        ease: [0.23, 1, 0.32, 1],
                      },
                    }
              }
            >
              <Image
                src={item.image}
                alt=""
                fill
                loading={index === 0 ? "eager" : "lazy"}
                sizes="(max-width: 768px) 100vw, 1200px"
              />
              <span className="hover-expand-shade" />
            </motion.span>

            <span className="hover-expand-content">
              <span className="hover-expand-main">
                <motion.span
                  className="hover-expand-number"
                  animate={{ color: isActive ? "#ffffff" : "var(--muted)" }}
                >
                  {String(index + 1).padStart(2, "0")}
                </motion.span>
                <motion.span
                  className="hover-expand-label"
                  animate={{ color: isActive ? "#ffffff" : "var(--ink)" }}
                >
                  {item.label}
                </motion.span>
                {item.description ? (
                  <motion.span
                    className="hover-expand-description"
                    animate={{
                      opacity: isActive ? 1 : 0,
                      x: isActive ? 0 : -8,
                    }}
                    initial={false}
                    transition={{
                      duration: reduceMotion ? 0 : 0.28,
                      delay: isActive && !reduceMotion ? 0.1 : 0,
                    }}
                  >
                    — {item.description}
                  </motion.span>
                ) : null}
              </span>

              <motion.span
                className="hover-expand-meta"
                animate={{
                  color: isActive ? "rgba(255,255,255,.82)" : "var(--muted)",
                }}
              >
                {item.sublabel}
                <ArrowUpRight size={15} aria-hidden="true" />
              </motion.span>
            </span>
          </motion.button>
        );
      })}
    </div>
  );
}
