-- ensure that every dashboard in the system has a name defined if it doesn't
-- already

update public.dashboards
set raw_data = jsonb_set(
    raw_data,
    '{name}',
    case
        when row_num = 1 then '"Main Dashboard"'
        when row_num = 2 then '"Unnamed Dashboard"'
        else to_jsonb(concat('Unnamed Dashboard ', row_num - 1))
    end
  )
  from (
      select
          id,
          row_number() over (partition by user_id order by updated_at desc) as row_num
      from public.dashboards
  ) as ranked_dashboards
  where public.dashboards.id = ranked_dashboards.id
  and public.dashboards.raw_data->>'name' is null;
