import type { Metadata } from "next";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

export const metadata: Metadata = { title: "Blog" };

const BLOG_POSTS = [
  {
    slug: "jee-main-2027-prep-guide",
    title: "The Ultimate JEE Main 2027 Preparation Guide",
    date: "2026-07-15",
    description: "A comprehensive roadmap to crack JEE Main with top scores, featuring study plans and resource recommendations.",
  },
  {
    slug: "neet-biology-strategies",
    title: "Mastering NEET Biology: High-Yield Topics",
    date: "2026-07-10",
    description: "Focus your energy where it matters most. Breakdowns of the highest-weightage biology chapters for NEET.",
  },
  {
    slug: "kcet-counselling-tips",
    title: "Navigating KCET Counselling Like a Pro",
    date: "2026-07-05",
    description: "A step-by-step guide to option entry, mock allotments, and making the best choice for your engineering future.",
  }
];

export default function BlogPage() {
  return (
    <div className="container py-12 md:py-16">
      <div className="mb-12 max-w-2xl">
        <h1 className="text-4xl font-bold tracking-tight">ExamSetu Blog</h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Study tips, exam news, college guides and success stories to help you ace your entrance exams.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {BLOG_POSTS.map((post) => (
          <Card key={post.slug} className="flex flex-col">
            <CardHeader>
              <div className="mb-2 text-sm text-muted-foreground">{post.date}</div>
              <CardTitle className="line-clamp-2">
                <Link href={`/blog/${post.slug}`} className="hover:underline">
                  {post.title}
                </Link>
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1">
              <CardDescription className="line-clamp-3 text-base">
                {post.description}
              </CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
