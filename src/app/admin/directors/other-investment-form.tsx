"use client";

import { useActionState } from "react";

import { IDLE_FORM_STATE } from "@/lib/types";
import { Field, FormMessage, inputClass } from "@/components/form-fields";
import { buttonClass } from "@/components/ui";

import { saveOtherInvestment } from "../other-investment-actions";

export function OtherInvestmentForm() {
  const [state, formAction, pending] = useActionState(
    saveOtherInvestment,
    IDLE_FORM_STATE,
  );
  const today = new Date().toISOString().slice(0, 10);

  return (
    <form
      action={formAction}
      className="space-y-5 rounded-2xl border border-line bg-ink-850/50 p-6"
    >
      <h3 className="text-lg font-semibold text-cloud">Add other investment</h3>
      <p className="text-xs text-mist">
        When a friend lends money for a job, record the date they gave it and later
        the date you paid them back.
      </p>
      <FormMessage state={state} />

      <Field label="Who gave the money?" htmlFor="lender_name" error={state.errors?.lender_name}>
        <input
          id="lender_name"
          name="lender_name"
          required
          className={inputClass}
          placeholder="Friend’s name"
        />
      </Field>

      <Field label="Amount (INR)" htmlFor="other-amount" error={state.errors?.amount}>
        <input
          id="other-amount"
          name="amount"
          type="number"
          min="0"
          step="0.01"
          required
          className={inputClass}
        />
      </Field>

      <Field
        label="They gave us on"
        htmlFor="given_date"
        error={state.errors?.given_date}
      >
        <input
          id="given_date"
          name="given_date"
          type="date"
          required
          defaultValue={today}
          className={inputClass}
        />
      </Field>

      <Field
        label="We paid them back on"
        htmlFor="repaid_date"
        error={state.errors?.repaid_date}
        optional
      >
        <input id="repaid_date" name="repaid_date" type="date" className={inputClass} />
      </Field>

      <Field label="Notes" htmlFor="other-notes" optional>
        <textarea id="other-notes" name="notes" rows={2} className={inputClass} />
      </Field>

      <button type="submit" disabled={pending} className={buttonClass({ className: "w-full" })}>
        {pending ? "Saving…" : "Add record"}
      </button>
    </form>
  );
}
