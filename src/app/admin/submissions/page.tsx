import Link from "next/link";

import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import type {
  ConsultationRequest,
  ContactSubmission,
  NewsletterSubscriber,
} from "@/lib/types";
import { AdminShell } from "../admin-shell";
import { SubmissionsTabs } from "./submissions-tabs";

export const dynamic = "force-dynamic";

async function loadSubmissions() {
  if (!isSupabaseConfigured()) {
    return { consultations: [], contacts: [], subscribers: [] };
  }

  const supabase = await createClient();

  async function fetchTable<T>(table: string): Promise<T[]> {
    const active = await supabase
      .from(table)
      .select("*")
      .is("deleted_at", null)
      .order("created_at", { ascending: false })
      .limit(table === "newsletter_subscribers" ? 500 : 200);

    if (!active.error) return (active.data ?? []) as T[];

    // Before trash.sql is applied, fall back to loading all rows.
    const all = await supabase
      .from(table)
      .select("*")
      .order("created_at", { ascending: false })
      .limit(table === "newsletter_subscribers" ? 500 : 200);

    if (all.error) {
      console.error(`[submissions] ${table}:`, all.error.message);
      return [];
    }

    return (all.data ?? []) as T[];
  }

  const [consultations, contacts, subscribers] = await Promise.all([
    fetchTable<ConsultationRequest>("consultation_requests"),
    fetchTable<ContactSubmission>("contact_submissions"),
    fetchTable<NewsletterSubscriber>("newsletter_subscribers"),
  ]);

  return { consultations, contacts, subscribers };
}

export default async function SubmissionsPage() {
  const { consultations, contacts, subscribers } = await loadSubmissions();
  const total = consultations.length + contacts.length + subscribers.length;

  return (
    <AdminShell
      title="Form submissions"
      description={`${total} total across consultation requests, contact messages and newsletter signups.`}
      action={
        <Link href="/admin" className="text-sm text-mist hover:text-brand-400">
          ← Back to posts
        </Link>
      }
    >
      <SubmissionsTabs
        consultations={consultations}
        contacts={contacts}
        subscribers={subscribers}
      />
    </AdminShell>
  );
}
