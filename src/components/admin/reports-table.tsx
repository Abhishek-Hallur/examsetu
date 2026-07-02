"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import type { AdminReportRow } from "@/lib/data";
import { DataTable, Column } from "@/components/admin/data-table";
import { CheckCircle, ExternalLink } from "lucide-react";

interface ReportsTableProps {
  initialRows: AdminReportRow[];
  initialTotal: number;
  initialPage: number;
  pageSize: number;
  initialTab: "open" | "resolved";
}

export function ReportsTable({
  initialRows,
  initialTotal,
  initialPage,
  pageSize,
  initialTab,
}: ReportsTableProps) {
  const [rows, setRows] = useState(initialRows);
  const [total, setTotal] = useState(initialTotal);
  const [page, setPage] = useState(initialPage);
  const [tab, setTab] = useState<"open" | "resolved">(initialTab);
  const [isPending, startTransition] = useTransition();
  const [resolvingId, setResolvingId] = useState<string | null>(null);

  function switchTab(newTab: "open" | "resolved") {
    setTab(newTab);
    startTransition(async () => {
      const res = await fetch(`/api/admin/reports-list?resolved=${newTab === "resolved"}&page=1`);
      if (res.ok) {
        const data = await res.json();
        setRows(data.results);
        setTotal(data.total);
        setPage(1);
      }
    });
  }

  function fetchPage(newPage: number) {
    startTransition(async () => {
      const res = await fetch(`/api/admin/reports-list?resolved=${tab === "resolved"}&page=${newPage}`);
      if (res.ok) {
        const data = await res.json();
        setRows(data.results);
        setTotal(data.total);
        setPage(newPage);
      }
    });
  }

  async function resolveReport(id: string, resolved: boolean) {
    setResolvingId(id);
    try {
      const res = await fetch(`/api/admin/reports/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resolved }),
      });
      if (res.ok) {
        setRows((prev) => prev.filter((r) => r.id !== id));
        setTotal((t) => t - 1);
      }
    } finally {
      setResolvingId(null);
    }
  }

  const totalPages = Math.ceil(total / pageSize);

  const columns: Column<AdminReportRow>[] = [
    {
      key: "resource",
      header: "Resource",
      render: (row) => (
        <div className="flex items-start gap-2">
          <div>
            <p className="font-medium text-white">{row.resource.title}</p>
            <Link
              href={`/resources/${row.resource.slug}`}
              target="_blank"
              className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-rose-400"
            >
              View <ExternalLink className="size-3" />
            </Link>
          </div>
        </div>
      ),
    },
    {
      key: "reason",
      header: "Reason",
      render: (row) => (
        <span className="max-w-xs truncate text-slate-300">{row.reason}</span>
      ),
    },
    {
      key: "user",
      header: "Reporter",
      className: "hidden md:table-cell",
      render: (row) => (
        <span className="text-xs text-slate-400">
          {row.user?.name ?? row.user?.email ?? "Anonymous"}
        </span>
      ),
    },
    {
      key: "createdAt",
      header: "Date",
      className: "hidden lg:table-cell",
      render: (row) => (
        <span className="text-xs text-slate-400">
          {new Date(row.createdAt).toLocaleDateString("en-IN", { dateStyle: "medium" })}
        </span>
      ),
    },
    {
      key: "id",
      header: "Action",
      render: (row) => (
        <button
          onClick={() => resolveReport(row.id, !row.resolved)}
          disabled={resolvingId === row.id}
          className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors disabled:opacity-40 ${
            row.resolved
              ? "border border-white/10 text-slate-400 hover:bg-white/5"
              : "border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10"
          }`}
        >
          <CheckCircle className="size-3.5" />
          {row.resolved ? "Re-open" : "Resolve"}
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      {/* Tabs */}
      <div className="flex gap-1 rounded-xl border border-white/10 bg-white/[0.03] p-1 w-fit">
        {(["open", "resolved"] as const).map((t) => (
          <button
            key={t}
            onClick={() => switchTab(t)}
            className={`rounded-lg px-4 py-1.5 text-sm font-medium capitalize transition-colors ${
              tab === t
                ? "bg-white/10 text-white"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <DataTable<AdminReportRow>
        columns={columns}
        rows={rows}
        keyField="id"
        emptyMessage={tab === "open" ? "No open reports. All clear! 🎉" : "No resolved reports yet."}
      />

      {totalPages > 1 && (
        <div className="flex items-center justify-between text-sm text-slate-400">
          <span>{total} {tab} reports</span>
          <div className="flex gap-2">
            <button onClick={() => fetchPage(page - 1)} disabled={page <= 1 || isPending} className="rounded-lg border border-white/10 px-3 py-1.5 text-xs hover:bg-white/5 disabled:opacity-40">Previous</button>
            <span className="rounded-lg border border-white/10 px-3 py-1.5 text-xs">{page} / {totalPages}</span>
            <button onClick={() => fetchPage(page + 1)} disabled={page >= totalPages || isPending} className="rounded-lg border border-white/10 px-3 py-1.5 text-xs hover:bg-white/5 disabled:opacity-40">Next</button>
          </div>
        </div>
      )}
    </div>
  );
}
