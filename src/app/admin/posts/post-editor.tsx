"use client";

import Link from "next/link";
import { useActionState, useState } from "react";

import { createPost, updatePost } from "../actions";
import { IDLE_FORM_STATE, type Post } from "@/lib/types";
import { estimateReadTime, slugify } from "@/lib/utils";
import { Button, buttonClass } from "@/components/ui";
import { Field, FormMessage, inputClass } from "@/components/form-fields";
import { cn } from "@/lib/utils";

const CATEGORIES = [
  "Software",
  "Digital Marketing",
  "SEO",
  "Design",
  "AI & Automation",
  "Business",
];

function toDateInput(value?: string) {
  if (!value) return new Date().toISOString().slice(0, 10);
  return new Date(value).toISOString().slice(0, 10);
}

export function PostEditor({ post }: { post?: Post }) {
  const isEdit = Boolean(post);
  const [state, formAction, pending] = useActionState(
    isEdit ? updatePost : createPost,
    IDLE_FORM_STATE,
  );

  const [title, setTitle] = useState(post?.title ?? "");
  const [slug, setSlug] = useState(post?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(Boolean(post?.slug));
  const [content, setContent] = useState(post?.content ?? "");
  const [showPreview, setShowPreview] = useState(false);

  const onTitleChange = (value: string) => {
    setTitle(value);
    // Auto-derive the slug until the author edits it themselves.
    if (!slugTouched) setSlug(slugify(value));
  };

  return (
    <form action={formAction} className="grid gap-8 lg:grid-cols-[1.6fr_1fr]">
      {isEdit ? <input type="hidden" name="id" value={post!.id} /> : null}

      {/* Main column */}
      <div className="space-y-6">
        <Field label="Title" htmlFor="title" error={state.errors?.title}>
          <input
            id="title"
            name="title"
            value={title}
            onChange={(e) => onTitleChange(e.target.value)}
            required
            placeholder="Why Your Business Needs Digital Marketing"
            className={inputClass}
          />
        </Field>

        <Field label="Slug" htmlFor="slug" error={state.errors?.slug}>
          <div className="flex items-center gap-2">
            <span className="shrink-0 font-mono text-sm text-mist">/blogs/</span>
            <input
              id="slug"
              name="slug"
              value={slug}
              onChange={(e) => {
                setSlugTouched(true);
                setSlug(e.target.value);
              }}
              required
              className={cn(inputClass, "font-mono text-sm")}
            />
          </div>
        </Field>

        <Field label="Excerpt" htmlFor="excerpt" error={state.errors?.excerpt}>
          <textarea
            id="excerpt"
            name="excerpt"
            rows={3}
            defaultValue={post?.excerpt ?? ""}
            required
            placeholder="One or two sentences shown on the blog listing."
            className={cn(inputClass, "resize-y")}
          />
        </Field>

        <div>
          <div className="mb-2 flex items-center justify-between">
            <label htmlFor="content" className="text-sm font-medium text-cloud">
              Content <span className="text-brand-500">*</span>
              <span className="ml-2 font-normal text-mist">
                HTML, use &lt;p&gt;, &lt;h2&gt;, &lt;ul&gt;, &lt;a&gt;
              </span>
            </label>
            <button
              type="button"
              onClick={() => setShowPreview((v) => !v)}
              className="text-xs font-medium text-brand-400 hover:text-brand-500"
            >
              {showPreview ? "Edit HTML" : "Preview"}
            </button>
          </div>

          {showPreview ? (
            <div className="min-h-[24rem] rounded-lg border border-line bg-ink-900 p-6">
              <div
                className="article-body"
                dangerouslySetInnerHTML={{ __html: content }}
              />
            </div>
          ) : (
            <textarea
              id="content"
              name="content"
              rows={20}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              placeholder="<p>Your first paragraph…</p>"
              className={cn(inputClass, "resize-y font-mono text-sm leading-relaxed")}
            />
          )}

          {/* Keep the value submitted even while the preview replaces the textarea. */}
          {showPreview ? (
            <input type="hidden" name="content" value={content} />
          ) : null}

          {state.errors?.content ? (
            <p className="mt-1.5 text-xs text-red-400" role="alert">
              {state.errors.content}
            </p>
          ) : null}
          <p className="mt-2 text-xs text-mist">
            Estimated reading time: {estimateReadTime(content)}
          </p>
        </div>
      </div>

      {/* Sidebar */}
      <aside className="space-y-6">
        <div className="space-y-5 rounded-2xl border border-line bg-ink-850 p-6">
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              name="published"
              defaultChecked={post?.published ?? true}
              className="h-4 w-4 accent-[color:var(--color-brand-500)]"
            />
            <span className="text-sm font-medium text-cloud">Published</span>
          </label>
          <p className="text-xs text-mist">
            Unpublished posts stay hidden from the public site but remain here as
            drafts.
          </p>

          <FormMessage state={state} />

          <Button type="submit" size="lg" disabled={pending} className="w-full">
            {pending ? "Saving…" : isEdit ? "Save changes" : "Create post"}
          </Button>

          <Link
            href="/admin"
            className={buttonClass({
              variant: "ghost",
              className: "w-full",
            })}
          >
            Cancel
          </Link>

          {isEdit && post!.published ? (
            <Link
              href={`/blogs/${post!.slug}`}
              target="_blank"
              className="block text-center text-xs text-mist hover:text-brand-400"
            >
              View live post ↗
            </Link>
          ) : null}
        </div>

        <div className="space-y-5 rounded-2xl border border-line bg-ink-850 p-6">
          <Field label="Category" htmlFor="category">
            <input
              id="category"
              name="category"
              list="category-options"
              defaultValue={post?.category ?? "Software"}
              className={inputClass}
            />
            <datalist id="category-options">
              {CATEGORIES.map((c) => (
                <option key={c} value={c} />
              ))}
            </datalist>
          </Field>

          <Field label="Author" htmlFor="author">
            <input
              id="author"
              name="author"
              defaultValue={post?.author ?? "Altveen Team"}
              className={inputClass}
            />
          </Field>

          <Field label="Cover image URL" htmlFor="image_url" optional>
            <input
              id="image_url"
              name="image_url"
              type="url"
              defaultValue={post?.image_url ?? ""}
              placeholder="https://images.unsplash.com/…"
              className={inputClass}
            />
          </Field>

          <Field label="Publish date" htmlFor="published_at">
            <input
              id="published_at"
              name="published_at"
              type="date"
              defaultValue={toDateInput(post?.published_at)}
              className={inputClass}
            />
          </Field>

          <Field label="Read time" htmlFor="read_time" optional>
            <input
              id="read_time"
              name="read_time"
              defaultValue={post?.read_time ?? ""}
              placeholder="Auto-calculated if left blank"
              className={inputClass}
            />
          </Field>
        </div>
      </aside>
    </form>
  );
}
