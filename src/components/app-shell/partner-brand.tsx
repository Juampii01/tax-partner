import Image from "next/image";
import { GovBidderLogo } from "@/components/brand/govbidder-logo";
import type { PartnerSummary } from "@/lib/auth";

// Header del partner: su logo si lo subió; si no, el nombre de su empresa
// con el lockup de GovBidder como respaldo.
export function PartnerBrand({ partner }: { partner: PartnerSummary | null }) {
  if (partner?.logo_url) {
    return (
      <Image
        src={partner.logo_url}
        alt={partner.company_name}
        width={180}
        height={48}
        className="h-11 w-auto max-w-[180px] object-contain"
      />
    );
  }

  if (partner) {
    return (
      <div className="flex min-w-0 items-center gap-3">
        <GovBidderLogo size="sm" iconOnly />
        <span className="truncate text-base font-semibold text-brand-navy">
          {partner.company_name}
        </span>
      </div>
    );
  }

  return <GovBidderLogo size="sm" />;
}
