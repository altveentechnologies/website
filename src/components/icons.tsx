import type { ReactElement, SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

const strokeProps = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

/** Line icons used by the "Why Altveen" grid, keyed by content.ts `icon`. */
export const FEATURE_ICONS: Record<
  string,
  (props: IconProps) => ReactElement
> = {
  layers: (props) => (
    <svg viewBox="0 0 24 24" {...strokeProps} {...props}>
      <path d="M12 3l9 5-9 5-9-5 9-5z" />
      <path d="M3 13l9 5 9-5" />
      <path d="M3 17.5l9 5 9-5" />
    </svg>
  ),
  users: (props) => (
    <svg viewBox="0 0 24 24" {...strokeProps} {...props}>
      <circle cx="9" cy="8" r="3.2" />
      <path d="M2.5 20a6.5 6.5 0 0113 0" />
      <path d="M16 5.5a3.2 3.2 0 010 6" />
      <path d="M17.5 14.2A6.5 6.5 0 0121.5 20" />
    </svg>
  ),
  compass: (props) => (
    <svg viewBox="0 0 24 24" {...strokeProps} {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M15.5 8.5l-2 5-5 2 2-5 5-2z" />
    </svg>
  ),
  bolt: (props) => (
    <svg viewBox="0 0 24 24" {...strokeProps} {...props}>
      <path d="M13 2L4.5 13.5H11l-1 8.5 8.5-11.5H12l1-8.5z" />
    </svg>
  ),
  chart: (props) => (
    <svg viewBox="0 0 24 24" {...strokeProps} {...props}>
      <path d="M3 3v18h18" />
      <path d="M7 15v3" />
      <path d="M12 10v8" />
      <path d="M17 6v12" />
    </svg>
  ),
  growth: (props) => (
    <svg viewBox="0 0 24 24" {...strokeProps} {...props}>
      <path d="M3 17l6-6 4 4 7-7" />
      <path d="M15 8h5v5" />
    </svg>
  ),
};

export function ArrowRightIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" {...strokeProps} {...props}>
      <path d="M5 12h14" />
      <path d="M13 6l6 6-6 6" />
    </svg>
  );
}

export function CheckIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" {...strokeProps} strokeWidth={2} {...props}>
      <path d="M4 12.5l5 5L20 6.5" />
    </svg>
  );
}

export function PlusIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" {...strokeProps} {...props}>
      <path d="M12 5v14" />
      <path d="M5 12h14" />
    </svg>
  );
}

export function SearchIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" {...strokeProps} {...props}>
      <circle cx="11" cy="11" r="7" />
      <path d="M16.5 16.5L21 21" />
    </svg>
  );
}

export function SpinnerIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" {...strokeProps} strokeWidth={2.2} {...props}>
      <path d="M12 3a9 9 0 019 9" />
    </svg>
  );
}

export function FacebookIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M13.5 22v-8h2.7l.4-3h-3.1V9.1c0-.9.2-1.5 1.5-1.5H17V5c-.4-.1-1.8-.2-3.4-.2-3 0-5.1 1.8-5.1 5.2V11H5.7v3h2.8v8h5z" />
    </svg>
  );
}

export function InstagramIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5zm10 2H7a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3zm-5 4.5A5.5 5.5 0 1 1 6.5 12 5.5 5.5 0 0 1 12 8.5zm0 2A3.5 3.5 0 1 0 15.5 12 3.5 3.5 0 0 0 12 10.5zM18 6.8a1.2 1.2 0 1 1-1.2 1.2A1.2 1.2 0 0 1 18 6.8z" />
    </svg>
  );
}

export function LinkedinIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M4.98 3.5A2.5 2.5 0 1 1 5 8.5a2.5 2.5 0 0 1-.02-5zM3.5 21h3V9h-3v12zM9 9h2.9v1.6h.04c.4-.8 1.4-1.7 2.9-1.7 3.1 0 3.7 2 3.7 4.7V21h-3v-5.6c0-1.3 0-3-1.8-3s-2.1 1.4-2.1 2.9V21H9V9z" />
    </svg>
  );
}

export function WhatsappIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M12.04 2C6.56 2 2.13 6.4 2.13 11.83c0 1.94.58 3.83 1.67 5.44L2 22l4.86-1.74a9.9 9.9 0 0 0 5.18 1.43h.01c5.48 0 9.9-4.4 9.9-9.83C21.95 6.4 17.52 2 12.04 2zm5.78 14.19c-.25.7-1.46 1.34-2.03 1.42-.52.07-1.18.1-1.9-.12-.43-.14-.99-.32-1.71-.63-3-1.29-4.96-4.44-5.11-4.64-.14-.2-1.22-1.61-1.22-3.07s.77-2.18 1.05-2.48c.28-.3.61-.38.81-.38h.58c.19 0 .45-.07.7.53.25.6.86 2.08.94 2.23.08.15.13.33.03.53-.1.2-.15.33-.3.5-.14.17-.3.38-.43.51-.14.14-.28.29-.12.57.15.28.7 1.16 1.51 1.88 1.04.93 1.92 1.22 2.2 1.36.28.14.44.12.6-.07.17-.2.69-.8.87-1.07.18-.27.37-.23.62-.14.25.1 1.58.74 1.86.88.28.14.47.2.54.31.07.1.07.61-.18 1.31z" />
    </svg>
  );
}
