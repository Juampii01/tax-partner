# Prompts para Claude Code — Tax Partner

Uno por vez, en orden. Revisá y commiteá entre cada uno. Nada de agentes en paralelo
sobre este repo.

## 0. Antes de abrir Claude Code (a mano, 10 min)

```bash
mkdir -p ~/Dev/tax-partner && cd ~/Dev/tax-partner
npx create-next-app@16 . --typescript --tailwind --app --eslint --src-dir --use-npm
git init && git add -A && git commit -m "chore: bootstrap next.js 16"
```

Fijá el major a mano en `package.json` (`"next": "16.x"`) para que un `@latest`
futuro no te salte a 17 en medio del proyecto.

Copiá `CLAUDE.md`, `docs/spec-mvp.md` y `docs/schema.sql` a la raíz del repo.
Creá el proyecto en Supabase (uno **nuevo**, no el de Connect) y poné en `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
RESEND_API_KEY=
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## 1. Base del proyecto y auth

```
Leé CLAUDE.md y docs/spec-mvp.md antes de escribir nada.

Armá la base del proyecto:
1. Configurá shadcn/ui con los colores de marca: navy #152978 como primary y rojo
   #E42D2C como accent. Tipografía Inter. Dark mode no hace falta.
2. Clientes de Supabase con @supabase/ssr: uno para browser, uno para server
   components y uno admin con service role que solo se pueda importar desde
   código de servidor.
3. Protección de rutas en `proxy.ts` en la raíz (Next 16; NO crees middleware.ts):
   refresca la sesión de Supabase y protege /dashboard, /referrals, /commissions,
   /resources, /settings y /admin.
4. Login con magic link en /login: panel izquierdo azul navy con el logo de
   GovBidder bien grande y el formulario a la derecha. Mobile first.
5. Layout del área de partner: sidebar con navegación, header con el logo del
   partner si lo subió, y "Powered by GovBidder Tax Partner" en el footer.
6. Guard de rol: /admin solo para profiles.role = 'admin'.

Toda la interfaz en inglés. No crees páginas de contenido todavía, solo la base
navegable con placeholders.
```

## 2. Base de datos

```
Aplicá docs/schema.sql como migración en Supabase y generá los tipos TypeScript
en src/types/database.ts.

Después:
1. Verificá con una query que TODAS las tablas tengan RLS activa y al menos una
   política. Si falta alguna, corregila.
2. Creá un seed en supabase/seed.sql con: un admin, dos partners de prueba, un
   webinar activo, ocho referidos en distintos estados y tres ventas.
3. Generá la función de creación de referral_code: seis caracteres alfanuméricos
   en mayúscula, sin caracteres ambiguos (0, O, 1, I), con reintento si colisiona.

No escribas todavía ninguna pantalla.
```

## 3. Página pública de referido

```
Implementá /r/[code] según docs/spec-mvp.md:
1. Server component que busca el partner por referral_code y el webinar activo con
   audience = 'clients'. Si el código no existe o el partner está inactivo, 404.
2. Header con el logo del partner y el texto "Invited by {company_name}".
3. Sección con fecha, hora y countdown del webinar. Mostrá la hora en la zona del
   visitante.
4. Formulario: full name, email, phone, company, industry. Validación con zod +
   react-hook-form.
5. El submit va a un route handler POST /api/referrals que usa el cliente admin:
   valida, aplica rate limit por IP (5 por hora), y si el email ya existe para ese
   webinar NO cambia el partner original, solo devuelve éxito.
6. Al registrarse, mandá un email con Resend con el link del webinar. Plantilla
   simple con la marca de GovBidder.
7. Pantalla de confirmación después del envío.

Mobile first. Esta página la van a abrir desde WhatsApp.
```

## 4. Dashboard del partner

```
Implementá el área del partner según docs/spec-mvp.md:
1. /dashboard: cinco KPIs (registered, attended, purchased, total commission,
   next payout), calculados en el servidor con una sola query agregada por
   partner. Card del referral link con botón de copiar y botón de compartir por
   WhatsApp. Card del próximo webinar con countdown.
2. /referrals: tabla con búsqueda, filtro por estado y paginación del lado del
   servidor. Estados con badges de color.
3. /commissions: lista de ventas con cliente, monto, comisión, estado y corte.
   Totales arriba. Los montos vienen en centavos: formatealos como USD.
4. /resources: los copys agrupados por tipo, cada uno en un card con botón de copiar.
5. /settings: editar datos de la empresa y subir logo a Supabase Storage (bucket
   'partner-logos', máximo 2 MB, png/jpg/svg, políticas para que cada partner solo
   escriba en su carpeta).

Estados vacíos cuidados: un partner nuevo va a entrar a todo esto sin un solo dato.
```

## 5. Panel de admin

```
Implementá /admin según docs/spec-mvp.md:
1. /admin/partners: tabla, alta manual (crea el usuario e invita por email),
   editar tasa de comisión y fee_status.
2. /admin/webinars: CRUD. Activar un webinar desactiva los otros del mismo audience.
3. /admin/referrals: tabla global con filtro por partner, cambio de estado en línea,
   e importación de CSV para marcar asistencia (match por email).
4. /admin/sales: crear venta eligiendo referido; la comisión se calcula en el
   servidor con la tasa vigente del partner y queda congelada en el registro.
   Acciones para aprobar y para agrupar en un payout por período.
5. /admin/resources: CRUD de los copys.

Todas las mutaciones en server actions, con verificación de rol admin en el servidor.
Nunca confíes en el rol que venga del cliente.
```

## 6. Cierre antes de mostrárselo a Santo

```
Pasada de verificación antes del deploy:
1. Probá con dos partners distintos que ninguno pueda ver datos del otro: intentá
   leer sus referidos y ventas directamente contra la API de Supabase con su token.
   Documentá el resultado.
2. Revisá que la service role key no aparezca en ningún bundle del cliente.
3. Corré build de producción y arreglá todos los errores de tipos y lint.
4. Revisá cada pantalla en 375px de ancho.
5. Escribí un README con las variables de entorno, cómo correr las migraciones y
   los pasos de deploy en Vercel.
```

---

## Orden sugerido de trabajo

| Paso | Tiempo estimado |
|---|---|
| 1–2 base y datos | 1 día |
| 3 página de referido | medio día |
| 4 dashboard del partner | 1,5 días |
| 5 admin | 1 día |
| 6 verificación y deploy | medio día |

Da unos 4–5 días de trabajo efectivo. Llegás al 6 de octubre con margen si arrancás
esta semana.
