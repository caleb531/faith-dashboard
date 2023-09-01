-- ensure that dashboards are automatically deleted when a user is deleted (this
-- will automatically delete widgets as well, since cascade-delete is already
-- configured for the widgets table if a dashboard is deleted)
alter table public.dashboards
  drop constraint if exists fk_user_id,
  add constraint fk_user_id
    foreign key(user_id)
    references auth.users(id)
    on delete cascade;

