"use client";

import Link from "next/link";
import { useActionState } from "react";

import {
  createTestimonialRecord,
  updateTestimonialRecord,
} from "../testimonial-actions";
import { IDLE_FORM_STATE, type Testimonial } from "@/lib/types";
import { Button, buttonClass } from "@/components/ui";
import { Field, FormMessage, inputClass } from "@/components/form-fields";
import { cn } from "@/lib/utils";

export function TestimonialEditor({ testimonial }: { testimonial?: Testimonial }) {
  const isEdit = Boolean(testimonial);
  const [state, formAction, pending] = useActionState(
    isEdit ? updateTestimonialRecord : createTestimonialRecord,
    IDLE_FORM_STATE,
  );

  return (
    <form action={formAction} className="grid gap-8 lg:grid-cols-[1.5fr_1fr]">
      {isEdit ? <input type="hidden" name="id" value={testimonial!.id} /> : null}

      <div className="space-y-6">
        <Field
          label="Client name"
          htmlFor="client_name"
          error={state.errors?.client_name}
        >
          <input
            id="client_name"
            name="client_name"
            defaultValue={testimonial?.client_name ?? ""}
            required
            placeholder="Lotus Cuisine of India"
            className={inputClass}
          />
        </Field>

        <Field label="Subtitle" htmlFor="detail" optional>
          <input
            id="detail"
            name="detail"
            defaultValue={testimonial?.detail ?? ""}
            placeholder="San Rafael, USA · Restaurant & digital growth"
            className={inputClass}
          />
        </Field>

        <Field label="Star rating" htmlFor="rating">
          <input
            id="rating"
            name="rating"
            type="number"
            min={0}
            max={5}
            step={0.1}
            defaultValue={testimonial?.rating ?? 5}
            className={inputClass}
          />
          <p className="mt-1.5 text-xs text-mist">0 to 5, decimals allowed (e.g. 4.9).</p>
        </Field>

        <Field label="What they said" htmlFor="quote" error={state.errors?.quote}>
          <textarea
            id="quote"
            name="quote"
            rows={6}
            defaultValue={testimonial?.quote ?? ""}
            required
            placeholder="Altveen feels like an extension of our team…"
            className={cn(inputClass, "resize-y")}
          />
        </Field>
      </div>

      <aside className="space-y-6">
        <div className="space-y-5 rounded-2xl border border-line bg-ink-850 p-6">
          <label className="flex items-start gap-3">
            <input
              type="checkbox"
              name="published"
              defaultChecked={testimonial?.published ?? true}
              className="mt-1 h-4 w-4 accent-[color:var(--color-brand-500)]"
            />
            <span className="text-sm text-cloud">
              Published
              <span className="mt-0.5 block text-xs font-normal text-mist">
                Drafts are hidden from the public site.
              </span>
            </span>
          </label>

          <label className="flex items-start gap-3">
            <input
              type="checkbox"
              name="show_on_homepage"
              defaultChecked={testimonial?.show_on_homepage ?? true}
              className="mt-1 h-4 w-4 accent-[color:var(--color-brand-500)]"
            />
            <span className="text-sm text-cloud">
              Show on homepage
            </span>
          </label>

          <label className="flex items-start gap-3">
            <input
              type="checkbox"
              name="show_on_services"
              defaultChecked={testimonial?.show_on_services ?? true}
              className="mt-1 h-4 w-4 accent-[color:var(--color-brand-500)]"
            />
            <span className="text-sm text-cloud">
              Show on services page
            </span>
          </label>

          <Field label="Sort order" htmlFor="sort_order" optional>
            <input
              id="sort_order"
              name="sort_order"
              type="number"
              defaultValue={testimonial?.sort_order ?? 0}
              className={inputClass}
            />
          </Field>
          <p className="text-xs text-mist">
            Lower numbers appear first. Published reviews also appear on the
            clients and about pages.
          </p>

          <FormMessage state={state} />

          <Button type="submit" size="lg" disabled={pending} className="w-full">
            {pending ? "Saving…" : isEdit ? "Save changes" : "Add review"}
          </Button>

          <Link
            href="/admin/testimonials"
            className={buttonClass({ variant: "ghost", className: "w-full" })}
          >
            Cancel
          </Link>
        </div>
      </aside>
    </form>
  );
}
