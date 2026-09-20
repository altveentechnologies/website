import "server-only";

import { createAdminClient } from "@/lib/supabase/admin";
import type { OtherInvestment } from "@/lib/types";

const COLUMNS =
  "id, lender_name, amount, given_date, repaid_date, notes, created_at, updated_at";

function mapRow(row: Record<string, unknown>): OtherInvestment {
  return {
    id: String(row.id),
    lender_name: String(row.lender_name ?? ""),
    amount: Number(row.amount) || 0,
    given_date: String(row.given_date ?? ""),
    repaid_date: row.repaid_date ? String(row.repaid_date) : null,
    notes: String(row.notes ?? ""),
    created_at: String(row.created_at ?? ""),
    updated_at: String(row.updated_at ?? ""),
  };
}

export async function getOtherInvestments(): Promise<OtherInvestment[]> {
  const supabase = createAdminClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("finance_other_investments")
    .select(COLUMNS)
    .is("deleted_at", null)
    .order("given_date", { ascending: false });

  if (error) {
    console.error("[other-investments]", error.message);
    return [];
  }

  return (data ?? []).map((row) => mapRow(row as Record<string, unknown>));
}

export function totalsAcrossOtherInvestments(rows: OtherInvestment[]) {
  return rows.reduce(
    (acc, row) => {
      acc.invested += row.amount;
      if (row.repaid_date) acc.paid_back += row.amount;
      else acc.outstanding += row.amount;
      return acc;
    },
    { invested: 0, paid_back: 0, outstanding: 0 },
  );
}
