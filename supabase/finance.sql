-- Business finance tracking for the admin panel (client jobs, payments, costs, profit).
-- Run once in Supabase → SQL Editor. Safe to re-run.

-- ---------------------------------------------------------------------
-- Client jobs / projects
-- ---------------------------------------------------------------------
create table if not exists public.finance_projects (
  id             uuid primary key default gen_random_uuid(),
  client_id      uuid references public.clients (id) on delete set null,
  client_name    text not null,
  title          text not null,
  services       text[] not null default '{}',
  currency       text not null default 'INR'
                   check (currency in ('INR', 'USD')),
  quoted_amount  numeric(14, 2) not null default 0 check (quoted_amount >= 0),
  budget_amount  numeric(14, 2) not null default 0 check (budget_amount >= 0),
  status         text not null default 'active'
                   check (status in ('active', 'completed', 'on_hold')),
  notes          text not null default '',
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now(),
  deleted_at     timestamptz
);

create index if not exists finance_projects_client_idx
  on public.finance_projects (client_name) where deleted_at is null;
create index if not exists finance_projects_status_idx
  on public.finance_projects (status, updated_at desc) where deleted_at is null;

drop trigger if exists finance_projects_set_updated_at on public.finance_projects;
create trigger finance_projects_set_updated_at
  before update on public.finance_projects
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------
-- Ledger: client payments, service costs, equipment, vendor payouts
-- ---------------------------------------------------------------------
create table if not exists public.finance_transactions (
  id                 uuid primary key default gen_random_uuid(),
  project_id         uuid not null references public.finance_projects (id) on delete cascade,
  entry_type         text not null check (entry_type in (
    'client_payment',
    'service_expense',
    'equipment_expense',
    'vendor_payment',
    'other_income',
    'other_expense',
    'partner_taken',
    'partner_invested'
  )),
  partner            text not null default ''
                       check (partner in ('', 'arfat', 'khalid')),
  service_name       text not null default '',
  amount             numeric(14, 2) not null check (amount >= 0),
  transaction_date   date not null default current_date,
  paid_to            text not null default '',
  equipment_details  text not null default '',
  notes              text not null default '',
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now(),
  deleted_at         timestamptz
);

create index if not exists finance_transactions_project_idx
  on public.finance_transactions (project_id, transaction_date desc)
  where deleted_at is null;

drop trigger if exists finance_transactions_set_updated_at on public.finance_transactions;
create trigger finance_transactions_set_updated_at
  before update on public.finance_transactions
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------
-- RLS — admin only (authenticated). No public access.
-- ---------------------------------------------------------------------
alter table public.finance_projects enable row level security;
alter table public.finance_transactions enable row level security;

drop policy if exists "finance projects admin all" on public.finance_projects;
create policy "finance projects admin all"
  on public.finance_projects for all to authenticated
  using (true) with check (true);

drop policy if exists "finance transactions admin all" on public.finance_transactions;
create policy "finance transactions admin all"
  on public.finance_transactions for all to authenticated
  using (true) with check (true);

-- ---------------------------------------------------------------------
-- Upgrade existing installs (safe to re-run)
-- ---------------------------------------------------------------------
alter table public.finance_transactions
  add column if not exists partner text not null default '';

alter table public.finance_transactions
  drop constraint if exists finance_transactions_entry_type_check;

alter table public.finance_transactions
  add constraint finance_transactions_entry_type_check
  check (entry_type in (
    'client_payment',
    'service_expense',
    'equipment_expense',
    'vendor_payment',
    'other_income',
    'other_expense',
    'partner_taken',
    'partner_invested'
  ));

alter table public.finance_transactions
  drop constraint if exists finance_transactions_partner_check;

alter table public.finance_transactions
  add constraint finance_transactions_partner_check
  check (partner in ('', 'arfat', 'khalid'));

-- Refresh Supabase API schema cache
notify pgrst, 'reload schema';
