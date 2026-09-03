import type { Metadata } from "next";

import { INDUSTRIES } from "@/lib/content";
import { getClients, groupByRegion } from "@/lib/clients";
import { getTestimonials } from "@/lib/testimonials";
import { PageHero, Pill, Section, SectionHeading } from "@/components/ui";
import { Reveal } from "@/components/reveal";
import { ClientCard, TestimonialCard } from "@/components/cards";
import { StatsStrip } from "@/components/stat-counter";
import { ConsultationSection } from "@/components/consultation-form";

export const metadata: Metadata = {
  title: "Clients",
  description:
    "Altveen works with e-commerce stores, restaurants, hotels and startups across the US, India and beyond, building websites, stores and the marketing behind them.",
};

// Clients live in Supabase and are managed from the admin panel; revalidate
// hourly so additions appear without a redeploy.
export const revalidate = 3600;

export default async function ClientsPage() {
  const [clients, testimonials] = await Promise.all([
    getClients(),
    getTestimonials(),
  ]);
  const { international, local } = groupByRegion(clients);

  return (
    <>
      <PageHero
        eyebrow="Our work"
        title="Clients"
        description="We're proud to work with businesses worldwide and in our community."
      />

      {international.length > 0 ? (
        <Section tone="raised">
          <SectionHeading
            eyebrow="International"
            title="Clients across the globe"
            description="We partner with organizations abroad to deliver software, Shopify / WordPress / Webflow websites, and marketing solutions."
          />
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {international.map((client, index) => (
              <Reveal key={client.id} index={index} className="h-full">
                <ClientCard client={client} />
              </Reveal>
            ))}
          </div>
        </Section>
      ) : null}

      {local.length > 0 ? (
        <Section>
          <SectionHeading
            eyebrow="Local"
            title="Clients in our community"
            description="Proud to support businesses close to home with digital growth, storefronts, and design."
          />
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {local.map((client, index) => (
              <Reveal key={client.id} index={index} className="h-full">
                <ClientCard client={client} />
              </Reveal>
            ))}
          </div>
        </Section>
      ) : null}

      <StatsStrip />

      {testimonials.length > 0 ? (
        <Section>
          <SectionHeading
            eyebrow="Testimonials"
            title="Client testimonials"
            description="Stories from international and local clients who trust Altveen."
          />
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((testimonial, index) => (
              <Reveal key={testimonial.id} index={index} className="h-full">
                <TestimonialCard item={testimonial} />
              </Reveal>
            ))}
          </div>
        </Section>
      ) : null}

      <Section tone="raised">
        <SectionHeading
          eyebrow="Sectors"
          title="Industries we serve"
        />
        <Reveal>
          <div className="flex flex-wrap justify-center gap-3">
            {INDUSTRIES.map((industry) => (
              <Pill key={industry}>{industry}</Pill>
            ))}
          </div>
        </Reveal>
      </Section>

      <ConsultationSection />
    </>
  );
}
