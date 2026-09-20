-- Spend installments with dates — run in Supabase → SQL Editor (safe to re-run)

alter table public.finance_projects
  add column if not exists costs jsonb not null default '[]'::jsonb;

update public.finance_projects
set costs = jsonb_build_array(
  jsonb_build_object('amount', cost_amount, 'date', current_date::text)
)
where cost_amount > 0
  and (costs is null or costs = '[]'::jsonb);

notify pgrst, 'reload schema';
