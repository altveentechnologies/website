"use client";

import { useState } from "react";

import { LinkedinIcon, WhatsappIcon } from "@/components/icons";

export function ShareLinks({ title, url }: { title: string; url: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard blocked (insecure context or denied permission), the other
      // share targets still work, so fail quietly.
    }
  };

  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const targets = [
    {
      label: "Share on LinkedIn",
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      Icon: LinkedinIcon,
    },
    {
      label: "Share on WhatsApp",
      href: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
      Icon: WhatsappIcon,
    },
  ];

  return (
    <div className="flex items-center gap-3">
      <span className="font-mono text-xs uppercase tracking-[0.14em] text-mist">
        Share
      </span>

      {targets.map(({ label, href, Icon }) => (
        <a
          key={label}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={label}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-line text-mist transition-all hover:-translate-y-0.5 hover:border-brand-500/60 hover:text-brand-400"
        >
          <Icon className="h-4 w-4" />
        </a>
      ))}

      <button
        type="button"
        onClick={copy}
        className="rounded-full border border-line px-3.5 py-2 text-xs text-mist transition-colors hover:border-brand-500/60 hover:text-brand-400"
      >
        {copied ? "Link copied" : "Copy link"}
      </button>
    </div>
  );
}
