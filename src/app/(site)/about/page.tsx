import type { Metadata } from "next";
import Image from "next/image";

import { PROCESS_STEPS, VALUES } from "@/lib/content";
import { getTestimonials } from "@/lib/testimonials";
import { PageHero, Section, SectionHeading } from "@/components/ui";
import { Reveal } from "@/components/reveal";
import { ImageCard, TestimonialCard } from "@/components/cards";
import { StatsStrip } from "@/components/stat-counter";
import { ConsultationSection } from "@/components/consultation-form";

export const metadata: Metadata = {
  title: "About",
  description:
    "Altveen Technologies was started in Kashmir by B.Tech and Economics graduates who believed businesses everywhere deserve world-class software and digital marketing.",
};

export const revalidate = 3600;

export default async function AboutPage() {
  const testimonials = await getTestimonials();
  return (
    <>
      <PageHero
        eyebrow="About us"
        title="Who we are and what drives us"
        description="Engineering and economics, in the same room, building technology that works and makes business sense."
      />

      {/* Story */}
      <Section tone="raised">
        <div className="grid items-center gap-14 lg:grid-cols-2">
          <Reveal>
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-line">
              <Image
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1400&q=95"
                alt="The Altveen team collaborating"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <SectionHeading eyebrow="Our story" title="Started in Kashmir" align="left" />
            <div className="space-y-4 text-mist">
              <p className="text-lg leading-relaxed text-cloud/90">
                Altveen Technologies Pvt Ltd was started in Kashmir by a team of
                B.Tech and Economics graduates who believed that businesses
                everywhere, including in the Valley, deserve access to
                world-class software and digital marketing.
              </p>
              <p className="leading-relaxed">
                What began as a small venture with a focus on building reliable
                web solutions and data-driven campaigns has grown into a company
                that serves clients across India and abroad. Our mix of
                engineering and economics helps us build technology that not
                only works but also makes business sense, efficient, scalable,
                and aligned with your goals.
              </p>
              <p className="leading-relaxed">
                We design and develop custom software, web and mobile apps,
                Shopify, WordPress and Webflow sites, AI chatbots, automation
                tools, and design, and run digital marketing that brings
                visibility, leads, and growth. Whether you are a startup in
                Srinagar or an enterprise elsewhere, we are here to be your
                single partner for building and promoting your digital presence.
              </p>
            </div>
          </Reveal>
        </div>
      </Section>

      {/* Studio */}
      <Section>
        <div className="grid items-center gap-14 lg:grid-cols-2">
          <Reveal className="lg:order-2">
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-line">
              <Image
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1400&q=90"
                alt="The Altveen studio and workspace"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
          </Reveal>

          <Reveal delay={0.1} className="lg:order-1">
            <SectionHeading
              eyebrow="Our studio"
              title="Built in Kashmir, shipping worldwide"
              align="left"
            />
            <div className="space-y-4 leading-relaxed text-mist">
              <p>
                Altveen is built in Kashmir, inspired by the energy of local
                entrepreneurs and the calm of the mountains around us. Our
                studio is where strategy, design, and engineering sit together  - 
                so your website, store, and marketing all move in the same
                direction.
              </p>
              <p>
                From here we design and ship Shopify, WordPress, and Webflow
                sites, dashboards, and campaigns for clients across different
                time zones. Whether we’re sketching a new brand identity or
                refining a checkout flow, the focus is always the same: make
                your digital presence feel clear, fast, and trustworthy.
              </p>
            </div>
          </Reveal>
        </div>
      </Section>

      {/* Process */}
      <Section tone="raised">
        <SectionHeading
          eyebrow="How we work"
          title="A process you can see into"
          description="Collaborative and structured, from discovery through to launch and beyond."
        />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {PROCESS_STEPS.map((step, index) => (
            <Reveal key={step.step} index={index} className="h-full">
              <div className="relative h-full rounded-2xl border border-line bg-ink-800/60 p-7">
                <span className="font-mono text-3xl font-bold text-brand-500/30">
                  {step.step}
                </span>
                <h3 className="mt-4 text-lg font-semibold text-cloud">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-mist">
                  {step.description}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* Values */}
      <Section>
        <SectionHeading
          eyebrow="Our values"
          title="The principles behind every project"
          description="What guides how we work with every client."
        />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {VALUES.map((value, index) => (
            <Reveal key={value.title} index={index} className="h-full">
              <ImageCard item={value} />
            </Reveal>
          ))}
        </div>
      </Section>

      {/* Testimonials */}
      {testimonials.length > 0 ? (
        <Section tone="raised">
          <SectionHeading
            eyebrow="Testimonials"
            title="What clients say"
            description="Real feedback from international and local businesses we support."
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

      <StatsStrip />
      <ConsultationSection />
    </>
  );
}
