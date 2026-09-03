import { createClient } from "@/lib/supabase/server";
import { createPublicClient } from "@/lib/supabase/public";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import type { Testimonial } from "@/lib/types";

const TESTIMONIAL_COLUMNS =
  "id, client_name, quote, detail, rating, published, show_on_homepage, show_on_services, sort_order, created_at, updated_at";

function mapRows(data: unknown[] | null): Testimonial[] {
  return (data ?? []).map((row) => ({
    ...(row as Testimonial),
    rating: Number((row as Testimonial).rating),
  }));
}

/** All published reviews, ordered for clients / about pages. */
export async function getTestimonials(): Promise<Testimonial[]> {
  if (!isSupabaseConfigured()) return [];

  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("testimonials")
    .select(TESTIMONIAL_COLUMNS)
    .eq("published", true)
    .is("deleted_at", null)
    .order("sort_order", { ascending: true })
    .order("client_name", { ascending: true });

  if (error) {
    console.error("[testimonials] getTestimonials:", error.message);
    return [];
  }

  return mapRows(data);
}

export async function getHomepageTestimonials(): Promise<Testimonial[]> {
  if (!isSupabaseConfigured()) return [];

  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("testimonials")
    .select(TESTIMONIAL_COLUMNS)
    .eq("published", true)
    .eq("show_on_homepage", true)
    .is("deleted_at", null)
    .order("sort_order", { ascending: true })
    .order("client_name", { ascending: true });

  if (error) {
    console.error("[testimonials] getHomepageTestimonials:", error.message);
    return [];
  }

  return mapRows(data);
}

export async function getServicesTestimonials(): Promise<Testimonial[]> {
  if (!isSupabaseConfigured()) return [];

  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("testimonials")
    .select(TESTIMONIAL_COLUMNS)
    .eq("published", true)
    .eq("show_on_services", true)
    .is("deleted_at", null)
    .order("sort_order", { ascending: true })
    .order("client_name", { ascending: true });

  if (error) {
    console.error("[testimonials] getServicesTestimonials:", error.message);
    return [];
  }

  return mapRows(data);
}

/** Admin list, includes drafts. */
export async function getAllTestimonialsForAdmin(): Promise<Testimonial[]> {
  if (!isSupabaseConfigured()) return [];

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("testimonials")
    .select(TESTIMONIAL_COLUMNS)
    .is("deleted_at", null)
    .order("sort_order", { ascending: true })
    .order("client_name", { ascending: true });

  if (error) {
    console.error("[testimonials] getAllTestimonialsForAdmin:", error.message);
    return [];
  }

  return mapRows(data);
}

export async function getTestimonialById(id: string): Promise<Testimonial | null> {
  if (!isSupabaseConfigured()) return null;

  const supabase = await createClient();
  const { data } = await supabase
    .from("testimonials")
    .select(TESTIMONIAL_COLUMNS)
    .eq("id", id)
    .is("deleted_at", null)
    .maybeSingle();

  if (!data) return null;

  return {
    ...(data as Testimonial),
    rating: Number(data.rating),
  };
}
