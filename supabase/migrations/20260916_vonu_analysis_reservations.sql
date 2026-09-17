create table if not exists public.vonu_analysis_reservations (
  id uuid primary key,
  device_id uuid not null references public.vonu_device_usage(device_id) on delete cascade,
  access_source text not null check (access_source in ('free','credit')),
  status text not null default 'reserved' check (status in ('reserved','committed','released')),
  created_at timestamptz not null default now(),
  finalized_at timestamptz
);

alter table public.vonu_analysis_reservations enable row level security;
revoke all on public.vonu_analysis_reservations from anon, authenticated;

create or replace function public.reserve_vonu_device_analysis(p_device_id uuid, p_reservation_id uuid)
returns table (allowed boolean, access_source text, credits_remaining integer, free_used boolean, reservation_id uuid)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_credits integer;
  v_free_used boolean;
begin
  insert into public.vonu_device_usage(device_id) values (p_device_id)
  on conflict (device_id) do nothing;

  update public.vonu_device_usage as u
     set free_used = true,
         lifetime_analyses = u.lifetime_analyses + 1,
         updated_at = now(),
         last_seen_at = now()
   where u.device_id = p_device_id and u.free_used = false
  returning u.credits, u.free_used into v_credits, v_free_used;

  if found then
    insert into public.vonu_analysis_reservations(id, device_id, access_source)
    values (p_reservation_id, p_device_id, 'free');
    return query select true, 'free'::text, v_credits, true, p_reservation_id;
    return;
  end if;

  update public.vonu_device_usage as u
     set credits = u.credits - 1,
         lifetime_analyses = u.lifetime_analyses + 1,
         updated_at = now(),
         last_seen_at = now()
   where u.device_id = p_device_id and u.credits > 0
  returning u.credits, u.free_used into v_credits, v_free_used;

  if found then
    insert into public.vonu_analysis_reservations(id, device_id, access_source)
    values (p_reservation_id, p_device_id, 'credit');
    return query select true, 'credit'::text, v_credits, v_free_used, p_reservation_id;
    return;
  end if;

  update public.vonu_device_usage as u
     set last_seen_at = now(), updated_at = now()
   where u.device_id = p_device_id;

  select u.credits, u.free_used into v_credits, v_free_used
    from public.vonu_device_usage as u where u.device_id = p_device_id;

  return query select false, 'blocked'::text, coalesce(v_credits, 0), coalesce(v_free_used, true), null::uuid;
end;
$$;

create or replace function public.commit_vonu_device_analysis(p_reservation_id uuid)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  v_count integer;
begin
  update public.vonu_analysis_reservations
     set status = 'committed', finalized_at = now()
   where id = p_reservation_id and status = 'reserved';
  get diagnostics v_count = row_count;
  return v_count = 1;
end;
$$;

create or replace function public.release_vonu_device_analysis(p_reservation_id uuid)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  v_device_id uuid;
  v_source text;
  v_count integer;
begin
  select r.device_id, r.access_source into v_device_id, v_source
    from public.vonu_analysis_reservations r
   where r.id = p_reservation_id and r.status = 'reserved'
   for update;

  if not found then return false; end if;

  if v_source = 'free' then
    update public.vonu_device_usage as u
       set free_used = false,
           lifetime_analyses = greatest(0, u.lifetime_analyses - 1),
           updated_at = now(),
           last_seen_at = now()
     where u.device_id = v_device_id;
  elsif v_source = 'credit' then
    update public.vonu_device_usage as u
       set credits = u.credits + 1,
           lifetime_analyses = greatest(0, u.lifetime_analyses - 1),
           updated_at = now(),
           last_seen_at = now()
     where u.device_id = v_device_id;
  end if;

  update public.vonu_analysis_reservations
     set status = 'released', finalized_at = now()
   where id = p_reservation_id and status = 'reserved';
  get diagnostics v_count = row_count;
  return v_count = 1;
end;
$$;

revoke all on function public.reserve_vonu_device_analysis(uuid, uuid) from public, anon, authenticated;
revoke all on function public.commit_vonu_device_analysis(uuid) from public, anon, authenticated;
revoke all on function public.release_vonu_device_analysis(uuid) from public, anon, authenticated;
grant execute on function public.reserve_vonu_device_analysis(uuid, uuid) to service_role;
grant execute on function public.commit_vonu_device_analysis(uuid) to service_role;
grant execute on function public.release_vonu_device_analysis(uuid) to service_role;
