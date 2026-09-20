"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import type { FormState } from "@/lib/types";

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

function revalidateCompanyExpenses() {
  revalidatePath("/admin/finance");
  revalidatePath("/admin/trash");
}

function parseAmount(raw: string): number {
  const n = Number(String(raw).replace(/,/g, "").trim());
  return Number.isFinite(n) ? n : 0;
}

export async function saveCompanyExpense(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  await requireAdmin();
  const supabase = adminClient();
  if (!supabase) return { status: "error", message: "Database not configured." };

  const description = String(formData.get("description") ?? "").trim();
  const amount = parseAmount(String(formData.get("amount") ?? ""));
  const expense_date = String(formData.get("expense_date") ?? "").trim();
  const notes = String(formData.get("notes") ?? "").trim();

  const errors: Record<string, string> = {};
  if (!description) errors.description = "Description is required.";
  if (amount <= 0) errors.amount = "Enter a valid amount.";
  if (!expense_date) errors.expense_date = "Date is required.";

  if (Object.keys(errors).length) {
    return { status: "error", message: "Fix the errors below.", errors };
  }

  const { error } = await supabase.from("finance_company_expenses").insert({
    description,
    amount,
    expense_date,
    notes,
  });

  if (error) {
    console.error("[company-expense save]", error.message);
    return { status: "error", message: "Could not save expense." };
  }

  revalidateCompanyExpenses();
  return { status: "success", message: "Company expense added." };
}
