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
