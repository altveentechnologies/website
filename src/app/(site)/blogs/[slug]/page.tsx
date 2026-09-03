import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { SITE } from "@/lib/content";
import { getPostBySlug, getPublishedPosts, getRelatedPosts } from "@/lib/posts";
import { formatDate } from "@/lib/utils";
import { Section, SectionHeading } from "@/components/ui";
import { BlogCard } from "@/components/cards";
import { NewsletterForm } from "@/components/newsletter-form";
import { ArrowRightIcon } from "@/components/icons";
import { ReadingProgress } from "@/components/reading-progress";
import { ShareLinks } from "@/components/share-links";

export const revalidate = 3600;

type PageProps = { params: Promise<{ slug: string }> };

/** Pre-render the posts that exist at build time; new ones stream in via ISR. */
export async function generateStaticParams() {
  const posts = await getPublishedPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    return { title: "Post not found" };
  }

  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      type: "article",
      title: post.title,
      description: post.excerpt,
      publishedTime: post.published_at,
      authors: [post.author],
      images: post.image_url ? [{ url: post.image_url }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
      images: post.image_url ? [post.image_url] : undefined,
    },
    alternates: { canonical: `/blogs/${post.slug}` },
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) notFound();

  const related = await getRelatedPosts(post);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const postUrl = `${siteUrl}/blogs/${post.slug}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    image: post.image_url ?? undefined,
    datePublished: post.published_at,
    dateModified: post.updated_at,
    author: { "@type": "Organization", name: post.author },
    publisher: { "@type": "Organization", name: SITE.legalName },
    mainEntityOfPage: postUrl,
  };

  return (
    <>
      <ReadingProgress />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <article>
        {/* Hero */}
        <header className="relative overflow-hidden border-b border-line">
          <div className="aurora pointer-events-none absolute inset-0 opacity-60" />
          <div className="container-page relative py-14">
            <div className="mx-auto max-w-3xl">
              <Link
                href="/blogs"
                className="inline-flex items-center gap-2 text-sm text-mist transition-colors hover:text-brand-400"
              >
                <ArrowRightIcon className="h-4 w-4 rotate-180" />
                All articles
              </Link>

              <p className="mt-8 font-mono text-xs uppercase tracking-[0.18em] text-brand-500">
                {post.category}
              </p>
              <h1 className="mt-4 text-3xl font-bold leading-tight tracking-tight text-cloud sm:text-4xl lg:text-[2.75rem]">
                {post.title}
              </h1>
              <p className="mt-5 text-lg leading-relaxed text-mist">
                {post.excerpt}
              </p>

              <div className="mt-7 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-mist">
                <span className="text-cloud">{post.author}</span>
                <span aria-hidden="true">·</span>
                <time dateTime={post.published_at}>
                  {formatDate(post.published_at)}
                </time>
                <span aria-hidden="true">·</span>
                <span>{post.read_time}</span>
              </div>
            </div>
          </div>
        </header>

        {/* Cover */}
        {post.image_url ? (
          <div className="container-page -mt-2 pt-12">
            <div className="relative mx-auto aspect-[16/9] max-w-4xl overflow-hidden rounded-2xl border border-line">
              <Image
                src={post.image_url}
                alt={post.title}
                fill
                sizes="(max-width: 1024px) 100vw, 900px"
                className="object-cover"
                priority
              />
            </div>
          </div>
        ) : null}

        {/* Body */}
        <div className="container-page py-16">
          <div className="mx-auto max-w-3xl">
            {/*
              Post HTML is authored by an admin through the panel, so it is
              trusted content, the same trust model as any CMS rich-text field.
            */}
            <div
              className="article-body"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />

            <div className="mt-14 flex flex-col gap-6 border-t border-line pt-8 sm:flex-row sm:items-center sm:justify-between">
              <ShareLinks title={post.title} url={postUrl} />
              <Link
                href="/blogs"
                className="inline-flex items-center gap-2 text-sm font-medium text-brand-400 hover:text-brand-500"
              >
                Back to all articles
                <ArrowRightIcon className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>

        {/* Newsletter */}
        <Section tone="raised">
          <div className="mx-auto max-w-2xl text-center">
            <SectionHeading
              eyebrow="Newsletter"
              title="Subscribe for more"
              description="Insights on software, marketing, and growth delivered to your inbox."
            />
            <div className="mx-auto max-w-md">
              <NewsletterForm />
            </div>
          </div>
        </Section>

        {/* Related */}
        {related.length > 0 ? (
          <Section>
            <SectionHeading eyebrow="Keep reading" title="Related articles" />
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {related.map((item) => (
                <BlogCard key={item.id} post={item} />
              ))}
            </div>
          </Section>
        ) : null}
      </article>
    </>
  );
}
