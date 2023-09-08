create table if not exists public.widgets (
  id uuid not null,
  raw_data json not null,
  user_id uuid references auth.users not null,
  client_id uuid,
  updated_at timestamptz,
  dashboard_id uuid references public.dashboards(id) on delete cascade not null,
  primary key(id, user_id, dashboard_id)
);

alter table public.widgets enable row level security;

drop policy if exists "Only the user owning the widget can view it." on public.widgets;
create policy "Only the user owning the widget can view it."
  on public.widgets for select
  using (auth.uid() = user_id);

drop policy if exists "Users can insert their own widget." on public.widgets;
create policy "Users can insert their own widget."
  on public.widgets for insert
  with check (auth.uid() = user_id);

drop policy if exists "Users can update their own widget." on public.widgets;
create policy "Users can update their own widget."
  on public.widgets for update
  using (auth.uid() = user_id);

drop policy if exists "Users can delete their own widget." on public.widgets;
create policy "Users can delete their own widget."
  on public.widgets for delete
  using (auth.uid() = user_id);
