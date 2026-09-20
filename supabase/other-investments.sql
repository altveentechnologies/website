-- Friend / other investments — money borrowed when you do not have enough.
-- Run once in Supabase → SQL Editor. Safe to re-run.

create table if not exists public.finance_other_investments (
  id           uuid primary key default gen_random_uuid(),
  lender_name  text not null,
  amount       numeric(14, 2) not null check (amount > 0),
  given_date   date not null default current_date,
  repaid_date  date,
  notes        text not null default '',
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now(),
  deleted_at   timestamptz
);

create index if not exists finance_other_investments_given_idx
  on public.finance_other_investments (given_date desc)
  where deleted_at is null;

drop trigger if exists finance_other_investments_set_updated_at on public.finance_other_investments;
create trigger finance_other_investments_set_updated_at
  before update on public.finance_other_investments
  for each row execute function public.set_updated_at();

alter table public.finance_other_investments enable row level security;

drop policy if exists "finance other investments admin all" on public.finance_other_investments;
create policy "finance other investments admin all"
  on public.finance_other_investments for all to authenticated
  using (true) with check (true);

notify pgrst, 'reload schema';
