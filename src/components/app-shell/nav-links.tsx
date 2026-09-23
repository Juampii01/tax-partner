"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BookOpen,
  CalendarDays,
  DollarSign,
  FileText,
  LayoutDashboard,
  Settings,
  ShoppingCart,
  Users,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

export type NavArea = "partner" | "admin";

type NavItem = { href: string; label: string; icon: LucideIcon };

// La navegación vive en un módulo de cliente porque los íconos (componentes)
// no se pueden pasar como props desde un server component.
const NAV: Record<NavArea, NavItem[]> = {
  partner: [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/referrals", label: "Referrals", icon: Users },
    { href: "/commissions", label: "Commissions", icon: DollarSign },
    { href: "/resources", label: "Resources", icon: BookOpen },
    { href: "/settings", label: "Settings", icon: Settings },
  ],
  admin: [
    { href: "/admin/partners", label: "Partners", icon: Users },
    { href: "/admin/webinars", label: "Webinars", icon: CalendarDays },
    { href: "/admin/referrals", label: "Referrals", icon: FileText },
    { href: "/admin/sales", label: "Sales", icon: ShoppingCart },
    { href: "/admin/resources", label: "Resources", icon: BookOpen },
  ],
};

export function NavLinks({
  area,
  onNavigate,
}: {
  area: NavArea;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col gap-1" aria-label="Main">
      {NAV[area].map(({ href, label, icon: Icon }) => {
        const active = pathname === href || pathname.startsWith(`${href}/`);
        return (
          <Link
            key={href}
            href={href}
            onClick={onNavigate}
            aria-current={active ? "page" : undefined}
            className={cn(
              "flex h-11 items-center gap-3 rounded-lg px-3 text-[15px] font-medium transition-colors",
              active
                ? "bg-brand-navy text-white"
                : "text-foreground/80 hover:bg-accent hover:text-accent-foreground",
            )}
          >
            <Icon className="size-5 shrink-0" aria-hidden />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
