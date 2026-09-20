-- Director accounts (Arafat / Khalid) — money took & invested with dates.
-- Run once in Supabase → SQL Editor. Safe to re-run.

create table if not exists public.finance_director_entries (
  id               uuid primary key default gen_random_uuid(),
  director         text not null check (director in ('arfat', 'khalid')),
  entry_type       text not null check (entry_type in ('took', 'invested')),
  amount           numeric(14, 2) not null check (amount > 0),
  transaction_date date not null default current_date,
  project_id       uuid references public.finance_projects (id) on delete set null,
  notes            text not null default '',
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now(),
  deleted_at       timestamptz
);

create index if not exists finance_director_entries_director_idx
  on public.finance_director_entries (director, transaction_date desc)
  where deleted_at is null;

create index if not exists finance_director_entries_project_idx
  on public.finance_director_entries (project_id)
  where deleted_at is null;

drop trigger if exists finance_director_entries_set_updated_at on public.finance_director_entries;
create trigger finance_director_entries_set_updated_at
  before update on public.finance_director_entries
  for each row execute function public.set_updated_at();

alter table public.finance_director_entries enable row level security;

drop policy if exists "finance director entries admin all" on public.finance_director_entries;
create policy "finance director entries admin all"
  on public.finance_director_entries for all to authenticated
  using (true) with check (true);

notify pgrst, 'reload schema';
