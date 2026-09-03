"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import { FAQS } from "@/lib/content";
import { PlusIcon } from "@/components/icons";
import { SectionHeading } from "@/components/ui";
import { cn } from "@/lib/utils";

export function FaqSection() {
  // Single-open accordion, matching the original behaviour.
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="border-t border-line py-20 sm:py-24">
      <div className="container-page">
        <SectionHeading
          eyebrow="FAQ"
          title="Frequently asked questions"
          description="Answers to common questions about how we work at Altveen Technologies."
        />

        <div className="w-full space-y-3">
          {FAQS.map((faq, index) => {
            const isOpen = openIndex === index;

            return (
              <div
                key={faq.question}
                className={cn(
                  "overflow-hidden rounded-xl border transition-colors",
                  isOpen
                    ? "border-brand-500/40 bg-ink-800"
                    : "border-line bg-ink-850 hover:border-ink-600",
                )}
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left sm:px-8"
                >
                  <span className="font-medium text-cloud">{faq.question}</span>
                  <PlusIcon
                    className={cn(
                      "h-5 w-5 shrink-0 transition-transform duration-300",
                      isOpen ? "rotate-45 text-brand-500" : "text-mist",
                    )}
                  />
                </button>

                <AnimatePresence initial={false}>
                  {isOpen ? (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                    >
                      {/* Answer text stays measured so long lines remain
                          readable even though the card runs full width. */}
                      <p className="max-w-4xl px-6 pb-6 text-sm leading-relaxed text-mist sm:px-8">
                        {faq.answer}
                      </p>
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
