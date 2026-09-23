import type { Metadata } from "next";
import { GovBidderLogo } from "@/components/brand/govbidder-logo";
import { safeNextPath } from "@/lib/safe-next";
import { LoginForm } from "./login-form";

export const metadata: Metadata = {
  title: "Sign in",
};

export default async function LoginPage({ searchParams }: PageProps<"/login">) {
  const params = await searchParams;
  const next = safeNextPath(params.next);
  const linkError = params.error === "link";

  return (
    <main className="flex min-h-dvh flex-col lg:flex-row">
      {/* Panel navy con el logo grande. En mobile va arriba, en desktop a la izquierda. */}
      <section className="flex flex-col items-center justify-center bg-brand-navy px-6 py-12 lg:w-1/2 lg:py-0">
        <GovBidderLogo variant="inverse" size="xl" />
        <p className="mt-6 hidden max-w-sm text-center text-base text-white/80 lg:block">
          Refer your business clients to GovBidder and earn a commission on every sale.
        </p>
      </section>

      <section className="flex flex-1 items-start justify-center px-6 py-10 lg:items-center lg:py-0">
        <div className="w-full max-w-sm space-y-8">
          <div className="space-y-2">
            <h1 className="text-2xl font-bold tracking-tight text-brand-navy">
              Partner sign in
            </h1>
            <p className="text-muted-foreground">
              Enter the email you registered with the GovBidder Tax Partner program.
            </p>
          </div>
          <LoginForm next={next} linkError={linkError} />
        </div>
      </section>
    </main>
  );
}
