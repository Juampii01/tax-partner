import type { NextConfig } from "next";

// Los logos de partners viven en Supabase Storage (bucket público 'partner-logos', paso 4).
// Se habilita solo esa ruta del host del proyecto para next/image.
const supabaseHost = process.env.NEXT_PUBLIC_SUPABASE_URL
  ? new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).hostname
  : undefined;

const nextConfig: NextConfig = {
  // Hay un pnpm-lock.yaml suelto en el home que confunde la detección de la raíz.
  turbopack: {
    root: process.cwd(),
  },
  images: {
    remotePatterns: supabaseHost
      ? [
          {
            protocol: "https",
            hostname: supabaseHost,
            pathname: "/storage/v1/object/public/partner-logos/**",
          },
        ]
      : [],
  },
};

export default nextConfig;
