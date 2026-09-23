# GovBidder — Call con Santo (21-sep-2026)

## 1. Resumen
1. Review de GovBidder Connect (frontend público): Santo lo da por aprobado salvo logos y buscador. "Estamos ready para lanzar."
2. Explicación de dedupe en importación HigherGov (CSV manual vs. APIs).
3. Reconfiguración de DNS del dominio de emails (se había desconfigurado).
4. **Proyecto nuevo: GovBidder Tax Partner / Tax Panel** — programa de partners para preparadores de impuestos (multiservices) + dashboard propio.
5. Pago: Santo transfiere el **30/09**.

## 2. Fixes en GovBidder Connect (acordados)
1. **Buscador sin auto-search** en Federal / Estatal / Awards: hoy busca solo mientras escribís y corta la escritura; debe buscar **solo con botón Buscar (o Enter)**. El filtro en vivo de la lista de NAICS se queda como está.
2. **Awards con la misma estética que Opportunities** (filtros, ancho de layout). Hoy "parece otra página".
3. **Logos más grandes y legibles** en 3 lugares:
   - Navbar pública (agrandar el logo, no la barra).
   - Pantalla de login/registro (panel azul): el más grande de todos; usar variante que contraste con fondo azul (no logo azul).
   - App interna (post-login): hoy muestra logo equivocado ("GovBidder Win"?) → reemplazar por logo principal.
   - Usar la carpeta de logos de distintos tamaños.
4. Confirmado ya hecho: notificaciones de licitaciones por perfil del usuario (solo su rubro) y email al registrarse. Santo va a registrarse con otro email para revisar el copy.

## 3. Datos / infra
1. Oportunidades: ~115k–150k. Las de APIs (auto) y las cargadas manual (CSV HigherGov) son contadores separados.
2. Dedupe: al subir CSV, la plataforma **inserta los duplicados pero no los muestra**. El contador del Home sí suma duplicados → número inflado. Santo preguntó si se pueden borrar. Pendiente decidir: limpiar duplicados (el número del Home baja) o dedupe en la inserción.
3. DNS emails: se re-cargaron TXT (DKIM), TXT `send` (SPF `v=spf1…`), MX `send` prioridad 10. Quedó verificando → **confirmar que el dominio quedó Verified**.
4. Recordatorio (ToS HigherGov): la carga masiva de CSVs de HigherGov sigue siendo decisión y riesgo de Santo/Cristian.

## 4. GovBidder Tax Partner — concepto
**Problema que ataca:** las multiservices/preparadores de impuestos facturan fuerte ene–abr/may y el resto del año cae. Ya tienen cartera de clientes que confían en ellos, parte son empresas.

**Funnel:**
1. Webinar 1 (en ~15 días, ~6-oct; Meta Ads ya corriendo, ~56–60 registrados, objetivo mín. 100 asistentes) → dirigido a los **preparadores**.
2. El preparador paga un **fee** (monto sin definir) para ser partner. Incluye: copys de email/WhatsApp, entrenamiento, dashboard.
3. El preparador invita a **sus** clientes-empresa a un Webinar 2 (GovBidder no toca la base de clientes, por privacidad).
4. Webinar 2 → GovBidder vende sus servicios a los empresarios (modelo Challenge).
5. El partner cobra **comisión** por cada cliente referido que compra (ej. USD 1.000 de USD 10.000).
6. Meta de Santo: 50 partners × ~30 empresas = ~1.500 leads indirectos.

**Dashboard (lo que Santo imaginó, sin claridad todavía):**
1. Cargar su cartera de clientes (queda en su cuenta, GovBidder no la usa).
2. Templates de email prediseñados → elegir contacto → enviar.
3. Link del próximo webinar siempre visible para compartir.
4. Tracking: invitados/referidos, quiénes compraron (GovBidder sube esa data), comisión acumulada, próximo corte/pago.
5. White-label parcial: logo del partner + "by GovBidder Tax Panel".
6. Valor extra para su negocio: email marketing / SMS a su base, tal vez agenda de citas ("un GoHighLevel reducido"). Alternativa de Santo si no se puede: subcuenta de GoHighLevel.

## 5. Preguntas abiertas antes de construir
1. ¿Cuál es el fee y qué exactamente se promete en el webinar del ~6-oct? Eso define el MVP, no la lista de deseos.
2. ¿Atribución de referidos: link/código único por partner o carga manual de Santo?
3. ¿Quién envía los emails: desde el dominio del partner o desde GovBidder? (Deliverability + DNS por partner = complejidad alta.)
4. ¿SMS/agenda/CRM propio o subcuenta GHL? Construir un "mini GHL" es un producto entero.
5. ¿Pagos de comisión: solo reporte o también payout?
6. ¿Dónde vive: dentro de Connect o app separada?
7. ¿Presupuesto? Esto es un producto nuevo, fuera del retainer actual.

## 6. Próximos pasos
1. Juampi: fixes de Connect (sección 2).
2. Juampi: confirmar verificación DNS emails.
3. Juampi: documento de propuesta del Tax Panel (alcance MVP para el webinar + fase 2 + cotización).
4. Santo: documento de la idea (vía ChatGPT) y registrarse con otro email para revisar copy.
5. Santo: pago el 30/09.
