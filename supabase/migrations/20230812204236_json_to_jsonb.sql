-- convert all json-type columns to jsonb (per Supabase's official
-- recommendation: <https://supabase.com/docs/guides/database/json>)
alter table public.dashboards
  alter column raw_data
    set data type jsonb;

alter table public.widgets
  alter column raw_data
    set data type jsonb;
