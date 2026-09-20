"use client";

import { useActionState, useState } from "react";

import type { FinanceSale, FormState } from "@/lib/types";
import { IDLE_FORM_STATE } from "@/lib/types";
import { Field, FormMessage, inputClass } from "@/components/form-fields";
import { buttonClass } from "@/components/ui";

import { saveFinanceSale } from "../finance-actions";

type MoneyRow = { amount: string; date: string };

function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

function initialPaymentRows(sale?: FinanceSale): MoneyRow[] {
  if (sale?.payments.length) {
    return sale.payments.map((payment) => ({
      amount: String(payment.amount),
      date: payment.date || "",
    }));
  }

  return [{ amount: "", date: "" }];
}

function initialCostRows(sale?: FinanceSale): MoneyRow[] {
  if (sale?.costs.length) {
    return sale.costs.map((cost) => ({
      amount: String(cost.amount),
      date: cost.date || "",
    }));
  }

  return [{ amount: "", date: "" }];
}

export function SaleEditor({ sale }: { sale?: FinanceSale }) {
  const [state, formAction, pending] = useActionState(saveFinanceSale, IDLE_FORM_STATE);
  const [moneyUsed, setMoneyUsed] = useState<"yes" | "no">(
    sale?.has_cost ? "yes" : "no",
  );
  const [paymentRows, setPaymentRows] = useState<MoneyRow[]>(() => initialPaymentRows(sale));
  const [costRows, setCostRows] = useState<MoneyRow[]>(() => initialCostRows(sale));

  const paidPreview = paymentRows.reduce((sum, row) => {
    const amount = Number.parseFloat(row.amount);
    return sum + (Number.isFinite(amount) ? amount : 0);
  }, 0);

  const spentPreview = costRows.reduce((sum, row) => {
    const amount = Number.parseFloat(row.amount);
    return sum + (Number.isFinite(amount) ? amount : 0);
  }, 0);

  const currencyCode = sale?.currency === "USD" ? "USD" : "INR";
  const currencyLocale = sale?.currency === "USD" ? "en-US" : "en-IN";

  return (
    <form action={formAction} className="mx-auto max-w-2xl space-y-6">
      {sale ? <input type="hidden" name="id" value={sale.id} /> : null}
      <input type="hidden" name="payment_count" value={paymentRows.length} />
      <input type="hidden" name="cost_count" value={moneyUsed === "yes" ? costRows.length : 0} />
      <FormMessage state={state} />

      <Field label="Company name" htmlFor="client_name" error={state.errors?.client_name}>
        <input
          id="client_name"
          name="client_name"
          required
          defaultValue={sale?.client_name ?? ""}
          className={inputClass}
          placeholder="Client company name"
        />
      </Field>

      <div className="grid gap-6 sm:grid-cols-2">
        <Field label="What we sell" htmlFor="sale_type">
          <select
            id="sale_type"
            name="sale_type"
            defaultValue={sale?.sale_type ?? "service"}
            className={inputClass}
          >
            <option value="service">Service</option>
            <option value="equipment">Equipment</option>
          </select>
        </Field>

        <Field label="Currency" htmlFor="currency">
          <select
            id="currency"
            name="currency"
            defaultValue={sale?.currency ?? "INR"}
            className={inputClass}
          >
            <option value="INR">INR (₹)</option>
            <option value="USD">USD ($)</option>
          </select>
        </Field>
      </div>

      <Field label="Name of service or equipment" htmlFor="item_name" error={state.errors?.item_name}>
        <input
          id="item_name"
          name="item_name"
          required
          defaultValue={sale?.item_name ?? ""}
          className={inputClass}
          placeholder="Website design, SEO, laptop, printer…"
        />
      </Field>

      <Field label="Quoted amount" htmlFor="quoted_amount" error={state.errors?.quoted_amount}>
        <input
          id="quoted_amount"
          name="quoted_amount"
          type="number"
          min="0"
          step="0.01"
          required
          defaultValue={sale?.quoted_amount ?? ""}
          className={inputClass}
        />
      </Field>

      <fieldset className="space-y-4 rounded-2xl border border-line bg-ink-850/40 p-6">
        <legend className="px-2 text-sm font-medium text-cloud">Client payments</legend>

        {paymentRows.map((row, index) => (
          <div key={index} className="grid gap-4 sm:grid-cols-2">
            <Field
              label={index === 0 ? "1st payment amount" : "2nd payment amount"}
              htmlFor={`payment_amount_${index}`}
              error={state.errors?.[`payment_amount_${index}`]}
              optional={index === 0}
            >
              <input
                id={`payment_amount_${index}`}
                name={`payment_amount_${index}`}
                type="number"
                min="0"
                step="0.01"
                defaultValue={row.amount}
                className={inputClass}
                placeholder="0 if not paid yet"
              />
            </Field>

            <Field
              label={index === 0 ? "1st payment date" : "2nd payment date"}
              htmlFor={`payment_date_${index}`}
              error={state.errors?.[`payment_date_${index}`]}
              optional={index === 0}
            >
              <input
                id={`payment_date_${index}`}
                name={`payment_date_${index}`}
                type="date"
                defaultValue={row.date}
                className={inputClass}
              />
            </Field>
          </div>
        ))}

        {paymentRows.length < 2 ? (
          <button
            type="button"
            onClick={() =>
              setPaymentRows((rows) => [...rows, { amount: "", date: todayIso() }])
            }
            className="text-sm text-brand-400 hover:text-brand-500"
          >
            + Add 2nd payment
          </button>
        ) : null}

        <p className="text-sm text-mist">
          Paid so far:{" "}
          <span className="font-semibold text-brand-400">
            {paidPreview.toLocaleString(currencyLocale, {
              style: "currency",
              currency: currencyCode,
              maximumFractionDigits: 0,
            })}
          </span>
        </p>
      </fieldset>

      <Field label="Money spent on this service or equipment?" htmlFor="money_used">
        <select
          id="money_used"
          name="money_used"
          className={inputClass}
          value={moneyUsed}
          onChange={(event) => setMoneyUsed(event.target.value === "yes" ? "yes" : "no")}
        >
          <option value="no">No</option>
          <option value="yes">Yes</option>
        </select>
      </Field>

      {moneyUsed === "yes" ? (
        <fieldset className="space-y-4 rounded-2xl border border-line bg-ink-850/40 p-6">
          <legend className="px-2 text-sm font-medium text-cloud">Money spent</legend>

          {costRows.map((row, index) => (
            <div key={index} className="grid gap-4 sm:grid-cols-2">
              <Field
                label={index === 0 ? "1st spend amount" : "2nd spend amount"}
                htmlFor={`cost_amount_${index}`}
                error={state.errors?.[`cost_amount_${index}`]}
                optional
              >
                <input
                  id={`cost_amount_${index}`}
                  name={`cost_amount_${index}`}
                  type="number"
                  min="0"
                  step="0.01"
                  defaultValue={row.amount}
                  className={inputClass}
                  placeholder="Amount spent"
                />
              </Field>

              <Field
                label={index === 0 ? "1st spend date" : "2nd spend date"}
                htmlFor={`cost_date_${index}`}
                error={state.errors?.[`cost_date_${index}`]}
                optional
              >
                <input
                  id={`cost_date_${index}`}
                  name={`cost_date_${index}`}
                  type="date"
                  defaultValue={row.date}
                  className={inputClass}
                />
              </Field>
            </div>
          ))}

          {costRows.length < 2 ? (
            <button
              type="button"
              onClick={() =>
                setCostRows((rows) => [...rows, { amount: "", date: todayIso() }])
              }
              className="text-sm text-brand-400 hover:text-brand-500"
            >
              + Add 2nd spend installment
            </button>
          ) : null}

          <p className="text-sm text-mist">
            Total spent:{" "}
            <span className="font-semibold text-cloud">
              {spentPreview.toLocaleString(currencyLocale, {
                style: "currency",
                currency: currencyCode,
                maximumFractionDigits: 0,
              })}
            </span>
          </p>
        </fieldset>
      ) : null}

      {sale ? (
        <div className="grid gap-3 sm:grid-cols-2">
          <p className="rounded-xl border border-line bg-ink-850/60 px-4 py-3 text-sm text-mist">
            Profit:{" "}
            <span
              className={`font-semibold ${sale.profit >= 0 ? "text-brand-400" : "text-amber-300"}`}
            >
              {sale.profit.toLocaleString(sale.currency === "USD" ? "en-US" : "en-IN", {
                style: "currency",
                currency: sale.currency === "USD" ? "USD" : "INR",
                maximumFractionDigits: 0,
              })}
            </span>
          </p>
          <p className="rounded-xl border border-line bg-ink-850/60 px-4 py-3 text-sm text-mist">
            Pending:{" "}
            <span className="font-semibold text-amber-300">
              {sale.pending.toLocaleString(sale.currency === "USD" ? "en-US" : "en-IN", {
                style: "currency",
                currency: sale.currency === "USD" ? "USD" : "INR",
                maximumFractionDigits: 0,
              })}
            </span>
          </p>
        </div>
      ) : null}

      <Field label="Notes" htmlFor="notes" optional>
        <textarea
          id="notes"
          name="notes"
          rows={3}
          defaultValue={sale?.notes ?? ""}
          className={inputClass}
          placeholder="Invoice number, bank reference…"
        />
      </Field>

      <button type="submit" disabled={pending} className={buttonClass({ size: "lg" })}>
        {pending ? "Saving…" : sale ? "Save changes" : "Add to dashboard"}
      </button>
    </form>
  );
}
