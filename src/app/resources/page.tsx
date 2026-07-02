import type { Metadata } from "next";
import { ResourcesExplorer } from "@/components/resources/resources-explorer";

export const metadata: Metadata = {
  title: "Resources",
  description:
    "Search and filter thousands of free JEE, NEET and KCET resources by exam, subject, type and language.",
};

interface Props {
  searchParams: Promise<{
    q?: string;
    exam?: string;
    subject?: string;
    type?: string;
    language?: string;
    sort?: string;
    page?: string;
  }>;
}

export default function ResourcesPage({ searchParams }: Props) {
  return <ResourcesExplorer searchParams={searchParams} />;
}
