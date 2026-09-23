import type { Metadata } from "next";
import { PagePlaceholder } from "@/components/placeholder/page-placeholder";

export const metadata: Metadata = { title: "Webinars" };

export default function Page() {
  return <PagePlaceholder title="Webinars" description="Create webinars and choose the active one." />;
}
