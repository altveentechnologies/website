import "server-only";

import { createAdminClient } from "@/lib/supabase/admin";
import type { CashOnHand } from "@/lib/types";

const EMPTY: CashOnHand = { amount: 0, notes: "", updated_at: null };

export async function getCashOnHand(): Promise<CashOnHand> {
  const supabase = createAdminClient();
  if (!supabase) return EMPTY;

  const { data, error } = await supabase
    .from("finance_cash_on_hand")
    .select("amount, notes, updated_at")
    .eq("id", 1)
    .maybeSingle();

  if (error) {
    console.error("[cash-on-hand]", error.message);
    return EMPTY;
  }

  if (!data) return EMPTY;

  return {
    amount: Number(data.amount) || 0,
    notes: String(data.notes ?? ""),
    updated_at: data.updated_at ? String(data.updated_at) : null,
  };
}
