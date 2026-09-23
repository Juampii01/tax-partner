import type { Metadata } from "next";
import { PagePlaceholder } from "@/components/placeholder/page-placeholder";

export const metadata: Metadata = { title: "Resources" };

export default function Page() {
  return <PagePlaceholder title="Resources" description="Edit the templates partners see." />;
}
