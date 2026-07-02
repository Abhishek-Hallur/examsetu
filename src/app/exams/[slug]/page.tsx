import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { Badge } from "@/components/ui/badge";
import { Icon } from "@/components/ui/icon";
import { ResourceCard } from "@/components/resource-card";
import { getExamBySlug, searchResources, getSubjects } from "@/lib/data";
import { EXAMS } from "@/lib/constants";
import { formatCompact, cn } from "@/lib/utils";

// Pre-build static paths from the known exam slugs so Next.js can statically
// optimise them; any slug not in the list will be rendered on-demand.
export function generateStaticParams() {
  return EXAMS.map((e) => ({ slug: e.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const exam = await getExamBySlug(slug);
  if (!exam) return {};
  return {
    title: `${exam.name} Resources`,
    description: exam.description,
  };
}

export default async function ExamPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const [exam, allSubjects, resourceResult] = await Promise.all([
    getExamBySlug(slug),
    getSubjects(),
    searchResources({ exam: slug, pageSize: 6, sort: "most-viewed" }),
  ]);

  if (!exam) notFound();

  const subjects = allSubjects.filter((s) => exam.subjects.includes(s.slug));
  const resources = resourceResult.results;

  return (
    <div>
      {/* Hero */}
      <section className={cn("relative overflow-hidden bg-gradient-to-br py-16 text-white", exam.color)}>
        <div className="container relative">
          <div className="mb-4 flex items-center gap-2 text-sm text-white/80">
            <Link href="/exams" className="hover:underline">Exams</Link>
            <span>/</span>
            <span>{exam.name}</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="grid size-14 place-items-center rounded-2xl bg-white/20 backdrop-blur">
              <Icon name={exam.icon} className="size-7" />
            </div>
            <div>
              <h1 className="text-3xl font-bold sm:text-4xl">{exam.name}</h1>
              <p className="text-white/80">{exam.fullName}</p>
            </div>
          </div>
          <p className="mt-4 max-w-2xl text-white/90">{exam.description}</p>
          <Badge className="mt-4 bg-white/20 text-white">
            {formatCompact(exam.resourceCount)} resources
          </Badge>
        </div>
      </section>

      {/* Subjects */}
      <section className="container py-12">
        <h2 className="text-xl font-bold">Subjects</h2>
        <div className="mt-4 flex flex-wrap gap-3">
          {subjects.map((s) => (
            <Link
              key={s.slug}
              href={`/resources?exam=${exam.slug}&subject=${s.slug}`}
              className="glass flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-transform hover:scale-105"
            >
              <Icon name={s.icon} className="size-4 text-primary" />
              {s.name}
            </Link>
          ))}
        </div>
      </section>

      {/* Popular Resources */}
      <section className="container pb-16">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold">Popular resources</h2>
          <Link
            href={`/resources?exam=${exam.slug}`}
            className="text-sm font-medium text-primary hover:underline"
          >
            View all
          </Link>
        </div>
        {resources.length ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {resources.map((r) => (
              <ResourceCard key={r.id} resource={r} />
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">
            No resources found for this exam yet. Seed the database or add some resources.
          </p>
        )}
      </section>
    </div>
  );
}
