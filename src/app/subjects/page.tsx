import Link from "next/link";
import type { Metadata } from "next";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Icon } from "@/components/ui/icon";
import { getSubjects } from "@/lib/data";
import { formatCompact, cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Subjects",
  description: "Browse free resources by subject — Physics, Chemistry, Mathematics, Biology.",
};

export default async function SubjectsPage() {
  const subjects = await getSubjects();

  return (
    <div className="container py-12">
      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Subjects</h1>
      <p className="mt-2 text-muted-foreground">
        Explore resources organized by subject across all exams.
      </p>
      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {subjects.map((s) => (
          <Link key={s.slug} href={`/subjects/${s.slug}`}>
            <Card className="group h-full p-6 transition-all hover:-translate-y-1 hover:shadow-xl">
              <div
                className={cn(
                  "mb-4 grid size-12 place-items-center rounded-xl bg-gradient-to-br text-white shadow-lg",
                  s.color
                )}
              >
                <Icon name={s.icon} className="size-6" />
              </div>
              <h2 className="text-lg font-bold">{s.name}</h2>
              <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                {s.description}
              </p>
              <Badge variant="secondary" className="mt-4">
                {formatCompact(s.resourceCount)} resources
              </Badge>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
