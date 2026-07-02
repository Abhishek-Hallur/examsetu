import { cn } from "@/lib/utils";
import { ReactNode } from "react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface Column<T = any> {
  key: keyof T | string;
  header: string;
  className?: string;
  render?: (row: T) => ReactNode;
}

interface DataTableProps<T extends object> {
  columns: Column<T>[];
  rows: T[];
  keyField: keyof T;
  emptyMessage?: string;
  className?: string;
}

export function DataTable<T extends object>({
  columns,
  rows,
  keyField,
  emptyMessage = "No data found.",
  className,
}: DataTableProps<T>) {
  return (
    <div className={cn("w-full overflow-x-auto rounded-2xl border border-white/10", className)}>
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-white/10 bg-white/[0.03]">
            {columns.map((col) => (
              <th
                key={String(col.key)}
                className={cn(
                  "px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400",
                  col.className
                )}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className="px-4 py-12 text-center text-slate-500"
              >
                {emptyMessage}
              </td>
            </tr>
          ) : (
            rows.map((row) => (
              <tr
                key={String(row[keyField])}
                className="border-b border-white/5 transition-colors hover:bg-white/[0.03]"
              >
                {columns.map((col) => (
                  <td
                    key={String(col.key)}
                    className={cn("px-4 py-3 text-slate-300", col.className)}
                  >
                    {col.render
                      ? col.render(row)
                      : String((row as Record<string, unknown>)[col.key as string] ?? "")}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
