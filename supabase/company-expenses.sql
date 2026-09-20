-- General company expenses (not tied to a client sale).
-- Run once in Supabase → SQL Editor. Safe to re-run.

create table if not exists public.finance_company_expenses (
  id            uuid primary key default gen_random_uuid(),
  description   text not null,
  amount        numeric(14, 2) not null check (amount > 0),
  expense_date  date not null default current_date,
  notes         text not null default '',
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  deleted_at    timestamptz
);

create index if not exists finance_company_expenses_date_idx
  on public.finance_company_expenses (expense_date desc)
  where deleted_at is null;

drop trigger if exists finance_company_expenses_set_updated_at on public.finance_company_expenses;
create trigger finance_company_expenses_set_updated_at
  before update on public.finance_company_expenses
  for each row execute function public.set_updated_at();

alter table public.finance_company_expenses enable row level security;

drop policy if exists "finance company expenses admin all" on public.finance_company_expenses;
create policy "finance company expenses admin all"
  on public.finance_company_expenses for all to authenticated
  using (true) with check (true);

notify pgrst, 'reload schema';
