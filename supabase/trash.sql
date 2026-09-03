-- Soft-delete (trash) support for admin-managed content and form submissions.
-- Run once in Supabase → SQL Editor. Safe to re-run.

-- ---------------------------------------------------------------------
-- deleted_at column on every trashable table
-- ---------------------------------------------------------------------
alter table public.posts add column if not exists deleted_at timestamptz;
alter table public.clients add column if not exists deleted_at timestamptz;
alter table public.testimonials add column if not exists deleted_at timestamptz;
alter table public.consultation_requests add column if not exists deleted_at timestamptz;
alter table public.contact_submissions add column if not exists deleted_at timestamptz;
alter table public.newsletter_subscribers add column if not exists deleted_at timestamptz;

create index if not exists posts_active_idx
  on public.posts (published, published_at desc) where deleted_at is null;
create index if not exists clients_active_idx
  on public.clients (region, sort_order) where deleted_at is null;
create index if not exists testimonials_active_idx
  on public.testimonials (published, sort_order) where deleted_at is null;

-- Unique keys only among non-trashed rows so slugs/emails can be reused after trash.
alter table public.posts drop constraint if exists posts_slug_key;
drop index if exists public.posts_slug_key;
create unique index if not exists posts_slug_active_idx
  on public.posts (slug) where deleted_at is null;

drop index if exists public.testimonials_client_name_idx;
create unique index if not exists testimonials_client_name_active_idx
  on public.testimonials (client_name) where deleted_at is null;

alter table public.newsletter_subscribers drop constraint if exists newsletter_subscribers_email_key;
drop index if exists public.newsletter_subscribers_email_key;
create unique index if not exists newsletter_subscribers_email_active_idx
  on public.newsletter_subscribers (email) where deleted_at is null;

-- ---------------------------------------------------------------------
-- Public RLS — hide trashed rows from the site
-- ---------------------------------------------------------------------
drop policy if exists "posts public read published" on public.posts;
create policy "posts public read published"
  on public.posts for select to anon, authenticated
  using (published = true and deleted_at is null);

drop policy if exists "clients public read" on public.clients;
create policy "clients public read"
  on public.clients for select to anon, authenticated
  using (deleted_at is null);

drop policy if exists "testimonials public read published" on public.testimonials;
create policy "testimonials public read published"
  on public.testimonials for select to anon, authenticated
  using (published = true and deleted_at is null);
