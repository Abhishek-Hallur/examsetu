import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/auth";
import { AdminNav } from "@/components/admin/admin-nav";
import { ShieldAlert } from "lucide-react";
import type { Role } from "@prisma/client";

const ADMIN_ROLES: Role[] = ["ADMIN", "MODERATOR"];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  const role = session?.user?.role as Role | undefined;

  if (!session?.user) redirect("/login?callbackUrl=/admin");
  if (!role || !ADMIN_ROLES.includes(role)) redirect("/");

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      {/* Top bar */}
      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#0a0a0f]/80 backdrop-blur-md">
        <div className="container flex h-14 items-center gap-3">
          <Link href="/admin" className="flex items-center gap-2 text-sm font-semibold text-white">
            <ShieldAlert className="size-4 text-rose-400" />
            <span>ExamSetu Admin</span>
          </Link>
          <span className="ml-auto rounded-full border border-rose-500/30 bg-rose-500/10 px-2.5 py-0.5 text-xs font-medium text-rose-400">
            {role}
          </span>
          <span className="hidden text-xs text-slate-500 sm:block">{session.user.email}</span>
        </div>
      </header>

      <div className="container py-8">
        <div className="flex flex-col gap-8 lg:flex-row lg:gap-10">
          {/* Sidebar */}
          <aside className="w-full shrink-0 lg:w-56">
            <nav className="rounded-2xl border border-white/10 bg-white/[0.03] p-2 backdrop-blur-sm">
              <AdminNav />
            </nav>
          </aside>

          {/* Content */}
          <main className="min-w-0 flex-1">{children}</main>
        </div>
      </div>
    </div>
  );
}
