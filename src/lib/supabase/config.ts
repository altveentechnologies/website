export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";

/**
 * Supabase issues this key under two names depending on project age:
 * the legacy `anon` JWT, and the newer `sb_publishable_…` key. Both are safe
 * to ship to the browser and both work here, so accept either.
 */
export const SUPABASE_ANON_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
  "";

/**
 * The site is designed to build and render before Supabase is wired up, so
 * every data path checks this first and degrades to an empty state instead of
 * throwing. Once .env.local has real values this flips to true everywhere.
 */
export function isSupabaseConfigured(): boolean {
  return Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);
}
