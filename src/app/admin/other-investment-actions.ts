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
}

function adminClient() {
  const supabase = createAdminClient();
  if (!supabase) return null;
  return supabase;
}

function revalidate() {
  revalidatePath("/admin/directors");
  revalidatePath("/admin/trash");
}

function parseAmount(raw: string): number {
  const value = Number.parseFloat(String(raw).replace(/,/g, "").trim());
  return Number.isFinite(value) && value > 0 ? value : -1;
}

export async function saveOtherInvestment(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  await requireAdmin();
  const supabase = adminClient();
  if (!supabase) {
    return { status: "error", message: "Supabase secret key is missing." };
  }

  const lender_name = String(formData.get("lender_name") ?? "").trim();
  const amount = parseAmount(String(formData.get("amount") ?? ""));
  const given_date = String(formData.get("given_date") ?? "").trim();
  const repaid_date = String(formData.get("repaid_date") ?? "").trim() || null;
  const notes = String(formData.get("notes") ?? "").trim();

  const errors: Record<string, string> = {};
  if (!lender_name) errors.lender_name = "Enter who gave the money.";
  if (amount <= 0) errors.amount = "Enter a valid amount.";
  if (!given_date) errors.given_date = "Pick the date they gave it.";
  if (repaid_date && repaid_date < given_date) {
    errors.repaid_date = "Payback date cannot be before the given date.";
  }

  if (Object.keys(errors).length > 0) {
    return { status: "error", message: "Fix the highlighted fields.", errors };
  }

  const { error } = await supabase.from("finance_other_investments").insert({
    lender_name,
    amount,
    given_date,
    repaid_date,
    notes,
  });

  if (error) {
    return {
      status: "error",
      message:
        "Could not save. Run supabase/other-investments.sql in the Supabase SQL Editor first.",
    };
  }

  revalidate();
  return { status: "success", message: "Other investment added." };
}

export async function markOtherInvestmentRepaid(formData: FormData): Promise<void> {
  await requireAdmin();
  const supabase = adminClient();
  if (!supabase) return;

  const id = String(formData.get("id") ?? "").trim();
  const repaid_date = String(formData.get("repaid_date") ?? "").trim();
  if (!id || !repaid_date) return;

  await supabase
    .from("finance_other_investments")
    .update({ repaid_date })
    .eq("id", id)
    .is("deleted_at", null);

  revalidate();
}
