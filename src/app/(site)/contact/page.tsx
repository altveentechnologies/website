import type { Metadata } from "next";

import { SITE } from "@/lib/content";
import { PageHero, Section } from "@/components/ui";
import { Reveal } from "@/components/reveal";
import { ContactForm } from "@/components/contact-form";
import { FaqSection } from "@/components/faq-accordion";
import {
  FacebookIcon,
  InstagramIcon,
  LinkedinIcon,
  WhatsappIcon,
} from "@/components/icons";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with Altveen Technologies for a no-obligation conversation about your website, software or digital marketing project.",
};

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

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Let's talk"
        description="Get in touch for a no-obligation conversation about your project."
      />

      <Section tone="raised">
        <div className="grid gap-14 lg:grid-cols-[0.9fr_1.1fr]">
          <Reveal>
            <h2 className="text-2xl font-bold text-cloud">
              Tell us what you're building
            </h2>
            <p className="mt-4 leading-relaxed text-mist">
              Whether you need a new website, custom software, or a full digital
              marketing strategy, we're here to help. Share your goals and
              we'll come back with ideas and next steps.
            </p>

            <dl className="mt-10 space-y-7">
              <div>
                <dt className="font-mono text-xs uppercase tracking-[0.18em] text-mist">
                  Email
                </dt>
                <dd className="mt-2">
                  <a
                    href={`mailto:${SITE.email}`}
                    className="break-all text-cloud transition-colors hover:text-brand-400"
                  >
                    {SITE.email}
                  </a>
                </dd>
              </div>

              <div>
                <dt className="font-mono text-xs uppercase tracking-[0.18em] text-mist">
                  Phone
                </dt>
                <dd className="mt-2 space-y-1">
                  {SITE.phones.map((phone) => (
                    <a
                      key={phone}
                      href={`tel:${phone.replace(/\s/g, "")}`}
                      className="block text-cloud transition-colors hover:text-brand-400"
                    >
                      {phone}
                    </a>
                  ))}
                </dd>
              </div>

              <div>
                <dt className="font-mono text-xs uppercase tracking-[0.18em] text-mist">
                  Office
                </dt>
                <dd className="mt-2 text-cloud">
                  {SITE.legalName}
                  <br />
                  {SITE.address}
                </dd>
              </div>

              <div>
                <dt className="font-mono text-xs uppercase tracking-[0.18em] text-mist">
                  Follow
                </dt>
                <dd className="mt-3 flex gap-2.5">
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
                </dd>
              </div>
            </dl>
          </Reveal>

          <Reveal delay={0.1}>
            <ContactForm />
          </Reveal>
        </div>
      </Section>

      <FaqSection />
    </>
  );
}
