import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/motion/reveal";

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  href,
  hrefLabel = "View all",
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  href?: string;
  hrefLabel?: string;
}) {
  return (
    <Reveal className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        {eyebrow && (
          <span className="text-sm font-semibold uppercase tracking-wider text-primary">
            {eyebrow}
          </span>
        )}
        <h2 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
          {title}
        </h2>
        {subtitle && (
          <p className="mt-2 max-w-2xl text-muted-foreground">{subtitle}</p>
        )}
      </div>
      {href && (
        <Link
          href={href}
          className="inline-flex shrink-0 items-center gap-1 text-sm font-medium text-primary hover:underline"
        >
          {hrefLabel} <ArrowRight className="size-4" />
        </Link>
      )}
    </Reveal>
  );
}
