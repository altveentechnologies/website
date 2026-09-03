-- Testimonials table + the six reviews from the original site.
-- Safe to re-run: idempotent DDL and inserts skip duplicates.

create table if not exists public.testimonials (
  id                uuid primary key default gen_random_uuid(),
  client_name       text not null,
  quote             text not null,
  detail            text not null default '',
  rating            numeric(2,1) not null default 5.0
                      check (rating >= 0 and rating <= 5),
  published         boolean not null default true,
  show_on_homepage  boolean not null default true,
  show_on_services  boolean not null default true,
  sort_order        integer not null default 0,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

create unique index if not exists testimonials_client_name_active_idx
  on public.testimonials (client_name) where deleted_at is null;

create index if not exists testimonials_published_idx
  on public.testimonials (published, sort_order);

drop trigger if exists testimonials_set_updated_at on public.testimonials;
create trigger testimonials_set_updated_at
  before update on public.testimonials
  for each row execute function public.set_updated_at();

alter table public.testimonials enable row level security;

drop policy if exists "testimonials public read published" on public.testimonials;
create policy "testimonials public read published"
  on public.testimonials for select to anon, authenticated
  using (published = true);

drop policy if exists "testimonials admin all" on public.testimonials;
create policy "testimonials admin all"
  on public.testimonials for all to authenticated using (true) with check (true);

insert into public.testimonials
  (client_name, quote, detail, rating, published, show_on_homepage, show_on_services, sort_order)
values
  (
    'Indian Spices and Groceries',
    'Altveen feels like an extension of our team. They handle our e-commerce, website, and marketing under one roof, so we never worry about coordination.',
    'San Francisco, USA · E-commerce store & marketing',
    4.9, true, true, true, 1
  ),
  (
    'Lotus Cuisine of India',
    'From menu updates to online campaigns, they move fast and keep us informed. Our online orders and reservations have grown steadily.',
    'San Rafael, USA · Restaurant & digital growth',
    5.0, true, true, true, 2
  ),
  (
    'Lotus Markets',
    'They rebuilt our Shopify presence and now manage performance ads. We see clear reports every week and know exactly what is working.',
    'San Rafael, USA · Shopify store & ads',
    4.8, true, true, true, 3
  ),
  (
    'Lotus Corner Market',
    'A dependable partner for both tech and marketing. They keep our storefront fast, stable, and always aligned with our campaigns.',
    'San Francisco, USA · Store management & marketing',
    5.0, true, true, true, 4
  ),
  (
    'Hotel Sea View',
    'For our hotel, Altveen delivered a clean, fast website and ongoing digital marketing that keeps us visible in a competitive market.',
    'Srinagar, J&K · Website & digital marketing',
    5.0, true, true, true, 5
  ),
  (
    'Atfaal Innovations',
    'They understand startups. From branding to web to campaigns, everything is data-driven and focused on helping us grow.',
    'Srinagar, J&K · Product site & growth support',
    4.9, true, true, true, 6
  )
on conflict (client_name) do nothing;
