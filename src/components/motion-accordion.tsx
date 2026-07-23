"use client";

import * as React from "react";
import { motion, useReducedMotion } from "motion/react";
import { Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

export interface MotionAccordionItem {
  question: React.ReactNode;
  answer: React.ReactNode;
}

export interface MotionAccordionProps {
  items: MotionAccordionItem[];
  gap?: number;
  className?: string;
}

function AccordionItem({
  item,
  isOpen,
  onToggle,
  itemId,
  panelId,
}: {
  item: MotionAccordionItem;
  isOpen: boolean;
  onToggle: () => void;
  itemId: string;
  panelId: string;
}) {
  const reduceMotion = useReducedMotion();
  const spring = reduceMotion
    ? { duration: 0 }
    : { type: "spring" as const, stiffness: 300, damping: 30, mass: 0.88 };

  return (
    <motion.article
      layout
      className="motion-faq-item"
      animate={{ scale: isOpen ? 1 : 0.99 }}
      initial={false}
      transition={spring}
      style={{ originX: 0.5, originY: 0 }}
    >
      <button
        className="motion-faq-trigger"
        id={itemId}
        type="button"
        aria-controls={panelId}
        aria-expanded={isOpen}
        onClick={onToggle}
      >
        <span>{item.question}</span>
        <motion.span
          className="motion-faq-icon"
          aria-hidden="true"
          animate={{ rotate: isOpen ? 180 : 0, scale: isOpen ? 1.04 : 1 }}
          initial={false}
          transition={
            reduceMotion
              ? { duration: 0 }
              : { type: "spring", stiffness: 480, damping: 28 }
          }
        >
          {isOpen ? <Minus size={18} /> : <Plus size={18} />}
        </motion.span>
      </button>

      <motion.div
        className="motion-faq-panel"
        id={panelId}
        role="region"
        aria-labelledby={itemId}
        aria-hidden={!isOpen}
        animate={{
          height: isOpen ? "auto" : 0,
          opacity: isOpen ? 1 : 0,
        }}
        initial={false}
        transition={
          reduceMotion
            ? { duration: 0 }
            : {
                height: {
                  type: "spring",
                  stiffness: 340,
                  damping: 34,
                  mass: 0.9,
                },
                opacity: { duration: 0.18, ease: "easeOut" },
              }
        }
      >
        <motion.div
          className="motion-faq-answer"
          animate={{ y: isOpen ? 0 : -6 }}
          initial={false}
          transition={spring}
        >
          {item.answer}
        </motion.div>
      </motion.div>
    </motion.article>
  );
}

export function MotionAccordion({
  items,
  gap = 10,
  className,
}: MotionAccordionProps) {
  const rawId = React.useId();
  const baseId = `faq-${rawId.replace(/:/g, "")}`;
  const [openIndex, setOpenIndex] = React.useState<number | null>(0);

  return (
    <div className={cn("motion-faq", className)}>
      <div className="motion-faq-list" style={{ gap }}>
        {items.map((item, index) => (
          <AccordionItem
            key={index}
            item={item}
            isOpen={openIndex === index}
            onToggle={() =>
              setOpenIndex((current) => (current === index ? null : index))
            }
            itemId={`${baseId}-trigger-${index}`}
            panelId={`${baseId}-panel-${index}`}
          />
        ))}
      </div>
    </div>
  );
}
