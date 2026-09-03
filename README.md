# Altveen Technologies Website

Website for **Altveen Technologies Pvt Ltd**, built with Next.js and Supabase.

## Tech stack

| Layer      | Choice                                             |
| ---------- | -------------------------------------------------- |
| Framework  | Next.js 16 (App Router, React 19, TypeScript)      |
| Styling    | Tailwind CSS v4                                    |
| Motion     | Framer Motion                                      |
| Database   | Supabase (Postgres + Row Level Security)           |
| Auth       | Supabase Auth                                      |
| Email      | Nodemailer over SMTP                               |
| Hosting    | Netlify                                            |

## What lives where

- **Supabase** — blog posts, consultation requests, contact messages, newsletter subscribers.
- **`src/lib/content.ts`** — services, clients, values, FAQs, stats. Type-checked, no DB round-trip; edit the file and redeploy to change them.

## Public routes

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



### 1. Install

```bash
npm install
```

### 2. Create the Supabase project

1. Go to [supabase.com](https://supabase.com) → **New project**. Pick a region close to your users (e.g. Mumbai / `ap-south-1`).
2. Once it's ready, open **SQL Editor → New query**, paste the whole of [`supabase/schema.sql`](supabase/schema.sql), and hit **Run**. This creates the tables, indexes and Row Level Security policies.

### 3. Add your keys

Copy `.env.example` to `.env.local` and fill in the values:

| Variable | Where to find it |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Project Settings → Data API → Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Project Settings → API Keys → `anon` / `public` |
| `SUPABASE_SERVICE_ROLE_KEY` | Project Settings → API Keys → `service_role` |

> The `service_role` key bypasses RLS. It is only ever read on the server. Never commit it and never prefix it with `NEXT_PUBLIC_`.

Also set the SMTP variables for contact and newsletter forms.

### 4. Import the existing blog posts

```bash
npm run seed
```

This upserts the starter articles into the `posts` table. Safe to re-run.

### 5. Run it

```bash
npm run dev
```

Open <http://localhost:3000>.

---

## Blog content

Posts are stored in Supabase. Use `npm run seed` for the starter articles, or edit rows directly in the Supabase table editor. Content is HTML (`<p>`, `<h2>`, `<h3>`, `<ul>`, `<blockquote>`, `<a>`, `<pre><code>`, `<img>`).

## Form submissions

Every consultation request, contact message and newsletter signup is written to Supabase and emailed to `RECEIVER_EMAIL`. If SMTP fails, the lead is still saved in the database.

---

## Deploying to Netlify

1. Push this folder to a GitHub repo.
2. In Netlify: **Add new site → Import an existing project** → connect the repo.
3. Build command: `npm run build`. Netlify auto-detects Next.js.
4. Add the environment variables from `.env.local` under **Site configuration → Environment variables**, and set `NEXT_PUBLIC_SITE_URL` to your production domain (e.g. `https://altveen.com`).
5. Deploy.

After adding a custom domain, update `NEXT_PUBLIC_SITE_URL` and redeploy so the sitemap, canonical URLs and social share links point at the right host.

## Commands

```bash
npm run dev        # dev server
npm run build      # production build
npm run start      # serve the production build
npm run typecheck  # TypeScript, no emit
npm run seed       # import starter blog posts
```

---

© 2025 Altveen Technologies Pvt Ltd.
