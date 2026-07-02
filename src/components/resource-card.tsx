import Link from "next/link";
import { Download, Eye, Star, FileText, Play, Globe } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { formatCompact, cn } from "@/lib/utils";
import { EXAMS, RESOURCE_TYPES } from "@/lib/constants";
import type { Resource } from "@/types";

const formatIcon = {
  PDF: FileText,
  Video: Play,
  Website: Globe,
} as const;

export function ResourceCard({ resource }: { resource: Resource }) {
  const exam = EXAMS.find((e) => e.slug === resource.exam);
  const type = RESOURCE_TYPES.find((t) => t.slug === resource.resourceType);
  const FormatIcon = formatIcon[resource.format];

  return (
    <Card className="group relative flex h-full flex-col overflow-hidden transition-all hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5">
      {/* Accent strip */}
      <div
        className={cn(
          "h-1.5 w-full bg-gradient-to-r",
          exam?.color ?? "from-indigo-500 to-fuchsia-500"
        )}
      />
      <div className="flex flex-1 flex-col p-5">
        <div className="mb-3 flex items-center gap-2">
          <Badge variant="outline" className="gap-1">
            <FormatIcon className="size-3" />
            {resource.format}
          </Badge>
          {type && <Badge variant="secondary">{type.name}</Badge>}
          {resource.isPremium && <Badge variant="premium">Premium</Badge>}
        </div>

        <Link
          href={`/resources/${resource.slug}`}
          className="line-clamp-2 font-semibold leading-snug transition-colors group-hover:text-primary"
        >
          {resource.title}
        </Link>
        <p className="mt-2 line-clamp-2 flex-1 text-sm text-muted-foreground">
          {resource.description}
        </p>

        <div className="mt-3 flex flex-wrap gap-1.5">
          <Badge variant="default">{exam?.name}</Badge>
          <Badge variant="outline">{resource.classLevel}</Badge>
          <Badge variant="outline">{resource.language}</Badge>
        </div>

        <div className="mt-4 flex items-center justify-between border-t pt-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Eye className="size-3.5" /> {formatCompact(resource.views)}
          </span>
          <span className="flex items-center gap-1">
            <Download className="size-3.5" /> {formatCompact(resource.downloads)}
          </span>
          <span className="flex items-center gap-1">
            <Star className="size-3.5 fill-amber-400 text-amber-400" />
            {resource.rating.toFixed(1)}
          </span>
        </div>
      </div>
    </Card>
  );
}
