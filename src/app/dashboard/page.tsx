import { redirect } from "next/navigation";
import Link from "next/link";
import { Bookmark, Download, Eye, ArrowRight } from "lucide-react";
import { auth } from "@/auth";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getDashboardStats, getUserBookmarks } from "@/lib/data";
import { ResourceCard } from "@/components/resource-card";

export const metadata = { title: "Dashboard" };

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user) redirect("/login?callbackUrl=/dashboard");

  const userId = session.user.id;
  const [stats, recentBookmarks] = await Promise.all([
    getDashboardStats(userId),
    getUserBookmarks(userId, 1, 3),
  ]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Welcome back, {session.user.name?.split(" ")[0] ?? "Student"} 👋
        </h1>
        <p className="mt-1 text-muted-foreground">
          Here&apos;s a summary of your activity on ExamSetu.
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          icon={<Bookmark className="size-5 text-indigo-500" />}
          label="Bookmarks"
          value={stats.bookmarks}
          href="/dashboard/bookmarks"
          bg="bg-indigo-500/10"
        />
        <StatCard
          icon={<Download className="size-5 text-emerald-500" />}
          label="Downloads"
          value={stats.downloads}
          href="/dashboard/downloads"
          bg="bg-emerald-500/10"
        />
        <StatCard
          icon={<Eye className="size-5 text-amber-500" />}
          label="Resources viewed"
          value={stats.views}
          href="/resources"
          bg="bg-amber-500/10"
        />
      </div>

      {/* Recent bookmarks */}
      {recentBookmarks.results.length > 0 && (
        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Recent bookmarks</h2>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/dashboard/bookmarks">
                View all <ArrowRight className="size-3.5" />
              </Link>
            </Button>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {recentBookmarks.results.map((r) => (
              <ResourceCard key={r.id} resource={r} />
            ))}
          </div>
        </section>
      )}

      {stats.bookmarks === 0 && stats.downloads === 0 && (
        <div className="rounded-2xl border border-dashed p-10 text-center">
          <p className="font-medium">Nothing here yet</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Browse resources and start bookmarking or downloading.
          </p>
          <Button variant="gradient" className="mt-4" asChild>
            <Link href="/resources">Explore resources</Link>
          </Button>
        </div>
      )}
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  href,
  bg,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  href: string;
  bg: string;
}) {
  return (
    <Link href={href}>
      <Card className="flex items-center gap-4 p-5 transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md">
        <div className={`grid size-11 shrink-0 place-items-center rounded-xl ${bg}`}>
          {icon}
        </div>
        <div>
          <p className="text-2xl font-bold">{value.toLocaleString("en-IN")}</p>
          <p className="text-sm text-muted-foreground">{label}</p>
        </div>
      </Card>
    </Link>
  );
}
