"use client";

import { useActionState } from "react";

import type { DirectorSaleOption, FormState } from "@/lib/types";
import {
  DIRECTOR_ENTRY_LABELS,
  DIRECTOR_LABELS,
  IDLE_FORM_STATE,
} from "@/lib/types";
import { Field, FormMessage, inputClass } from "@/components/form-fields";
import { buttonClass } from "@/components/ui";

import { saveDirectorEntry } from "../directors-actions";

export function DirectorEntryForm({ sales }: { sales: DirectorSaleOption[] }) {
  const [state, formAction, pending] = useActionState(saveDirectorEntry, IDLE_FORM_STATE);
  const today = new Date().toISOString().slice(0, 10);

  return (
    <form action={formAction} className="space-y-5 rounded-2xl border border-line bg-ink-850/50 p-6">
      <h3 className="text-lg font-semibold text-cloud">Add record</h3>
      <FormMessage state={state} />

      <Field label="Director" htmlFor="director" error={state.errors?.director}>
        <select id="director" name="director" required className={inputClass} defaultValue="">
          <option value="">Pick one</option>
          {(Object.keys(DIRECTOR_LABELS) as Array<keyof typeof DIRECTOR_LABELS>).map(
            (key) => (
              <option key={key} value={key}>
                {DIRECTOR_LABELS[key]}
              </option>
            ),
          )}
        </select>
      </Field>

      <Field label="Type" htmlFor="entry_type">
        <select id="entry_type" name="entry_type" className={inputClass} defaultValue="took">
          {(Object.keys(DIRECTOR_ENTRY_LABELS) as Array<keyof typeof DIRECTOR_ENTRY_LABELS>).map(
            (key) => (
              <option key={key} value={key}>
                {DIRECTOR_ENTRY_LABELS[key]}
              </option>
            ),
          )}
        </select>
      </Field>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Amount" htmlFor="amount" error={state.errors?.amount}>
          <input
            id="amount"
            name="amount"
            type="number"
            min="0"
            step="0.01"
            required
            className={inputClass}
          />
        </Field>

        <Field label="Date" htmlFor="transaction_date" error={state.errors?.transaction_date}>
          <input
            id="transaction_date"
            name="transaction_date"
            type="date"
            required
            defaultValue={today}
            className={inputClass}
          />
        </Field>
      </div>

      <Field
        label="For which service or sale?"
        htmlFor="project_id"
        error={state.errors?.project_id}
        optional
      >
        <select id="project_id" name="project_id" className={inputClass} defaultValue="">
          <option value="">Not linked / general</option>
          {sales.map((sale) => (
            <option key={sale.id} value={sale.id}>
              {sale.label}
            </option>
          ))}
        </select>
      </Field>

      <Field label="Notes" htmlFor="director-notes" optional>
        <textarea id="director-notes" name="notes" rows={2} className={inputClass} />
      </Field>

      <button type="submit" disabled={pending} className={buttonClass()}>
        {pending ? "Saving…" : "Add record"}
      </button>
    </form>
  );
}
