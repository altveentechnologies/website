import "server-only";

import { createAdminClient } from "@/lib/supabase/admin";
import type { DirectorEntry, DirectorName, DirectorSaleOption } from "@/lib/types";

const ENTRY_COLUMNS =
  "id, director, entry_type, amount, transaction_date, project_id, notes, created_at, updated_at";

function toNumber(value: unknown): number {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
}

function saleLabel(
  projectId: string | null,
  salesById: Map<string, { client_name: string; item_name: string }>,
): string {
  if (!projectId) return "—";
  const sale = salesById.get(projectId);
  if (!sale) return "—";
  return `${sale.client_name} — ${sale.item_name}`;
}

function mapEntry(
  row: Record<string, unknown>,
  salesById: Map<string, { client_name: string; item_name: string }>,
): DirectorEntry {
  const project_id = row.project_id ? String(row.project_id) : null;

  return {
    id: String(row.id),
    director: row.director === "khalid" ? "khalid" : "arfat",
    entry_type: row.entry_type === "invested" ? "invested" : "took",
    amount: toNumber(row.amount),
    transaction_date: String(row.transaction_date),
    project_id,
    service_label: saleLabel(project_id, salesById),
    notes: String(row.notes ?? ""),
    created_at: String(row.created_at),
    updated_at: String(row.updated_at),
  };
}

async function loadSalesById() {
  const supabase = createAdminClient();
  const map = new Map<string, { client_name: string; item_name: string }>();
  if (!supabase) return map;

  const { data } = await supabase
    .from("finance_projects")
    .select("id, client_name, item_name")
    .is("deleted_at", null);

  for (const row of data ?? []) {
    map.set(String(row.id), {
      client_name: String(row.client_name),
      item_name: String(row.item_name),
    });
  }

  return map;
}

export async function getDirectorEntries(): Promise<DirectorEntry[]> {
  const supabase = createAdminClient();
  if (!supabase) return [];

  const salesById = await loadSalesById();

  const { data, error } = await supabase
    .from("finance_director_entries")
    .select(ENTRY_COLUMNS)
    .is("deleted_at", null)
    .order("transaction_date", { ascending: false });

  if (error) {
    console.error("[directors] getDirectorEntries:", error.message);
    return [];
  }

  return (data ?? []).map((row) => mapEntry(row, salesById));
}

export async function getDirectorSaleOptions(): Promise<DirectorSaleOption[]> {
  const supabase = createAdminClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("finance_projects")
    .select("id, client_name, item_name")
    .is("deleted_at", null)
    .order("updated_at", { ascending: false });

  if (error) {
    console.error("[directors] getDirectorSaleOptions:", error.message);
    return [];
  }

  return (data ?? []).map((row) => ({
    id: String(row.id),
    label: `${row.client_name} — ${row.item_name}`,
  }));
}

export function totalsAcrossDirectors(entries: DirectorEntry[]) {
  return entries.reduce(
    (acc, entry) => {
      const key = entry.director;
      if (entry.entry_type === "took") {
        acc[`${key}_took`] += entry.amount;
      } else {
        acc[`${key}_invested`] += entry.amount;
      }
      return acc;
    },
    {
      arfat_took: 0,
      arfat_invested: 0,
      khalid_took: 0,
      khalid_invested: 0,
    },
  );
}

export function entriesForDirector(entries: DirectorEntry[], director: DirectorName) {
  return entries.filter((entry) => entry.director === director);
}
