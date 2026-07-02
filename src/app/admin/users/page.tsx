import { getAdminUsers } from "@/lib/data";
import { auth } from "@/auth";
import { UsersTable } from "@/components/admin/users-table";

export const metadata = { title: "Users — ExamSetu Admin" };

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string }>;
}) {
  const sp = await searchParams;
  const page = Math.max(1, parseInt(sp.page ?? "1", 10));
  const q = sp.q;

  const session = await auth();
  const currentUserId = session?.user?.id ?? "";

  const { results, total } = await getAdminUsers({ q, page, pageSize: 20 });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Users</h1>
        <p className="mt-1 text-sm text-slate-400">
          Manage registered users and their roles. Role changes take effect on next login.
        </p>
      </div>
      <UsersTable
        initialRows={results}
        initialTotal={total}
        initialPage={page}
        pageSize={20}
        currentUserId={currentUserId}
        isAdmin={session?.user?.role === "ADMIN"}
      />
    </div>
  );
}
