"use client";

import { useActionState } from "react";

import { addMarqueeName } from "../marquee-actions";
import { IDLE_FORM_STATE } from "@/lib/types";
import { Button } from "@/components/ui";
import { Field, FormMessage, inputClass } from "@/components/form-fields";

export function AddMarqueeForm() {
  const [state, formAction, pending] = useActionState(addMarqueeName, IDLE_FORM_STATE);

  return (
    <form action={formAction} className="rounded-2xl border border-line bg-ink-850 p-6">
      <p className="text-sm font-medium text-cloud">Add a business name</p>
      <p className="mt-1 text-xs text-mist">
        Appears in the scrolling strip right below the hero on the homepage.
      </p>

      <div className="mt-5 grid gap-4 sm:grid-cols-[1fr_7rem_auto] sm:items-end">
        <Field label="Business name" htmlFor="marquee-name" error={state.errors?.name}>
          <input
            id="marquee-name"
            name="name"
            required
            placeholder="Acme Corp"
            className={inputClass}
          />
        </Field>

        <Field label="Order" htmlFor="marquee-order" optional>
          <input
            id="marquee-order"
            name="sort_order"
            type="number"
            defaultValue={0}
            className={inputClass}
          />
        </Field>

        <Button type="submit" disabled={pending} className="sm:mb-0.5">
          {pending ? "Adding…" : "Add"}
        </Button>
      </div>

      <FormMessage state={state} />
    </form>
  );
}
