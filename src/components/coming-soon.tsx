import Link from "next/link";
import { Construction, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

/** Placeholder for routes scheduled in a later build phase. */
export function ComingSoon({
  title,
  phase,
  description,
}: {
  title: string;
  phase: string;
  description?: string;
}) {
  return (
    <section className="container flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
      <div className="mb-5 grid size-16 place-items-center rounded-2xl bg-primary/10 text-primary">
        <Construction className="size-8" />
      </div>
      <Badge variant="secondary">{phase}</Badge>
      <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
        {title}
      </h1>
      <p className="mt-3 max-w-md text-muted-foreground">
        {description ??
          "This section is part of an upcoming build phase. The foundation is in place — full functionality is on the way."}
      </p>
      <div className="mt-6 flex gap-3">
        <Button variant="outline" asChild>
          <Link href="/">
            <ArrowLeft className="size-4" /> Back home
          </Link>
        </Button>
        <Button variant="gradient" asChild>
          <Link href="/resources">Browse resources</Link>
        </Button>
      </div>
    </section>
  );
}
