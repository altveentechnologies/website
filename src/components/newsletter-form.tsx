"use client";

import { useActionState } from "react";
import { usePathname } from "next/navigation";

import { subscribeNewsletter } from "@/actions/forms";
import { IDLE_FORM_STATE } from "@/lib/types";
import { Button } from "@/components/ui";
import { inputClass } from "@/components/form-fields";
import { cn } from "@/lib/utils";

export function NewsletterForm() {
  const pathname = usePathname();
  const [state, formAction, pending] = useActionState(
    subscribeNewsletter,
    IDLE_FORM_STATE,
  );

  return (
    <div className="w-full">
      {state.status === "success" ? (
        <p className="rounded-lg border border-brand-500/40 bg-brand-500/10 px-4 py-3 text-center text-sm text-brand-400">
          {state.message}
        </p>
      ) : (
        <form
          action={formAction}
          className="flex flex-col gap-3 sm:flex-row sm:items-start"
        >
          <input type="hidden" name="source_page" value={pathname} />
          <div className="flex-1">
            <label htmlFor="newsletter-email" className="sr-only">
              Email address
            </label>
            <input
              id="newsletter-email"
              name="email"
              type="email"
              required
              placeholder="you@company.com"
              className={cn(inputClass, "sm:min-w-[16rem]")}
            />
            {state.status === "error" ? (
              <p className="mt-2 text-xs text-red-400" role="alert">
                {state.message}
              </p>
            ) : null}
          </div>
          <Button type="submit" size="lg" disabled={pending}>
            {pending ? "Subscribing…" : "Subscribe"}
          </Button>
        </form>
      )}
    </div>
  );
}
