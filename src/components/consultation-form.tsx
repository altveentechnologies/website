"use client";

import { useActionState, useState } from "react";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

import { submitConsultation } from "@/actions/forms";
import { COUNTRY_CODES, SERVICE_OPTIONS } from "@/lib/content";
import { IDLE_FORM_STATE } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Button, SectionHeading } from "@/components/ui";
import {
  Field,
  FormMessage,
  inputBase,
  inputClass,
} from "@/components/form-fields";
import { CheckIcon } from "@/components/icons";

export function ConsultationForm() {
  const pathname = usePathname();
  const [state, formAction, pending] = useActionState(
    submitConsultation,
    IDLE_FORM_STATE,
  );
  const [selected, setSelected] = useState<string[]>([]);

  const toggleService = (service: string) => {
    setSelected((current) =>
      current.includes(service)
        ? current.filter((s) => s !== service)
        : [...current, service],
    );
  };

  if (state.status === "success") {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full rounded-2xl border border-brand-500/40 bg-brand-500/5 p-12 text-center"
      >
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-brand-500/15">
          <CheckIcon className="h-7 w-7 text-brand-500" />
        </div>
        <h3 className="mt-5 text-xl font-semibold text-cloud">
          Request received
        </h3>
        <p className="mt-2 text-mist">{state.message}</p>
      </motion.div>
    );
  }

  return (
    <form
      action={formAction}
      className="w-full rounded-2xl border border-line bg-ink-800/60 p-6 backdrop-blur-sm sm:p-10 lg:p-12"
    >
      <input type="hidden" name="source_page" value={pathname} />
      {/* Chip state mirrored into hidden inputs so the action gets a real array. */}
      {selected.map((service) => (
        <input key={service} type="hidden" name="services" value={service} />
      ))}

      <div className="space-y-6 text-left">
        <div className="grid gap-6 sm:grid-cols-2">
          <Field label="Name" htmlFor="c-name" error={state.errors?.name}>
            <input
              id="c-name"
              name="name"
              type="text"
              required
              autoComplete="name"
              placeholder="Your full name"
              className={inputClass}
            />
          </Field>

          <Field label="Email" htmlFor="c-email" error={state.errors?.email}>
            <input
              id="c-email"
              name="email"
              type="email"
              required
              autoComplete="email"
              placeholder="you@company.com"
              className={inputClass}
            />
          </Field>
        </div>

        <Field label="Phone" htmlFor="c-phone" error={state.errors?.phone}>
          {/* Stacks on narrow screens, sits side-by-side from `sm` up. */}
          <div className="flex flex-col gap-3 sm:flex-row">
            <select
              name="country_code"
              aria-label="Country code"
              defaultValue="+91"
              className={cn(
                inputBase,
                "w-full cursor-pointer sm:w-44 sm:shrink-0",
              )}
            >
              {COUNTRY_CODES.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.code} {c.label}
                </option>
              ))}
            </select>
            <input
              id="c-phone"
              name="phone"
              type="tel"
              required
              autoComplete="tel"
              placeholder="Phone number"
              className={cn(inputBase, "w-full min-w-0 sm:flex-1")}
            />
          </div>
        </Field>

        <div>
          <p className="mb-3 block text-sm font-medium text-cloud">
            Services needed<span className="ml-1 text-brand-500">*</span>
          </p>
          <div className="flex flex-wrap gap-2.5">
            {SERVICE_OPTIONS.map((service) => {
              const active = selected.includes(service);
              return (
                <button
                  key={service}
                  type="button"
                  aria-pressed={active}
                  onClick={() => toggleService(service)}
                  className={cn(
                    "rounded-full border px-4 py-2 text-sm transition-all",
                    active
                      ? "border-brand-500 bg-brand-500/15 text-brand-400"
                      : "border-line bg-ink-900 text-mist hover:border-ink-600 hover:text-cloud",
                  )}
                >
                  {active ? <span className="mr-1.5">✓</span> : null}
                  {service}
                </button>
              );
            })}
          </div>
          {state.errors?.services ? (
            <p className="mt-2 text-xs text-red-400" role="alert">
              {state.errors.services}
            </p>
          ) : null}
        </div>

        <FormMessage state={state} />

        {/* At full content width a full-bleed button reads as a slab, so it
            only stretches on narrow screens. */}
        <div className="flex flex-col items-center gap-3 pt-2 sm:flex-row sm:justify-between">
          <p className="order-2 text-xs text-mist sm:order-1">
            No obligation. We usually reply within one business day.
          </p>
          <Button
            type="submit"
            size="lg"
            disabled={pending}
            className="order-1 w-full sm:order-2 sm:w-auto sm:min-w-72"
          >
            {pending ? "Sending…" : "Request my free consultation"}
          </Button>
        </div>
      </div>
    </form>
  );
}

/** Full-width CTA band used at the bottom of the marketing pages. */
export function ConsultationSection() {
  return (
    <section className="relative overflow-hidden border-t border-line bg-ink-850 py-20 sm:py-24">
      <div className="aurora pointer-events-none absolute inset-0 opacity-60" />
      <div className="container-page relative">
        <SectionHeading
          eyebrow="Get started"
          title="Ready to grow with us?"
          description="Get a free consultation. Tell us a bit about yourself and the services you need."
        />
        <ConsultationForm />
      </div>
    </section>
  );
}
