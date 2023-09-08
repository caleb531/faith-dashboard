create table if not exists public.dashboards (
  id uuid not null unique,
  raw_data json not null,
  user_id uuid references auth.users on delete cascade not null,
  client_id uuid,
  updated_at timestamptz,
  primary key(id, user_id)
);

alter table public.dashboards enable row level security;

drop policy if exists "Only the user owning the dashboard can view it." on public.dashboards;
create policy "Only the user owning the dashboard can view it."
  on public.dashboards for select
  using (auth.uid() = user_id);

drop policy if exists "Users can insert their own dashboard." on public.dashboards;
create policy "Users can insert their own dashboard."
  on public.dashboards for insert
  with check (auth.uid() = user_id);

drop policy if exists "Users can update their own dashboard." on public.dashboards;
create policy "Users can update their own dashboard."
  on public.dashboards for update
  using (auth.uid() = user_id);

drop policy if exists "Users can delete their own dashboard." on public.dashboards;
create policy "Users can delete their own dashboard."
  on public.dashboards for delete
  using (auth.uid() = user_id);
