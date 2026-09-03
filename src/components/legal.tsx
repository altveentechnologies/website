import type { ReactNode } from "react";

/** Shared shell for the privacy / terms / refund pages. */
export function LegalBody({ children }: { children: ReactNode }) {
  return (
    <section className="border-t border-line bg-ink-850 py-20">
      <div className="container-page">
        <div className="article-body w-full">{children}</div>
      </div>
    </section>
  );
}

export function LegalIntro({ children }: { children: ReactNode }) {
  return (
    <p className="text-lg leading-relaxed text-cloud/90">{children}</p>
  );
}
