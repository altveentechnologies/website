"use client";

import { motion } from "framer-motion";

import { CAPABILITIES, SITE } from "@/lib/content";
import { ArrowRightIcon, CheckIcon } from "@/components/icons";
import { ButtonLink, Eyebrow } from "@/components/ui";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.05 } },
};

const item = {
  hidden: { opacity: 0, y: 22 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: [0.16, 1, 0.3, 1] as const },
  },
};

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="aurora pointer-events-none absolute inset-0" />
      <div className="grid-backdrop pointer-events-none absolute inset-0" />

      <div className="container-page relative">
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid items-center gap-16 py-20 lg:grid-cols-[1.05fr_0.95fr] lg:py-28"
        >
          {/* Copy */}
          <div>
            <motion.div variants={item}>
              <Eyebrow>{SITE.tagline}</Eyebrow>
            </motion.div>

            <motion.h1
              variants={item}
              className="mt-5 text-5xl font-bold leading-[1.05] tracking-tight text-cloud sm:text-6xl lg:text-7xl"
            >
              Build. Grow.{" "}
              <span className="text-gradient">Scale.</span>
            </motion.h1>

            <motion.p
              variants={item}
              className="mt-6 max-w-xl text-lg leading-relaxed text-mist"
            >
              {SITE.description}
            </motion.p>

            <motion.div variants={item} className="mt-9 flex flex-wrap gap-4">
              <ButtonLink href="/contact" size="lg">
                Get a Free Consultation
                <ArrowRightIcon className="h-4 w-4" />
              </ButtonLink>
              <ButtonLink href="/services" variant="ghost" size="lg">
                Our Services
              </ButtonLink>
            </motion.div>

            <motion.div
              variants={item}
              className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-3 text-sm text-mist"
            >
              <span className="flex items-center gap-2">
                <CheckIcon className="h-4 w-4 text-brand-500" />
                Dev &amp; marketing under one roof
              </span>
              <span className="flex items-center gap-2">
                <CheckIcon className="h-4 w-4 text-brand-500" />
                Clients in India, the US &amp; beyond
              </span>
            </motion.div>
          </div>

          {/* Capability card */}
          <motion.div variants={item} className="relative lg:justify-self-end">
            <div
              aria-hidden="true"
              className="absolute -inset-px rounded-3xl bg-gradient-to-br from-brand-500/40 via-transparent to-sky-accent/30 blur-sm"
            />
            <div className="relative w-full rounded-3xl border border-line bg-ink-850/90 p-8 backdrop-blur-xl lg:max-w-md">
              <Eyebrow>We deliver</Eyebrow>
              <ul className="mt-6 space-y-3.5">
                {CAPABILITIES.map((capability, index) => (
                  <motion.li
                    key={capability}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      delay: 0.45 + index * 0.06,
                      duration: 0.45,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    className="flex items-center gap-3 text-[0.97rem] text-cloud/90"
                  >
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-500/15">
                      <CheckIcon className="h-3 w-3 text-brand-500" />
                    </span>
                    {capability}
                  </motion.li>
                ))}
              </ul>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
