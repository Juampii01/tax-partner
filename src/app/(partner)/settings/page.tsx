import type { Metadata } from "next";
import { PagePlaceholder } from "@/components/placeholder/page-placeholder";

export const metadata: Metadata = { title: "Settings" };

export default function Page() {
  return <PagePlaceholder title="Settings" description="Your company details and logo." />;
}
