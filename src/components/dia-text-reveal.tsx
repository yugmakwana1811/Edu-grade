"use client";

import { useEffect, useRef, useState } from "react";

export function DiaTextReveal({
  text,
  className = "",
}: {
  text: string;
  className?: string;
}) {
  const elementRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    if (!("IntersectionObserver" in window)) {
      const timer = globalThis.setTimeout(() => setIsVisible(true), 0);
      return () => globalThis.clearTimeout(timer);
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setIsVisible(true);
        observer.disconnect();
      },
      { threshold: 0.55 },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <em
      className={`dia-text-reveal${isVisible ? " is-visible" : ""}${className ? ` ${className}` : ""}`}
      ref={elementRef}
    >
      {text}
    </em>
  );
}
