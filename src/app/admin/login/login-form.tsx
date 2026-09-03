"use client";

import { useActionState } from "react";
import { useSearchParams } from "next/navigation";

import { signIn } from "../actions";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { IDLE_FORM_STATE } from "@/lib/types";
import { Button } from "@/components/ui";
import { Field, FormMessage, inputClass } from "@/components/form-fields";

export function LoginForm() {
  const searchParams = useSearchParams();
  const [state, formAction, pending] = useActionState(signIn, IDLE_FORM_STATE);

  if (!isSupabaseConfigured()) {
    return (
      <p className="mt-6 rounded-lg border border-amber-500/40 bg-amber-500/10 px-4 py-3 text-sm text-amber-300">
        Supabase isn’t configured yet. Add NEXT_PUBLIC_SUPABASE_URL and
        NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY to <code>.env.local</code> and
        restart the dev server.
      </p>
    );
  }

  return (
    <form action={formAction} className="mt-7 space-y-5">
      <input type="hidden" name="next" value={searchParams.get("next") ?? ""} />

      <Field label="Email" htmlFor="admin-email">
        <input
          id="admin-email"
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="you@altveen.com"
          className={inputClass}
        />
      </Field>

      <Field label="Password" htmlFor="admin-password">
        <input
          id="admin-password"
          name="password"
          type="password"
          required
          autoComplete="current-password"
          placeholder="••••••••"
          className={inputClass}
        />
      </Field>

      <FormMessage state={state} />

      <Button type="submit" size="lg" disabled={pending} className="w-full">
        {pending ? "Signing in…" : "Sign in"}
      </Button>
    </form>
  );
}
