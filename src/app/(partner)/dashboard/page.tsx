import type { Metadata } from "next";
import { PagePlaceholder } from "@/components/placeholder/page-placeholder";

export const metadata: Metadata = { title: "Dashboard" };

export default function Page() {
  return <PagePlaceholder title="Dashboard" description="Your referrals, commissions and the next webinar at a glance." />;
}
