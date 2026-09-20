-- Simple finance dashboard — run in Supabase → SQL Editor (safe to re-run)

alter table public.finance_projects
  add column if not exists sale_type text not null default 'service';

alter table public.finance_projects
  add column if not exists item_name text not null default '';

alter table public.finance_projects
  add column if not exists paid_amount numeric(14, 2) not null default 0 check (paid_amount >= 0);

alter table public.finance_projects
  add column if not exists payments jsonb not null default '[]'::jsonb;

alter table public.finance_projects
  add column if not exists cost_amount numeric(14, 2) not null default 0 check (cost_amount >= 0);

alter table public.finance_projects
  add column if not exists costs jsonb not null default '[]'::jsonb;

alter table public.finance_projects
  add column if not exists arfat_took numeric(14, 2) not null default 0 check (arfat_took >= 0);

alter table public.finance_projects
  add column if not exists khalid_took numeric(14, 2) not null default 0 check (khalid_took >= 0);

alter table public.finance_projects
  drop constraint if exists finance_projects_sale_type_check;

alter table public.finance_projects
  add constraint finance_projects_sale_type_check
  check (sale_type in ('service', 'equipment'));

-- Copy old data into new columns where possible
update public.finance_projects
set item_name = coalesce(nullif(trim(item_name), ''), nullif(trim(title), ''), client_name)
where nullif(trim(item_name), '') is null;

notify pgrst, 'reload schema';
