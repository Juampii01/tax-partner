import type { Metadata } from "next";
import { PagePlaceholder } from "@/components/placeholder/page-placeholder";

export const metadata: Metadata = { title: "All referrals" };

export default function Page() {
  return <PagePlaceholder title="All referrals" description="Every referral across partners. Mark attendance." />;
}
