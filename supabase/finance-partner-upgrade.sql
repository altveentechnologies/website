-- Run this in Supabase → SQL Editor if you see:
-- "Could not find the 'partner' column of 'finance_transactions' in the schema cache"
-- Safe to re-run.

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
