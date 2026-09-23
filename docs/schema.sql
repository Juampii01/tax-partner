-- GovBidder Tax Partner — esquema inicial (Supabase / Postgres)
-- Ejecutar como migración. Todas las tablas con RLS activa.

create extension if not exists "pgcrypto";

-- ---------- perfiles y roles ----------
create table public.profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  role text not null default 'partner' check (role in ('partner','admin')),
  created_at timestamptz not null default now()
);

create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.profiles p where p.user_id = auth.uid() and p.role = 'admin');
$$;

-- ---------- partners ----------
create table public.partners (
  id uuid primary key default gen_random_uuid(),
  user_id uuid unique references auth.users(id) on delete cascade,
  company_name text not null,
  contact_name text,
  email text not null,
  phone text,
  logo_url text,
  referral_code text not null unique,
  commission_rate numeric(5,2) not null default 10.00,
  fee_status text not null default 'pending' check (fee_status in ('pending','paid','cancelled')),
  status text not null default 'active' check (status in ('active','inactive')),
  created_at timestamptz not null default now()
);

create or replace function public.current_partner_id()
returns uuid language sql stable security definer set search_path = public as $$
  select id from public.partners where user_id = auth.uid();
$$;

-- ---------- webinars ----------
create table public.webinars (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  starts_at timestamptz not null,
  join_url text,
  audience text not null default 'clients' check (audience in ('partners','clients')),
  is_active boolean not null default false,
  created_at timestamptz not null default now()
);

-- ---------- referidos ----------
create table public.referrals (
  id uuid primary key default gen_random_uuid(),
  partner_id uuid not null references public.partners(id) on delete cascade,
  webinar_id uuid references public.webinars(id) on delete set null,
  full_name text not null,
  email text not null,
  phone text,
  company text,
  industry text,
  status text not null default 'registered'
    check (status in ('registered','attended','purchased','lost')),
  created_at timestamptz not null default now(),
  unique (webinar_id, email)
);
create index on public.referrals (partner_id, status);

-- ---------- ventas y comisiones ----------
create table public.payouts (
  id uuid primary key default gen_random_uuid(),
  partner_id uuid not null references public.partners(id) on delete cascade,
  period_start date not null,
  period_end date not null,
  total_cents integer not null default 0,
  status text not null default 'pending' check (status in ('pending','paid')),
  paid_at timestamptz
);

create table public.sales (
  id uuid primary key default gen_random_uuid(),
  referral_id uuid not null references public.referrals(id) on delete restrict,
  partner_id uuid not null references public.partners(id) on delete restrict,
  amount_cents integer not null check (amount_cents > 0),
  commission_cents integer not null check (commission_cents >= 0),
  status text not null default 'pending' check (status in ('pending','approved','paid')),
  closed_at date not null default current_date,
  payout_id uuid references public.payouts(id) on delete set null,
  created_at timestamptz not null default now()
);
create index on public.sales (partner_id, status);

-- ---------- recursos (copys) ----------
create table public.resources (
  id uuid primary key default gen_random_uuid(),
  kind text not null check (kind in ('email','whatsapp','script')),
  title text not null,
  body text not null,
  sort_order integer not null default 0,
  is_active boolean not null default true
);

-- ---------- RLS ----------
alter table public.profiles  enable row level security;
alter table public.partners  enable row level security;
alter table public.webinars  enable row level security;
alter table public.referrals enable row level security;
alter table public.sales     enable row level security;
alter table public.payouts   enable row level security;
alter table public.resources enable row level security;

create policy "own profile" on public.profiles
  for select using (user_id = auth.uid() or public.is_admin());

create policy "partner reads self" on public.partners
  for select using (user_id = auth.uid() or public.is_admin());
create policy "partner updates self" on public.partners
  for update using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "admin writes partners" on public.partners
  for all using (public.is_admin()) with check (public.is_admin());

create policy "read webinars" on public.webinars
  for select using (auth.role() = 'authenticated');
create policy "admin writes webinars" on public.webinars
  for all using (public.is_admin()) with check (public.is_admin());

create policy "partner reads own referrals" on public.referrals
  for select using (partner_id = public.current_partner_id() or public.is_admin());
create policy "admin writes referrals" on public.referrals
  for all using (public.is_admin()) with check (public.is_admin());
-- El alta pública de referidos NO pasa por RLS: se hace en un route handler
-- del servidor con service role + rate limit por IP.

create policy "partner reads own sales" on public.sales
  for select using (partner_id = public.current_partner_id() or public.is_admin());
create policy "admin writes sales" on public.sales
  for all using (public.is_admin()) with check (public.is_admin());

create policy "partner reads own payouts" on public.payouts
  for select using (partner_id = public.current_partner_id() or public.is_admin());
create policy "admin writes payouts" on public.payouts
  for all using (public.is_admin()) with check (public.is_admin());

create policy "read resources" on public.resources
  for select using (auth.role() = 'authenticated');
create policy "admin writes resources" on public.resources
  for all using (public.is_admin()) with check (public.is_admin());

-- ---------- perfil automático al registrarse ----------
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (user_id, role) values (new.id, 'partner')
  on conflict (user_id) do nothing;
  return new;
end; $$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
