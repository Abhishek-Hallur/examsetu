import { getAdminResources } from "@/lib/data";
import { ResourcesTable } from "@/components/admin/resources-table";

export const metadata = { title: "Resources — ExamSetu Admin" };

export default async function AdminResourcesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string; published?: string }>;
}) {
  const sp = await searchParams;
  const page = Math.max(1, parseInt(sp.page ?? "1", 10));
  const q = sp.q;
  const published = (sp.published ?? "all") as "all" | "true" | "false";

  const { results, total } = await getAdminResources({ q, page, pageSize: 20, published });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Resources</h1>
        <p className="mt-1 text-sm text-slate-400">
          Manage all study resources. Search, edit, or publish/unpublish entries.
        </p>
      </div>

      <ResourcesTable
        initialRows={results}
        initialTotal={total}
        initialPage={page}
        pageSize={20}
      />
    </div>
  );
}
