import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface AdminStatCardProps {
  label: string;
  value: number | string;
  icon: LucideIcon;
  color?: "rose" | "blue" | "emerald" | "amber" | "violet";
  description?: string;
}

const COLOR_MAP = {
  rose: "bg-rose-500/10 text-rose-400 border-rose-500/20",
  blue: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  emerald: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  amber: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  violet: "bg-violet-500/10 text-violet-400 border-violet-500/20",
};

export function AdminStatCard({
  label,
  value,
  icon: Icon,
  color = "blue",
  description,
}: AdminStatCardProps) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur-sm transition-all hover:bg-white/[0.06]">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-slate-500">{label}</p>
          <p className="mt-1.5 text-3xl font-bold text-white">
            {typeof value === "number" ? value.toLocaleString() : value}
          </p>
          {description && (
            <p className="mt-1 text-xs text-slate-500">{description}</p>
          )}
        </div>
        <div className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border", COLOR_MAP[color])}>
          <Icon className="size-5" />
        </div>
      </div>
    </div>
  );
}
