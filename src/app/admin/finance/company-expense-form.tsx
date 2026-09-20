"use client";

import { useActionState } from "react";

import type { FormState } from "@/lib/types";
import { IDLE_FORM_STATE } from "@/lib/types";
import { Field, FormMessage, inputClass } from "@/components/form-fields";
import { buttonClass } from "@/components/ui";

import { saveCompanyExpense } from "../company-expense-actions";

export function CompanyExpenseForm() {
  const [state, formAction, pending] = useActionState(saveCompanyExpense, IDLE_FORM_STATE);
  const today = new Date().toISOString().slice(0, 10);

  return (
    <form
      action={formAction}
      className="space-y-5 rounded-2xl border border-line bg-ink-850/50 p-6"
    >
      <h3 className="text-lg font-semibold text-cloud">Add company expense</h3>
      <p className="text-xs text-mist">
        Extra costs for the company — office, travel, tools, etc. (not tied to a client sale).
      </p>
      <FormMessage state={state} />

      <Field label="What was it for?" htmlFor="description" error={state.errors?.description}>
        <input
          id="description"
          name="description"
          required
          className={inputClass}
          placeholder="e.g. Office rent, domain renewal"
        />
      </Field>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Amount (INR)" htmlFor="amount" error={state.errors?.amount}>
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
        <Field label="Date" htmlFor="expense_date" error={state.errors?.expense_date}>
          <input
            id="expense_date"
            name="expense_date"
            type="date"
            required
            defaultValue={today}
            className={inputClass}
          />
        </Field>
      </div>

      <Field label="Notes (optional)" htmlFor="notes">
        <textarea id="notes" name="notes" rows={2} className={inputClass} />
      </Field>

      <button type="submit" disabled={pending} className={buttonClass({ className: "w-full" })}>
        {pending ? "Saving…" : "Add expense"}
      </button>
    </form>
  );
}
