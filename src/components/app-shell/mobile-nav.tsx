"use client";

import { useState, type ReactNode } from "react";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { NavLinks, type NavArea } from "./nav-links";

// Menú hamburguesa para mobile. Se cierra solo al elegir una sección.
export function MobileNav({ area, brand }: { area: NavArea; brand: ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="size-11 md:hidden" aria-label="Open menu">
          <Menu className="size-6" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-72 p-0">
        <SheetHeader className="border-b p-4 pr-12">
          <SheetTitle className="sr-only">Navigation</SheetTitle>
          {brand}
        </SheetHeader>
        <div className="p-3">
          <NavLinks area={area} onNavigate={() => setOpen(false)} />
        </div>
      </SheetContent>
    </Sheet>
  );
}
