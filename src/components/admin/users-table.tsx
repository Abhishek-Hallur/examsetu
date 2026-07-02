"use client";

import { useState, useCallback, useTransition } from "react";
import type { AdminUserRow } from "@/lib/data";
import { DataTable, Column } from "@/components/admin/data-table";
import { Search, RefreshCw } from "lucide-react";

const ROLES = ["STUDENT", "PREMIUM", "MODERATOR", "ADMIN", "GUEST"] as const;

const ROLE_COLORS: Record<string, string> = {
  ADMIN: "bg-rose-500/15 text-rose-400",
  MODERATOR: "bg-violet-500/15 text-violet-400",
  PREMIUM: "bg-amber-500/15 text-amber-400",
  STUDENT: "bg-blue-500/15 text-blue-400",
  GUEST: "bg-slate-500/15 text-slate-400",
};

interface UsersTableProps {
  initialRows: AdminUserRow[];
  initialTotal: number;
  initialPage: number;
  pageSize: number;
  currentUserId: string;
  isAdmin: boolean;
}

export function UsersTable({
  initialRows,
  initialTotal,
  initialPage,
  pageSize,
  currentUserId,
  isAdmin,
}: UsersTableProps) {
  const [rows, setRows] = useState(initialRows);
  const [total, setTotal] = useState(initialTotal);
  const [page, setPage] = useState(initialPage);
  const [q, setQ] = useState("");
  const [isPending, startTransition] = useTransition();
  const [changingId, setChangingId] = useState<string | null>(null);

  const fetchPage = useCallback((newPage: number, newQ: string) => {
    startTransition(async () => {
      const params = new URLSearchParams();
      if (newQ) params.set("q", newQ);
      params.set("page", String(newPage));
      const res = await fetch(`/api/admin/users-list?${params}`);
      if (res.ok) {
        const data = await res.json();
        setRows(data.results);
        setTotal(data.total);
        setPage(newPage);
      }
    });
  }, []);

  async function changeRole(userId: string, role: string) {
    setChangingId(userId);
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role }),
      });
      if (res.ok) {
        setRows((prev) =>
          prev.map((r) => (r.id === userId ? { ...r, role } : r))
        );
      }
    } finally {
      setChangingId(null);
    }
  }

  const totalPages = Math.ceil(total / pageSize);

  const columns: Column<AdminUserRow>[] = [
    {
      key: "name",
      header: "User",
      render: (row) => (
        <div>
          <p className="font-medium text-white">{row.name ?? "(no name)"}</p>
          <p className="text-xs text-slate-500">{row.email}</p>
        </div>
      ),
    },
    {
      key: "role",
      header: "Role",
      render: (row) => {
        if (!isAdmin || row.id === currentUserId) {
          return (
            <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${ROLE_COLORS[row.role] ?? ""}`}>
              {row.role}
            </span>
          );
        }
        return (
          <select
            value={row.role}
            disabled={changingId === row.id}
            onChange={(e) => changeRole(row.id, e.target.value)}
            className="rounded-lg border border-white/10 bg-white/5 px-2 py-1 text-xs text-white focus:outline-none disabled:opacity-50"
          >
            {ROLES.map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
        );
      },
    },
    {
      key: "createdAt",
      header: "Joined",
      className: "hidden md:table-cell",
      render: (row) => (
        <span className="text-slate-400">
          {new Date(row.createdAt).toLocaleDateString("en-IN", { dateStyle: "medium" })}
        </span>
      ),
    },
    {
      key: "_count",
      header: "Bookmarks",
      className: "hidden lg:table-cell",
      render: (row) => <span className="text-slate-400">{row._count.bookmarks}</span>,
    },
    {
      key: "_count",
      header: "Downloads",
      className: "hidden lg:table-cell",
      render: (row) => <span className="text-slate-400">{row._count.userDownloads}</span>,
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-500" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && fetchPage(1, q)}
            placeholder="Search by name or email…"
            className="rounded-xl border border-white/10 bg-white/5 py-2 pl-9 pr-4 text-sm text-white placeholder-slate-500 focus:border-rose-500/40 focus:outline-none"
          />
        </div>
        <button
          onClick={() => fetchPage(1, q)}
          disabled={isPending}
          className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-300 transition-colors hover:bg-white/10"
        >
          {isPending ? <RefreshCw className="size-4 animate-spin" /> : <Search className="size-4" />}
        </button>
      </div>

      <DataTable<AdminUserRow>
        columns={columns}
        rows={rows}
        keyField="id"
        emptyMessage="No users found."
      />

      {totalPages > 1 && (
        <div className="flex items-center justify-between text-sm text-slate-400">
          <span>{total} total users</span>
          <div className="flex gap-2">
            <button onClick={() => fetchPage(page - 1, q)} disabled={page <= 1 || isPending} className="rounded-lg border border-white/10 px-3 py-1.5 text-xs hover:bg-white/5 disabled:opacity-40">Previous</button>
            <span className="rounded-lg border border-white/10 px-3 py-1.5 text-xs">{page} / {totalPages}</span>
            <button onClick={() => fetchPage(page + 1, q)} disabled={page >= totalPages || isPending} className="rounded-lg border border-white/10 px-3 py-1.5 text-xs hover:bg-white/5 disabled:opacity-40">Next</button>
          </div>
        </div>
      )}

      {!isAdmin && (
        <p className="text-xs text-slate-500">
          * Role changes are only available to ADMIN users.
        </p>
      )}
    </div>
  );
}
