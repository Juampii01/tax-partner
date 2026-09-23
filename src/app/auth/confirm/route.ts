import type { EmailOtpType } from "@supabase/supabase-js";
import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { safeNextPath } from "@/lib/safe-next";

// Destino del magic link. Soporta los dos formatos de Supabase:
// 1. ?token_hash=...&type=email  → recomendado. Funciona aunque el link se abra en
//    otro navegador (ej. el navegador interno de Gmail/WhatsApp en el celular).
//    Requiere cambiar el template "Magic Link" en Supabase (ver README del paso 6).
// 2. ?code=...                   → flujo PKCE del template por defecto. Solo funciona
//    si el link se abre en el mismo navegador donde se pidió.
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const next = safeNextPath(searchParams.get("next"));
  const tokenHash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;
  const code = searchParams.get("code");

  const supabase = await createClient();

  let ok = false;
  if (tokenHash && type) {
    const { error } = await supabase.auth.verifyOtp({ type, token_hash: tokenHash });
    ok = !error;
  } else if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    ok = !error;
  }

  // `next` puede traer query string (ej. /referrals?status=purchased), por eso new URL.
  const target = ok ? new URL(next, request.url) : new URL("/login?error=link", request.url);
  return NextResponse.redirect(target);
}
