// Sanea el parámetro `next` de login/callback para evitar open redirects:
// solo se aceptan rutas internas ("/algo"), nunca "//dominio" ni URLs absolutas.
export function safeNextPath(value: unknown, fallback = "/dashboard") {
  if (typeof value !== "string") return fallback;
  if (!value.startsWith("/") || value.startsWith("//") || value.startsWith("/\\")) {
    return fallback;
  }
  return value;
}
