import Link from "next/link";
import { GovBidderLogo } from "@/components/brand/govbidder-logo";
import { Button } from "@/components/ui/button";

// Placeholder de la landing pública. El contenido real (qué es, qué incluye,
// CTA al webinar) se arma más adelante; en el paso 1 solo tiene que navegar.
export default function Home() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-8 bg-brand-navy px-6 text-center">
      <GovBidderLogo variant="inverse" size="xl" />
      <p className="max-w-md text-lg text-white/85">
        The partner program for tax preparers. Refer your business clients to GovBidder and earn
        a commission on every sale.
      </p>
      <Button asChild size="lg" className="h-12 bg-white px-8 text-base text-brand-navy hover:bg-white/90">
        <Link href="/login">Partner sign in</Link>
      </Button>
    </main>
  );
}
