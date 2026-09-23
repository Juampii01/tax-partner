import type { Metadata } from "next";
import { PagePlaceholder } from "@/components/placeholder/page-placeholder";

export const metadata: Metadata = { title: "Referrals" };

export default function Page() {
  return <PagePlaceholder title="Referrals" description="Everyone who registered for a webinar with your link." />;
}
