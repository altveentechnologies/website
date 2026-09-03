import Link from "next/link";

import { getMarqueeClients } from "@/lib/clients";
import { AdminShell } from "../admin-shell";
import { ConfirmButton } from "../confirm-button";
import { removeFromMarquee, updateMarqueeSort } from "../marquee-actions";
import { AddMarqueeForm } from "./add-marquee-form";
import { buttonClass } from "@/components/ui";

export const dynamic = "force-dynamic";

export default async function AdminMarqueePage() {
  const clients = await getMarqueeClients();

  return (
    <AdminShell
      title="Homepage scroller"
      description={`${clients.length} business name${clients.length === 1 ? "" : "s"} · “Trusted by businesses across the world” strip below the hero`}
      action={
        <Link href="/admin/clients" className={buttonClass({ variant: "ghost" })}>
          Full client profiles →
        </Link>
      }
    >
      <div className="space-y-8">
        <AddMarqueeForm />

        {clients.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-line bg-ink-850 p-14 text-center">
            <h2 className="text-lg font-semibold text-cloud">No names yet</h2>
            <p className="mx-auto mt-2 max-w-md text-sm text-mist">
              Add a business name above, or run <code>npm run seed</code> to import
              clients from the previous site.
            </p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-line">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[36rem] text-left text-sm">
                <thead className="bg-ink-850 text-mist">
                  <tr>
                    <th className="px-5 py-3.5 font-medium">Business name</th>
                    <th className="px-5 py-3.5 font-medium">Order</th>
                    <th className="px-5 py-3.5 text-right font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[color:var(--color-line)]">
                  {clients.map((client) => (
                    <tr key={client.id} className="bg-ink-900/60">
                      <td className="px-5 py-4">
                        <p className="font-medium text-cloud">{client.name}</p>
                        {client.sector ? (
                          <p className="mt-0.5 text-xs text-mist">{client.sector}</p>
                        ) : null}
                      </td>
                      <td className="px-5 py-4">
                        <form action={updateMarqueeSort} className="flex items-center gap-2">
                          <input type="hidden" name="id" value={client.id} />
                          <input
                            name="sort_order"
                            type="number"
                            defaultValue={client.sort_order}
                            className="w-20 rounded-lg border border-line bg-ink-900 px-2.5 py-1.5 font-mono text-sm text-cloud"
                          />
                          <button
                            type="submit"
                            className="text-xs text-brand-400 hover:text-brand-500"
                          >
                            Save
                          </button>
                        </form>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center justify-end gap-3">
                          <Link
                            href={`/admin/clients/${client.id}`}
                            className="text-brand-400 hover:text-brand-500"
                          >
                            Edit profile
                          </Link>
                          <form action={removeFromMarquee}>
                            <input type="hidden" name="id" value={client.id} />
                            <ConfirmButton
                              message={`Remove “${client.name}” from the scroller? The client profile stays in Clients.`}
                              className="text-mist transition-colors hover:text-amber-400"
                            >
                              Remove
                            </ConfirmButton>
                          </form>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <p className="text-xs leading-relaxed text-mist">
          Names here are the same clients stored in Supabase. Adding a full client at{" "}
          <Link href="/admin/clients/new" className="text-brand-400 hover:text-brand-500">
            Clients → Add client
          </Link>{" "}
          with “Show in home-page scroller” checked will also list them here. Lower
          order numbers appear first.
        </p>
      </div>
    </AdminShell>
  );
}
