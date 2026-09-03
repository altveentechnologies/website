import Link from "next/link";

import { getAllTestimonialsForAdmin } from "@/lib/testimonials";
import { buttonClass, StarRating } from "@/components/ui";
import { AdminShell } from "../admin-shell";
import {
  toggleTestimonialHomepage,
  toggleTestimonialPublished,
  toggleTestimonialServices,
} from "../testimonial-actions";
import { TrashButton } from "../trash-button";

export const dynamic = "force-dynamic";

export default async function AdminTestimonialsPage() {
  const testimonials = await getAllTestimonialsForAdmin();
  const published = testimonials.filter((t) => t.published).length;

  return (
    <AdminShell
      title="Reviews"
      description={`${testimonials.length} total · ${published} published · ${testimonials.length - published} draft`}
      action={
        <Link href="/admin/testimonials/new" className={buttonClass()}>
          Add review
        </Link>
      }
    >
      {testimonials.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-line bg-ink-850 p-14 text-center">
          <h2 className="text-lg font-semibold text-cloud">No reviews yet</h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-mist">
            Add your first client review, or run <code>npm run seed</code> to
            import the six from the previous site.
          </p>
          <Link
            href="/admin/testimonials/new"
            className={buttonClass({ className: "mt-6" })}
          >
            Add your first review
          </Link>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-line">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[56rem] text-left text-sm">
              <thead className="bg-ink-850 text-mist">
                <tr>
                  <th className="px-5 py-3.5 font-medium">Client</th>
                  <th className="px-5 py-3.5 font-medium">Rating</th>
                  <th className="px-5 py-3.5 font-medium">Published</th>
                  <th className="px-5 py-3.5 font-medium">Home</th>
                  <th className="px-5 py-3.5 font-medium">Services</th>
                  <th className="px-5 py-3.5 font-medium">Order</th>
                  <th className="px-5 py-3.5 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[color:var(--color-line)]">
                {testimonials.map((item) => (
                  <tr key={item.id} className="bg-ink-900/60">
                    <td className="px-5 py-4">
                      <Link
                        href={`/admin/testimonials/${item.id}`}
                        className="font-medium text-cloud hover:text-brand-400"
                      >
                        {item.client_name}
                      </Link>
                      <p className="mt-1 line-clamp-2 max-w-md text-xs text-mist">
                        “{item.quote}”
                      </p>
                    </td>
                    <td className="px-5 py-4">
                      <StarRating rating={item.rating} />
                    </td>
                    <td className="px-5 py-4">
                      <form action={toggleTestimonialPublished}>
                        <input type="hidden" name="id" value={item.id} />
                        <input
                          type="hidden"
                          name="published"
                          value={String(!item.published)}
                        />
                        <button
                          type="submit"
                          className={
                            item.published
                              ? "rounded-full border border-brand-500/40 bg-brand-500/10 px-3 py-1 text-xs text-brand-400"
                              : "rounded-full border border-line bg-ink-800 px-3 py-1 text-xs text-mist"
                          }
                        >
                          {item.published ? "Live" : "Draft"}
                        </button>
                      </form>
                    </td>
                    <td className="px-5 py-4">
                      <form action={toggleTestimonialHomepage}>
                        <input type="hidden" name="id" value={item.id} />
                        <input
                          type="hidden"
                          name="show_on_homepage"
                          value={String(!item.show_on_homepage)}
                        />
                        <button
                          type="submit"
                          className={
                            item.show_on_homepage
                              ? "rounded-full border border-brand-500/40 bg-brand-500/10 px-3 py-1 text-xs text-brand-400"
                              : "rounded-full border border-line bg-ink-800 px-3 py-1 text-xs text-mist"
                          }
                        >
                          {item.show_on_homepage ? "Yes" : "No"}
                        </button>
                      </form>
                    </td>
                    <td className="px-5 py-4">
                      <form action={toggleTestimonialServices}>
                        <input type="hidden" name="id" value={item.id} />
                        <input
                          type="hidden"
                          name="show_on_services"
                          value={String(!item.show_on_services)}
                        />
                        <button
                          type="submit"
                          className={
                            item.show_on_services
                              ? "rounded-full border border-brand-500/40 bg-brand-500/10 px-3 py-1 text-xs text-brand-400"
                              : "rounded-full border border-line bg-ink-800 px-3 py-1 text-xs text-mist"
                          }
                        >
                          {item.show_on_services ? "Yes" : "No"}
                        </button>
                      </form>
                    </td>
                    <td className="px-5 py-4 font-mono text-mist">
                      {item.sort_order}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-3">
                        <Link
                          href={`/admin/testimonials/${item.id}`}
                          className="text-brand-400 hover:text-brand-500"
                        >
                          Edit
                        </Link>
                        <TrashButton
                          kind="testimonial"
                          id={item.id}
                          label={item.client_name}
                        />
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
