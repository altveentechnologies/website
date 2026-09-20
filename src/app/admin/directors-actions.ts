"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import type { DirectorEntryType, DirectorName, FormState } from "@/lib/types";

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

function revalidateDirectors() {
  revalidatePath("/admin/directors");
  revalidatePath("/admin/trash");
}

function parseAmount(raw: string): number {
  const value = Number.parseFloat(raw);
  return Number.isFinite(value) && value > 0 ? value : -1;
}

export async function saveDirectorEntry(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  await requireAdmin();
  const supabase = adminClient();
  if (!supabase) {
    return { status: "error", message: "Supabase secret key is missing." };
  }

  const directorRaw = String(formData.get("director") ?? "").trim();
  const director: DirectorName | "" =
    directorRaw === "arfat" || directorRaw === "khalid" ? directorRaw : "";
  const entry_type = (formData.get("entry_type") === "invested"
    ? "invested"
    : "took") satisfies DirectorEntryType;
  const amount = parseAmount(String(formData.get("amount") ?? ""));
  const transaction_date = String(formData.get("transaction_date") ?? "").trim();
  const project_id = String(formData.get("project_id") ?? "").trim() || null;
  const notes = String(formData.get("notes") ?? "").trim();

  const errors: Record<string, string> = {};
  if (!director) errors.director = "Pick Arafat or Khalid.";
  if (amount <= 0) errors.amount = "Enter a valid amount.";
  if (!transaction_date) errors.transaction_date = "Pick a date.";
  if (entry_type === "invested" && !project_id) {
    errors.project_id = "Pick which service or sale this was for.";
  }

  if (Object.keys(errors).length > 0) {
    return { status: "error", message: "Fix the highlighted fields.", errors };
  }

  const { error } = await supabase.from("finance_director_entries").insert({
    director,
    entry_type,
    amount,
    transaction_date,
    project_id,
    notes,
  });

  if (error) return { status: "error", message: error.message };

  revalidateDirectors();
  return { status: "success", message: "Entry added." };
}

export async function deleteDirectorEntry(formData: FormData): Promise<void> {
  await requireAdmin();
  const supabase = adminClient();
  if (!supabase) return;

  const id = String(formData.get("id") ?? "");
  if (!id) return;

  await supabase
    .from("finance_director_entries")
    .update({ deleted_at: new Date().toISOString() })
    .eq("id", id);

  revalidateDirectors();
}
