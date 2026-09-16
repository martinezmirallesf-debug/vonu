create table if not exists public.vonu_device_usage (
  device_id uuid primary key,
  free_used boolean not null default false,
  credits integer not null default 0 check (credits >= 0),
  lifetime_analyses integer not null default 0 check (lifetime_analyses >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  last_seen_at timestamptz not null default now()
);

create table if not exists public.vonu_device_purchases (
  stripe_checkout_session_id text primary key,
  device_id uuid not null references public.vonu_device_usage(device_id) on delete restrict,
  credits_granted integer not null check (credits_granted > 0),
  amount_total bigint,
  currency text,
  payment_status text,
  stripe_payment_intent_id text,
  created_at timestamptz not null default now()
);

alter table public.vonu_device_usage enable row level security;
alter table public.vonu_device_purchases enable row level security;
revoke all on public.vonu_device_usage from anon, authenticated;
revoke all on public.vonu_device_purchases from anon, authenticated;

create or replace function public.consume_vonu_device_analysis(p_device_id uuid)
returns table (allowed boolean, access_source text, credits_remaining integer, free_used boolean)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_credits integer;
  v_free_used boolean;
begin
  insert into public.vonu_device_usage(device_id)
  values (p_device_id)
  on conflict (device_id) do nothing;

  update public.vonu_device_usage as u
     set free_used = true,
         lifetime_analyses = u.lifetime_analyses + 1,
         updated_at = now(),
         last_seen_at = now()
   where u.device_id = p_device_id
     and u.free_used = false
  returning u.credits, u.free_used into v_credits, v_free_used;

  if found then
    return query select true, 'free'::text, v_credits, true;
    return;
  end if;

  update public.vonu_device_usage as u
     set credits = u.credits - 1,
         lifetime_analyses = u.lifetime_analyses + 1,
         updated_at = now(),
         last_seen_at = now()
   where u.device_id = p_device_id
     and u.credits > 0
  returning u.credits, u.free_used into v_credits, v_free_used;

  if found then
    return query select true, 'credit'::text, v_credits, v_free_used;
    return;
  end if;

  update public.vonu_device_usage as u
     set last_seen_at = now(), updated_at = now()
   where u.device_id = p_device_id;

  select u.credits, u.free_used
    into v_credits, v_free_used
    from public.vonu_device_usage as u
   where u.device_id = p_device_id;

  return query select false, 'blocked'::text, coalesce(v_credits, 0), coalesce(v_free_used, true);
end;
$$;

create or replace function public.grant_vonu_device_pack(
  p_device_id uuid,
  p_stripe_checkout_session_id text,
  p_credits integer,
  p_amount_total bigint default null,
  p_currency text default null,
  p_payment_status text default null,
  p_stripe_payment_intent_id text default null
)
returns table (granted boolean, credits_remaining integer)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_row_count integer := 0;
  v_credits integer;
begin
  if p_credits is null or p_credits <= 0 then
    raise exception 'credits_must_be_positive';
  end if;

  insert into public.vonu_device_usage(device_id)
  values (p_device_id)
  on conflict (device_id) do nothing;

  insert into public.vonu_device_purchases(
    stripe_checkout_session_id,
    device_id,
    credits_granted,
    amount_total,
    currency,
    payment_status,
    stripe_payment_intent_id
  ) values (
    p_stripe_checkout_session_id,
    p_device_id,
    p_credits,
    p_amount_total,
    lower(p_currency),
    p_payment_status,
    p_stripe_payment_intent_id
  )
  on conflict (stripe_checkout_session_id) do nothing;

  get diagnostics v_row_count = row_count;

  if v_row_count = 1 then
    update public.vonu_device_usage as u
       set credits = u.credits + p_credits,
           updated_at = now(),
           last_seen_at = now()
     where u.device_id = p_device_id
    returning u.credits into v_credits;
  else
    select u.credits into v_credits
      from public.vonu_device_usage as u
     where u.device_id = p_device_id;
  end if;

  return query select (v_row_count = 1), coalesce(v_credits, 0);
end;
$$;

create or replace function public.get_vonu_device_entitlement(p_device_id uuid)
returns table (free_used boolean, credits_remaining integer, lifetime_analyses integer)
language sql
security definer
set search_path = public
as $$
  select u.free_used, u.credits, u.lifetime_analyses
  from public.vonu_device_usage u
  where u.device_id = p_device_id
  union all
  select false, 0, 0
  where not exists (select 1 from public.vonu_device_usage u2 where u2.device_id = p_device_id)
  limit 1;
$$;

revoke all on function public.consume_vonu_device_analysis(uuid) from public, anon, authenticated;
revoke all on function public.grant_vonu_device_pack(uuid, text, integer, bigint, text, text, text) from public, anon, authenticated;
revoke all on function public.get_vonu_device_entitlement(uuid) from public, anon, authenticated;
grant execute on function public.consume_vonu_device_analysis(uuid) to service_role;
grant execute on function public.grant_vonu_device_pack(uuid, text, integer, bigint, text, text, text) to service_role;
grant execute on function public.get_vonu_device_entitlement(uuid) to service_role;
