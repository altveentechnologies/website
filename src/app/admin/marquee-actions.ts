"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import type { FormState } from "@/lib/types";

async function requireAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/admin/login");
  return user;
}

function revalidateMarqueeRoutes() {
  revalidatePath("/");
  revalidatePath("/admin/marquee");
  revalidatePath("/admin/clients");
}

/** Quick-add a business name to the homepage scroller. */
export async function addMarqueeName(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  await requireAdmin();

  const name = String(formData.get("name") ?? "").trim();
  const sortOrder = Number.parseInt(String(formData.get("sort_order") ?? "0"), 10) || 0;

  if (!name) {
    return { status: "error", message: "Business name is required.", errors: { name: "Required." } };
  }

  const supabase = createAdminClient();
  if (!supabase) {
    return { status: "error", message: "Supabase secret key is missing." };
  }

  const { error } = await supabase.from("clients").insert({
    name,
    description: "Featured in the homepage scroller.",
    sector: "",
    region: "international",
    in_marquee: true,
    sort_order: sortOrder,
  });

  if (error) {
    return {
      status: "error",
      message:
        error.code === "23505"
          ? "That name is already in the scroller."
          : error.message,
    };
  }

  revalidateMarqueeRoutes();
  return { status: "success", message: `Added “${name}” to the scroller.` };
}

export async function removeFromMarquee(formData: FormData): Promise<void> {
  await requireAdmin();

  const id = String(formData.get("id") ?? "");
  if (!id) return;

  const supabase = createAdminClient();
  if (!supabase) return;

  await supabase.from("clients").update({ in_marquee: false }).eq("id", id);
  revalidateMarqueeRoutes();
}

export async function updateMarqueeSort(formData: FormData): Promise<void> {
  await requireAdmin();

  const id = String(formData.get("id") ?? "");
  const sortOrder = Number.parseInt(String(formData.get("sort_order") ?? "0"), 10) || 0;
  if (!id) return;

  const supabase = createAdminClient();
  if (!supabase) return;

  await supabase.from("clients").update({ sort_order: sortOrder }).eq("id", id);
  revalidateMarqueeRoutes();
}
