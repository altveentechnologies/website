-- Manual cash-on-hand figure for the finance dashboard.
-- Run once in Supabase → SQL Editor. Safe to re-run.

create table if not exists public.finance_cash_on_hand (
  id          integer primary key default 1 check (id = 1),
  amount      numeric(14, 2) not null default 0 check (amount >= 0),
  notes       text not null default '',
  updated_at  timestamptz not null default now()
);

insert into public.finance_cash_on_hand (id, amount)
values (1, 0)
on conflict (id) do nothing;

drop trigger if exists finance_cash_on_hand_set_updated_at on public.finance_cash_on_hand;
create trigger finance_cash_on_hand_set_updated_at
  before update on public.finance_cash_on_hand
  for each row execute function public.set_updated_at();

alter table public.finance_cash_on_hand enable row level security;

drop policy if exists "finance cash on hand admin all" on public.finance_cash_on_hand;
create policy "finance cash on hand admin all"
  on public.finance_cash_on_hand for all to authenticated
  using (true) with check (true);

notify pgrst, 'reload schema';
