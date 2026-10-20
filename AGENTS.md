# Supabase SQL migrations

New `public` tables are not exposed to the Data API automatically. Every new public table in a migration must explicitly enable RLS and grant only needed privileges to `service_role`, `authenticated` or `anon` in the same migration. Use `-- data-api: private public.table_name` for tables not exposed to Supabase's Data API. See `docs/SUPABASE_DATA_API_GRANTS.md` and keep the SQL grant CI test green. Never globally grant `anon` access.
