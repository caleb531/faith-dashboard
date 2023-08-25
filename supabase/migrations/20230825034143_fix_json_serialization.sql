-- unwrap stringified JSON to be proper JSON objects (so they can be queried
-- with -> and ->>)

update public.dashboards
  set raw_data = (raw_data->>0)::jsonb
  where (raw_data->>0)::jsonb is not null;

update public.widgets
  set raw_data = (raw_data->>0)::jsonb
  where (raw_data->>0)::jsonb is not null;
