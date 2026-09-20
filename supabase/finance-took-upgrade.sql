-- Money took by Arafat / Khalid — run in Supabase → SQL Editor (safe to re-run)

alter table public.finance_projects
  add column if not exists arfat_took numeric(14, 2) not null default 0 check (arfat_took >= 0);

alter table public.finance_projects
  add column if not exists khalid_took numeric(14, 2) not null default 0 check (khalid_took >= 0);

notify pgrst, 'reload schema';
