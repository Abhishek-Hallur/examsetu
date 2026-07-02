import { redirect } from "next/navigation";
import Image from "next/image";
import { auth } from "@/auth";
import { DashboardNav } from "@/components/dashboard/dashboard-nav";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user) redirect("/login?callbackUrl=/dashboard");

  const user = session.user;
  const initials = user.name
    ? user.name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2)
    : "U";

  return (
    <div className="container py-8">
      <div className="flex flex-col gap-8 lg:flex-row lg:gap-10">
        {/* Sidebar */}
        <aside className="w-full shrink-0 lg:w-60">
          {/* User card */}
          <div className="glass-strong mb-4 flex items-center gap-3 rounded-2xl border p-4">
            <div className="relative grid size-10 shrink-0 place-items-center overflow-hidden rounded-full bg-gradient-to-br from-indigo-500 to-fuchsia-500 text-sm font-semibold text-white">
              {user.image ? (
                <Image
                  src={user.image}
                  alt={user.name ?? "Avatar"}
                  width={40}
                  height={40}
                  className="rounded-full object-cover"
                />
              ) : (
                initials
              )}
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">{user.name ?? "Student"}</p>
              <p className="truncate text-xs text-muted-foreground">{user.email}</p>
            </div>
          </div>

          {/* Nav */}
          <nav className="glass-strong rounded-2xl border p-2">
            <DashboardNav />
          </nav>
        </aside>

        {/* Content */}
        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </div>
  );
}
