# Spec MVP — GovBidder Tax Partner

Objetivo: que Santo pueda mostrar la herramienta en el webinar del ~6 de octubre y que
los partners que paguen la cuota entren a algo funcional el mismo día.

## Pantallas

### 1. Público
- **`/`** — landing corta del programa (qué es, qué incluye, CTA al webinar).
- **`/r/[code]`** — página de registro al webinar con el código de referido del partner.
  Muestra el logo del partner ("Invited by {company}"), datos del próximo webinar,
  y un formulario: nombre, email, teléfono, empresa, rubro.
  Al enviar → crea un `referral` con `status = registered` atado a ese partner.
  Manda email de confirmación con el link del webinar (Resend).
- **`/login`** — magic link. Panel azul con el logo de GovBidder grande.

### 2. Partner (requiere auth, rol `partner`)
- **`/dashboard`**
  - KPIs: invitados registrados, asistieron, compraron, comisión acumulada,
    comisión del próximo corte.
  - Bloque "Your referral link" con el link, botón de copiar y botón de compartir por WhatsApp.
  - Card del próximo webinar: fecha, hora, countdown, botón de copiar el link.
- **`/referrals`** — tabla de sus referidos: nombre, empresa, email, estado
  (registered / attended / purchased), fecha, comisión generada. Filtros y búsqueda.
- **`/commissions`** — lista de ventas atribuidas: cliente, monto de la venta,
  comisión, estado (pending / approved / paid), corte de pago.
- **`/resources`** — los copys de email y WhatsApp que arma Santo, en cards con botón
  de copiar. Contenido editable por admin, no hardcodeado.
- **`/settings`** — datos de la empresa, subir logo, teléfono, zona horaria.

### 3. Admin (rol `admin`)
- **`/admin/partners`** — alta/baja, estado de la cuota, tasa de comisión por partner.
- **`/admin/webinars`** — crear webinar: título, fecha/hora, link de Zoom, público
  (partners o clientes), activo sí/no. El webinar activo es el que ven todos los partners.
- **`/admin/referrals`** — todos los referidos, marcar asistencia (importación CSV del
  reporte de Zoom por email).
- **`/admin/sales`** — cargar una venta: referido, monto, fecha. Calcula la comisión
  con la tasa del partner. Aprobar y marcar como pagada.
- **`/admin/resources`** — editar los copys que ven los partners.

## Modelo de datos

```
partners
  id uuid pk, user_id uuid fk auth.users, company_name text, contact_name text,
  email text, phone text, logo_url text, referral_code text unique,
  commission_rate numeric default 10.0, fee_status text (pending|paid|cancelled),
  status text (active|inactive), created_at

webinars
  id uuid pk, title text, starts_at timestamptz, join_url text,
  audience text (partners|clients), is_active bool, created_at

referrals
  id uuid pk, partner_id fk, webinar_id fk, full_name text, email text, phone text,
  company text, industry text, status text (registered|attended|purchased|lost),
  created_at
  unique (webinar_id, email)

sales
  id uuid pk, referral_id fk, partner_id fk, amount_cents int,
  commission_cents int, status text (pending|approved|paid),
  closed_at date, payout_id fk nullable, created_at

payouts
  id uuid pk, partner_id fk, period_start date, period_end date,
  total_cents int, status text (pending|paid), paid_at timestamptz

resources
  id uuid pk, kind text (email|whatsapp|script), title text, body text,
  sort_order int, is_active bool

profiles
  user_id uuid pk fk auth.users, role text (partner|admin)
```

## Reglas de negocio
1. `commission_cents = amount_cents * commission_rate / 100`, calculado en el servidor
   al crear la venta y **congelado** ahí. Si después cambia la tasa del partner, las
   ventas viejas no se recalculan.
2. La atribución es por `referral_code`. Un referido pertenece al primer partner que lo
   registró: si el mismo email vuelve por otro link, queda con el original.
3. Un partner con `fee_status != 'paid'` puede entrar al dashboard pero ve un aviso y
   no puede generar su link.
4. Los referidos de un partner no son visibles para ningún otro partner. Nunca.

## RLS
- `partners`: select/update solo donde `user_id = auth.uid()`. Admin: todo.
- `referrals`, `sales`, `payouts`: select solo donde `partner_id` corresponde al partner
  del usuario. Insert de referrals solo desde el servidor (route handler público con
  service role, con rate limiting por IP).
- `webinars`, `resources`: select para cualquier autenticado. Escritura solo admin.
- `profiles`: select propio. El rol nunca se edita desde el cliente.

## Fuera de alcance en fase 1
Envío masivo de emails o SMS desde la plataforma, importación de la cartera de clientes
del partner, agenda de citas, pagos automáticos de comisión, dominios de email propios
por partner. Todo eso es fase 2 y se cotiza aparte.
