import { redirect } from "next/navigation";
import { AppShell } from "@/components/app-shell/app-shell";
import { PartnerBrand } from "@/components/app-shell/partner-brand";
import { GovBidderLogo } from "@/components/brand/govbidder-logo";
import { Button } from "@/components/ui/button";
import { signOut } from "@/app/auth/actions";
import { requireUser } from "@/lib/auth";

// Área del partner. El proxy ya exige sesión; acá además resolvemos su fila en `partners`.
export default async function PartnerLayout({ children }: LayoutProps<"/">) {
  const session = await requireUser();

  if (!session.partner) {
    // Un admin sin ficha de partner va directo a su panel.
    if (session.role === "admin") redirect("/admin/partners");
    return <AccountNotReady email={session.email} />;
  }

  return (
    <AppShell
      area="partner"
      brand={<PartnerBrand partner={session.partner} />}
      userEmail={session.email}
      userLabel={session.partner.company_name}
    >
      {children}
    </AppShell>
  );
}

// Usuario con login válido pero sin fila en `partners` (alta incompleta).
function AccountNotReady({ email }: { email: string | null }) {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-6 px-6 text-center">
      <GovBidderLogo size="md" />
      <div className="max-w-sm space-y-2">
        <h1 className="text-xl font-semibold text-brand-navy">Your account isn&apos;t ready yet</h1>
        <p className="text-muted-foreground">
          {email ? <>You&apos;re signed in as {email}, but </> : null}
          your partner profile hasn&apos;t been set up. Contact the GovBidder team and we&apos;ll
          get you in.
        </p>
      </div>
      <form action={signOut}>
        <Button type="submit" variant="outline">
          Sign out
        </Button>
      </form>
    </main>
  );
}
