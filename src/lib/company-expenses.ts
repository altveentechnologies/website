import "server-only";

import { createAdminClient } from "@/lib/supabase/admin";
import type { CompanyExpense } from "@/lib/types";

const COLUMNS =
  "id, description, amount, expense_date, notes, created_at, updated_at";

function mapRow(row: Record<string, unknown>): CompanyExpense {
  return {
    id: String(row.id),
    description: String(row.description ?? ""),
    amount: Number(row.amount) || 0,
    expense_date: String(row.expense_date ?? ""),
    notes: String(row.notes ?? ""),
    created_at: String(row.created_at ?? ""),
    updated_at: String(row.updated_at ?? ""),
  };
}

export async function getCompanyExpenses(): Promise<CompanyExpense[]> {
  const supabase = createAdminClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("finance_company_expenses")
    .select(COLUMNS)
    .is("deleted_at", null)
    .order("expense_date", { ascending: false });

  if (error) {
    console.error("[company-expenses]", error.message);
    return [];
  }

  return (data ?? []).map((row) => mapRow(row as Record<string, unknown>));
}

export function totalCompanyExpenses(expenses: CompanyExpense[]): number {
  return expenses.reduce((sum, e) => sum + e.amount, 0);
}
