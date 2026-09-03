import "server-only";

import { createClient } from "@supabase/supabase-js";
import { SUPABASE_URL } from "./config";

/**
 * Service-role client. Bypasses RLS, so it must never be imported into a
 * Client Component, the "server-only" import above turns that into a build
 * error rather than a leaked key.
 *
 * Used for writing public form submissions (visitors have no insert policy)
 * and for admin post mutations after the session has been verified.
 */
export function createAdminClient() {
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!SUPABASE_URL || !serviceKey) {
    return null;
  }

  return createClient(SUPABASE_URL, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
