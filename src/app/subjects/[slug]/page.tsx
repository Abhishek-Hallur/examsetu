import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { Badge } from "@/components/ui/badge";
import { Icon } from "@/components/ui/icon";
import { ResourceCard } from "@/components/resource-card";
import { getSubjectBySlug, searchResources } from "@/lib/data";
import { SUBJECTS } from "@/lib/constants";
import { formatCompact, cn } from "@/lib/utils";

export function generateStaticParams() {
  return SUBJECTS.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const subject = await getSubjectBySlug(slug);
  if (!subject) return {};
  return { title: `${subject.name} Resources`, description: subject.description };
}

export default async function SubjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const [subject, resourceResult] = await Promise.all([
    getSubjectBySlug(slug),
    searchResources({ subject: slug, pageSize: 6, sort: "most-viewed" }),
  ]);

  if (!subject) notFound();

  const resources = resourceResult.results;

  return (
    <div>
      <section className={cn("bg-gradient-to-br py-16 text-white", subject.color)}>
        <div className="container">
          <div className="mb-4 flex items-center gap-2 text-sm text-white/80">
            <Link href="/subjects" className="hover:underline">Subjects</Link>
            <span>/</span>
            <span>{subject.name}</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="grid size-14 place-items-center rounded-2xl bg-white/20 backdrop-blur">
              <Icon name={subject.icon} className="size-7" />
            </div>
            <h1 className="text-3xl font-bold sm:text-4xl">{subject.name}</h1>
          </div>
          <p className="mt-4 max-w-2xl text-white/90">{subject.description}</p>
          <Badge className="mt-4 bg-white/20 text-white">
            {formatCompact(subject.resourceCount)} resources
          </Badge>
        </div>
      </section>

      <section className="container py-12">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold">Popular resources</h2>
          <Link
            href={`/resources?subject=${subject.slug}`}
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
            No resources found for this subject yet. Seed the database or add some resources.
          </p>
        )}
      </section>
    </div>
  );
}
