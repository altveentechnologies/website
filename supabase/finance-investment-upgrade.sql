-- Partner investment columns — run in Supabase → SQL Editor (safe to re-run)

alter table public.finance_projects
  add column if not exists arfat_invested numeric(14, 2) not null default 0 check (arfat_invested >= 0);

alter table public.finance_projects
  add column if not exists khalid_invested numeric(14, 2) not null default 0 check (khalid_invested >= 0);

notify pgrst, 'reload schema';
