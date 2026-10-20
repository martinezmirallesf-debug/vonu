# Supabase Data API permissions — October 2026

From 2026-10-30 Supabase no longer automatically exposes new `public` tables via its Data API.
The `explicit_data_api_grants_october_2026` migration opted this project into the new behavior on 2026-10-20, preserved existing table/function/sequence grants and RLS, and verified a new-table smoke test.

Official guidance: https://supabase.com/docs/guides/api/securing-your-api
Announcement: https://github.com/orgs/supabase/discussions/45329

## Every new public table must make an API-access decision

Grant access **in the same migration that creates the table**. For server-only API tables:

```sql
CREATE TABLE public.example_jobs (id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY);
ALTER TABLE public.example_jobs ENABLE ROW LEVEL SECURITY;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.example_jobs TO service_role;
-- Grant sequence privileges only when needed for inserts:
GRANT USAGE, SELECT ON SEQUENCE public.example_jobs_id_seq TO service_role;
```

For client access, grant only the operations actually needed, enable RLS and add ownership policies:

```sql
GRANT SELECT ON TABLE public.example_items TO authenticated;
CREATE POLICY "read own items" ON public.example_items
  FOR SELECT TO authenticated USING (user_id = (SELECT auth.uid()));
```

If the table is only accessed via a **direct Postgres connection** and must not be exposed through Supabase's Data API, do not grant to API roles. Include the marker `-- data-api: private public.table_name` in the migration. Enable RLS for all public tables.

For any new RPC intended for supabase-js clients, explicitly `GRANT EXECUTE ON FUNCTION public.function_name(arg_type) TO service_role` or to a narrower appropriate role. Protect `SECURITY DEFINER` functions and use an explicit search_path.

## CI and troubleshooting

`scripts/check-supabase-grants.mjs` checks changed SQL migrations for RLS and an explicit GRANT or private marker on every newly created public table. It does not inspect manual Dashboard changes or validate all RLS policy logic.

If an API call fails with PostgreSQL error `42501`, inspect privileges on the specific table or function and grant *only* the missing operation to the right role. Do not grant all tables to `anon`. Existing tables remain accessible after the cutoff.
