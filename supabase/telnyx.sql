-- Inbound SMS sessions + create a dashboard job when intake finishes.
-- Run in the Supabase SQL editor after a Telnyx number is live.

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
