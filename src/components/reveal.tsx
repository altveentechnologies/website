"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

type RevealProps = {
  children: ReactNode;
  /** Stagger helper, index within a grid, multiplied into the delay. */
  index?: number;
  delay?: number;
  className?: string;
  as?: "div" | "section" | "article" | "li";
};

/**
 * Scroll-triggered fade-and-rise. Replaces the old IntersectionObserver +
 * .in-view CSS class from the Flask build, and respects reduced-motion.
 */
export function Reveal({
  children,
  index = 0,
  delay = 0,
  className,
  as = "div",
}: RevealProps) {
  const reduceMotion = useReducedMotion();
  const MotionTag = motion[as];

  if (reduceMotion) {
    const Tag = as;
    return <Tag className={className}>{children}</Tag>;
  }

  return (
    <MotionTag
      className={className}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -80px 0px" }}
      transition={{
        duration: 0.6,
        ease: [0.16, 1, 0.3, 1],
        delay: delay + index * 0.07,
      }}
    >
      {children}
    </MotionTag>
  );
}
