-- Run once in the project's Supabase SQL editor. No anonymous read/write access.
create table if not exists public.galla_reservations (
 id uuid primary key, request_key uuid not null unique,
 name text not null, phone text not null, email text not null,
 restaurant text not null check (restaurant in ('game-on','ciorbar','mamas-tajine','rosa')),
 adults integer not null check(adults>=0), children integer not null check(children>=0),
 tables_json jsonb not null, table_preference text not null,
 total integer not null, consent_version text not null,
 status text not null default 'pending', created_at timestamptz not null default now(),
 expires_at timestamptz not null default '2027-04-01T00:00:00Z',
 constraint galla_guest_count check(adults+children between 1 and 300)
);
-- Additive migration for existing installations; run this script again to upgrade.
alter table public.galla_reservations add column if not exists seat_selection_json jsonb not null default '[]';
alter table public.galla_reservations add column if not exists plan_version text not null default '';
alter table public.galla_reservations add column if not exists currency text not null default 'ron';
alter table public.galla_reservations add column if not exists amount_minor integer not null default 0;
alter table public.galla_reservations add column if not exists payment_status text not null default 'not_started';
alter table public.galla_reservations drop constraint if exists galla_reservations_check;
alter table public.galla_reservations drop constraint if exists galla_guest_count;
alter table public.galla_reservations add constraint galla_guest_count check(adults+children between 1 and 300);
update public.galla_reservations set amount_minor=total*100 where amount_minor=0;
create table if not exists public.galla_rate_limits(bucket text primary key,attempts integer not null,expires_at timestamptz not null);
alter table public.galla_reservations enable row level security;
alter table public.galla_rate_limits enable row level security;
revoke all on public.galla_reservations, public.galla_rate_limits from anon,authenticated;
grant all on public.galla_reservations, public.galla_rate_limits to service_role;

create or replace function public.submit_galla_reservation(payload jsonb,rate_bucket text)
returns jsonb language plpgsql security invoker set search_path=public as $$
declare attempts_now integer; saved_id uuid;
begin
 delete from galla_rate_limits where expires_at < now();
 delete from galla_reservations where expires_at < now() and status='pending';
 insert into galla_rate_limits(bucket,attempts,expires_at) values(rate_bucket,1,now()+interval '2 hours')
 on conflict(bucket) do update set attempts=galla_rate_limits.attempts+1 returning attempts into attempts_now;
 if attempts_now>10 then return jsonb_build_object('rateLimited',true); end if;
 insert into galla_reservations(id,request_key,name,phone,email,restaurant,adults,children,tables_json,table_preference,total,consent_version,seat_selection_json,plan_version,currency,amount_minor,payment_status)
 values((payload->>'id')::uuid,(payload->>'requestKey')::uuid,payload->>'name',payload->>'phone',payload->>'email',payload->>'restaurant',(payload->>'adults')::integer,(payload->>'children')::integer,payload->'tables',payload->>'tablePreference',(payload->>'adults')::integer*950+(payload->>'children')::integer*650,payload->>'consentVersion',payload->'seatSelection',payload->>'planVersion','ron',((payload->>'adults')::integer*950+(payload->>'children')::integer*650)*100,'not_started') on conflict(request_key) do nothing;
 select id into saved_id from galla_reservations where request_key=(payload->>'requestKey')::uuid;
 return jsonb_build_object('id',saved_id);
end $$;
revoke all on function public.submit_galla_reservation(jsonb,text) from public,anon,authenticated;
grant execute on function public.submit_galla_reservation(jsonb,text) to service_role;
-- Schedule the expiry cleanup daily in Supabase Cron when activating production.
-- DELETE FROM public.galla_reservations WHERE expires_at < now() AND status='pending';
