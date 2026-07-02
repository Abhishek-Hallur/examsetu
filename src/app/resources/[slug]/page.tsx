import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { Eye, Star, Download, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { ResourceCard } from "@/components/resource-card";
import { ResourceSidebar } from "@/components/resources/resource-sidebar";
import { PdfViewer } from "@/components/resources/pdf-viewer";
import { getResourceBySlug, searchResources } from "@/lib/data";
import { EXAMS, SUBJECTS, RESOURCE_TYPES } from "@/lib/constants";
import { formatCompact } from "@/lib/utils";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const r = await getResourceBySlug(slug);
  if (!r) return {};
  return { title: r.title, description: r.description };
}

export default async function ResourcePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const r = await getResourceBySlug(slug);
  if (!r) notFound();

  const relatedResult = await searchResources({
    exam: r.exam,
    subject: r.subject,
    pageSize: 4,
    sort: "most-viewed",
  });
  const related = relatedResult.results.filter((x) => x.id !== r.id).slice(0, 3);

  const exam = EXAMS.find((e) => e.slug === r.exam);
  const subject = SUBJECTS.find((s) => s.slug === r.subject);
  const type = RESOURCE_TYPES.find((t) => t.slug === r.resourceType);

  return (
    <div className="container py-10">
      {/* Breadcrumb */}
      <nav className="mb-6 flex flex-wrap items-center gap-1.5 text-sm text-muted-foreground">
        <Link href="/" className="hover:text-foreground">Home</Link>
        <span>/</span>
        <Link href={`/exams/${r.exam}`} className="hover:text-foreground">{exam?.name}</Link>
        <span>/</span>
        <Link href={`/subjects/${r.subject}`} className="hover:text-foreground">{subject?.name}</Link>
        <span>/</span>
        <span className="text-foreground">{r.chapter}</span>
      </nav>

      <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
        <div>
          <div className="mb-3 flex flex-wrap gap-2">
            <Badge>{exam?.name}</Badge>
            <Badge variant="secondary">{type?.name}</Badge>
            <Badge variant="outline">{r.classLevel}</Badge>
            <Badge variant="outline">{r.language}</Badge>
            {r.isPremium && <Badge variant="premium">Premium</Badge>}
          </div>
          <h1 className="text-3xl font-bold tracking-tight">{r.title}</h1>
          <p className="mt-3 text-muted-foreground">{r.description}</p>

          <div className="mt-5 flex flex-wrap items-center gap-5 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <Eye className="size-4" /> {formatCompact(r.views)} views
            </span>
            <span className="flex items-center gap-1.5">
              <Download className="size-4" /> {formatCompact(r.downloads)} downloads
            </span>
            <span className="flex items-center gap-1.5">
              <Star className="size-4 fill-amber-400 text-amber-400" />
              {r.rating.toFixed(1)} ({formatCompact(r.ratingCount)})
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar className="size-4" /> Updated {r.updatedAt}
            </span>
          </div>

          {/* PDF viewer */}
          <PdfViewer fileUrl={r.fileUrl} title={r.title} />

          {/* Tags */}
          {r.tags.length > 0 && (
            <div className="mt-6">
              <h3 className="mb-2 text-sm font-semibold">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {r.tags.map((t) => (
                  <Link key={t} href={`/resources?q=${encodeURIComponent(t)}`}>
                    <Badge variant="outline">#{t}</Badge>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Interactive sidebar */}
        <div className="space-y-4">
          <ResourceSidebar
            resourceId={r.id}
            isPremium={r.isPremium}
            slug={r.slug}
          />

          <Card className="p-5 text-sm">
            <h3 className="mb-3 font-semibold">Source information</h3>
            <dl className="space-y-2 text-muted-foreground">
              <div className="flex justify-between">
                <dt>Source</dt>
                <dd className="text-foreground">{r.source}</dd>
              </div>
              <div className="flex justify-between">
                <dt>Format</dt>
                <dd className="text-foreground">{r.format}</dd>
              </div>
              {r.year && (
                <div className="flex justify-between">
                  <dt>Year</dt>
                  <dd className="text-foreground">{r.year}</dd>
                </div>
              )}
              <div className="flex justify-between">
                <dt>Difficulty</dt>
                <dd className="text-foreground">{r.difficulty ?? "—"}</dd>
              </div>
            </dl>
            <p className="mt-4 rounded-lg bg-muted/50 p-3 text-xs">
              Linked from an approved, redistributable source. ExamSetu respects
              copyright and never bypasses paywalls.
            </p>
          </Card>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-14">
          <h2 className="mb-4 text-xl font-bold">Related resources</h2>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((x) => (
              <ResourceCard key={x.id} resource={x} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
