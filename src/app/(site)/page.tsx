import Link from "next/link";

import {
  DIFFERENTIATORS,
  MARKETING_SERVICES,
  SOFTWARE_SERVICES,
} from "@/lib/content";
import { getPublishedPosts } from "@/lib/posts";
import { getMarqueeClients } from "@/lib/clients";
import { getHomepageTestimonials } from "@/lib/testimonials";

import { Hero } from "@/components/hero";
import { ClientMarquee } from "@/components/client-marquee";
import { StatsStrip } from "@/components/stat-counter";
import { FaqSection } from "@/components/faq-accordion";
import { ConsultationSection } from "@/components/consultation-form";
import { Reveal } from "@/components/reveal";
import { BlogCard, ImageCard, TestimonialCard } from "@/components/cards";
import { FEATURE_ICONS, ArrowRightIcon } from "@/components/icons";
import { ButtonLink, Section, SectionHeading } from "@/components/ui";

// Blog previews come from Supabase, revalidate hourly so new posts appear
// without a redeploy, while keeping the page statically fast.
export const revalidate = 3600;

export default async function HomePage() {
  const [posts, marqueeClients, testimonials] = await Promise.all([
    getPublishedPosts(),
    getMarqueeClients(),
    getHomepageTestimonials(),
  ]);
  const latest = posts.slice(0, 3);

  return (
    <>
      <Hero />
      <ClientMarquee clients={marqueeClients} />

      {/* Why Altveen */}
      <Section tone="raised" id="why">
        <SectionHeading
          eyebrow="Why Altveen"
          title="Two disciplines, one accountable team"
          description="We combine technical excellence with marketing savvy to help you win online and offline."
        />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {DIFFERENTIATORS.map((feature, index) => {
            const Icon = FEATURE_ICONS[feature.icon];

            return (
              <Reveal key={feature.title} index={index} className="h-full">
                <article className="group h-full rounded-2xl border border-line bg-ink-800/60 p-7 transition-all duration-300 hover:-translate-y-1 hover:border-brand-500/50 hover:shadow-[0_20px_50px_-20px] hover:shadow-brand-500/25">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-brand-500/25 bg-brand-500/10 text-brand-500 transition-colors group-hover:bg-brand-500/15">
                    {Icon ? <Icon className="h-6 w-6" /> : null}
                  </div>
                  <h3 className="mt-5 text-lg font-semibold text-cloud">
                    {feature.title}
                  </h3>
                  <p className="mt-2.5 text-sm leading-relaxed text-mist">
                    {feature.description}
                  </p>
                </article>
              </Reveal>
            );
          })}
        </div>
      </Section>

      {/* Software */}
      <Section>
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

      {/* Marketing */}
      <Section tone="raised">
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
        <div className="mt-12 text-center">
          <ButtonLink href="/services" variant="outline" size="lg">
            Explore all services
            <ArrowRightIcon className="h-4 w-4" />
          </ButtonLink>
        </div>
      </Section>

      {/* Testimonials */}
      {testimonials.length > 0 ? (
        <Section>
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

      {/* Blog preview */}
      {latest.length > 0 ? (
        <Section>
          <div className="mb-12 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-2xl">
              <SectionHeading
                eyebrow="From the blog"
                title="Insights worth your time"
                description="On software, marketing, and growing your business."
                align="left"
              />
            </div>
            <Link
              href="/blogs"
              className="group inline-flex shrink-0 items-center gap-2 pb-14 text-sm font-medium text-brand-400 hover:text-brand-500"
            >
              View all articles
              <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {latest.map((post, index) => (
              <Reveal key={post.id} index={index} className="h-full">
                <BlogCard post={post} />
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
