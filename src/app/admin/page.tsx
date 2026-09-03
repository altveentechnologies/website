import Link from "next/link";

import { getAllPostsForAdmin } from "@/lib/posts";
import { formatDate } from "@/lib/utils";
import { buttonClass } from "@/components/ui";
import { AdminShell } from "./admin-shell";
import { togglePublished } from "./actions";
import { TrashButton } from "./trash-button";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const posts = await getAllPostsForAdmin();
  const published = posts.filter((p) => p.published).length;

  return (
    <AdminShell
      title="Blog posts"
      description={`${posts.length} total · ${published} published · ${posts.length - published} draft`}
      action={
        <Link href="/admin/posts/new" className={buttonClass()}>
          New post
        </Link>
      }
    >
      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        <Link
          href="/admin/submissions"
          className="rounded-xl border border-line bg-ink-850 p-5 transition-colors hover:border-brand-500/50"
        >
          <p className="font-mono text-xs uppercase tracking-[0.14em] text-mist">
            Leads
          </p>
          <p className="mt-2 text-cloud">View form submissions →</p>
        </Link>
      </div>

      {posts.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-line bg-ink-850 p-14 text-center">
          <h2 className="text-lg font-semibold text-cloud">No posts yet</h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-mist">
            Create your first post, or run the seed script to import the nine
            articles from the previous site.
          </p>
          <Link
            href="/admin/posts/new"
            className={buttonClass({ className: "mt-6" })}
          >
            Write your first post
          </Link>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-line">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[46rem] text-left text-sm">
              <thead className="bg-ink-850 text-mist">
                <tr>
                  <th className="px-5 py-3.5 font-medium">Title</th>
                  <th className="px-5 py-3.5 font-medium">Category</th>
                  <th className="px-5 py-3.5 font-medium">Published</th>
                  <th className="px-5 py-3.5 font-medium">Status</th>
                  <th className="px-5 py-3.5 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[color:var(--color-line)]">
                {posts.map((post) => (
                  <tr key={post.id} className="bg-ink-900/60">
                    <td className="px-5 py-4">
                      <Link
                        href={`/admin/posts/${post.id}`}
                        className="font-medium text-cloud hover:text-brand-400"
                      >
                        {post.title}
                      </Link>
                      <p className="mt-0.5 font-mono text-xs text-mist">
                        /{post.slug}
                      </p>
                    </td>
                    <td className="px-5 py-4 text-mist">{post.category}</td>
                    <td className="px-5 py-4 text-mist">
                      {formatDate(post.published_at)}
                    </td>
                    <td className="px-5 py-4">
                      <form action={togglePublished}>
                        <input type="hidden" name="id" value={post.id} />
                        <input type="hidden" name="slug" value={post.slug} />
                        <input
                          type="hidden"
                          name="published"
                          value={String(!post.published)}
                        />
                        <button
                          type="submit"
                          title="Click to toggle"
                          className={
                            post.published
                              ? "rounded-full border border-brand-500/40 bg-brand-500/10 px-3 py-1 text-xs text-brand-400"
                              : "rounded-full border border-line bg-ink-800 px-3 py-1 text-xs text-mist"
                          }
                        >
                          {post.published ? "Published" : "Draft"}
                        </button>
                      </form>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-3">
                        <Link
                          href={`/admin/posts/${post.id}`}
                          className="text-brand-400 hover:text-brand-500"
                        >
                          Edit
                        </Link>
                        <TrashButton kind="post" id={post.id} label={post.title} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </AdminShell>
  );
}
