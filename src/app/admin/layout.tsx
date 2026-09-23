import { AppShell } from "@/components/app-shell/app-shell";
import { GovBidderLogo } from "@/components/brand/govbidder-logo";
import { Badge } from "@/components/ui/badge";
import { requireAdmin } from "@/lib/auth";

// Guard de rol: solo profiles.role = 'admin'. Un partner que entra acá vuelve a /dashboard.
// Ojo: esto protege las páginas, no las mutaciones. Cada server action de admin
// (paso 5) tiene que llamar a requireAdmin() por su cuenta.
export default async function AdminLayout({ children }: LayoutProps<"/admin">) {
  const session = await requireAdmin();

  return (
    <AppShell
      area="admin"
      brand={<GovBidderLogo size="sm" />}
      badge={<Badge className="bg-brand-red text-white">Admin</Badge>}
      userEmail={session.email}
      userLabel="GovBidder admin"
    >
      {children}
    </AppShell>
  );
}
