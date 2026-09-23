// Variables públicas de Supabase. Se leen con acceso estático (process.env.X)
// para que Next las inyecte en el bundle del cliente.
export function getSupabaseEnv() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY. Fill them in .env.local.",
    );
  }

  return { url, anonKey };
}
