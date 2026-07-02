"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface PaginationProps {
  page: number;
  totalPages: number;
  total: number;
  pageSize: number;
}

export function Pagination({ page, totalPages, total, pageSize }: PaginationProps) {
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  if (totalPages <= 1) return null;

  function goToPage(p: number) {
    const sp = new URLSearchParams(params.toString());
    if (p === 1) {
      sp.delete("page");
    } else {
      sp.set("page", String(p));
    }
    const qs = sp.toString();
    router.push(qs ? `${pathname}?${qs}` : pathname);
  }

  // Build page window: always show first, last, current ±1
  const pages = new Set<number>();
  pages.add(1);
  pages.add(totalPages);
  for (let i = Math.max(1, page - 1); i <= Math.min(totalPages, page + 1); i++) {
    pages.add(i);
  }
  const pageList = [...pages].sort((a, b) => a - b);

  const from = (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, total);

  return (
    <div className="mt-8 flex flex-col items-center gap-3">
      <p className="text-sm text-muted-foreground">
        Showing {from.toLocaleString("en-IN")}–{to.toLocaleString("en-IN")} of{" "}
        {total.toLocaleString("en-IN")} results
      </p>
      <div className="flex items-center gap-1">
        <Button
          variant="outline"
          size="icon"
          disabled={page <= 1}
          onClick={() => goToPage(page - 1)}
          aria-label="Previous page"
        >
          <ChevronLeft className="size-4" />
        </Button>

        {pageList.map((p, i) => {
          const prev = pageList[i - 1];
          const showEllipsis = prev !== undefined && p - prev > 1;
          return (
            <span key={p} className="flex items-center gap-1">
              {showEllipsis && (
                <span className="px-1 text-sm text-muted-foreground">…</span>
              )}
              <Button
                variant={p === page ? "default" : "outline"}
                size="icon"
                onClick={() => goToPage(p)}
                className={cn(p === page && "pointer-events-none")}
                aria-label={`Page ${p}`}
                aria-current={p === page ? "page" : undefined}
              >
                {p}
              </Button>
            </span>
          );
        })}

        <Button
          variant="outline"
          size="icon"
          disabled={page >= totalPages}
          onClick={() => goToPage(page + 1)}
          aria-label="Next page"
        >
          <ChevronRight className="size-4" />
        </Button>
      </div>
    </div>
  );
}
