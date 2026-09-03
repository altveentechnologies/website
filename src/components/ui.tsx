import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Section shell
// ---------------------------------------------------------------------------
export function Section({
  children,
  className,
  tone = "base",
  id,
}: {
  children: ReactNode;
  className?: string;
  tone?: "base" | "raised";
  id?: string;
}) {
  return (
    <section
      id={id}
      className={cn(
        "py-20 sm:py-24",
        tone === "raised" && "bg-ink-850 border-y border-line",
        className,
      )}
    >
      <div className="container-page">{children}</div>
    </section>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
}: {
  eyebrow?: string;
  title: ReactNode;
  description?: string;
  align?: "center" | "left";
}) {
  return (
    <div
      className={cn(
        "mb-14 max-w-2xl",
        align === "center" ? "mx-auto text-center" : "text-left",
      )}
    >
      {eyebrow ? <Eyebrow className="mb-3">{eyebrow}</Eyebrow> : null}
      <h2 className="text-3xl font-bold tracking-tight text-cloud sm:text-4xl">
        {title}
      </h2>
      {description ? (
        <p className="mt-4 text-base leading-relaxed text-mist">{description}</p>
      ) : null}
    </div>
  );
}

export function Eyebrow({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <p
      className={cn(
        "font-mono text-xs uppercase tracking-[0.18em] text-brand-500",
        className,
      )}
    >
      {children}
    </p>
  );
}

// ---------------------------------------------------------------------------
// Page hero for inner pages
// ---------------------------------------------------------------------------
export function PageHero({
  eyebrow,
  title,
  description,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
}) {
  return (
    <section className="relative overflow-hidden border-b border-line">
      <div className="aurora pointer-events-none absolute inset-0 opacity-70" />
      <div className="grid-backdrop pointer-events-none absolute inset-0" />
      <div className="container-page relative py-20 text-center sm:py-24">
        {eyebrow ? <Eyebrow className="mb-4">{eyebrow}</Eyebrow> : null}
        <h1 className="text-4xl font-bold tracking-tight text-cloud sm:text-5xl">
          {title}
        </h1>
        {description ? (
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-mist">
            {description}
          </p>
        ) : null}
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Buttons
// ---------------------------------------------------------------------------
const buttonBase =
  "inline-flex items-center justify-center gap-2 rounded-lg text-sm font-semibold transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-60";

const buttonVariants = {
  primary:
    "bg-brand-500 text-ink-950 hover:bg-brand-400 hover:-translate-y-0.5 hover:shadow-[0_10px_30px_-10px] hover:shadow-brand-500/60",
  outline:
    "border border-brand-500/60 text-brand-400 hover:bg-brand-500 hover:text-ink-950 hover:-translate-y-0.5",
  ghost:
    "border border-line text-cloud hover:border-brand-500/60 hover:text-brand-400",
} as const;

const buttonSizes = {
  md: "px-5 py-2.5",
  lg: "px-7 py-3.5 text-base",
} as const;

type ButtonStyleProps = {
  variant?: keyof typeof buttonVariants;
  size?: keyof typeof buttonSizes;
};

export function buttonClass({
  variant = "primary",
  size = "md",
  className,
}: ButtonStyleProps & { className?: string } = {}) {
  return cn(buttonBase, buttonVariants[variant], buttonSizes[size], className);
}

export function Button({
  variant,
  size,
  className,
  ...props
}: ComponentProps<"button"> & ButtonStyleProps) {
  return (
    <button
      {...props}
      className={buttonClass({ variant, size, className })}
    />
  );
}

export function ButtonLink({
  variant,
  size,
  className,
  ...props
}: ComponentProps<typeof Link> & ButtonStyleProps) {
  return <Link {...props} className={buttonClass({ variant, size, className })} />;
}

// ---------------------------------------------------------------------------
// Misc
// ---------------------------------------------------------------------------
export function Pill({ children }: { children: ReactNode }) {
  return (
    <span className="rounded-full border border-line bg-ink-800/60 px-4 py-2 text-sm text-mist transition-colors hover:border-brand-500/50 hover:text-cloud">
      {children}
    </span>
  );
}

export function StarRating({ rating }: { rating: number }) {
  const full = Math.floor(rating);

  return (
    <div className="flex items-center gap-2">
      <div className="flex" aria-hidden="true">
        {[0, 1, 2, 3, 4].map((i) => (
          <svg
            key={i}
            viewBox="0 0 20 20"
            className={cn(
              "h-4 w-4",
              i < full ? "text-brand-500" : "text-ink-600",
            )}
            fill="currentColor"
          >
            <path d="M10 1.5l2.6 5.3 5.9.85-4.25 4.15 1 5.85L10 14.9l-5.25 2.75 1-5.85L1.5 7.65l5.9-.85L10 1.5z" />
          </svg>
        ))}
      </div>
      <span className="font-mono text-xs text-mist">
        {rating.toFixed(1)}/5
      </span>
    </div>
  );
}
