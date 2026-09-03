import type { Client } from "@/lib/types";

/**
 * Continuous "trusted by" strip. Names come from the clients table, so adding
 * a client in the admin panel is enough, nothing here needs editing.
 * The list is duplicated so the CSS loop has no visible seam.
 */
export function ClientMarquee({ clients }: { clients: Client[] }) {
  if (clients.length === 0) return null;

  return (
    <section className="border-y border-line bg-ink-850/60 py-10">
      <p className="mb-7 text-center font-mono text-xs uppercase tracking-[0.18em] text-mist">
        Trusted by businesses across the world
      </p>
      <div className="marquee-mask overflow-hidden">
        <div className="marquee-track flex w-max gap-14">
          {[...clients, ...clients].map((client, index) => (
            <span
              key={`${client.id}-${index}`}
              className="whitespace-nowrap text-lg font-semibold text-mist/70"
              aria-hidden={index >= clients.length}
            >
              {client.name}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
