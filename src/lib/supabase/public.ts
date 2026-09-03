import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { SUPABASE_ANON_KEY, SUPABASE_URL } from "./config";

/**
 * Cookie-free anon client for reading public content.
 *
 * The cookie-backed client in ./server.ts calls `cookies()`, which is only
 * legal inside a request. Static generation contexts, generateStaticParams,
 * sitemap.ts, ISR revalidation, have no request, so they must use this one.
 * Published posts are readable by anon under RLS, so no session is needed.
 */
export function createPublicClient() {
  return createSupabaseClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
