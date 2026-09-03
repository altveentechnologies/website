"use client";

import { useActionState } from "react";
import { motion } from "framer-motion";

import { submitContact } from "@/actions/forms";
import { IDLE_FORM_STATE } from "@/lib/types";
import { Button } from "@/components/ui";
import { Field, FormMessage, inputClass } from "@/components/form-fields";
import { CheckIcon } from "@/components/icons";

export function ContactForm() {
  const [state, formAction, pending] = useActionState(
    submitContact,
    IDLE_FORM_STATE,
  );

  if (state.status === "success") {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        className="rounded-2xl border border-brand-500/40 bg-brand-500/5 p-10 text-center"
      >
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-brand-500/15">
          <CheckIcon className="h-7 w-7 text-brand-500" />
        </div>
        <h3 className="mt-5 text-xl font-semibold text-cloud">Message sent</h3>
        <p className="mt-2 text-mist">{state.message}</p>
      </motion.div>
    );
  }

  return (
    <form
      action={formAction}
      className="space-y-5 rounded-2xl border border-line bg-ink-800/60 p-6 backdrop-blur-sm sm:p-8"
    >
      <Field label="Name" htmlFor="name" error={state.errors?.name}>
        <input
          id="name"
          name="name"
          type="text"
          required
          autoComplete="name"
          placeholder="Your full name"
          className={inputClass}
        />
      </Field>

      <Field label="Email" htmlFor="email" error={state.errors?.email}>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="you@company.com"
          className={inputClass}
        />
      </Field>

      <Field label="Company" htmlFor="company" optional>
        <input
          id="company"
          name="company"
          type="text"
          autoComplete="organization"
          placeholder="Company name"
          className={inputClass}
        />
      </Field>

      <Field label="Message" htmlFor="message" error={state.errors?.message}>
        <textarea
          id="message"
          name="message"
          rows={5}
          required
          placeholder="Tell us about your project, goals and timeline…"
          className={`${inputClass} resize-y`}
        />
      </Field>

      <FormMessage state={state} />

      <Button type="submit" size="lg" disabled={pending} className="w-full">
        {pending ? "Sending…" : "Send message"}
      </Button>
    </form>
  );
}
