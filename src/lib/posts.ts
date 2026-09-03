import { createClient } from "@/lib/supabase/server";
import { createPublicClient } from "@/lib/supabase/public";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import type { Post } from "@/lib/types";

const POST_COLUMNS =
  "id, slug, title, excerpt, content, author, category, image_url, read_time, published, published_at, created_at, updated_at";

/** All published posts, newest first. Empty array if Supabase isn't wired up yet. */
export async function getPublishedPosts(): Promise<Post[]> {
  if (!isSupabaseConfigured()) return [];

  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("posts")
    .select(POST_COLUMNS)
    .eq("published", true)
    .is("deleted_at", null)
    .order("published_at", { ascending: false });

  if (error) {
    console.error("[posts] getPublishedPosts:", error.message);
    return [];
  }

  return (data ?? []) as Post[];
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  if (!isSupabaseConfigured()) return null;

  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("posts")
    .select(POST_COLUMNS)
    .eq("slug", slug)
    .eq("published", true)
    .is("deleted_at", null)
    .maybeSingle();

  if (error) {
    console.error("[posts] getPostBySlug:", error.message);
    return null;
  }

  return (data as Post) ?? null;
}

/** Other published posts in the same category, for the "keep reading" rail. */
export async function getRelatedPosts(post: Post, limit = 3): Promise<Post[]> {
  if (!isSupabaseConfigured()) return [];

  const supabase = createPublicClient();
  const { data } = await supabase
    .from("posts")
    .select(POST_COLUMNS)
    .eq("published", true)
    .is("deleted_at", null)
    .neq("id", post.id)
    .eq("category", post.category)
    .order("published_at", { ascending: false })
    .limit(limit);

  const related = (data ?? []) as Post[];
  if (related.length >= limit) return related;

  // Not enough in-category matches, top up with the most recent posts.
  const excluded = [post.id, ...related.map((p) => p.id)];
  const { data: recent } = await supabase
    .from("posts")
    .select(POST_COLUMNS)
    .eq("published", true)
    .is("deleted_at", null)
    .not("id", "in", `(${excluded.join(",")})`)
    .order("published_at", { ascending: false })
    .limit(limit - related.length);

  return [...related, ...((recent ?? []) as Post[])];
}

/** Every post including drafts, admin only, relies on an authenticated session. */
export async function getAllPostsForAdmin(): Promise<Post[]> {
  if (!isSupabaseConfigured()) return [];

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("posts")
    .select(POST_COLUMNS)
    .is("deleted_at", null)
    .order("published_at", { ascending: false });

  if (error) {
    console.error("[posts] getAllPostsForAdmin:", error.message);
    return [];
  }

  return (data ?? []) as Post[];
}

export async function getPostById(id: string): Promise<Post | null> {
  if (!isSupabaseConfigured()) return null;

  const supabase = await createClient();
  const { data } = await supabase
    .from("posts")
    .select(POST_COLUMNS)
    .eq("id", id)
    .is("deleted_at", null)
    .maybeSingle();

  return (data as Post) ?? null;
}
