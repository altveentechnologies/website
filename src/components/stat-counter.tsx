"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "framer-motion";

import { STATS } from "@/lib/content";

function Counter({ value, suffix }: { value: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });
  const reduceMotion = useReducedMotion();
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;

    if (reduceMotion) {
      setDisplay(value);
      return;
    }

    const duration = 1500;
    let frame = 0;
    let start: number | null = null;

    const step = (timestamp: number) => {
      if (start === null) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(value * eased));
      if (progress < 1) frame = requestAnimationFrame(step);
    };

    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [inView, value, reduceMotion]);

  return (
    <span ref={ref} className="font-mono text-4xl font-bold sm:text-5xl">
      <span className="text-gradient">
        {display}
        {suffix}
      </span>
    </span>
  );
}

export function StatsStrip() {
  return (
    <section className="border-y border-line bg-gradient-to-b from-ink-850 to-ink-800">
      <div className="container-page py-16">
        <div className="grid grid-cols-2 gap-8 text-center lg:grid-cols-4">
          {STATS.map((stat) => (
            <div key={stat.label}>
              <Counter value={stat.value} suffix={stat.suffix} />
              <p className="mt-2 text-sm text-mist">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
