"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { slugify } from "@/lib/utils";
import type { FormState } from "@/lib/types";
import { moveToTrash } from "./trash-actions";

const BUCKET = "client-images";
const MAX_IMAGE_BYTES = 5 * 1024 * 1024; // 5 MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/avif"];

async function requireAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/admin/login");
  return user;
}

function revalidateClientRoutes() {
  revalidatePath("/");
  revalidatePath("/clients");
  revalidatePath("/admin/clients");
  revalidatePath("/admin/marquee");
}

/**
 * Uploads a client photo to Supabase Storage and returns its public URL.
 * Returns null when no file was chosen, so callers keep the existing image.
 */
async function uploadImage(
  file: File | null,
  name: string,
): Promise<{ url: string | null; error?: string }> {
  if (!file || file.size === 0) return { url: null };

  if (!ALLOWED_TYPES.includes(file.type)) {
    return { url: null, error: "Image must be a JPG, PNG, WebP or AVIF file." };
  }
  if (file.size > MAX_IMAGE_BYTES) {
    return { url: null, error: "Image must be smaller than 5 MB." };
  }

  const supabase = createAdminClient();
  if (!supabase) return { url: null, error: "Supabase secret key is missing." };

  const extension = file.name.split(".").pop()?.toLowerCase() || "jpg";
  // Timestamped so re-uploads never collide or serve a stale CDN copy.
  const path = `${slugify(name) || "client"}-${Date.now()}.${extension}`;

  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(path, file, { contentType: file.type, upsert: false });

  if (error) {
    return { url: null, error: `Image upload failed: ${error.message}` };
  }

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return { url: data.publicUrl };
}

function readClientForm(formData: FormData) {
  const value = (key: string) => String(formData.get(key) ?? "").trim();
  const region = value("region") === "local" ? "local" : "international";

  return {
    name: value("name"),
    sector: value("sector"),
    description: value("description"),
    url: value("url") || null,
    region,
    in_marquee: formData.get("in_marquee") === "on",
    sort_order: Number.parseInt(value("sort_order") || "0", 10) || 0,
  };
}

// ---------------------------------------------------------------------------
export async function createClientRecord(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  await requireAdmin();

  const fields = readClientForm(formData);
  const errors: Record<string, string> = {};
  if (!fields.name) errors.name = "Name is required.";
  if (!fields.description) errors.description = "Description is required.";

  if (Object.keys(errors).length > 0) {
    return { status: "error", message: "Please fix the highlighted fields.", errors };
  }

  const file = formData.get("image") as File | null;
  const upload = await uploadImage(file, fields.name);
  if (upload.error) return { status: "error", message: upload.error };

  const imageUrl = upload.url ?? String(formData.get("image_url") ?? "").trim();

  const supabase = createAdminClient();
  if (!supabase) {
    return { status: "error", message: "Supabase secret key is missing." };
  }

  const { error } = await supabase
    .from("clients")
    .insert({ ...fields, image_url: imageUrl || null });

  if (error) return { status: "error", message: error.message };

  revalidateClientRoutes();
  redirect("/admin/clients");
}

// ---------------------------------------------------------------------------
export async function updateClientRecord(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  await requireAdmin();

  const id = String(formData.get("id") ?? "");
  if (!id) return { status: "error", message: "Missing client id." };

  const fields = readClientForm(formData);
  const errors: Record<string, string> = {};
  if (!fields.name) errors.name = "Name is required.";
  if (!fields.description) errors.description = "Description is required.";

  if (Object.keys(errors).length > 0) {
    return { status: "error", message: "Please fix the highlighted fields.", errors };
  }

  const file = formData.get("image") as File | null;
  const upload = await uploadImage(file, fields.name);
  if (upload.error) return { status: "error", message: upload.error };

  // Keep the current image unless a new file was uploaded or the URL edited.
  const imageUrl =
    upload.url ?? (String(formData.get("image_url") ?? "").trim() || null);

  const supabase = createAdminClient();
  if (!supabase) {
    return { status: "error", message: "Supabase secret key is missing." };
  }

  const { error } = await supabase
    .from("clients")
    .update({ ...fields, image_url: imageUrl })
    .eq("id", id);

  if (error) return { status: "error", message: error.message };

  revalidateClientRoutes();
  revalidatePath(`/admin/clients/${id}`);

  return { status: "success", message: "Client saved." };
}

// ---------------------------------------------------------------------------
export async function deleteClientRecord(formData: FormData): Promise<void> {
  formData.set("kind", "client");
  await moveToTrash(formData);
}

// ---------------------------------------------------------------------------
export async function toggleClientMarquee(formData: FormData): Promise<void> {
  await requireAdmin();

  const id = String(formData.get("id") ?? "");
  const next = formData.get("in_marquee") === "true";
  if (!id) return;

  const supabase = createAdminClient();
  if (!supabase) return;

  await supabase.from("clients").update({ in_marquee: next }).eq("id", id);
  revalidateClientRoutes();
}
