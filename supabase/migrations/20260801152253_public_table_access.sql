-- Explicitly expose the dashboard data tables through Supabase's Data and
-- GraphQL APIs; row-level security policies still determine which rows each
-- API role can read or modify
grant select, insert, update, delete on table public.dashboards, public.widgets
  to anon, authenticated, service_role;
