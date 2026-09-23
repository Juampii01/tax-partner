# GovBidder Tax Partner — contexto del proyecto

## Qué es
Plataforma para los **partners** de GovBidder: oficinas de preparación de impuestos
(multiservices) en Estados Unidos que refieren a sus clientes-empresa a GovBidder
y cobran comisión por cada venta.

**El usuario final de esta app es el preparador de impuestos (el partner), NO su cliente.**
Los clientes-empresa del partner nunca se loguean acá: solo pasan por un link público
de registro a webinar.

## Modelo de negocio (para entender el dominio)
1. El partner paga una cuota para entrar al programa.
2. Recibe copys de email/WhatsApp, entrenamiento y esta herramienta.
3. Invita a sus propios clientes-empresa a un webinar de GovBidder usando su link de referido.
4. GovBidder vende su servicio en ese webinar.
5. El partner cobra comisión por cada cliente suyo que compra.

**Regla de privacidad, no negociable:** GovBidder no recibe ni contacta la cartera de
clientes del partner. Los datos de clientes que el partner cargue son suyos y solo él los ve.
El único dato que llega a GovBidder es el de quien se registra por voluntad propia
en el webinar usando el link del partner.

## Stack
- Next.js 16 (App Router) + TypeScript — mismo major que Connect y que examen-alumnos.
  En 16 el middleware se llama `proxy.ts`, no `middleware.ts`.
- Tailwind + shadcn/ui
- Supabase: Auth (email + magic link), Postgres, RLS, Storage (logos)
- Resend para emails transaccionales
- Deploy en Vercel, subdominio de govbidder.net

## Marca
- Navy: `#152978`
- Rojo: `#E42D2C`
- Usar los mismos logos de GovBidder, en tamaño generoso (no chicos).
- El partner puede subir su propio logo: se muestra el suyo arriba y abajo va
  "Powered by GovBidder Tax Partner".

## Roles
- `partner`: ve solo sus propios datos.
- `admin`: equipo GovBidder. Crea webinars, carga las ventas, aprueba comisiones.

## Reglas de desarrollo
1. **No tocar el repo ni la base de datos de GovBidder Connect.** Este es un proyecto aparte.
2. RLS activa en todas las tablas desde el día uno. Ninguna tabla sin políticas.
3. Nunca usar la service role key en el cliente. Solo en route handlers del servidor.
4. Montos en centavos (integer), nunca float.
5. Nada de `git push` automático. Commits sí, push lo hace Juampi.
6. No levantar agentes en paralelo sobre el mismo repo (ya hubo corrupción de git por eso).
   Ojo también con el naming de Next 16: la protección de rutas va en `proxy.ts` en la
   raíz del proyecto. Si Claude Code crea `middleware.ts`, está usando patrones de 15
   y hay que corregirlo.
7. Mobile first: los preparadores de impuestos van a entrar desde el celular.
8. Todo el texto de la interfaz en **inglés** (los partners son de Estados Unidos).
   Este documento y los comentarios internos, en español.

## Estado
Fase 1 (MVP para el webinar del 6-oct). Ver `docs/spec-mvp.md`.
Lo que NO va en fase 1: envío masivo de emails/SMS desde la plataforma, agenda de
citas, CRM completo, payouts automáticos.

## Reglas de Next.js 16 (generadas por create-next-app)
@AGENTS.md
