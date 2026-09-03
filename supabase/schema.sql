-- =====================================================================
-- Altveen Technologies — Supabase schema
-- Run this once in the Supabase dashboard: SQL Editor -> New query -> Run.
-- Safe to re-run: everything is idempotent.
-- =====================================================================

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------
-- Blog posts
-- ---------------------------------------------------------------------
create table if not exists public.posts (
  id           uuid primary key default gen_random_uuid(),
  slug         text not null,
  title        text not null,
  excerpt      text not null default '',
  content      text not null default '',        -- HTML
  author       text not null default 'Altveen Team',
  category     text not null default 'General',
  image_url    text,
  read_time    text not null default '5 min read',
  published    boolean not null default true,
  published_at timestamptz not null default now(),
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now(),
  deleted_at   timestamptz
);

create unique index if not exists posts_slug_active_idx
  on public.posts (slug) where deleted_at is null;
create index if not exists posts_published_idx
  on public.posts (published, published_at desc) where deleted_at is null;
create index if not exists posts_category_idx   on public.posts (category) where deleted_at is null;

-- keep updated_at fresh
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists posts_set_updated_at on public.posts;
create trigger posts_set_updated_at
  before update on public.posts
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------
-- Lead capture tables
-- ---------------------------------------------------------------------
create table if not exists public.consultation_requests (
  id           uuid primary key default gen_random_uuid(),
  name         text not null,
  email        text not null,
  phone        text not null,
  services     text[] not null default '{}',
  source_page  text,
  created_at   timestamptz not null default now(),
  deleted_at   timestamptz
);

create table if not exists public.contact_submissions (
  id           uuid primary key default gen_random_uuid(),
  name         text not null,
  email        text not null,
  company      text,
  message      text not null,
  created_at   timestamptz not null default now(),
  deleted_at   timestamptz
);

create table if not exists public.newsletter_subscribers (
  id           uuid primary key default gen_random_uuid(),
  email        text not null,
  source_page  text,
  created_at   timestamptz not null default now(),
  deleted_at   timestamptz
);

create unique index if not exists newsletter_subscribers_email_active_idx
  on public.newsletter_subscribers (email) where deleted_at is null;

-- ---------------------------------------------------------------------
-- Row Level Security
--
-- Model:
--   * anon  -> may READ published posts. Nothing else.
--   * authenticated (your admin login) -> full read/write on posts,
--     and read access to submitted leads.
--   * Writes to the lead tables happen server-side with the service_role
--     key, which bypasses RLS. No anon insert policy is granted, so the
--     public can never write directly to these tables from the browser.
-- ---------------------------------------------------------------------
alter table public.posts                  enable row level security;
alter table public.consultation_requests  enable row level security;
alter table public.contact_submissions    enable row level security;
alter table public.newsletter_subscribers enable row level security;

-- posts: public can read only published rows
drop policy if exists "posts public read published" on public.posts;
create policy "posts public read published"
  on public.posts for select
  to anon, authenticated
  using (published = true and deleted_at is null);

-- posts: signed-in admins can do everything (incl. see drafts)
drop policy if exists "posts admin all" on public.posts;
create policy "posts admin all"
  on public.posts for all
  to authenticated
  using (true)
  with check (true);

-- leads: signed-in admins can read submissions
drop policy if exists "consultations admin read" on public.consultation_requests;
create policy "consultations admin read"
  on public.consultation_requests for select to authenticated using (true);

drop policy if exists "contacts admin read" on public.contact_submissions;
create policy "contacts admin read"
  on public.contact_submissions for select to authenticated using (true);

drop policy if exists "subscribers admin read" on public.newsletter_subscribers;
create policy "subscribers admin read"
  on public.newsletter_subscribers for select to authenticated using (true);

-- ---------------------------------------------------------------------
-- Clients
--
-- Drives the /clients page and the "trusted by" marquee on the home page.
-- Adding a client in the admin panel is all that's needed — no code change.
-- ---------------------------------------------------------------------
create table if not exists public.clients (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  sector      text not null default '',          -- e.g. "San Francisco, USA"
  description text not null default '',
  url         text,
  image_url   text,
  region      text not null default 'international'
                check (region in ('international', 'local')),
  in_marquee  boolean not null default true,     -- show in the home-page scroller
  sort_order  integer not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  deleted_at  timestamptz
);

create index if not exists clients_region_idx
  on public.clients (region, sort_order) where deleted_at is null;

drop trigger if exists clients_set_updated_at on public.clients;
create trigger clients_set_updated_at
  before update on public.clients
  for each row execute function public.set_updated_at();

alter table public.clients enable row level security;

-- Clients are public information — anyone may read them.
drop policy if exists "clients public read" on public.clients;
create policy "clients public read"
  on public.clients for select to anon, authenticated using (deleted_at is null);

drop policy if exists "clients admin all" on public.clients;
create policy "clients admin all"
  on public.clients for all to authenticated using (true) with check (true);

-- ---------------------------------------------------------------------
-- Testimonials / reviews
--
-- Managed from /admin/testimonials. Controls which pages each review
-- appears on via show_on_homepage and show_on_services.
-- ---------------------------------------------------------------------
create table if not exists public.testimonials (
  id                uuid primary key default gen_random_uuid(),
  client_name       text not null,
  quote             text not null,
  detail            text not null default '',     -- e.g. "San Francisco, USA · E-commerce"
  rating            numeric(2,1) not null default 5.0
                      check (rating >= 0 and rating <= 5),
  published         boolean not null default true,
  show_on_homepage  boolean not null default true,
  show_on_services  boolean not null default true,
  sort_order        integer not null default 0,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now(),
  deleted_at        timestamptz
);

create unique index if not exists testimonials_client_name_active_idx
  on public.testimonials (client_name) where deleted_at is null;

create index if not exists testimonials_published_idx
  on public.testimonials (published, sort_order) where deleted_at is null;

drop trigger if exists testimonials_set_updated_at on public.testimonials;
create trigger testimonials_set_updated_at
  before update on public.testimonials
  for each row execute function public.set_updated_at();

alter table public.testimonials enable row level security;

drop policy if exists "testimonials public read published" on public.testimonials;
create policy "testimonials public read published"
  on public.testimonials for select to anon, authenticated
  using (published = true and deleted_at is null);
create policy "testimonials admin all"
  on public.testimonials for all to authenticated using (true) with check (true);

-- ---------------------------------------------------------------------
-- Storage bucket for client logos / photos uploaded via the admin panel.
-- Public read so <Image> can load them; writes happen server-side with the
-- secret key, so no anon insert policy is granted.
-- ---------------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('client-images', 'client-images', true)
on conflict (id) do update set public = true;

drop policy if exists "client images public read" on storage.objects;
create policy "client images public read"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'client-images');
