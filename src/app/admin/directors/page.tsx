import {
  getDirectorEntries,
  getDirectorSaleOptions,
  totalsAcrossDirectors,
} from "@/lib/directors";
import { formatMoney } from "@/lib/finance";
import { DIRECTOR_ENTRY_LABELS, DIRECTOR_LABELS } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import { AdminShell } from "../admin-shell";
import { TrashButton } from "../trash-button";
import { DirectorEntryForm } from "./entry-form";

export const dynamic = "force-dynamic";

export default async function AdminDirectorsPage() {
  const [entries, sales] = await Promise.all([
    getDirectorEntries(),
    getDirectorSaleOptions(),
  ]);
  const totals = totalsAcrossDirectors(entries);

  return (
    <AdminShell
      title="Directors accounts"
      description="Arafat and Khalid — money took, money invested, dates, and which service it was for."
    >
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-line bg-ink-850/60 p-5">
          <p className="font-mono text-[0.65rem] uppercase tracking-[0.14em] text-mist">
            Arafat took
          </p>
          <p className="mt-2 text-2xl font-bold text-cloud">
            {formatMoney(totals.arfat_took, "INR")}
          </p>
        </div>
        <div className="rounded-2xl border border-line bg-ink-850/60 p-5">
          <p className="font-mono text-[0.65rem] uppercase tracking-[0.14em] text-mist">
            Arafat invested
          </p>
          <p className="mt-2 text-2xl font-bold text-brand-400">
            {formatMoney(totals.arfat_invested, "INR")}
          </p>
        </div>
        <div className="rounded-2xl border border-line bg-ink-850/60 p-5">
          <p className="font-mono text-[0.65rem] uppercase tracking-[0.14em] text-mist">
            Khalid took
          </p>
          <p className="mt-2 text-2xl font-bold text-cloud">
            {formatMoney(totals.khalid_took, "INR")}
          </p>
        </div>
        <div className="rounded-2xl border border-line bg-ink-850/60 p-5">
          <p className="font-mono text-[0.65rem] uppercase tracking-[0.14em] text-mist">
            Khalid invested
          </p>
          <p className="mt-2 text-2xl font-bold text-brand-400">
            {formatMoney(totals.khalid_invested, "INR")}
          </p>
        </div>
      </div>

      <div className="grid gap-10 xl:grid-cols-[1fr_22rem]">
        <section className="space-y-6">
          <h2 className="text-lg font-semibold text-cloud">All records</h2>

          {entries.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-line bg-ink-850 p-10 text-center">
              <p className="text-sm text-mist">
                No director records yet. Add when Arafat or Khalid takes money or invests
                for a service.
              </p>
              <p className="mx-auto mt-3 max-w-md text-xs text-mist">
                First run <code className="text-brand-400">supabase/directors.sql</code> in
                Supabase SQL Editor.
              </p>
            </div>
          ) : (
            <div className="overflow-hidden rounded-2xl border border-line">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[44rem] text-left text-sm">
                  <thead className="bg-ink-850 text-mist">
                    <tr>
                      <th className="px-4 py-3 font-medium">Director</th>
                      <th className="px-4 py-3 font-medium">Type</th>
                      <th className="px-4 py-3 font-medium">Amount</th>
                      <th className="px-4 py-3 font-medium">Date</th>
                      <th className="px-4 py-3 font-medium">Service / sale</th>
                      <th className="px-4 py-3 font-medium">Notes</th>
                      <th className="px-4 py-3 text-right font-medium">Remove</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[color:var(--color-line)]">
                    {entries.map((entry) => (
                      <tr key={entry.id} className="bg-ink-900/60">
                        <td className="px-4 py-3 font-medium text-cloud">
                          {DIRECTOR_LABELS[entry.director]}
                        </td>
                        <td className="px-4 py-3 text-mist">
                          {DIRECTOR_ENTRY_LABELS[entry.entry_type]}
                        </td>
                        <td className="px-4 py-3 font-medium text-cloud">
                          {formatMoney(entry.amount, "INR")}
                        </td>
                        <td className="px-4 py-3 text-mist">
                          {formatDate(entry.transaction_date)}
                        </td>
                        <td className="max-w-[14rem] px-4 py-3 text-xs text-mist">
                          {entry.service_label}
                        </td>
                        <td className="max-w-[10rem] px-4 py-3 text-xs text-mist">
                          {entry.notes || "—"}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <TrashButton
                            kind="director_entry"
                            id={entry.id}
                            label={`${DIRECTOR_LABELS[entry.director]} — ${DIRECTOR_ENTRY_LABELS[entry.entry_type]}`}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </section>

        <aside>
          <DirectorEntryForm sales={sales} />
        </aside>
      </div>
    </AdminShell>
  );
}
