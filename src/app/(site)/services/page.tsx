import type { Metadata } from "next";

import { MARKETING_SERVICES, PROCESS_STEPS, SOFTWARE_SERVICES } from "@/lib/content";
import { getServicesTestimonials } from "@/lib/testimonials";
import { PageHero, Section, SectionHeading } from "@/components/ui";
import { Reveal } from "@/components/reveal";
import { ImageCard, TestimonialCard } from "@/components/cards";
import { FaqSection } from "@/components/faq-accordion";
import { ConsultationSection } from "@/components/consultation-form";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Custom software development and digital marketing: web and mobile apps, Shopify / WordPress / Webflow, AI and automation, SEO, performance ads, analytics and brand design.",
};

export const revalidate = 3600;

export default async function ServicesPage() {
  const testimonials = await getServicesTestimonials();
  return (
    <>
      <PageHero
        eyebrow="What we do"
        title="Our services"
        description="Software development and digital marketing tailored to your business."
      />

      <Section tone="raised" id="software">
        <SectionHeading
          eyebrow="Software Development"
          title="Software that scales with you"
          description="From custom applications to e-commerce and automation, we build software that scales."
        />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {SOFTWARE_SERVICES.map((service, index) => (
            <Reveal key={service.title} index={index} className="h-full">
              <ImageCard item={service} />
            </Reveal>
          ))}
        </div>
      </Section>

      <Section id="marketing">
        <SectionHeading
          eyebrow="Digital Marketing"
          title="Reach the right audience, and convert them"
          description="Powered by content, performance, and data."
        />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {MARKETING_SERVICES.map((service, index) => (
            <Reveal key={service.title} index={index} className="h-full">
              <ImageCard item={service} />
            </Reveal>
          ))}
        </div>
      </Section>

      <Section tone="raised">
        <SectionHeading
          eyebrow="Engagement"
          title="How a project runs"
          description="No black boxes, you can see the work at every stage."
        />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {PROCESS_STEPS.map((step, index) => (
            <Reveal key={step.step} index={index} className="h-full">
              <div className="h-full rounded-2xl border border-line bg-ink-800/60 p-7">
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

      {testimonials.length > 0 ? (
        <Section>
          <SectionHeading
            eyebrow="Testimonials"
            title="What clients say"
            description="Real feedback from businesses we support."
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

      <FaqSection />
      <ConsultationSection />
    </>
  );
}
