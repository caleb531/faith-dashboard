-- reset everything so this migration script can be re-run
alter table public.widgets drop constraint if exists fk_dashboard_id;
alter table public.dashboards drop constraint if exists unique_dashboard_id;

-- Ensure that dashboard table's id (part of a composite primary key) is unique
-- in itself
alter table public.dashboards
    add constraint unique_dashboard_id
    unique(id);

-- create column for associating a widget with a particular dashboard
alter table public.widgets
    add column if not exists dashboard_id UUID,
    add constraint fk_dashboard_id
        foreign key(dashboard_id)
        references public.dashboards(id);

-- associate every widget with the user's only dashboard
update public.widgets set dashboard_id = (
  select id from dashboards
    where dashboards.user_id = widgets.user_id
    order by updated_at desc
    limit 1
) where dashboard_id is null;
