"use server";

import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { safeNextPath } from "@/lib/safe-next";

export type LoginState =
  | { status: "idle" }
  | { status: "sent"; email: string }
  | { status: "error"; message: string; email: string };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function sendMagicLink(
  _prev: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const next = safeNextPath(formData.get("next"));

  if (!EMAIL_RE.test(email)) {
    return { status: "error", message: "Enter a valid email address.", email };
  }

  const origin = await getAppOrigin();
  const redirectTo = new URL("/auth/confirm", origin);
  redirectTo.searchParams.set("next", next);

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      // Solo entran usuarios que ya existen (los da de alta admin en el paso 5).
      // Así nadie crea una cuenta "partner" escribiendo cualquier email.
      shouldCreateUser: false,
      emailRedirectTo: redirectTo.toString(),
    },
  });

  if (error) {
    // Si el email no existe, Supabase devuelve error. No lo revelamos:
    // respondemos lo mismo que en el caso exitoso (evita enumerar cuentas).
    if (isUnknownUserError(error)) return { status: "sent", email };

    if (error.status === 429) {
      return {
        status: "error",
        message: "Too many attempts. Please wait a minute and try again.",
        email,
      };
    }

    console.error("[login] signInWithOtp failed", error.status, error.code, error.message);
    return {
      status: "error",
      message: "We couldn't send the link. Please try again in a moment.",
      email,
    };
  }

  return { status: "sent", email };
}

function isUnknownUserError(error: { code?: string; message: string }) {
  return (
    error.code === "otp_disabled" ||
    error.code === "user_not_found" ||
    /signups not allowed/i.test(error.message)
  );
}

async function getAppOrigin() {
  if (process.env.NEXT_PUBLIC_APP_URL) return process.env.NEXT_PUBLIC_APP_URL;
  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host");
  const proto = h.get("x-forwarded-proto") ?? "https";
  return `${proto}://${host}`;
}
