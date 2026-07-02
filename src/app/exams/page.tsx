import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Icon } from "@/components/ui/icon";
import { getExams } from "@/lib/data";
import { formatCompact, cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Exams",
  description: "Browse free resources by exam — JEE Main, JEE Advanced, NEET, KCET.",
};

export default async function ExamsPage() {
  const exams = await getExams();

  return (
    <div className="container py-12">
      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Exams</h1>
      <p className="mt-2 text-muted-foreground">
        Pick an exam to explore its full, organized resource library.
      </p>
      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {exams.map((exam) => (
          <Link key={exam.slug} href={`/exams/${exam.slug}`}>
            <Card className="group h-full overflow-hidden p-6 transition-all hover:-translate-y-1 hover:shadow-xl">
              <div
                className={cn(
                  "mb-4 grid size-12 place-items-center rounded-xl bg-gradient-to-br text-white shadow-lg",
                  exam.color
                )}
              >
                <Icon name={exam.icon} className="size-6" />
              </div>
              <h2 className="text-lg font-bold">{exam.name}</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                {exam.fullName}
              </p>
              <div className="mt-4 flex items-center justify-between">
                <Badge variant="secondary">
                  {formatCompact(exam.resourceCount)} resources
                </Badge>
                <ArrowRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary" />
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
