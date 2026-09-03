"use client";

import type { ReactNode } from "react";
import { motion } from "framer-motion";

import { cn } from "@/lib/utils";
import type { FormState } from "@/lib/types";

/**
 * Field styling without a width, so callers that need a non-full-width control
 * (e.g. the country-code select) can set their own without fighting `w-full`.
 */
export const inputBase =
  "rounded-lg border border-line bg-ink-900 px-4 py-3 text-cloud placeholder:text-mist/60 transition-colors focus:border-brand-500 focus:outline-none";

export const inputClass = `w-full ${inputBase}`;

export function Field({
  label,
  htmlFor,
  error,
  children,
  optional,
}: {
  label: string;
  htmlFor: string;
  error?: string;
  children: ReactNode;
  optional?: boolean;
}) {
  return (
    <div>
      <label
        htmlFor={htmlFor}
        className="mb-2 block text-sm font-medium text-cloud"
      >
        {label}
        {optional ? (
          <span className="ml-1 font-normal text-mist">(optional)</span>
        ) : (
          <span className="ml-1 text-brand-500">*</span>
        )}
      </label>
      {children}
      {error ? (
        <p className="mt-1.5 text-xs text-red-400" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}

/** Inline success / error banner driven by a server action's FormState. */
export function FormMessage({ state }: { state: FormState }) {
  if (state.status === "idle" || !state.message) return null;

  return (
    <motion.p
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      role="status"
      className={cn(
        "rounded-lg border px-4 py-3 text-sm",
        state.status === "success"
          ? "border-brand-500/40 bg-brand-500/10 text-brand-400"
          : "border-red-500/40 bg-red-500/10 text-red-400",
      )}
    >
      {state.message}
    </motion.p>
  );
}
