import { Suspense } from "react";
import { ResourceCard } from "@/components/resource-card";
import { ResourcesFilters } from "@/components/resources/resources-filters";
import { Pagination } from "@/components/ui/pagination";
import { searchResources } from "@/lib/data";

const PAGE_SIZE = 24;

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

export async function ResourcesExplorer({ searchParams }: Props) {
  const sp = await searchParams;
  const page = Math.max(1, sp.page ? Number(sp.page) : 1);

  const { results, total } = await searchResources({
    q: sp.q,
    exam: sp.exam,
    subject: sp.subject,
    type: sp.type,
    language: sp.language,
    sort: sp.sort,
    page,
    pageSize: PAGE_SIZE,
  });

  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <div className="container py-10">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Resources</h1>
        <p className="mt-1 text-muted-foreground">
          Search and filter{" "}
          <span className="font-medium text-foreground">
            {total.toLocaleString("en-IN")}
          </span>{" "}
          resources across all exams, subjects and types.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[260px_1fr]">
        <Suspense
          fallback={
            <div className="col-span-full h-14 animate-pulse rounded-2xl bg-muted" />
          }
        >
          <ResourcesFilters total={total} />
        </Suspense>

        <div>
          {results.length === 0 ? (
            <div className="grid place-items-center rounded-2xl border border-dashed py-20 text-center">
              <p className="font-medium">No resources match your filters.</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Try clearing some filters or searching a different term.
              </p>
            </div>
          ) : (
            <>
              <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {results.map((r) => (
                  <ResourceCard key={r.id} resource={r} />
                ))}
              </div>
              <Suspense fallback={null}>
                <Pagination
                  page={page}
                  totalPages={totalPages}
                  total={total}
                  pageSize={PAGE_SIZE}
                />
              </Suspense>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
