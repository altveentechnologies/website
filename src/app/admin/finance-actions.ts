"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import type { FinancePayment, FinanceSaleType, FormState } from "@/lib/types";

async function requireAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/admin/login");
  return user;
}

function adminClient() {
  const supabase = createAdminClient();
  if (!supabase) return null;
  return supabase;
}

function revalidateFinance() {
  revalidatePath("/admin/finance");
  revalidatePath("/admin/trash");
}

function parseAmount(raw: string): number {
  const value = Number.parseFloat(raw);
  return Number.isFinite(value) && value >= 0 ? value : -1;
}

function readPayments(formData: FormData): {
  payments: FinancePayment[];
  errors: Record<string, string>;
} {
  const count = Number.parseInt(String(formData.get("payment_count") ?? "1"), 10);
  const payments: FinancePayment[] = [];
  const errors: Record<string, string> = {};

  for (let i = 0; i < count; i++) {
    const amountRaw = String(formData.get(`payment_amount_${i}`) ?? "").trim();
    const date = String(formData.get(`payment_date_${i}`) ?? "").trim();

    if (!amountRaw) continue;

    const amount = parseAmount(amountRaw);
    if (amount <= 0) continue;

    if (!date) {
      errors[`payment_date_${i}`] = "Pick a payment date.";
      continue;
    }

    payments.push({ amount, date });
  }

  return { payments, errors };
}

function readCosts(formData: FormData): {
  costs: FinancePayment[];
  errors: Record<string, string>;
} {
  const count = Number.parseInt(String(formData.get("cost_count") ?? "0"), 10);
  const costs: FinancePayment[] = [];
  const errors: Record<string, string> = {};

  for (let i = 0; i < count; i++) {
    const amountRaw = String(formData.get(`cost_amount_${i}`) ?? "").trim();
    const date = String(formData.get(`cost_date_${i}`) ?? "").trim();

    if (!amountRaw) continue;

    const amount = parseAmount(amountRaw);
    if (amount <= 0) continue;

    if (!date) {
      errors[`cost_date_${i}`] = "Pick a spend date.";
      continue;
    }

    costs.push({ amount, date });
  }

  return { costs, errors };
}

export async function saveFinanceSale(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  await requireAdmin();
  const supabase = adminClient();
  if (!supabase) {
    return { status: "error", message: "Supabase secret key is missing." };
  }

  const id = String(formData.get("id") ?? "").trim();
  const client_name = String(formData.get("client_name") ?? "").trim();
  const sale_type = (formData.get("sale_type") === "equipment"
    ? "equipment"
    : "service") satisfies FinanceSaleType;
  const item_name = String(formData.get("item_name") ?? "").trim();
  const currency = formData.get("currency") === "USD" ? "USD" : "INR";
  const quoted_amount = parseAmount(String(formData.get("quoted_amount") ?? ""));
  const money_used = formData.get("money_used") === "yes";
  const notes = String(formData.get("notes") ?? "").trim();
  const { payments, errors: paymentErrors } = readPayments(formData);
  const { costs, errors: costErrors } = money_used
    ? readCosts(formData)
    : { costs: [] as FinancePayment[], errors: {} as Record<string, string> };

  const errors: Record<string, string> = { ...paymentErrors, ...costErrors };
  if (!client_name) errors.client_name = "Company name is required.";
  if (!item_name) errors.item_name = "Service or equipment name is required.";
  if (quoted_amount < 0) errors.quoted_amount = "Enter a valid quoted amount.";

  if (Object.keys(errors).length > 0) {
    return { status: "error", message: "Fix the highlighted fields.", errors };
  }

  const paid_amount = payments.reduce((sum, payment) => sum + payment.amount, 0);
  const cost_amount = costs.reduce((sum, entry) => sum + entry.amount, 0);

  const payload = {
    client_name,
    sale_type,
    item_name,
    title: item_name,
    services: [] as string[],
    currency,
    quoted_amount,
    paid_amount,
    payments,
    costs,
    cost_amount,
    budget_amount: 0,
    status: "active",
    notes,
    client_id: null,
  };

  if (id) {
    const { error } = await supabase
      .from("finance_projects")
      .update(payload)
      .eq("id", id);

    if (error) return { status: "error", message: error.message };

    revalidateFinance();
    revalidatePath(`/admin/finance/${id}`);
    return { status: "success", message: "Saved." };
  }

  const { error } = await supabase.from("finance_projects").insert(payload);

  if (error) {
    return { status: "error", message: error.message };
  }

  revalidateFinance();
  redirect("/admin/finance");
}

export async function deleteFinanceSale(formData: FormData): Promise<void> {
  await requireAdmin();
  const supabase = adminClient();
  if (!supabase) return;

  const id = String(formData.get("id") ?? "");
  if (!id) return;

  await supabase
    .from("finance_projects")
    .update({ deleted_at: new Date().toISOString() })
    .eq("id", id);

  revalidateFinance();
  redirect("/admin/finance");
}
