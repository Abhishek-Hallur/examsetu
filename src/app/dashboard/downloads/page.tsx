import { redirect } from "next/navigation";
import Link from "next/link";
import { Download, ExternalLink } from "lucide-react";
import type { Metadata } from "next";
import { Suspense } from "react";
import { auth } from "@/auth";
import { getUserDownloads } from "@/lib/data";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pagination } from "@/components/ui/pagination";
import { EXAMS, RESOURCE_TYPES } from "@/lib/constants";

export const metadata: Metadata = { title: "Downloads · Dashboard" };

const PAGE_SIZE = 15;

export default async function DownloadsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const session = await auth();
  if (!session?.user) redirect("/login?callbackUrl=/dashboard/downloads");

  const sp = await searchParams;
  const page = Math.max(1, sp.page ? Number(sp.page) : 1);

  const { results, total } = await getUserDownloads(session.user.id, page, PAGE_SIZE);
  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Downloads</h1>
        <p className="mt-0.5 text-sm text-muted-foreground">
          {total} download{total !== 1 ? "s" : ""}
        </p>
      </div>

      {results.length === 0 ? (
        <div className="rounded-2xl border border-dashed p-14 text-center">
          <Download className="mx-auto size-10 text-muted-foreground/40" />
          <p className="mt-3 font-medium">No downloads yet</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Downloads you make will appear here.
          </p>
          <Button variant="gradient" className="mt-4" asChild>
            <Link href="/resources">Find resources</Link>
          </Button>
        </div>
      ) : (
        <>
          <div className="space-y-3">
            {results.map((item) => {
              const exam = EXAMS.find((e) => e.slug === item.resource.exam);
              const type = RESOURCE_TYPES.find((t) => t.slug === item.resource.resourceType);
              return (
                <Card key={item.id} className="flex items-center gap-4 p-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      {exam && <Badge>{exam.name}</Badge>}
                      {type && <Badge variant="secondary">{type.name}</Badge>}
                      {item.resource.isPremium && <Badge variant="premium">Premium</Badge>}
                    </div>
                    <Link
                      href={`/resources/${item.resource.slug}`}
                      className="line-clamp-1 font-medium hover:text-primary transition-colors"
                    >
                      {item.resource.title}
                    </Link>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {item.resource.chapter} · {new Date(item.downloadedAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                  <Button variant="ghost" size="icon" asChild>
                    <Link href={`/resources/${item.resource.slug}`}>
                      <ExternalLink className="size-4" />
                    </Link>
                  </Button>
                </Card>
              );
            })}
          </div>
          <Suspense fallback={null}>
            <Pagination page={page} totalPages={totalPages} total={total} pageSize={PAGE_SIZE} />
          </Suspense>
        </>
      )}
    </div>
  );
}
