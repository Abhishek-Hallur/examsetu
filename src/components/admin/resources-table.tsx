"use client";

import { useState, useCallback, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { DataTable, Column } from "@/components/admin/data-table";
import type { AdminResourceRow } from "@/lib/data";
import { Eye, Download, Star, Plus, Search, RefreshCw, Pencil, EyeOff } from "lucide-react";

interface ResourcesTableProps {
  initialRows: AdminResourceRow[];
  initialTotal: number;
  initialPage: number;
  pageSize: number;
}

export function ResourcesTable({
  initialRows,
  initialTotal,
  initialPage,
  pageSize,
}: ResourcesTableProps) {
  const searchParams = useSearchParams();
  const [rows, setRows] = useState(initialRows);
  const [total, setTotal] = useState(initialTotal);
  const [page, setPage] = useState(initialPage);
  const [q, setQ] = useState(searchParams.get("q") ?? "");
  const [published, setPublished] = useState<"all" | "true" | "false">(
    (searchParams.get("published") as "all" | "true" | "false") ?? "all"
  );
  const [isPending, startTransition] = useTransition();
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const fetchPage = useCallback(
    (newPage: number, newQ: string, newPublished: string) => {
      startTransition(async () => {
        const params = new URLSearchParams();
        if (newQ) params.set("q", newQ);
        if (newPublished !== "all") params.set("published", newPublished);
        params.set("page", String(newPage));

        const res = await fetch(`/api/admin/resources-list?${params}`);
        if (res.ok) {
          const data = await res.json();
          setRows(data.results);
          setTotal(data.total);
          setPage(newPage);
        }
      });
    },
    []
  );

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    fetchPage(1, q, published);
  }

  async function togglePublish(row: AdminResourceRow) {
    setTogglingId(row.id);
    try {
      const res = await fetch(`/api/admin/resources/${row.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ published: !row.published }),
      });
      if (res.ok) {
        setRows((prev) =>
          prev.map((r) => (r.id === row.id ? { ...r, published: !r.published } : r))
        );
      }
    } finally {
      setTogglingId(null);
    }
  }

  const totalPages = Math.ceil(total / pageSize);

  const columns: Column<AdminResourceRow>[] = [
    {
      key: "title",
      header: "Title",
      className: "max-w-xs",
      render: (row) => (
        <div>
          <p className="truncate font-medium text-white">{row.title}</p>
          <p className="text-xs text-slate-500">{row.exam} · {row.subject}</p>
        </div>
      ),
    },
    { key: "resourceType", header: "Type", className: "hidden md:table-cell" },
    { key: "format", header: "Format", className: "hidden lg:table-cell" },
    { key: "language", header: "Lang", className: "hidden xl:table-cell" },
    {
      key: "views",
      header: "Views",
      className: "hidden lg:table-cell",
      render: (row) => (
        <span className="flex items-center gap-1 text-slate-400">
          <Eye className="size-3" /> {row.views.toLocaleString()}
        </span>
      ),
    },
    {
      key: "downloads",
      header: "DL",
      className: "hidden lg:table-cell",
      render: (row) => (
        <span className="flex items-center gap-1 text-slate-400">
          <Download className="size-3" /> {row.downloads.toLocaleString()}
        </span>
      ),
    },
    {
      key: "rating",
      header: "Rating",
      className: "hidden xl:table-cell",
      render: (row) => (
        <span className="flex items-center gap-1 text-amber-400">
          <Star className="size-3" /> {row.rating.toFixed(1)}
        </span>
      ),
    },
    {
      key: "published",
      header: "Status",
      render: (row) => (
        <span
          className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
            row.published
              ? "bg-emerald-500/15 text-emerald-400"
              : "bg-slate-500/15 text-slate-400"
          }`}
        >
          {row.published ? "Published" : "Unpublished"}
        </span>
      ),
    },
    {
      key: "id",
      header: "Actions",
      render: (row) => (
        <div className="flex items-center gap-2">
          <Link
            href={`/admin/resources/${row.id}/edit`}
            className="flex h-7 w-7 items-center justify-center rounded-lg border border-white/10 text-slate-400 transition-colors hover:border-blue-500/30 hover:text-blue-400"
            title="Edit"
          >
            <Pencil className="size-3.5" />
          </Link>
          <button
            onClick={() => togglePublish(row)}
            disabled={togglingId === row.id}
            className="flex h-7 w-7 items-center justify-center rounded-lg border border-white/10 text-slate-400 transition-colors hover:border-rose-500/30 hover:text-rose-400 disabled:opacity-40"
            title={row.published ? "Unpublish" : "Publish"}
          >
            <EyeOff className="size-3.5" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-500" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search resources…"
              className="rounded-xl border border-white/10 bg-white/5 py-2 pl-9 pr-4 text-sm text-white placeholder-slate-500 focus:border-rose-500/40 focus:outline-none"
            />
          </div>
          <select
            value={published}
            onChange={(e) => {
              const v = e.target.value as "all" | "true" | "false";
              setPublished(v);
              fetchPage(1, q, v);
            }}
            className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:outline-none"
          >
            <option value="all">All</option>
            <option value="true">Published</option>
            <option value="false">Unpublished</option>
          </select>
          <button
            type="submit"
            className="flex items-center gap-1.5 rounded-xl bg-white/5 border border-white/10 px-3 py-2 text-sm text-slate-300 transition-colors hover:bg-white/10"
          >
            {isPending ? <RefreshCw className="size-4 animate-spin" /> : <Search className="size-4" />}
          </button>
        </form>

        <Link
          href="/admin/resources/new"
          className="flex items-center gap-2 rounded-xl bg-rose-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-rose-500"
        >
          <Plus className="size-4" />
          New Resource
        </Link>
      </div>

      {/* Table */}
      <DataTable<AdminResourceRow>
        columns={columns}
        rows={rows}
        keyField="id"
        emptyMessage="No resources found. Try adjusting your filters."
      />

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between text-sm text-slate-400">
          <span>{total} total resources</span>
          <div className="flex gap-2">
            <button
              onClick={() => fetchPage(page - 1, q, published)}
              disabled={page <= 1 || isPending}
              className="rounded-lg border border-white/10 px-3 py-1.5 text-xs transition-colors hover:bg-white/5 disabled:opacity-40"
            >
              Previous
            </button>
            <span className="rounded-lg border border-white/10 px-3 py-1.5 text-xs">
              {page} / {totalPages}
            </span>
            <button
              onClick={() => fetchPage(page + 1, q, published)}
              disabled={page >= totalPages || isPending}
              className="rounded-lg border border-white/10 px-3 py-1.5 text-xs transition-colors hover:bg-white/5 disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
