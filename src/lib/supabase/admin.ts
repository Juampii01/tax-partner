import "server-only";

import { createClient as createSupabaseClient } from "@supabase/supabase-js";

// Cliente con service role: SALTEA RLS.
// `import "server-only"` hace fallar el build si algún componente de cliente
// lo importa, así la key nunca llega al bundle del navegador.
// Usarlo solo en route handlers / server actions que ya validaron permisos
// (ej. alta pública de referidos, acciones de admin).
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY. Fill them in .env.local.",
    );
  }

  return createSupabaseClient(url, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
