"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import type { FormState } from "@/lib/types";
import { moveToTrash } from "./trash-actions";

async function requireAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/admin/login");
  return user;
}

function revalidateTestimonialRoutes() {
  revalidatePath("/");
  revalidatePath("/services");
  revalidatePath("/clients");
  revalidatePath("/about");
  revalidatePath("/admin/testimonials");
}

function readTestimonialForm(formData: FormData) {
  const value = (key: string) => String(formData.get(key) ?? "").trim();
  const ratingRaw = Number.parseFloat(value("rating") || "5");
  const rating = Number.isFinite(ratingRaw)
    ? Math.min(5, Math.max(0, Math.round(ratingRaw * 10) / 10))
    : 5;

  return {
    client_name: value("client_name"),
    quote: value("quote"),
    detail: value("detail"),
    rating,
    published: formData.get("published") === "on",
    show_on_homepage: formData.get("show_on_homepage") === "on",
    show_on_services: formData.get("show_on_services") === "on",
    sort_order: Number.parseInt(value("sort_order") || "0", 10) || 0,
  };
}

function validate(fields: ReturnType<typeof readTestimonialForm>) {
  const errors: Record<string, string> = {};
  if (!fields.client_name) errors.client_name = "Client name is required.";
  if (!fields.quote) errors.quote = "Review text is required.";
  return errors;
}

// ---------------------------------------------------------------------------
export async function createTestimonialRecord(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  await requireAdmin();

  const fields = readTestimonialForm(formData);
  const errors = validate(fields);

  if (Object.keys(errors).length > 0) {
    return { status: "error", message: "Please fix the highlighted fields.", errors };
  }

  const supabase = createAdminClient();
  if (!supabase) {
    return { status: "error", message: "Supabase secret key is missing." };
  }

  const { error } = await supabase.from("testimonials").insert(fields);

  if (error) return { status: "error", message: error.message };

  revalidateTestimonialRoutes();
  redirect("/admin/testimonials");
}

// ---------------------------------------------------------------------------
export async function updateTestimonialRecord(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  await requireAdmin();

  const id = String(formData.get("id") ?? "");
  if (!id) return { status: "error", message: "Missing review id." };

  const fields = readTestimonialForm(formData);
  const errors = validate(fields);

  if (Object.keys(errors).length > 0) {
    return { status: "error", message: "Please fix the highlighted fields.", errors };
  }

  const supabase = createAdminClient();
  if (!supabase) {
    return { status: "error", message: "Supabase secret key is missing." };
  }

  const { error } = await supabase.from("testimonials").update(fields).eq("id", id);

  if (error) return { status: "error", message: error.message };

  revalidateTestimonialRoutes();
  revalidatePath(`/admin/testimonials/${id}`);

  return { status: "success", message: "Review saved." };
}

// ---------------------------------------------------------------------------
export async function deleteTestimonialRecord(formData: FormData): Promise<void> {
  formData.set("kind", "testimonial");
  await moveToTrash(formData);
}

// ---------------------------------------------------------------------------
export async function toggleTestimonialPublished(formData: FormData): Promise<void> {
  await requireAdmin();

  const id = String(formData.get("id") ?? "");
  const next = formData.get("published") === "true";
  if (!id) return;

  const supabase = createAdminClient();
  if (!supabase) return;

  await supabase.from("testimonials").update({ published: next }).eq("id", id);
  revalidateTestimonialRoutes();
}

export async function toggleTestimonialHomepage(formData: FormData): Promise<void> {
  await requireAdmin();

  const id = String(formData.get("id") ?? "");
  const next = formData.get("show_on_homepage") === "true";
  if (!id) return;

  const supabase = createAdminClient();
  if (!supabase) return;

  await supabase.from("testimonials").update({ show_on_homepage: next }).eq("id", id);
  revalidateTestimonialRoutes();
}

export async function toggleTestimonialServices(formData: FormData): Promise<void> {
  await requireAdmin();

  const id = String(formData.get("id") ?? "");
  const next = formData.get("show_on_services") === "true";
  if (!id) return;

  const supabase = createAdminClient();
  if (!supabase) return;

  await supabase.from("testimonials").update({ show_on_services: next }).eq("id", id);
  revalidateTestimonialRoutes();
}
