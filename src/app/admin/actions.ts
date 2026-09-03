"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { estimateReadTime, slugify } from "@/lib/utils";
import type { FormState } from "@/lib/types";
import { moveToTrash } from "./trash-actions";

/**
 * Every mutation re-verifies the session server-side. The middleware guards
 * navigation; this guards the data, so a forged request can't write.
 */
async function requireAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/admin/login");
  return user;
}

function revalidateBlogRoutes(slug?: string) {
  revalidatePath("/");
  revalidatePath("/blogs");
  revalidatePath("/sitemap.xml");
  if (slug) revalidatePath(`/blogs/${slug}`);
}

function readPostForm(formData: FormData) {
  const value = (name: string) => String(formData.get(name) ?? "").trim();

  const title = value("title");
  const content = value("content");
  const slug = slugify(value("slug") || title);
  const readTime = value("read_time") || estimateReadTime(content);
  const publishedAt = value("published_at");

  return {
    title,
    slug,
    excerpt: value("excerpt"),
    content,
    author: value("author") || "Altveen Team",
    category: value("category") || "General",
    image_url: value("image_url") || null,
    read_time: readTime,
    published: formData.get("published") === "on",
    published_at: publishedAt
      ? new Date(publishedAt).toISOString()
      : new Date().toISOString(),
  };
}

function validate(post: ReturnType<typeof readPostForm>) {
  const errors: Record<string, string> = {};
  if (!post.title) errors.title = "Title is required.";
  if (!post.slug) errors.slug = "Slug is required.";
  if (!post.excerpt) errors.excerpt = "Excerpt is required.";
  if (!post.content) errors.content = "Content is required.";
  return errors;
}

// ---------------------------------------------------------------------------
export async function createPost(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  await requireAdmin();

  const post = readPostForm(formData);
  const errors = validate(post);

  if (Object.keys(errors).length > 0) {
    return { status: "error", message: "Please fix the highlighted fields.", errors };
  }

  const supabase = createAdminClient();
  if (!supabase) {
    return { status: "error", message: "Supabase service role key is missing." };
  }

  const { error } = await supabase.from("posts").insert(post);

  if (error) {
    return {
      status: "error",
      message:
        error.code === "23505"
          ? "That slug is already used by another post."
          : error.message,
    };
  }

  revalidateBlogRoutes(post.slug);
  redirect("/admin?created=1");
}

// ---------------------------------------------------------------------------
export async function updatePost(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  await requireAdmin();

  const id = String(formData.get("id") ?? "");
  if (!id) return { status: "error", message: "Missing post id." };

  const post = readPostForm(formData);
  const errors = validate(post);

  if (Object.keys(errors).length > 0) {
    return { status: "error", message: "Please fix the highlighted fields.", errors };
  }

  const supabase = createAdminClient();
  if (!supabase) {
    return { status: "error", message: "Supabase service role key is missing." };
  }

  const { error } = await supabase.from("posts").update(post).eq("id", id);

  if (error) {
    return {
      status: "error",
      message:
        error.code === "23505"
          ? "That slug is already used by another post."
          : error.message,
    };
  }

  revalidateBlogRoutes(post.slug);
  revalidatePath(`/admin/posts/${id}`);

  return { status: "success", message: "Post saved." };
}

// ---------------------------------------------------------------------------
export async function deletePost(formData: FormData): Promise<void> {
  formData.set("kind", "post");
  await moveToTrash(formData);
  revalidatePath("/admin");
}

// ---------------------------------------------------------------------------
export async function togglePublished(formData: FormData): Promise<void> {
  await requireAdmin();

  const id = String(formData.get("id") ?? "");
  const slug = String(formData.get("slug") ?? "");
  const next = formData.get("published") === "true";
  if (!id) return;

  const supabase = createAdminClient();
  if (!supabase) return;

  await supabase.from("posts").update({ published: next }).eq("id", id);

  revalidateBlogRoutes(slug || undefined);
  revalidatePath("/admin");
}

// ---------------------------------------------------------------------------
/**
 * Sign in on the server so the auth cookies are written straight into the
 * response. Doing this in the browser instead races the middleware: it reads
 * cookies from the incoming request, so a client-side redirect fired in the
 * same tick can bounce back to the login page.
 */
export async function signIn(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { status: "error", message: "Email and password are required." };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return { status: "error", message: error.message };
  }

  const next = String(formData.get("next") ?? "");
  // Only ever redirect within the admin area, never to an attacker's URL.
  redirect(next.startsWith("/admin") && !next.startsWith("//") ? next : "/admin");
}

// ---------------------------------------------------------------------------
export async function signOut(): Promise<void> {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}
