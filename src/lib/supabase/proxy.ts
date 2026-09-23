import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { getSupabaseEnv } from "./env";

// Rutas que requieren sesión. El control de rol (admin) se hace en el servidor,
// en src/app/admin/layout.tsx; acá solo miramos si hay usuario.
const PROTECTED_PREFIXES = [
  "/dashboard",
  "/referrals",
  "/commissions",
  "/resources",
  "/settings",
  "/admin",
];

function isProtected(pathname: string) {
  return PROTECTED_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}

// Refresca la sesión de Supabase (reescribe cookies si el token rotó) y
// redirige a /login las rutas protegidas sin usuario.
export async function updateSession(request: NextRequest) {
  const { url, anonKey } = getSupabaseEnv();
  let response = NextResponse.next({ request });

  const supabase = createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet, headers) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value),
        );
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options),
        );
        // Evita que un CDN cachee una respuesta con la sesión de otro usuario.
        Object.entries(headers).forEach(([key, value]) =>
          response.headers.set(key, value),
        );
      },
    },
  });

  // No meter código entre createServerClient y getClaims: getClaims valida
  // el JWT y dispara el refresh que escribe las cookies nuevas.
  const { data } = await supabase.auth.getClaims();
  const user = data?.claims;

  const { pathname, search } = request.nextUrl;

  if (!user && isProtected(pathname)) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/login";
    loginUrl.search = "";
    loginUrl.searchParams.set("next", `${pathname}${search}`);
    return redirectWithCookies(loginUrl, response);
  }

  if (user && pathname === "/login") {
    const dashboardUrl = request.nextUrl.clone();
    dashboardUrl.pathname = "/dashboard";
    dashboardUrl.search = "";
    return redirectWithCookies(dashboardUrl, response);
  }

  return response;
}

// Un redirect nuevo perdería las cookies de sesión que setAll dejó en
// `response`; las copiamos para no desloguear al usuario.
function redirectWithCookies(url: URL, from: NextResponse) {
  const redirect = NextResponse.redirect(url);
  from.cookies.getAll().forEach((cookie) => redirect.cookies.set(cookie));
  for (const key of ["cache-control", "expires", "pragma"]) {
    const value = from.headers.get(key);
    if (value) redirect.headers.set(key, value);
  }
  return redirect;
}
