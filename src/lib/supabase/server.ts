import "server-only";

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { getSupabaseEnv } from "./env";

// Cliente para server components, server actions y route handlers.
// Actúa como el usuario logueado (anon key + cookie de sesión), así que RLS aplica.
// Crear uno nuevo por request: no reutilizar entre requests.
export async function createClient() {
  // cookies() primero: marca la ruta como dinámica antes de cualquier otra cosa.
  const cookieStore = await cookies();
  const { url, anonKey } = getSupabaseEnv();

  return createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options),
          );
        } catch {
          // Desde un server component no se pueden escribir cookies.
          // No pasa nada: el proxy ya refresca la sesión en cada request.
        }
      },
    },
  });
}
