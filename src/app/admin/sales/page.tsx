import type { Metadata } from "next";
import { PagePlaceholder } from "@/components/placeholder/page-placeholder";

export const metadata: Metadata = { title: "Sales" };

export default function Page() {
  return <PagePlaceholder title="Sales" description="Record sales, approve commissions and mark payouts." />;
}
