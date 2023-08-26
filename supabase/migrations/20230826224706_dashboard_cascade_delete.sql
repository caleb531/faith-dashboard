-- ensure that widgets are automatically deleted when dashboard is deleted (we
-- forgot to do this when this foreign-key constraint was originally added back
-- in the 'multiple_dashboards' migration, so we must add it as part of a new
-- migration by dropping and recreating the constraint; see
-- <https://stackoverflow.com/questions/1571581/how-to-add-on-delete-cascade-in-alter-table-statement>)
alter table public.widgets
  drop constraint if exists fk_dashboard_id,
  add constraint fk_dashboard_id
    foreign key(dashboard_id)
    references public.dashboards(id)
    on delete cascade;

