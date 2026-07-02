import type { Metadata } from "next";
import { ComingSoon } from "@/components/coming-soon";

export const metadata: Metadata = { title: "Blog" };

export default function BlogPage() {
  return (
    <ComingSoon
      title="ExamSetu Blog"
      phase="Phase 9 · Content & SEO"
      description="Study tips, exam news, college guides and success stories — SEO-optimized — arrive in Phase 9."
    />
  );
}
