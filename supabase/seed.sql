-- Datos de prueba para desarrollo local (`supabase db reset`) o para cargar a mano.
-- NO correr en producción: crea usuarios @example.com.
-- IDs fijos para que sea idempotente y fácil de borrar.
--
-- Contenido: 1 admin, 2 partners, 1 webinar activo (clients), 8 referidos en
-- distintos estados, 3 ventas (pending / approved / paid) y 1 payout.
-- Links de prueba: /r/TESTAA (Partner A) y /r/TESTBB (Partner B).

-- ---------- usuarios de auth ----------
-- Con fila en auth.identities, así el magic link funciona para estos usuarios.
insert into auth.users (
  instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at,
  confirmation_token, recovery_token, email_change_token_new, email_change
)
select
  '00000000-0000-0000-0000-000000000000', u.id, 'authenticated', 'authenticated', u.email, '',
  now(), '{"provider":"email","providers":["email"]}'::jsonb, '{}'::jsonb, now(), now(),
  '', '', '', ''
from (values
  ('a0000000-0000-4000-8000-000000000001'::uuid, 'admin@example.com'),
  ('b0000000-0000-4000-8000-00000000000a'::uuid, 'partner.a@example.com'),
  ('b0000000-0000-4000-8000-00000000000b'::uuid, 'partner.b@example.com')
) as u(id, email)
on conflict (id) do nothing;

insert into auth.identities (id, user_id, provider_id, provider, identity_data, last_sign_in_at, created_at, updated_at)
select gen_random_uuid(), u.id, u.id::text, 'email',
       jsonb_build_object('sub', u.id::text, 'email', u.email, 'email_verified', true),
       now(), now(), now()
from auth.users u
where u.id in (
  'a0000000-0000-4000-8000-000000000001',
  'b0000000-0000-4000-8000-00000000000a',
  'b0000000-0000-4000-8000-00000000000b'
)
on conflict (provider_id, provider) do nothing;

-- El trigger on_auth_user_created ya creó los profiles como 'partner'.
update public.profiles set role = 'admin'
where user_id = 'a0000000-0000-4000-8000-000000000001';

-- ---------- partners ----------
insert into public.partners (id, user_id, company_name, contact_name, email, phone, referral_code, commission_rate, fee_status, timezone)
values
  ('c0000000-0000-4000-8000-00000000000a', 'b0000000-0000-4000-8000-00000000000a',
   'Rodriguez Tax & Multiservices', 'Maria Rodriguez', 'partner.a@example.com', '+1 305 555 0101',
   'TESTAA', 10.00, 'paid', 'America/New_York'),
  ('c0000000-0000-4000-8000-00000000000b', 'b0000000-0000-4000-8000-00000000000b',
   'Lone Star Tax Services', 'Carlos Mendez', 'partner.b@example.com', '+1 713 555 0102',
   'TESTBB', 15.00, 'paid', 'America/Chicago')
on conflict (id) do nothing;

-- ---------- webinar activo ----------
insert into public.webinars (id, title, starts_at, join_url, audience, is_active)
values
  ('d0000000-0000-4000-8000-000000000001', 'How to Win Government Contracts in 2027',
   '2026-10-20 19:00:00-04', 'https://zoom.us/j/0000000000', 'clients', true)
on conflict (id) do nothing;

