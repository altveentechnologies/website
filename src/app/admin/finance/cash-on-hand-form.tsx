"use client";

import { useActionState } from "react";

import type { CashOnHand } from "@/lib/types";
import { IDLE_FORM_STATE } from "@/lib/types";
import { Field, FormMessage, inputClass } from "@/components/form-fields";
import { buttonClass } from "@/components/ui";

import { saveCashOnHand } from "../cash-on-hand-actions";

export function CashOnHandForm({ cash }: { cash: CashOnHand }) {
  const [state, formAction, pending] = useActionState(saveCashOnHand, IDLE_FORM_STATE);

  return (
    <form action={formAction} className="space-y-5">
      <FormMessage state={state} />

      <Field label="Amount in hand (INR)" htmlFor="cash-amount" error={state.errors?.amount}>
        <input
          id="cash-amount"
          name="amount"
          type="number"
          min="0"
          step="0.01"
          required
          defaultValue={cash.amount || ""}
          className={inputClass}
          placeholder="0"
        />
      </Field>

      <Field label="Note" htmlFor="cash-notes" optional>
        <input
          id="cash-notes"
          name="notes"
          defaultValue={cash.notes}
          className={inputClass}
          placeholder="e.g. Counted today, bank + cash"
        />
      </Field>

      <button type="submit" disabled={pending} className={buttonClass()}>
        {pending ? "Saving…" : "Save money in hand"}
      </button>
    </form>
  );
}
