"use client";

import Image from "next/image";
import Link from "next/link";
import { useActionState, useState } from "react";

import { createClientRecord, updateClientRecord } from "../client-actions";
import { IDLE_FORM_STATE, type Client } from "@/lib/types";
import { Button, buttonClass } from "@/components/ui";
import { Field, FormMessage, inputClass } from "@/components/form-fields";
import { cn } from "@/lib/utils";

export function ClientEditor({ client }: { client?: Client }) {
  const isEdit = Boolean(client);
  const [state, formAction, pending] = useActionState(
    isEdit ? updateClientRecord : createClientRecord,
    IDLE_FORM_STATE,
  );

  const [preview, setPreview] = useState<string | null>(null);
  const currentImage = preview ?? client?.image_url ?? null;

  const onFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    // Local object URL just for the thumbnail; the real upload happens server-side.
    setPreview(file ? URL.createObjectURL(file) : null);
  };

  return (
    <form action={formAction} className="grid gap-8 lg:grid-cols-[1.5fr_1fr]">
      {isEdit ? <input type="hidden" name="id" value={client!.id} /> : null}

      <div className="space-y-6">
        <Field label="Client name" htmlFor="name" error={state.errors?.name}>
          <input
            id="name"
            name="name"
            defaultValue={client?.name ?? ""}
            required
            placeholder="Lotus Cuisine of India"
            className={inputClass}
          />
        </Field>

        <Field label="Location / sector" htmlFor="sector">
          <input
            id="sector"
            name="sector"
            defaultValue={client?.sector ?? ""}
            placeholder="San Rafael, USA"
            className={inputClass}
          />
        </Field>

        <Field
          label="Description"
          htmlFor="description"
          error={state.errors?.description}
        >
          <textarea
            id="description"
            name="description"
            rows={4}
            defaultValue={client?.description ?? ""}
            required
            placeholder="Restaurant website, online presence and ongoing digital marketing."
            className={cn(inputClass, "resize-y")}
          />
        </Field>

        <Field label="Website URL" htmlFor="url" optional>
          <input
            id="url"
            name="url"
            type="url"
            defaultValue={client?.url ?? ""}
            placeholder="https://example.com"
            className={inputClass}
          />
        </Field>
      </div>

      <aside className="space-y-6">
        {/* Image */}
        <div className="space-y-4 rounded-2xl border border-line bg-ink-850 p-6">
          <p className="text-sm font-medium text-cloud">Photo</p>

          {currentImage ? (
            <div className="relative aspect-[16/10] overflow-hidden rounded-lg border border-line">
              {/* Blob previews aren't a configured remote host, so use a plain img. */}
              {preview ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={preview}
                  alt=""
                  className="h-full w-full object-cover"
                />
              ) : (
                <Image
                  src={currentImage}
                  alt=""
                  fill
                  sizes="320px"
                  className="object-cover"
                />
              )}
            </div>
          ) : (
            <div className="flex aspect-[16/10] items-center justify-center rounded-lg border border-dashed border-line text-xs text-mist">
              No image yet
            </div>
          )}

          <input
            type="file"
            name="image"
            accept="image/jpeg,image/png,image/webp,image/avif"
            onChange={onFileChange}
            className="block w-full text-xs text-mist file:mr-3 file:cursor-pointer file:rounded-lg file:border-0 file:bg-brand-500 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-ink-950 hover:file:bg-brand-400"
          />
          <p className="text-xs text-mist">
            JPG, PNG, WebP or AVIF, up to 5 MB. Uploads to Supabase Storage  - 
            leave empty to keep the current photo.
          </p>

          <Field label="…or paste an image URL" htmlFor="image_url" optional>
            <input
              id="image_url"
              name="image_url"
              defaultValue={client?.image_url ?? ""}
              placeholder="https://… or /images/atfaal.jpg"
              className={cn(inputClass, "text-xs")}
            />
          </Field>
        </div>

        {/* Placement */}
        <div className="space-y-5 rounded-2xl border border-line bg-ink-850 p-6">
          <Field label="Section" htmlFor="region">
            <select
              id="region"
              name="region"
              defaultValue={client?.region ?? "international"}
              className={cn(inputClass, "cursor-pointer")}
            >
              <option value="international">International clients</option>
              <option value="local">Local clients</option>
            </select>
          </Field>

          <label className="flex items-start gap-3">
            <input
              type="checkbox"
              name="in_marquee"
              defaultChecked={client?.in_marquee ?? true}
              className="mt-1 h-4 w-4 accent-[color:var(--color-brand-500)]"
            />
            <span className="text-sm text-cloud">
              Show in home-page scroller
              <span className="mt-0.5 block text-xs font-normal text-mist">
                The “Trusted by businesses across the world” strip below the hero.
                Also managed from Scroller in the admin nav.
              </span>
            </span>
          </label>

          <Field label="Sort order" htmlFor="sort_order" optional>
            <input
              id="sort_order"
              name="sort_order"
              type="number"
              defaultValue={client?.sort_order ?? 0}
              className={inputClass}
            />
          </Field>
          <p className="text-xs text-mist">
            Lower numbers appear first. Ties fall back to alphabetical order.
          </p>

          <FormMessage state={state} />

          <Button type="submit" size="lg" disabled={pending} className="w-full">
            {pending
              ? "Saving…"
              : isEdit
                ? "Save changes"
                : "Add client"}
          </Button>

          <Link
            href="/admin/clients"
            className={buttonClass({ variant: "ghost", className: "w-full" })}
          >
            Cancel
          </Link>
        </div>
      </aside>
    </form>
  );
}
