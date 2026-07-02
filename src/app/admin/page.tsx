import { getAdminStats } from "@/lib/data";
import { AdminStatCard } from "@/components/admin/stat-card";
import {
  FileText,
  Users,
  Flag,
  Download,
  Bookmark,
  Eye,
} from "lucide-react";

export const metadata = { title: "Admin Overview — ExamSetu" };

export default async function AdminPage() {
  const stats = await getAdminStats();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">Admin Overview</h1>
        <p className="mt-1 text-sm text-slate-400">Platform-wide metrics at a glance.</p>
      </div>

      {/* Stats grid */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <AdminStatCard
          label="Total Resources"
          value={stats.totalResources}
          icon={FileText}
          color="blue"
          description={`${stats.publishedResources} published`}
        />
        <AdminStatCard
          label="Registered Users"
          value={stats.totalUsers}
          icon={Users}
          color="violet"
        />
        <AdminStatCard
          label="Open Reports"
          value={stats.openReports}
          icon={Flag}
          color={stats.openReports > 0 ? "rose" : "emerald"}
          description={stats.openReports === 0 ? "All clear!" : "Needs review"}
        />
        <AdminStatCard
          label="Total Downloads"
          value={stats.totalDownloads}
          icon={Download}
          color="emerald"
        />
        <AdminStatCard
          label="Total Bookmarks"
          value={stats.totalBookmarks}
          icon={Bookmark}
          color="amber"
        />
        <AdminStatCard
          label="Published Resources"
          value={stats.publishedResources}
          icon={Eye}
          color="blue"
          description={`${stats.totalResources - stats.publishedResources} unpublished`}
        />
      </div>

      {/* Quick links */}
      <div>
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-slate-400">Quick Actions</h2>
        <div className="grid gap-3 sm:grid-cols-3">
          {[
            { href: "/admin/resources/new", label: "Add Resource", desc: "Create a new study resource" },
            { href: "/admin/reports", label: "Review Reports", desc: `${stats.openReports} open reports` },
            { href: "/admin/users", label: "Manage Users", desc: `${stats.totalUsers} registered users` },
          ].map(({ href, label, desc }) => (
            <a
              key={href}
              href={href}
              className="group rounded-2xl border border-white/10 bg-white/[0.03] p-4 transition-all hover:border-rose-500/30 hover:bg-white/[0.06]"
            >
              <p className="text-sm font-semibold text-white group-hover:text-rose-400">{label}</p>
              <p className="mt-0.5 text-xs text-slate-500">{desc}</p>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
