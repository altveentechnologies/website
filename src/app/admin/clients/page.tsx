import Image from "next/image";
import Link from "next/link";

import { getClients } from "@/lib/clients";
import { buttonClass } from "@/components/ui";
import { AdminShell } from "../admin-shell";
import { toggleClientMarquee } from "../client-actions";
import { TrashButton } from "../trash-button";

export const dynamic = "force-dynamic";

export default async function AdminClientsPage() {
  const clients = await getClients();
  const international = clients.filter((c) => c.region === "international");
  const local = clients.filter((c) => c.region === "local");

  return (
    <AdminShell
      title="Clients"
      description={`${clients.length} total · ${international.length} international · ${local.length} local`}
      action={
        <Link href="/admin/clients/new" className={buttonClass()}>
          Add client
        </Link>
      }
    >
      {clients.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-line bg-ink-850 p-14 text-center">
          <h2 className="text-lg font-semibold text-cloud">No clients yet</h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-mist">
            Add your first client, or run <code>npm run seed</code> to import the
            six from the previous site.
          </p>
          <Link
            href="/admin/clients/new"
            className={buttonClass({ className: "mt-6" })}
          >
            Add your first client
          </Link>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-line">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[50rem] text-left text-sm">
              <thead className="bg-ink-850 text-mist">
                <tr>
                  <th className="px-5 py-3.5 font-medium">Client</th>
                  <th className="px-5 py-3.5 font-medium">Section</th>
                  <th className="px-5 py-3.5 font-medium">Scroller</th>
                  <th className="px-5 py-3.5 font-medium">Order</th>
                  <th className="px-5 py-3.5 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[color:var(--color-line)]">
                {clients.map((client) => (
                  <tr key={client.id} className="bg-ink-900/60">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="relative h-11 w-16 shrink-0 overflow-hidden rounded-md border border-line bg-ink-800">
                          {client.image_url ? (
                            <Image
                              src={client.image_url}
                              alt=""
                              fill
                              sizes="64px"
                              className="object-cover"
                            />
                          ) : null}
                        </div>
                        <div>
                          <Link
                            href={`/admin/clients/${client.id}`}
                            className="font-medium text-cloud hover:text-brand-400"
                          >
                            {client.name}
                          </Link>
                          <p className="mt-0.5 text-xs text-mist">
                            {client.sector || "-"}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-mist">
                      {client.region === "international"
                        ? "International"
                        : "Local"}
                    </td>
                    <td className="px-5 py-4">
                      <form action={toggleClientMarquee}>
                        <input type="hidden" name="id" value={client.id} />
                        <input
                          type="hidden"
                          name="in_marquee"
                          value={String(!client.in_marquee)}
                        />
                        <button
                          type="submit"
                          title="Click to toggle"
                          className={
                            client.in_marquee
                              ? "rounded-full border border-brand-500/40 bg-brand-500/10 px-3 py-1 text-xs text-brand-400"
                              : "rounded-full border border-line bg-ink-800 px-3 py-1 text-xs text-mist"
                          }
                        >
                          {client.in_marquee ? "Shown" : "Hidden"}
                        </button>
                      </form>
                    </td>
                    <td className="px-5 py-4 font-mono text-mist">
                      {client.sort_order}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-3">
                        <Link
                          href={`/admin/clients/${client.id}`}
                          className="text-brand-400 hover:text-brand-500"
                        >
                          Edit
                        </Link>
                        <TrashButton kind="client" id={client.id} label={client.name} />
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
