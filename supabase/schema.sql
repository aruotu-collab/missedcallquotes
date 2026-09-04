-- MissedCallQuotes — run this once in the Supabase SQL editor
-- Project: missedcallquotes
--
-- Auth (magic link) uses auth.users automatically. These tables hold
-- member businesses, recovered jobs, and quotes. Row Level Security
-- keeps each plumber on their own rows.

create table if not exists public.businesses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users (id) on delete cascade,
  name text not null default '',
  owner_first_name text not null default '',
  phone text not null default '',
  notification_mobile text not null default '',
  city text not null default '',
  service_areas text[] not null default '{}',
  services text[] not null default '{}',
  call_out integer not null default 95,
  emergency_call_out integer not null default 150,
  hourly_labour integer not null default 65,
  minimum_job integer not null default 80,
  boiler_diagnostic integer not null default 95,
  tone text not null default 'plain, calm, local plumber',
  plan text not null default 'founding',
  onboarded boolean not null default false,
  owner_email text not null default '',
  created_at timestamptz not null default now()
);

create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses (id) on delete cascade,
  customer_name text not null default '',
  customer_phone text not null default '',
  job_type text not null,
  job_label text not null,
  problem text not null default '',
  answers jsonb not null default '{}'::jsonb,
  postcode text not null default '',
  urgency text not null default '',
  preferred_time text not null default '',
  photo_note text not null default '',
  likely_job text not null default '',
  typical_min integer not null default 0,
  typical_max integer not null default 0,
  quoted_amount integer,
  won_amount integer,
  collected_amount integer,
  status text not null default 'new',
  existing_customer boolean not null default false,
  conversation jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.quotes (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses (id) on delete cascade,
  lead_id uuid not null references public.leads (id) on delete cascade,
  amount integer not null,
  description text not null default '',
  status text not null default 'sent',
  sent_at timestamptz,
  last_follow_up_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists leads_business_created_idx
  on public.leads (business_id, created_at desc);

create index if not exists quotes_business_created_idx
  on public.quotes (business_id, created_at desc);

alter table public.businesses enable row level security;
alter table public.leads enable row level security;
alter table public.quotes enable row level security;

drop policy if exists "members manage own business" on public.businesses;
create policy "members manage own business"
  on public.businesses for all
  to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

drop policy if exists "members manage own leads" on public.leads;
create policy "members manage own leads"
  on public.leads for all
  to authenticated
  using (business_id in (select id from public.businesses where user_id = auth.uid()))
  with check (business_id in (select id from public.businesses where user_id = auth.uid()));

drop policy if exists "members manage own quotes" on public.quotes;
create policy "members manage own quotes"
  on public.quotes for all
  to authenticated
  using (business_id in (select id from public.businesses where user_id = auth.uid()))
  with check (business_id in (select id from public.businesses where user_id = auth.uid()));

-- Admin (aruotu@gmail.com) + public visit log. See also supabase/admin.sql
-- if this project was created before these objects existed.

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select lower(coalesce(auth.jwt() ->> 'email', '')) = 'aruotu@gmail.com';
$$;

create table if not exists public.page_visits (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  path text not null,
  ip text not null default '',
  user_agent text not null default '',
  referrer text not null default '',
  country text not null default ''
);

create index if not exists page_visits_created_idx
  on public.page_visits (created_at desc);

alter table public.page_visits enable row level security;

drop policy if exists "record visits" on public.page_visits;
create policy "record visits"
  on public.page_visits for insert
  to anon, authenticated
  with check (true);

drop policy if exists "admin read visits" on public.page_visits;
create policy "admin read visits"
  on public.page_visits for select
  to authenticated
  using (public.is_admin());

drop policy if exists "admin delete visits" on public.page_visits;
create policy "admin delete visits"
  on public.page_visits for delete
  to authenticated
  using (public.is_admin());

drop policy if exists "admin read businesses" on public.businesses;
create policy "admin read businesses"
  on public.businesses for select
  to authenticated
  using (public.is_admin());

drop policy if exists "admin update businesses" on public.businesses;
create policy "admin update businesses"
  on public.businesses for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "admin read leads" on public.leads;
create policy "admin read leads"
  on public.leads for select
  to authenticated
  using (public.is_admin());

drop policy if exists "admin update leads" on public.leads;
create policy "admin update leads"
  on public.leads for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "admin read quotes" on public.quotes;
create policy "admin read quotes"
  on public.quotes for select
  to authenticated
  using (public.is_admin());

grant execute on function public.is_admin() to authenticated;
grant insert on public.page_visits to anon, authenticated;
grant select, delete on public.page_visits to authenticated;

-- Inbound SMS (Telnyx). See also supabase/telnyx.sql.
alter table public.businesses
  add column if not exists inbound_number text not null default '';

create table if not exists public.sms_sessions (
  phone text primary key,
  event_id text not null default '',
  state jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.sms_sessions enable row level security;

drop policy if exists "webhook sms sessions" on public.sms_sessions;
create policy "webhook sms sessions"
  on public.sms_sessions for all
  to anon, authenticated
  using (true)
  with check (true);

grant select, insert, update, delete on public.sms_sessions to anon, authenticated;

create or replace function public.resolve_inbound_business(p_to text)
returns table (id uuid, name text)
language sql
stable
security definer
set search_path = public
as $$
  select b.id, coalesce(nullif(b.name, ''), 'the plumber')
  from public.businesses b
  order by
    case
      when coalesce(b.inbound_number, '') <> ''
        and regexp_replace(b.inbound_number, '[^0-9+]', '', 'g')
          = regexp_replace(coalesce(p_to, ''), '[^0-9+]', '', 'g')
        then 0
      when b.onboarded then 1
      else 2
    end,
    b.created_at
  limit 1
$$;

create or replace function public.ingest_inbound_lead(
  p_to text,
  p_from text,
  p_customer_name text,
  p_job_type text,
  p_job_label text,
  p_problem text,
  p_answers jsonb,
  p_postcode text,
  p_urgency text,
  p_preferred_time text,
  p_photo_note text,
  p_likely_job text,
  p_typical_min integer,
  p_typical_max integer,
  p_conversation jsonb
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  bid uuid;
  new_id uuid;
begin
  select r.id into bid from public.resolve_inbound_business(p_to) r;
  if bid is null then
    return null;
  end if;

  insert into public.leads (
    business_id,
    customer_name,
    customer_phone,
    job_type,
    job_label,
    problem,
    answers,
    postcode,
    urgency,
    preferred_time,
    photo_note,
    likely_job,
    typical_min,
    typical_max,
    status,
    existing_customer,
    conversation
  ) values (
    bid,
    coalesce(nullif(p_customer_name, ''), 'Caller'),
    coalesce(p_from, ''),
    p_job_type,
    p_job_label,
    coalesce(p_problem, ''),
    coalesce(p_answers, '{}'::jsonb),
    coalesce(p_postcode, ''),
    coalesce(p_urgency, ''),
    coalesce(p_preferred_time, ''),
    coalesce(p_photo_note, ''),
    coalesce(p_likely_job, ''),
    coalesce(p_typical_min, 0),
    coalesce(p_typical_max, 0),
    'new',
    false,
    coalesce(p_conversation, '[]'::jsonb)
  )
  returning id into new_id;

  return new_id;
end;
$$;

grant execute on function public.resolve_inbound_business(text) to anon, authenticated;
grant execute on function public.ingest_inbound_lead(
  text, text, text, text, text, text, jsonb, text, text, text, text, text, integer, integer, jsonb
) to anon, authenticated;
