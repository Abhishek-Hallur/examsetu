import { getAdminReports } from "@/lib/data";
import { ReportsTable } from "@/components/admin/reports-table";

export const metadata = { title: "Reports — ExamSetu Admin" };

export default async function AdminReportsPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string; page?: string }>;
}) {
  const sp = await searchParams;
  const tab = sp.tab === "resolved" ? "resolved" : "open";
  const page = Math.max(1, parseInt(sp.page ?? "1", 10));

  const { results, total } = await getAdminReports({
    resolved: tab === "resolved",
    page,
    pageSize: 20,
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Moderation Reports</h1>
        <p className="mt-1 text-sm text-slate-400">
          Review and resolve user-submitted reports on resources.
        </p>
      </div>

      <ReportsTable
        initialRows={results}
        initialTotal={total}
        initialPage={page}
        pageSize={20}
        initialTab={tab}
      />
    </div>
  );
}
