"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  Users,
  Flag,
  ShieldCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard, exact: true },
  { href: "/admin/resources", label: "Resources", icon: FileText },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/reports", label: "Reports", icon: Flag },
];

export function AdminNav() {
  const pathname = usePathname();

  return (
    <ul className="space-y-0.5">
      {NAV.map(({ href, label, icon: Icon, exact }) => {
        const active = exact ? pathname === href : pathname.startsWith(href);
        return (
          <li key={href}>
            <Link
              href={href}
              className={cn(
                "flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                active
                  ? "bg-rose-500/15 text-rose-400"
                  : "text-slate-400 hover:bg-white/5 hover:text-white"
              )}
            >
              <Icon className="size-4 shrink-0" />
              {label}
            </Link>
          </li>
        );
      })}

      {/* Divider */}
      <li className="pt-2">
        <div className="border-t border-white/10" />
      </li>
      <li>
        <Link
          href="/dashboard"
          className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-500 transition-colors hover:bg-white/5 hover:text-slate-300"
        >
          <ShieldCheck className="size-4 shrink-0" />
          Back to Dashboard
        </Link>
      </li>
    </ul>
  );
}
