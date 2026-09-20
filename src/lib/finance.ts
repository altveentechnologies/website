import "server-only";

import { createAdminClient } from "@/lib/supabase/admin";
import type { FinanceCurrency, FinancePayment, FinanceSale } from "@/lib/types";

const SALE_COLUMNS =
  "id, client_name, sale_type, item_name, currency, quoted_amount, paid_amount, payments, costs, cost_amount, notes, created_at, updated_at";

function toNumber(value: unknown): number {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
}

function mapMoneyEntries(
  value: unknown,
  amountFallback: number,
  requireDate: boolean,
): FinancePayment[] {
  if (Array.isArray(value)) {
    const parsed = value
      .map((entry) => {
        if (!entry || typeof entry !== "object") return null;
        const row = entry as Record<string, unknown>;
        const amount = toNumber(row.amount);
        const date = String(row.date ?? "").trim();
        if (amount <= 0) return null;
        if (requireDate && !date) return null;
        return { amount, date };
      })
      .filter((p): p is FinancePayment => p !== null);

    if (parsed.length) return parsed;
  }

  if (amountFallback > 0) {
    return [{ amount: amountFallback, date: "" }];
  }

  return [];
}

function mapSale(row: Record<string, unknown>): FinanceSale {
  const quoted = toNumber(row.quoted_amount);
  const storedPaid = toNumber(row.paid_amount);
  const storedCost = toNumber(row.cost_amount);
  const payments = mapMoneyEntries(row.payments, storedPaid, true);
  const costs = mapMoneyEntries(row.costs, storedCost, false);
  const paid = payments.length
    ? payments.reduce((sum, payment) => sum + payment.amount, 0)
    : storedPaid;
  const cost = costs.length
    ? costs.reduce((sum, entry) => sum + entry.amount, 0)
    : storedCost;

  return {
    id: String(row.id),
    client_name: String(row.client_name ?? ""),
    sale_type: row.sale_type === "equipment" ? "equipment" : "service",
    item_name: String(row.item_name ?? ""),
    currency: row.currency === "USD" ? "USD" : "INR",
    quoted_amount: quoted,
    paid_amount: paid,
    payments,
    costs,
    cost_amount: cost,
    has_cost: cost > 0,
    profit: paid - cost,
    pending: Math.max(quoted - paid, 0),
    notes: String(row.notes ?? ""),
    created_at: String(row.created_at),
    updated_at: String(row.updated_at),
  };
}

export function formatMoney(amount: number, currency: FinanceCurrency) {
  const code = currency === "USD" ? "USD" : "INR";
  return new Intl.NumberFormat(currency === "USD" ? "en-US" : "en-IN", {
    style: "currency",
    currency: code,
    maximumFractionDigits: 0,
  }).format(amount);
}

export async function getFinanceSales(): Promise<FinanceSale[]> {
  const supabase = createAdminClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("finance_projects")
    .select(SALE_COLUMNS)
    .is("deleted_at", null)
    .order("updated_at", { ascending: false });

  if (error) {
    console.error("[finance] getFinanceSales:", error.message);
    return [];
  }

  return (data ?? []).map(mapSale);
}

export async function getFinanceSaleById(id: string): Promise<FinanceSale | null> {
  const supabase = createAdminClient();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("finance_projects")
    .select(SALE_COLUMNS)
    .eq("id", id)
    .is("deleted_at", null)
    .maybeSingle();

  if (error || !data) {
    if (error) console.error("[finance] getFinanceSaleById:", error.message);
    return null;
  }

  return mapSale(data);
}

export function totalsAcrossSales(sales: FinanceSale[]) {
  return sales.reduce(
    (acc, sale) => ({
      quoted: acc.quoted + sale.quoted_amount,
      paid: acc.paid + sale.paid_amount,
      cost: acc.cost + sale.cost_amount,
      profit: acc.profit + sale.profit,
      pending: acc.pending + sale.pending,
    }),
    { quoted: 0, paid: 0, cost: 0, profit: 0, pending: 0 },
  );
}
