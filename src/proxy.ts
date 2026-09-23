import type { NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/proxy";

// Next 16: esto reemplaza a middleware.ts. Con --src-dir va en src/, al lado de app/.
export async function proxy(request: NextRequest) {
  return updateSession(request);
}

export const config = {
  matcher: [
    // Todo menos estáticos, optimización de imágenes, íconos y assets de marca.
    "/((?!_next/static|_next/image|favicon.ico|icon.png|apple-icon.png|brand/|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
