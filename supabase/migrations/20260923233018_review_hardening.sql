-- Correcciones al esquema inicial acordadas en la revisión del paso 1–2.
-- Cada bloque dice qué problema resuelve.

-- ---------- 1. partners: campos que el partner NO puede tocar ----------
-- RLS no filtra por columna: con "partner updates self" un partner podía subirse
-- la comisión o marcarse la cuota como pagada. Se limita por permisos de columna
-- y, como segunda barrera, por trigger.
-- Consecuencia: los cambios de commission_rate / fee_status / status / referral_code
-- solo se hacen con service role (server actions de admin, paso 5) o por SQL.

alter table public.partners
  add column timezone text not null default 'America/New_York';

revoke update on public.partners from anon, authenticated;
grant update (company_name, contact_name, phone, logo_url, timezone)
  on public.partners to authenticated;

create or replace function public.protect_partner_fields()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  -- Solo aplica a usuarios finales. service_role y SQL directo (postgres) pasan:
  -- ahí auth.uid() es null, así que "not is_admin()" los bloquearía por error.
  if (select auth.role()) = 'authenticated' and not public.is_admin() then
    if new.commission_rate is distinct from old.commission_rate
       or new.fee_status    is distinct from old.fee_status
       or new.status        is distinct from old.status
       or new.referral_code is distinct from old.referral_code
       or new.user_id       is distinct from old.user_id
       or new.email         is distinct from old.email then
      raise exception 'protected field' using errcode = '42501';
    end if;
  end if;
  return new;
end; $$;

create trigger partners_protect_fields
  before update on public.partners
  for each row execute function public.protect_partner_fields();

-- ---------- 2. referrals: email siempre en minúscula ----------
alter table public.referrals drop constraint referrals_webinar_id_email_key;
alter table public.referrals add constraint referrals_email_lowercase
  check (email = lower(btrim(email)));
create unique index referrals_webinar_email_uq
  on public.referrals (webinar_id, lower(email));
-- Para buscar al dueño original por email (atribución, abajo).
create index referrals_email_created_idx on public.referrals (email, created_at);

-- ---------- 3. atribución para siempre ----------
-- Un referido pertenece al primer partner que lo registró. Si vuelve por el link
-- de otro partner (en este u otro webinar) se registra igual, pero queda atado
-- al partner original. Se garantiza en la base, no en el route handler.
create or replace function public.referrals_keep_first_partner()
returns trigger language plpgsql security definer set search_path = public as $$
declare
  first_partner uuid;
begin
  select r.partner_id into first_partner
  from public.referrals r
  where r.email = new.email
  order by r.created_at asc
  limit 1;

  if first_partner is not null then
    new.partner_id := first_partner;
  end if;
  return new;
end; $$;

create trigger referrals_keep_first_partner
  before insert on public.referrals
  for each row execute function public.referrals_keep_first_partner();

-- ---------- 4. ventas: atribución independiente + override auditado ----------
-- sales.partner_id ya es independiente de referrals.partner_id. El admin puede
-- reasignar una venta; cada movimiento queda en sale_reassignments (no se
-- reescribe historia).
alter table public.sales
  add column attributed_at timestamptz not null default now(),
  add column attributed_by uuid references auth.users(id) on delete set null;

create table public.sale_reassignments (
  id uuid primary key default gen_random_uuid(),
  sale_id uuid not null references public.sales(id) on delete cascade,
  from_partner_id uuid not null references public.partners(id) on delete restrict,
  to_partner_id uuid not null references public.partners(id) on delete restrict,
  reassigned_by uuid references auth.users(id) on delete set null,
  reason text,
  created_at timestamptz not null default now()
);
create index on public.sale_reassignments (sale_id);
create index on public.sale_reassignments (from_partner_id);
create index on public.sale_reassignments (to_partner_id);

alter table public.sale_reassignments enable row level security;
create policy "admin reads reassignments" on public.sale_reassignments
  for select using (public.is_admin());
create policy "admin writes reassignments" on public.sale_reassignments
  for insert with check (public.is_admin());

-- ---------- 5. linter de Supabase ----------
-- 5a. handle_new_user es de trigger: nadie debe poder llamarla por /rpc.
revoke execute on function public.handle_new_user() from public, anon, authenticated;
revoke execute on function public.protect_partner_fields() from public, anon, authenticated;
revoke execute on function public.referrals_keep_first_partner() from public, anon, authenticated;
-- is_admin / current_partner_id las usan las políticas de RLS de usuarios logueados,
-- así que authenticated las necesita. anon no.
revoke execute on function public.is_admin() from public, anon;
revoke execute on function public.current_partner_id() from public, anon;
grant execute on function public.is_admin() to authenticated;
grant execute on function public.current_partner_id() to authenticated;

-- 5b. auth.uid()/auth.role() envueltos en select: se evalúan una vez por query,
-- no por fila.
drop policy "own profile" on public.profiles;
create policy "own profile" on public.profiles
  for select using (user_id = (select auth.uid()) or public.is_admin());

drop policy "partner reads self" on public.partners;
create policy "partner reads self" on public.partners
  for select using (user_id = (select auth.uid()) or public.is_admin());

drop policy "partner updates self" on public.partners;
create policy "partner updates self" on public.partners
  for update using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));

drop policy "read webinars" on public.webinars;
create policy "read webinars" on public.webinars
  for select using ((select auth.role()) = 'authenticated');

drop policy "read resources" on public.resources;
create policy "read resources" on public.resources
  for select using ((select auth.role()) = 'authenticated');

-- 5c. índices para las FKs que el linter marcó.
create index on public.payouts (partner_id);
create index on public.sales (payout_id);
create index on public.sales (referral_id);
