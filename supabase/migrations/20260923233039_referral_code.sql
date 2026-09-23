-- Generador de referral_code: 6 caracteres alfanuméricos en mayúscula, sin los
-- ambiguos 0, O, 1, I (el partner lo va a dictar por teléfono y leer en WhatsApp).
-- 32 símbolos ^ 6 = ~1.070 millones de combinaciones.
-- Reintenta si el código ya existe. Queda como default de partners.referral_code,
-- así el alta (admin o checkout) no tiene que generarlo a mano.
--
-- security definer: el chequeo de colisión tiene que ver TODOS los partners,
-- aunque lo dispare un admin logueado (RLS) o la service role.

create or replace function public.generate_referral_code()
returns text language plpgsql volatile security definer set search_path = public as $$
declare
  alphabet constant text := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  candidate text;
  attempts int := 0;
begin
  loop
    candidate := '';
    for i in 1..6 loop
      candidate := candidate || substr(alphabet, 1 + floor(random() * length(alphabet))::int, 1);
    end loop;

    exit when not exists (select 1 from public.partners p where p.referral_code = candidate);

    attempts := attempts + 1;
    if attempts >= 25 then
      raise exception 'could not generate a unique referral code after % attempts', attempts;
    end if;
  end loop;

  return candidate;
end; $$;

-- Solo lo usan el default de la columna (lo evalúa quien inserta: admin o service role).
revoke execute on function public.generate_referral_code() from public, anon;
grant execute on function public.generate_referral_code() to authenticated, service_role;

alter table public.partners
  alter column referral_code set default public.generate_referral_code();

-- Formato válido garantizado también para códigos cargados a mano.
alter table public.partners add constraint partners_referral_code_format
  check (referral_code ~ '^[A-HJ-NP-Z2-9]{6}$');
