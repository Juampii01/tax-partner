import type { ReactNode } from "react";
import { MobileNav } from "./mobile-nav";
import { NavLinks, type NavArea } from "./nav-links";
import { UserMenu } from "./user-menu";

type Props = {
  area: NavArea;
  /** Logo que va arriba: el del partner si lo subió, si no el de GovBidder. */
  brand: ReactNode;
  /** Etiqueta chica al lado del header (ej. "Admin"). */
  badge?: ReactNode;
  userEmail: string | null;
  userLabel: string;
  children: ReactNode;
};

// Estructura común del área logueada: sidebar fijo en desktop, hamburguesa en mobile,
// header con el logo y footer "Powered by GovBidder Tax Partner".
export function AppShell({ area, brand, badge, userEmail, userLabel, children }: Props) {
  return (
    <div className="flex min-h-dvh bg-muted/40">
      <aside className="sticky top-0 hidden h-dvh w-64 shrink-0 flex-col border-r bg-sidebar md:flex">
        <div className="flex h-20 items-center border-b px-5">{brand}</div>
        <div className="flex-1 overflow-y-auto p-3">
          <NavLinks area={area} />
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-2 border-b bg-background/95 px-3 backdrop-blur sm:px-6 md:h-20">
          <MobileNav area={area} brand={brand} />
          <div className="min-w-0 flex-1 md:hidden">{brand}</div>
          <div className="hidden flex-1 md:block">{badge}</div>
          {badge && <div className="md:hidden">{badge}</div>}
          <UserMenu email={userEmail} label={userLabel} />
        </header>

        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">{children}</main>

        <footer className="border-t bg-background px-4 py-4 text-center text-xs text-muted-foreground sm:px-6">
          Powered by{" "}
          <span className="font-semibold text-brand-navy">GovBidder Tax Partner</span>
        </footer>
      </div>
    </div>
  );
}
