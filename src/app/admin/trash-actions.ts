"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import type { TrashKind } from "@/lib/types";

const TABLE: Record<TrashKind, string> = {
  post: "posts",
  client: "clients",
  testimonial: "testimonials",
  consultation: "consultation_requests",
  contact: "contact_submissions",
  subscriber: "newsletter_subscribers",
};

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
  if (!supabase) throw new Error("Supabase secret key is missing.");
  return supabase;
}

function revalidateAll() {
  revalidatePath("/");
  revalidatePath("/blogs");
  revalidatePath("/sitemap.xml");
  revalidatePath("/clients");
  revalidatePath("/about");
  revalidatePath("/services");
  revalidatePath("/admin");
  revalidatePath("/admin/clients");
  revalidatePath("/admin/testimonials");
  revalidatePath("/admin/submissions");
  revalidatePath("/admin/trash");
}

function readKind(formData: FormData): TrashKind | null {
  const kind = String(formData.get("kind") ?? "") as TrashKind;
  return kind in TABLE ? kind : null;
}

function readId(formData: FormData): string {
  return String(formData.get("id") ?? "");
}

/** Move a row to trash instead of deleting it permanently. */
export async function moveToTrash(formData: FormData): Promise<void> {
  await requireAdmin();

  const kind = readKind(formData);
  const id = readId(formData);
  if (!kind || !id) return;

  const supabase = adminClient();
  await supabase
    .from(TABLE[kind])
    .update({ deleted_at: new Date().toISOString() })
    .eq("id", id)
    .is("deleted_at", null);

  revalidateAll();
}

/** Restore a trashed row. */
export async function restoreFromTrash(formData: FormData): Promise<void> {
  await requireAdmin();

  const kind = readKind(formData);
  const id = readId(formData);
  if (!kind || !id) return;

  const supabase = adminClient();
  await supabase
    .from(TABLE[kind])
    .update({ deleted_at: null })
    .eq("id", id)
    .not("deleted_at", "is", null);

  revalidateAll();
}

/** Permanently delete a trashed row. Cannot be undone. */
export async function permanentlyDelete(formData: FormData): Promise<void> {
  await requireAdmin();

  const kind = readKind(formData);
  const id = readId(formData);
  if (!kind || !id) return;

  const supabase = adminClient();
  await supabase
    .from(TABLE[kind])
    .delete()
    .eq("id", id)
    .not("deleted_at", "is", null);

  revalidateAll();
}

/** Empty the entire trash, permanently deletes every trashed row. */
export async function emptyTrash(): Promise<void> {
  await requireAdmin();

  const supabase = adminClient();
  const kinds = Object.keys(TABLE) as TrashKind[];

  await Promise.all(
    kinds.map((kind) =>
      supabase.from(TABLE[kind]).delete().not("deleted_at", "is", null),
    ),
  );

  revalidateAll();
}
