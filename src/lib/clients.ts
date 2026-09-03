import { createClient } from "@/lib/supabase/server";
import { createPublicClient } from "@/lib/supabase/public";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import type { Client, ClientRegion } from "@/lib/types";

const CLIENT_COLUMNS =
  "id, name, sector, description, url, image_url, region, in_marquee, sort_order, created_at, updated_at";

/** Ordered by the admin-controlled sort_order, then alphabetically. */
export async function getClients(): Promise<Client[]> {
  if (!isSupabaseConfigured()) return [];

  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("clients")
    .select(CLIENT_COLUMNS)
    .is("deleted_at", null)
    .order("sort_order", { ascending: true })
    .order("name", { ascending: true });

  if (error) {
    console.error("[clients] getClients:", error.message);
    return [];
  }

  return (data ?? []) as Client[];
}

/** Splits the single fetch into the two sections the /clients page renders. */
export function groupByRegion(clients: Client[]): Record<ClientRegion, Client[]> {
  return {
    international: clients.filter((c) => c.region === "international"),
    local: clients.filter((c) => c.region === "local"),
  };
}

export async function getMarqueeClients(): Promise<Client[]> {
  const clients = await getClients();
  return clients.filter((c) => c.in_marquee);
}

/** Admin read, uses the session client so RLS sees an authenticated user. */
export async function getClientById(id: string): Promise<Client | null> {
  if (!isSupabaseConfigured()) return null;

  const supabase = await createClient();
  const { data } = await supabase
    .from("clients")
    .select(CLIENT_COLUMNS)
    .eq("id", id)
    .is("deleted_at", null)
    .maybeSingle();

  return (data as Client) ?? null;
}
