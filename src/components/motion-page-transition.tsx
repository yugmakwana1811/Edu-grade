"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { usePathname } from "next/navigation";

export function MotionPageTransition({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const reduceMotion = useReducedMotion();

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        className="route-motion"
        key={pathname}
        initial={reduceMotion ? false : { opacity: 0, y: 7 }}
        animate={{ opacity: 1, y: 0 }}
        exit={reduceMotion ? { opacity: 1 } : { opacity: 0, y: -4 }}
        transition={
          reduceMotion
            ? { duration: 0 }
            : { duration: 0.22, ease: [0.22, 1, 0.36, 1] }
        }
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
