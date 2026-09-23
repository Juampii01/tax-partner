import type { Metadata } from "next";
import { PagePlaceholder } from "@/components/placeholder/page-placeholder";

export const metadata: Metadata = { title: "Commissions" };

export default function Page() {
  return <PagePlaceholder title="Commissions" description="Sales attributed to you and their payout status." />;
}
