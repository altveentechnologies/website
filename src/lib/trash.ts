import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import type { TrashItem, TrashKind } from "@/lib/types";

function label(kind: TrashKind, row: Record<string, unknown>): string {
  switch (kind) {
    case "post":
      return String(row.title ?? "Untitled post");
    case "client":
      return String(row.name ?? "Unnamed client");
    case "testimonial":
      return String(row.client_name ?? "Unnamed review");
    case "consultation":
      return String(row.name ?? "Consultation request");
    case "contact":
      return String(row.name ?? "Contact message");
    case "subscriber":
      return String(row.email ?? "Subscriber");
    case "finance_sale":
      return String(row.client_name ?? "Client sale");
    case "director_entry": {
      const director = String(row.director ?? "");
      const type = String(row.entry_type ?? "");
      const name = director === "arfat" ? "Arfat" : director === "khalid" ? "Khalid" : director;
      const typeLabel = type === "invested" ? "invested" : "took";
      return `${name} — ${typeLabel}`;
    }
    case "company_expense":
      return String(row.description ?? "Company expense");
  }
}

function detail(kind: TrashKind, row: Record<string, unknown>): string {
  switch (kind) {
    case "post":
      return String(row.slug ?? "");
    case "client":
      return String(row.sector ?? row.description ?? "");
    case "testimonial":
      return `${row.rating ?? "?"}★ · ${String(row.detail ?? "").slice(0, 80)}`;
    case "consultation":
      return String(row.email ?? "");
    case "contact":
      return String(row.email ?? "");
    case "subscriber":
      return row.source_page ? String(row.source_page) : "Newsletter signup";
    case "finance_sale":
      return String(row.item_name ?? row.sale_type ?? "");
    case "director_entry":
      return `₹${Number(row.amount ?? 0).toLocaleString("en-IN")} · ${String(row.transaction_date ?? "")}`;
    case "company_expense":
      return `₹${Number(row.amount ?? 0).toLocaleString("en-IN")} · ${String(row.expense_date ?? "")}`;
  }
}

const SOURCES: { kind: TrashKind; table: string; order: string }[] = [
  { kind: "post", table: "posts", order: "deleted_at" },
  { kind: "client", table: "clients", order: "deleted_at" },
  { kind: "testimonial", table: "testimonials", order: "deleted_at" },
  { kind: "consultation", table: "consultation_requests", order: "deleted_at" },
  { kind: "contact", table: "contact_submissions", order: "deleted_at" },
  { kind: "subscriber", table: "newsletter_subscribers", order: "deleted_at" },
  { kind: "finance_sale", table: "finance_projects", order: "deleted_at" },
  { kind: "director_entry", table: "finance_director_entries", order: "deleted_at" },
  { kind: "company_expense", table: "finance_company_expenses", order: "deleted_at" },
];

export async function getTrashItems(): Promise<TrashItem[]> {
  if (!isSupabaseConfigured()) return [];

  const supabase = await createClient();
  const items: TrashItem[] = [];

  for (const { kind, table, order } of SOURCES) {
    const { data, error } = await supabase
      .from(table)
      .select("*")
      .not("deleted_at", "is", null)
      .order(order, { ascending: false });

    if (error) {
      console.error(`[trash] ${table}:`, error.message);
      continue;
    }

    for (const row of data ?? []) {
      items.push({
        id: String(row.id),
        kind,
        label: label(kind, row as Record<string, unknown>),
        detail: detail(kind, row as Record<string, unknown>),
        deleted_at: String(row.deleted_at),
      });
    }
  }

  items.sort(
    (a, b) =>
      new Date(b.deleted_at).getTime() - new Date(a.deleted_at).getTime(),
  );

  return items;
}

export async function getTrashCount(): Promise<number> {
  const items = await getTrashItems();
  return items.length;
}

export const TRASH_KIND_LABEL: Record<TrashKind, string> = {
  post: "Blog post",
  client: "Client",
  testimonial: "Review",
  consultation: "Consultation",
  contact: "Contact message",
  subscriber: "Newsletter signup",
  finance_sale: "Client sale",
  director_entry: "Director record",
  company_expense: "Company expense",
};
