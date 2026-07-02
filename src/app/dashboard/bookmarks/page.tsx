import { redirect } from "next/navigation";
import Link from "next/link";
import { Bookmark } from "lucide-react";
import type { Metadata } from "next";
import { auth } from "@/auth";
import { getUserBookmarks } from "@/lib/data";
import { ResourceCard } from "@/components/resource-card";
import { Pagination } from "@/components/ui/pagination";
import { Button } from "@/components/ui/button";
import { Suspense } from "react";

export const metadata: Metadata = { title: "Bookmarks · Dashboard" };

const PAGE_SIZE = 12;

export default async function BookmarksPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const session = await auth();
  if (!session?.user) redirect("/login?callbackUrl=/dashboard/bookmarks");

  const sp = await searchParams;
  const page = Math.max(1, sp.page ? Number(sp.page) : 1);

  const { results, total } = await getUserBookmarks(session.user.id, page, PAGE_SIZE);
  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Bookmarks</h1>
          <p className="mt-0.5 text-sm text-muted-foreground">
            {total} saved resource{total !== 1 ? "s" : ""}
          </p>
        </div>
        <Button variant="outline" asChild>
          <Link href="/resources">Browse more</Link>
        </Button>
      </div>

      {results.length === 0 ? (
        <div className="rounded-2xl border border-dashed p-14 text-center">
          <Bookmark className="mx-auto size-10 text-muted-foreground/40" />
          <p className="mt-3 font-medium">No bookmarks yet</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Hit the Save button on any resource to bookmark it.
          </p>
          <Button variant="gradient" className="mt-4" asChild>
            <Link href="/resources">Explore resources</Link>
          </Button>
        </div>
      ) : (
        <>
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {results.map((r) => (
              <ResourceCard key={r.id} resource={r} />
            ))}
          </div>
          <Suspense fallback={null}>
            <Pagination page={page} totalPages={totalPages} total={total} pageSize={PAGE_SIZE} />
          </Suspense>
        </>
      )}
    </div>
  );
}
