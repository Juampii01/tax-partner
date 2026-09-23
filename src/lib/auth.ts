import "server-only";

import { cache } from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type Role = "partner" | "admin";

export type PartnerSummary = {
  id: string;
  company_name: string;
  logo_url: string | null;
};

export type SessionContext = {
  userId: string;
  email: string | null;
  role: Role;
  partner: PartnerSummary | null;
};

// Lee usuario, rol y partner con el cliente del usuario (RLS aplica).
// `cache` deduplica la llamada entre layout y página dentro del mismo request.
// Los tipos son manuales hasta que el paso 2 genere src/types/database.ts.
export const getSessionContext = cache(async (): Promise<SessionContext | null> => {
  const supabase = await createClient();

  const { data: claimsData } = await supabase.auth.getClaims();
  const claims = claimsData?.claims;
  if (!claims?.sub) return null;

  const [{ data: profile }, { data: partner }] = await Promise.all([
    supabase.from("profiles").select("role").eq("user_id", claims.sub).maybeSingle(),
    supabase
      .from("partners")
      .select("id, company_name, logo_url")
      .eq("user_id", claims.sub)
      .maybeSingle(),
  ]);

  // El rol sale SIEMPRE de la tabla profiles (nunca del cliente ni de user_metadata).
  // Sin fila en profiles, se trata como partner: el mínimo privilegio.
  const role: Role = profile?.role === "admin" ? "admin" : "partner";

  return {
    userId: claims.sub,
    email: typeof claims.email === "string" ? claims.email : null,
    role,
    partner: (partner as PartnerSummary | null) ?? null,
  };
});

export async function requireUser() {
  const session = await getSessionContext();
  if (!session) redirect("/login");
  return session;
}

// Guard de rol para /admin. Se llama en el layout y hay que volver a llamarlo en
// cada server action de admin (paso 5): el layout no protege las mutaciones.
export async function requireAdmin() {
  const session = await requireUser();
  if (session.role !== "admin") redirect("/dashboard");
  return session;
}
