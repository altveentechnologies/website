import Link from "next/link";

import { getCashOnHand } from "@/lib/cash-on-hand";
import { getCompanyExpenses, totalCompanyExpenses } from "@/lib/company-expenses";
import { formatMoney, getFinanceSales, totalsAcrossSales } from "@/lib/finance";
import { FINANCE_SALE_TYPE_LABELS } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import { buttonClass } from "@/components/ui";
import { AdminShell } from "../admin-shell";
import { TrashButton } from "../trash-button";
import { CashOnHandForm } from "./cash-on-hand-form";
import { CompanyExpenseForm } from "./company-expense-form";

export const dynamic = "force-dynamic";

export default async function AdminFinancePage() {
  const [sales, companyExpenses, cash] = await Promise.all([
    getFinanceSales(),
    getCompanyExpenses(),
    getCashOnHand(),
  ]);
  const totals = totalsAcrossSales(sales);
  const extraExpensesTotal = totalCompanyExpenses(companyExpenses);

  return (
    <AdminShell
      title="Business finance"
      description="Company sales — what you quoted, what they paid, and what is still pending."
      action={
        <Link href="/admin/finance/new" className={buttonClass()}>
          Add sale
        </Link>
      }
    >
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <div className="rounded-2xl border border-line bg-ink-850/60 p-5">
          <p className="font-mono text-[0.65rem] uppercase tracking-[0.14em] text-mist">
            Total quoted
          </p>
          <p className="mt-2 text-2xl font-bold text-cloud">
            {formatMoney(totals.quoted, "INR")}
          </p>
        </div>
        <div className="rounded-2xl border border-line bg-ink-850/60 p-5">
          <p className="font-mono text-[0.65rem] uppercase tracking-[0.14em] text-mist">
            Total paid
          </p>
          <p className="mt-2 text-2xl font-bold text-brand-400">
            {formatMoney(totals.paid, "INR")}
          </p>
        </div>
        <div className="rounded-2xl border border-line bg-ink-850/60 p-5">
          <p className="font-mono text-[0.65rem] uppercase tracking-[0.14em] text-mist">
            Total pending
          </p>
          <p className="mt-2 text-2xl font-bold text-amber-400">
            {formatMoney(totals.pending, "INR")}
          </p>
        </div>
        <div className="rounded-2xl border border-line bg-ink-850/60 p-5">
          <p className="font-mono text-[0.65rem] uppercase tracking-[0.14em] text-mist">
            Total money spent
          </p>
          <p className="mt-2 text-2xl font-bold text-mist">
            {formatMoney(totals.cost, "INR")}
          </p>
        </div>
        <div className="rounded-2xl border border-line bg-ink-850/60 p-5">
          <p className="font-mono text-[0.65rem] uppercase tracking-[0.14em] text-mist">
            Total profit
          </p>
          <p
            className={`mt-2 text-2xl font-bold ${totals.profit >= 0 ? "text-brand-400" : "text-amber-400"}`}
          >
            {formatMoney(totals.profit, "INR")}
          </p>
        </div>
        <div className="rounded-2xl border border-line bg-ink-850/60 p-5">
          <p className="font-mono text-[0.65rem] uppercase tracking-[0.14em] text-mist">
            Company extra expenses
          </p>
          <p className="mt-2 text-2xl font-bold text-red-400/90">
            {formatMoney(extraExpensesTotal, "INR")}
          </p>
        </div>
        <div className="rounded-2xl border border-brand-500/30 bg-ink-850/60 p-5">
          <p className="font-mono text-[0.65rem] uppercase tracking-[0.14em] text-mist">
            Money in hand
          </p>
          <p className="mt-2 text-2xl font-bold text-cloud">
            {formatMoney(cash.amount, "INR")}
          </p>
        </div>
      </div>

      <section className="mb-10 rounded-2xl border border-line bg-ink-850/40 p-6 sm:p-8">
        <div className="grid gap-8 lg:grid-cols-[1fr_22rem] lg:items-start">
          <div>
            <h2 className="text-lg font-semibold text-cloud">Money in hand</h2>
            <p className="mt-1 text-sm text-mist">
              Enter this yourself whenever you count cash and bank. It is not calculated
              from sales or expenses.
            </p>
            <p className="mt-5 text-3xl font-bold text-cloud">
              {formatMoney(cash.amount, "INR")}
            </p>
            {cash.updated_at ? (
              <p className="mt-2 text-xs text-mist">
                Last updated {formatDate(cash.updated_at)}
                {cash.notes ? ` · ${cash.notes}` : ""}
              </p>
            ) : (
              <p className="mt-2 text-xs text-mist">
                Run{" "}
                <code className="text-brand-400">supabase/cash-on-hand.sql</code> in
                Supabase SQL Editor once, then save an amount here.
              </p>
            )}
          </div>
          <CashOnHandForm key={cash.updated_at ?? "new"} cash={cash} />
        </div>
      </section>

      {sales.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-line bg-ink-850 p-14 text-center">
          <h2 className="text-lg font-semibold text-cloud">No sales yet</h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-mist">
            Add each client sale — company, service or equipment, quoted amount, and
            how much they have paid.
          </p>
          <p className="mx-auto mt-3 max-w-md text-xs text-mist">
            Run <code className="text-brand-400">supabase/finance-simple-upgrade.sql</code> in
            Supabase SQL Editor if the table is missing columns.
          </p>
          <Link href="/admin/finance/new" className={buttonClass({ className: "mt-6" })}>
            Add first sale
          </Link>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-line">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[48rem] text-left text-sm">
              <thead className="bg-ink-850 text-mist">
                <tr>
                  <th className="px-5 py-3.5 font-medium">Company</th>
                  <th className="px-5 py-3.5 font-medium">Service / equipment</th>
                  <th className="px-5 py-3.5 font-medium">Name</th>
                  <th className="px-5 py-3.5 font-medium">Quoted</th>
                  <th className="px-5 py-3.5 font-medium">Paid</th>
                  <th className="px-5 py-3.5 font-medium">Money spent?</th>
                  <th className="px-5 py-3.5 font-medium">How much spent</th>
                  <th className="px-5 py-3.5 font-medium">Profit</th>
                  <th className="px-5 py-3.5 font-medium">Pending</th>
                  <th className="px-5 py-3.5 text-right font-medium">Edit</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[color:var(--color-line)]">
                {sales.map((sale) => (
                  <tr key={sale.id} className="bg-ink-900/60">
                    <td className="px-5 py-4 font-medium text-cloud">{sale.client_name}</td>
                    <td className="px-5 py-4 text-mist">
                      {FINANCE_SALE_TYPE_LABELS[sale.sale_type]}
                    </td>
                    <td className="px-5 py-4 text-mist">{sale.item_name}</td>
                    <td className="px-5 py-4 text-cloud">
                      {formatMoney(sale.quoted_amount, sale.currency)}
                    </td>
                    <td className="px-5 py-4 text-brand-400">
                      {formatMoney(sale.paid_amount, sale.currency)}
                    </td>
                    <td className="px-5 py-4 text-mist">
                      {sale.has_cost ? "Yes" : "No"}
                    </td>
                    <td className="px-5 py-4 text-mist">
                      {sale.has_cost
                        ? formatMoney(sale.cost_amount, sale.currency)
                        : "—"}
                    </td>
                    <td
                      className={
                        sale.profit >= 0
                          ? "px-5 py-4 font-medium text-brand-400"
                          : "px-5 py-4 font-medium text-amber-400"
                      }
                    >
                      {formatMoney(sale.profit, sale.currency)}
                    </td>
                    <td className="px-5 py-4 text-amber-400">
                      {formatMoney(sale.pending, sale.currency)}
                    </td>
                    <td className="px-5 py-4 text-right">
                      <Link
                        href={`/admin/finance/${sale.id}`}
                        className="text-brand-400 hover:text-brand-500"
                      >
                        Edit
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <section className="mt-14 border-t border-line pt-10">
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-cloud">Company extra expenses</h2>
          <p className="mt-1 text-sm text-mist">
            General company costs — not linked to a client sale. Deleted items go to Trash.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1fr_20rem]">
          {companyExpenses.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-line bg-ink-850 p-10 text-center">
              <p className="text-sm text-mist">No company expenses recorded yet.</p>
              <p className="mx-auto mt-2 max-w-md text-xs text-mist">
                Run{" "}
                <code className="text-brand-400">supabase/company-expenses.sql</code> in Supabase
                SQL Editor if the table is missing.
              </p>
            </div>
          ) : (
            <div className="overflow-hidden rounded-2xl border border-line">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[32rem] text-left text-sm">
                  <thead className="bg-ink-850 text-mist">
                    <tr>
                      <th className="px-5 py-3.5 font-medium">Description</th>
                      <th className="px-5 py-3.5 font-medium">Amount</th>
                      <th className="px-5 py-3.5 font-medium">Date</th>
                      <th className="px-5 py-3.5 font-medium">Notes</th>
                      <th className="px-5 py-3.5 text-right font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[color:var(--color-line)]">
                    {companyExpenses.map((expense) => (
                      <tr key={expense.id} className="bg-ink-900/60">
                        <td className="px-5 py-4 font-medium text-cloud">
                          {expense.description}
                        </td>
                        <td className="px-5 py-4 text-red-400/90">
                          {formatMoney(expense.amount, "INR")}
                        </td>
                        <td className="px-5 py-4 text-mist">
                          {formatDate(expense.expense_date)}
                        </td>
                        <td className="max-w-[12rem] px-5 py-4 text-xs text-mist">
                          {expense.notes || "—"}
                        </td>
                        <td className="px-5 py-4 text-right">
                          <TrashButton
                            kind="company_expense"
                            id={expense.id}
                            label={expense.description}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          <CompanyExpenseForm />
        </div>
      </section>
    </AdminShell>
  );
}
