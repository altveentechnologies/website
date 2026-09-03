import Image from "next/image";
import Link from "next/link";

import { LEGAL_LINKS, NAV_LINKS, SITE } from "@/lib/content";
import {
  FacebookIcon,
  InstagramIcon,
  LinkedinIcon,
  WhatsappIcon,
} from "@/components/icons";

const SOCIALS = [
  { href: SITE.social.facebook, label: "Facebook", Icon: FacebookIcon },
  { href: SITE.social.instagram, label: "Instagram", Icon: InstagramIcon },
  { href: SITE.social.linkedin, label: "LinkedIn", Icon: LinkedinIcon },
  {
    href: `https://wa.me/${SITE.whatsapp}`,
    label: "WhatsApp",
    Icon: WhatsappIcon,
  },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-line bg-ink-850">
      <div className="container-page py-16">
        <div className="grid gap-12 lg:grid-cols-[2fr_1fr_1fr_1fr]">
          {/* Brand */}
          <div>
            <Link href="/" className="inline-flex items-center gap-2.5">
              <Image
                src="/images/logo1.png"
                alt=""
                width={36}
                height={36}
                className="rounded-lg"
              />
              <span className="text-lg font-bold tracking-tight text-cloud">
                Altveen<span className="text-brand-500"> Technologies</span>
              </span>
            </Link>

            <p className="mt-5 max-w-md text-sm leading-relaxed text-mist">
              {SITE.description}
            </p>
            <p className="mt-3 text-sm text-mist">
              Based in Kashmir, working with clients in India, the US and beyond.
            </p>

            <div className="mt-6 flex gap-2.5">
              {SOCIALS.map(({ href, label, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-line text-mist transition-all hover:-translate-y-0.5 hover:border-brand-500/60 hover:bg-brand-500/10 hover:text-brand-400"
                >
                  <Icon className="h-[18px] w-[18px]" />
                </a>
              ))}
            </div>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-mono text-xs uppercase tracking-[0.18em] text-mist">
              Company
            </h3>
            <ul className="mt-5 space-y-3">
              {NAV_LINKS.filter((l) => l.href !== "/").map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-mist transition-colors hover:text-brand-400"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-mono text-xs uppercase tracking-[0.18em] text-mist">
              Legal
            </h3>
            <ul className="mt-5 space-y-3">
              {LEGAL_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-mist transition-colors hover:text-brand-400"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-mono text-xs uppercase tracking-[0.18em] text-mist">
              Contact
            </h3>
            <ul className="mt-5 space-y-3 text-sm">
              {SITE.phones.map((phone) => (
                <li key={phone}>
                  <a
                    href={`tel:${phone.replace(/\s/g, "")}`}
                    className="text-mist transition-colors hover:text-brand-400"
                  >
                    {phone}
                  </a>
                </li>
              ))}
              <li>
                <a
                  href={`mailto:${SITE.email}`}
                  className="break-all text-mist transition-colors hover:text-brand-400"
                >
                  {SITE.email}
                </a>
              </li>
              <li className="text-mist">{SITE.address}</li>
            </ul>
          </div>
        </div>

        <div className="mt-14 border-t border-line pt-8 text-center">
          <p className="text-sm text-mist">
            © {new Date().getFullYear()} {SITE.legalName}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
