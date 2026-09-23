import Image from "next/image";
import { cn } from "@/lib/utils";

// Lockup de GovBidder Tax Partner: isotipo (águila) + texto.
// El wordmark del brand kit dice "GovBidder Connect", por eso el texto va en tipografía.
// - "color": fondos claros. - "inverse": fondo navy (el azul pasa a blanco, el rojo queda).
type Props = {
  variant?: "color" | "inverse";
  size?: "sm" | "md" | "xl";
  showProduct?: boolean;
  /** Solo el águila, sin texto. */
  iconOnly?: boolean;
  className?: string;
};

// El isotipo es apaisado (2408×1410): se dimensiona por alto, ancho automático.
const ICON_RATIO = 2408 / 1410;

const SIZES = {
  sm: { icon: 32, iconClass: "h-8", name: "text-lg", product: "text-[10px]" },
  md: { icon: 44, iconClass: "h-11", name: "text-2xl", product: "text-xs" },
  xl: { icon: 144, iconClass: "h-28 sm:h-32 lg:h-40", name: "text-4xl sm:text-5xl", product: "text-sm sm:text-base" },
} as const;

export function GovBidderLogo({
  variant = "color",
  size = "md",
  showProduct = true,
  iconOnly = false,
  className,
}: Props) {
  const s = SIZES[size];
  const inverse = variant === "inverse";

  return (
    <div
      className={cn(
        "flex items-center gap-3",
        size === "xl" && "flex-col gap-5 text-center",
        className,
      )}
    >
      <Image
        src={inverse ? "/brand/govbidder-isotipo-inverso.svg" : "/brand/govbidder-isotipo-color.svg"}
        alt="GovBidder"
        width={Math.round(s.icon * ICON_RATIO)}
        height={s.icon}
        priority={size === "xl"}
        className={cn("w-auto shrink-0", s.iconClass)}
      />
      {!iconOnly && (
        <div className="leading-none">
          <div
            className={cn(
              "font-extrabold tracking-[0.12em] uppercase",
              s.name,
              inverse ? "text-white" : "text-brand-navy",
            )}
          >
            GovBidder
          </div>
          {showProduct && (
            <div
              className={cn(
                "mt-1.5 font-semibold tracking-[0.3em] uppercase text-brand-red",
                s.product,
              )}
            >
              Tax Partner
            </div>
          )}
        </div>
      )}
    </div>
  );
}
