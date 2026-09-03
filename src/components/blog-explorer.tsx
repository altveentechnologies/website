"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import type { Post } from "@/lib/types";
import { cn } from "@/lib/utils";
import { BlogCard } from "@/components/cards";
import { SearchIcon } from "@/components/icons";

/**
 * Client-side search + category filtering over the posts fetched on the
 * server. The full list is small enough to filter in the browser, which keeps
 * the interaction instant and avoids a request per keystroke.
 */
export function BlogExplorer({ posts }: { posts: Post[] }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");

  const categories = useMemo(() => {
    const unique = Array.from(new Set(posts.map((p) => p.category))).sort();
    return ["All", ...unique];
  }, [posts]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();

    return posts.filter((post) => {
      const matchesCategory = category === "All" || post.category === category;
      if (!matchesCategory) return false;
      if (!q) return true;

      return (
        post.title.toLowerCase().includes(q) ||
        post.excerpt.toLowerCase().includes(q) ||
        post.category.toLowerCase().includes(q)
      );
    });
  }, [posts, query, category]);

  if (posts.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-line bg-ink-850 p-14 text-center">
        <h3 className="text-lg font-semibold text-cloud">No posts yet</h3>
        <p className="mx-auto mt-2 max-w-md text-sm text-mist">
          Once posts are published in Supabase they will appear here
          automatically, no redeploy needed.
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* Controls */}
      <div className="mb-10 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="relative w-full lg:max-w-sm">
          <SearchIcon className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-mist" />
          <label htmlFor="blog-search" className="sr-only">
            Search articles
          </label>
          <input
            id="blog-search"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search articles…"
            className="w-full rounded-full border border-line bg-ink-800 py-3 pl-11 pr-4 text-sm text-cloud placeholder:text-mist/70 transition-colors focus:border-brand-500 focus:outline-none"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setCategory(cat)}
              aria-pressed={category === cat}
              className={cn(
                "rounded-full border px-4 py-2 text-sm transition-all",
                category === cat
                  ? "border-brand-500 bg-brand-500/15 text-brand-400"
                  : "border-line bg-ink-800 text-mist hover:border-ink-600 hover:text-cloud",
              )}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <p className="mb-6 text-sm text-mist">
        {filtered.length} {filtered.length === 1 ? "article" : "articles"}
        {category !== "All" ? ` in ${category}` : ""}
      </p>

      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-line bg-ink-850 p-14 text-center">
          <h3 className="text-lg font-semibold text-cloud">No matches</h3>
          <p className="mt-2 text-sm text-mist">
            Try a different search term or category.
          </p>
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setCategory("All");
            }}
            className="mt-5 text-sm font-medium text-brand-400 hover:text-brand-500"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <motion.div
          layout
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          <AnimatePresence mode="popLayout">
            {filtered.map((post) => (
              <motion.div
                key={post.id}
                layout
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              >
                <BlogCard post={post} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
}
