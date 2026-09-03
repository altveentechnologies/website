# Altveen Technologies Website

Marketing site for **Altveen Technologies Pvt Ltd**, built with Next.js and Supabase.

## Tech stack

| Layer      | Choice                                             |
| ---------- | -------------------------------------------------- |
| Framework  | Next.js 16 (App Router, React 19, TypeScript)      |
| Styling    | Tailwind CSS v4                                    |
| Motion     | Framer Motion                                      |
| Database   | Supabase (Postgres + Row Level Security)           |
| Auth       | Supabase Auth (admin panel only)                   |
| Email      | Nodemailer over SMTP                               |
| Hosting    | Vercel                                             |

## What lives where

- **Supabase** — blog posts, consultation requests, contact messages, newsletter subscribers.
- **`src/lib/content.ts`** — services, clients, testimonials, values, FAQs, stats. Type-checked, no DB round-trip; edit the file and redeploy to change them.

## Routes

| Route              | Notes                                                  |
| ------------------ | ------------------------------------------------------ |
| `/`                | Hero, differentiators, services, testimonials, blog preview |
| `/about`           | Story, studio, process, values                         |
| `/services`        | Software + marketing services, process                 |
| `/clients`         | International + local clients, industries              |
| `/blogs`           | Live search + category filtering (from Supabase)       |
| `/blogs/[slug]`    | Article, reading progress, sharing, related posts      |
| `/contact`         | Contact details + form                                 |
| `/privacy`, `/terms`, `/refund` | Legal pages                               |
| `/admin`           | Password-protected post manager                        |
| `/admin/submissions` | All form submissions                                 |

---

## Setup

### 1. Install

```bash
npm install
```

### 2. Create the Supabase project

1. Go to [supabase.com](https://supabase.com) → **New project**. Pick a region close to your users (e.g. Mumbai / `ap-south-1`).
2. Once it's ready, open **SQL Editor → New query**, paste the whole of [`supabase/schema.sql`](supabase/schema.sql), and hit **Run**. This creates the tables, indexes and Row Level Security policies.

### 3. Add your keys

Open `.env.local` and fill in the three Supabase values:

| Variable | Where to find it |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Project Settings → Data API → Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Project Settings → API Keys → `anon` / `public` |
| `SUPABASE_SERVICE_ROLE_KEY` | Project Settings → API Keys → `service_role` |

> The `service_role` key bypasses RLS. It is only ever read on the server — never
> commit it and never prefix it with `NEXT_PUBLIC_`.

The SMTP values are already carried over from the previous Flask app.

### 4. Import the existing blog posts

```bash
npm run seed
```

This upserts the nine articles from the old site into the `posts` table. Safe to re-run.

### 5. Create your admin login

In the Supabase dashboard: **Authentication → Users → Add user**, set an email and
password, and tick *Auto Confirm User*. Sign in at `/admin/login`.

To stop anyone else signing themselves up, go to **Authentication → Sign In / Providers**
and disable email sign-ups so accounts can only be created by you from the dashboard.

### 6. Run it

```bash
npm run dev
```

Open <http://localhost:3000>.

---

## Writing blog posts

Go to `/admin` and click **New post**. Content is written as HTML — `<p>`, `<h2>`,
`<h3>`, `<ul>`, `<blockquote>`, `<a>`, `<pre><code>` and `<img>` are all styled by the
article stylesheet. There's a **Preview** toggle above the editor.

- The slug is generated from the title until you edit it yourself.
- Reading time is calculated automatically if you leave the field blank.
- Untick **Published** to keep a post as a draft — it stays hidden from the site.
- Saving revalidates `/`, `/blogs`, the post page and the sitemap, so changes appear
  without a redeploy.

You can also edit posts directly in the Supabase table editor if you prefer.

## Where form submissions go

Every consultation request, contact message and newsletter signup is written to
Supabase **and** emailed to `RECEIVER_EMAIL`. If SMTP fails the lead is still saved —
view them all at `/admin/submissions`.

---

## Deploying to Vercel

1. Push this folder to a GitHub repo.
2. In Vercel: **New Project** → import the repo. It auto-detects Next.js; no build
   settings to change.
3. Add the environment variables under **Settings → Environment Variables** (copy them
   from `.env.local`), and set `NEXT_PUBLIC_SITE_URL` to your real domain, e.g.
   `https://altveen.com`.
4. Deploy.

After adding your custom domain, update `NEXT_PUBLIC_SITE_URL` and redeploy so the
sitemap, canonical URLs and social share links point at the right host.

## Commands

```bash
npm run dev        # dev server
npm run build      # production build
npm run start      # serve the production build
npm run typecheck  # TypeScript, no emit
npm run seed       # import the nine starter blog posts
```

---

© 2025 Altveen Technologies Pvt Ltd.
