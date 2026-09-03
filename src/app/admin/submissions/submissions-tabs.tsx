"use client";

import { useState } from "react";

import type {
  ConsultationRequest,
  ContactSubmission,
  NewsletterSubscriber,
  TrashKind,
} from "@/lib/types";
import { formatDate } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { TrashButton } from "../trash-button";

type TabKey = "consultations" | "contacts" | "subscribers";

function EmptyState({ label }: { label: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-line bg-ink-850 p-14 text-center">
      <p className="text-sm text-mist">No {label} yet.</p>
    </div>
  );
}

function RowActions({
  kind,
  id,
  label,
}: {
  kind: TrashKind;
  id: string;
  label: string;
}) {
  return (
    <div className="shrink-0">
      <TrashButton kind={kind} id={id} label={label} />
    </div>
  );
}

export function SubmissionsTabs({
  consultations,
  contacts,
  subscribers,
}: {
  consultations: ConsultationRequest[];
  contacts: ContactSubmission[];
  subscribers: NewsletterSubscriber[];
}) {
  const [tab, setTab] = useState<TabKey>("consultations");

  const tabs = [
    {
      key: "consultations" as const,
      label: "Consultation requests",
      count: consultations.length,
    },
    { key: "contacts" as const, label: "Contact messages", count: contacts.length },
    {
      key: "subscribers" as const,
      label: "Newsletter",
      count: subscribers.length,
    },
  ];

  return (
    <div>
      <div className="mb-8 flex flex-wrap gap-2 border-b border-line pb-4">
        {tabs.map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => setTab(t.key)}
            aria-pressed={tab === t.key}
            className={cn(
              "flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors",
              tab === t.key
                ? "bg-brand-500/15 text-brand-400"
                : "text-mist hover:bg-ink-800 hover:text-cloud",
            )}
          >
            {t.label}
            <span
              className={cn(
                "rounded-full px-2 py-0.5 font-mono text-xs",
                tab === t.key
                  ? "bg-brand-500/20 text-brand-400"
                  : "bg-ink-800 text-mist",
              )}
            >
              {t.count}
            </span>
          </button>
        ))}
      </div>

      {tab === "consultations" ? (
        consultations.length === 0 ? (
          <EmptyState label="consultation requests" />
        ) : (
          <div className="overflow-hidden rounded-2xl border border-line">
            <div className="divide-y divide-[color:var(--color-line)]">
              {consultations.map((item) => (
                <article
                  key={item.id}
                  className="bg-ink-900/60 px-6 py-5 transition-colors hover:bg-ink-850"
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-baseline justify-between gap-2 sm:justify-start">
                        <p className="font-medium text-cloud">{item.name}</p>
                        <time className="font-mono text-xs text-mist sm:ml-3">
                          {formatDate(item.created_at)}
                        </time>
                      </div>
                      <p className="mt-1.5 text-sm text-mist">
                        <a
                          href={`mailto:${item.email}`}
                          className="hover:text-brand-400"
                        >
                          {item.email}
                        </a>
                        <span className="mx-2" aria-hidden="true">
                          ·
                        </span>
                        <a
                          href={`tel:${item.phone.replace(/\s/g, "")}`}
                          className="hover:text-brand-400"
                        >
                          {item.phone}
                        </a>
                      </p>
                      {item.services.length > 0 ? (
                        <div className="mt-3 flex flex-wrap gap-1.5">
                          {item.services.map((service) => (
                            <span
                              key={service}
                              className="rounded-full border border-brand-500/30 bg-brand-500/10 px-2.5 py-1 text-xs text-brand-400"
                            >
                              {service}
                            </span>
                          ))}
                        </div>
                      ) : null}
                      {item.source_page ? (
                        <p className="mt-2 font-mono text-xs text-mist/70">
                          from {item.source_page}
                        </p>
                      ) : null}
                    </div>
                    <RowActions
                      kind="consultation"
                      id={item.id}
                      label={item.name}
                    />
                  </div>
                </article>
              ))}
            </div>
          </div>
        )
      ) : null}

      {tab === "contacts" ? (
        contacts.length === 0 ? (
          <EmptyState label="contact messages" />
        ) : (
          <div className="overflow-hidden rounded-2xl border border-line">
            <div className="divide-y divide-[color:var(--color-line)]">
              {contacts.map((item) => (
                <article
                  key={item.id}
                  className="bg-ink-900/60 px-6 py-5 transition-colors hover:bg-ink-850"
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-baseline gap-2">
                        <p className="font-medium text-cloud">
                          {item.name}
                          {item.company ? (
                            <span className="ml-2 font-normal text-mist">
                              · {item.company}
                            </span>
                          ) : null}
                        </p>
                        <time className="font-mono text-xs text-mist">
                          {formatDate(item.created_at)}
                        </time>
                      </div>
                      <p className="mt-1.5 text-sm">
                        <a
                          href={`mailto:${item.email}`}
                          className="text-mist hover:text-brand-400"
                        >
                          {item.email}
                        </a>
                      </p>
                      <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-mist">
                        {item.message}
                      </p>
                    </div>
                    <RowActions kind="contact" id={item.id} label={item.name} />
                  </div>
                </article>
              ))}
            </div>
          </div>
        )
      ) : null}

      {tab === "subscribers" ? (
        subscribers.length === 0 ? (
          <EmptyState label="subscribers" />
        ) : (
          <div className="overflow-hidden rounded-2xl border border-line">
            <div className="hidden border-b border-line bg-ink-850 px-6 py-3 text-xs font-medium text-mist sm:grid sm:grid-cols-[1fr_auto_auto] sm:gap-4">
              <span>Email</span>
              <span>Signed up</span>
              <span className="text-right">Action</span>
            </div>
            <div className="divide-y divide-[color:var(--color-line)]">
              {subscribers.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-col gap-3 bg-ink-900/60 px-6 py-4 transition-colors hover:bg-ink-850 sm:grid sm:grid-cols-[1fr_auto_auto] sm:items-center sm:gap-4"
                >
                  <a
                    href={`mailto:${item.email}`}
                    className="min-w-0 truncate text-sm text-cloud hover:text-brand-400"
                  >
                    {item.email}
                  </a>
                  <time className="shrink-0 font-mono text-xs text-mist">
                    {formatDate(item.created_at)}
                  </time>
                  <div className="sm:text-right">
                    <RowActions
                      kind="subscriber"
                      id={item.id}
                      label={item.email}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )
      ) : null}
    </div>
  );
}
