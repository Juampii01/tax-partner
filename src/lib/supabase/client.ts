import { createBrowserClient } from "@supabase/ssr";
import { getSupabaseEnv } from "./env";

// Cliente para componentes de cliente ("use client"). Usa la anon key:
// todo lo que lea pasa por RLS.
export function createClient() {
  const { url, anonKey } = getSupabaseEnv();
  return createBrowserClient(url, anonKey);
}