-- ---------- 8 referidos ----------
-- Partner A: 5 (2 registered, 1 attended, 2 purchased). Partner B: 3 (1 attended, 1 purchased, 1 lost).
insert into public.referrals (id, partner_id, webinar_id, full_name, email, phone, company, industry, status, created_at)
values
  ('e0000000-0000-4000-8000-000000000001', 'c0000000-0000-4000-8000-00000000000a', 'd0000000-0000-4000-8000-000000000001',
   'John Carter', 'john@cartercleaning.example.com', '+1 305 555 0201', 'Carter Cleaning LLC', 'Janitorial', 'registered', now() - interval '6 days'),
  ('e0000000-0000-4000-8000-000000000002', 'c0000000-0000-4000-8000-00000000000a', 'd0000000-0000-4000-8000-000000000001',
   'Ana Lopez', 'ana@lopezconstruction.example.com', '+1 305 555 0202', 'Lopez Construction', 'Construction', 'registered', now() - interval '5 days'),
  ('e0000000-0000-4000-8000-000000000003', 'c0000000-0000-4000-8000-00000000000a', 'd0000000-0000-4000-8000-000000000001',
   'Mike Chen', 'mike@chenlogistics.example.com', '+1 305 555 0203', 'Chen Logistics', 'Transportation', 'attended', now() - interval '5 days'),
  ('e0000000-0000-4000-8000-000000000004', 'c0000000-0000-4000-8000-00000000000a', 'd0000000-0000-4000-8000-000000000001',
   'Sara Diaz', 'sara@diazmedical.example.com', '+1 305 555 0204', 'Diaz Medical Supply', 'Medical supplies', 'purchased', now() - interval '4 days'),
  ('e0000000-0000-4000-8000-000000000005', 'c0000000-0000-4000-8000-00000000000a', 'd0000000-0000-4000-8000-000000000001',
   'Tom Wilson', 'tom@wilsonit.example.com', '+1 305 555 0205', 'Wilson IT Services', 'IT services', 'purchased', now() - interval '3 days'),
  ('e0000000-0000-4000-8000-000000000006', 'c0000000-0000-4000-8000-00000000000b', 'd0000000-0000-4000-8000-000000000001',
   'Laura Garcia', 'laura@garciacatering.example.com', '+1 713 555 0206', 'Garcia Catering', 'Food services', 'attended', now() - interval '4 days'),
  ('e0000000-0000-4000-8000-000000000007', 'c0000000-0000-4000-8000-00000000000b', 'd0000000-0000-4000-8000-000000000001',
   'Robert King', 'robert@kingsecurity.example.com', '+1 713 555 0207', 'King Security Group', 'Security', 'purchased', now() - interval '3 days'),
  ('e0000000-0000-4000-8000-000000000008', 'c0000000-0000-4000-8000-00000000000b', 'd0000000-0000-4000-8000-000000000001',
   'Nina Patel', 'nina@patelprinting.example.com', '+1 713 555 0208', 'Patel Printing', 'Printing', 'lost', now() - interval '2 days')
on conflict (id) do nothing;

-- ---------- payout (Partner B, ya pagado) ----------
insert into public.payouts (id, partner_id, period_start, period_end, total_cents, status, paid_at)
values
  ('f0000000-0000-4000-8000-000000000001', 'c0000000-0000-4000-8000-00000000000b',
   '2026-10-01', '2026-10-31', 120000, 'paid', now())
on conflict (id) do nothing;

-- ---------- 3 ventas ----------
-- commission_cents = amount_cents * commission_rate / 100, congelado al crear la venta.
insert into public.sales (id, referral_id, partner_id, amount_cents, commission_cents, status, closed_at, payout_id)
values
  -- Partner A (10%): USD 10,000 → USD 1,000, aprobada
  ('f1000000-0000-4000-8000-000000000001', 'e0000000-0000-4000-8000-000000000004', 'c0000000-0000-4000-8000-00000000000a',
   1000000, 100000, 'approved', current_date - 2, null),
  -- Partner A (10%): USD 5,000 → USD 500, pendiente
  ('f1000000-0000-4000-8000-000000000002', 'e0000000-0000-4000-8000-000000000005', 'c0000000-0000-4000-8000-00000000000a',
   500000, 50000, 'pending', current_date - 1, null),
  -- Partner B (15%): USD 8,000 → USD 1,200, pagada en el payout de octubre
  ('f1000000-0000-4000-8000-000000000003', 'e0000000-0000-4000-8000-000000000007', 'c0000000-0000-4000-8000-00000000000b',
   800000, 120000, 'paid', current_date - 2, 'f0000000-0000-4000-8000-000000000001')
on conflict (id) do nothing;
