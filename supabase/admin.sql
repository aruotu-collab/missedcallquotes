-- Admin access + visit log. Run in the Supabase SQL editor after schema.sql.
-- Admin account: aruotu@gmail.com

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select lower(coalesce(auth.jwt() ->> 'email', '')) = 'aruotu@gmail.com';
$$;

alter table public.businesses
  add column if not exists owner_email text not null default '';

update public.businesses b
set owner_email = coalesce(u.email, '')
from auth.users u
where b.user_id = u.id
  and b.owner_email = '';

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
