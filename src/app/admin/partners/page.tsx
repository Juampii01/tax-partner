import type { Metadata } from "next";
import { PagePlaceholder } from "@/components/placeholder/page-placeholder";

export const metadata: Metadata = { title: "Partners" };

export default function Page() {
  return <PagePlaceholder title="Partners" description="Manage partners, fee status and commission rates." />;
}
