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

function parseAmount(raw: string): number {
  const n = Number(String(raw).replace(/,/g, "").trim());
  return Number.isFinite(n) ? n : Number.NaN;
}

export async function saveCashOnHand(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  await requireAdmin();

  const supabase = createAdminClient();
  if (!supabase) return { status: "error", message: "Database not configured." };

  const amount = parseAmount(String(formData.get("amount") ?? ""));
  const notes = String(formData.get("notes") ?? "").trim();

  if (!Number.isFinite(amount) || amount < 0) {
    return {
      status: "error",
      message: "Enter a valid amount.",
      errors: { amount: "Enter 0 or more." },
    };
  }

  const { error } = await supabase.from("finance_cash_on_hand").upsert(
    { id: 1, amount, notes },
    { onConflict: "id" },
  );

  if (error) {
    console.error("[cash-on-hand save]", error.message);
    return {
      status: "error",
      message:
        "Could not save. Run supabase/cash-on-hand.sql in the Supabase SQL Editor first.",
    };
  }

  revalidatePath("/admin/finance");
  return { status: "success", message: "Money in hand updated." };
}
