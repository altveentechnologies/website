"use client";

import { motion, useScroll, useSpring } from "framer-motion";

/** Thin progress bar pinned under the sticky header on article pages. */
export function ReadingProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 220,
    damping: 34,
    restDelta: 0.001,
  });

  return (
    <motion.div
      aria-hidden="true"
      style={{ scaleX }}
      className="fixed left-0 top-0 z-60 h-0.5 w-full origin-left bg-gradient-to-r from-brand-500 to-sky-accent"
    />
  );
}
