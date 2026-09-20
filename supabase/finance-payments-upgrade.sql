-- Client payment dates — run in Supabase → SQL Editor (safe to re-run)

alter table public.finance_projects
  add column if not exists payments jsonb not null default '[]'::jsonb;

-- Backfill old rows that only had paid_amount
update public.finance_projects
set payments = jsonb_build_array(
  jsonb_build_object('amount', paid_amount, 'date', current_date::text)
)
where paid_amount > 0
  and (payments is null or payments = '[]'::jsonb);

notify pgrst, 'reload schema';
