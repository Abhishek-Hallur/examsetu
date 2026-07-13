import Link from "next/link";
import {
  ArrowRight,
  Sparkles,
  FolderTree,
  Search as SearchIcon,
  ShieldCheck,
  Zap,
  RefreshCw,
  Bookmark,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Reveal } from "@/components/motion/reveal";
import { SectionHeading } from "@/components/home/section-heading";
import {
  EXAMS,
  SUBJECTS,
  RESOURCE_TYPES,
} from "@/lib/constants";
import { formatCompact, cn } from "@/lib/utils";

/* ── Popular Exams ─────────────────────────────────────────── */
export function ExamsSection() {
  return (
    <section className="container py-16 sm:py-20">
      <SectionHeading
        eyebrow="Popular Exams"
        title="Pick your exam, find everything"
        subtitle="Curated resources mapped to the exact syllabus of each exam."
        href="/exams"
      />
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {EXAMS.map((exam, i) => (
          <Reveal key={exam.slug} delay={i * 0.05}>
            <Link href={`/exams/${exam.slug}`}>
              <Card className="group relative h-full overflow-hidden p-6 transition-all hover:-translate-y-1 hover:shadow-xl">
                <div
                  className={cn(
                    "absolute inset-0 -z-10 opacity-0 transition-opacity group-hover:opacity-10 bg-gradient-to-br",
                    exam.color
                  )}
                />
                <div
                  className={cn(
                    "mb-4 grid size-12 place-items-center rounded-xl bg-gradient-to-br text-white shadow-lg",
                    exam.color
                  )}
                >
                  <Icon name={exam.icon} className="size-6" />
                </div>
                <h3 className="text-lg font-bold">{exam.name}</h3>
                <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                  {exam.description}
                </p>
                <div className="mt-4 flex items-center justify-between">
                  <Badge variant="secondary">
                    {formatCompact(exam.resourceCount)} resources
                  </Badge>
                  <ArrowRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary" />
                </div>
              </Card>
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ── Popular Subjects ──────────────────────────────────────── */
export function SubjectsSection() {
  return (
    <section className="container py-16 sm:py-20">
      <SectionHeading
        eyebrow="Popular Subjects"
        title="Browse by subject"
        href="/subjects"
      />
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {SUBJECTS.map((s, i) => (
          <Reveal key={s.slug} delay={i * 0.05}>
            <Link href={`/subjects/${s.slug}`}>
              <Card className="group flex h-full items-center gap-4 p-5 transition-all hover:-translate-y-1 hover:shadow-lg">
                <div
                  className={cn(
                    "grid size-12 shrink-0 place-items-center rounded-xl bg-gradient-to-br text-white",
                    s.color
                  )}
                >
                  <Icon name={s.icon} className="size-6" />
                </div>
                <div className="min-w-0">
                  <h3 className="font-semibold">{s.name}</h3>
                  <p className="text-xs text-muted-foreground">
                    {formatCompact(s.resourceCount)} resources
                  </p>
                </div>
              </Card>
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ── Quick Access (resource types) ─────────────────────────── */
export function ResourceTypesSection() {
  return (
    <section className="container py-16 sm:py-20">
      <SectionHeading
        eyebrow="Quick Access"
        title="Jump straight to what you need"
        subtitle="Every resource type, one tap away."
      />
      <div className="flex flex-wrap gap-3">
        {RESOURCE_TYPES.map((t, i) => (
          <Reveal key={t.slug} delay={i * 0.03}>
            <Link href={`/resources?type=${t.slug}`}>
              <div className="glass group flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-medium transition-all hover:-translate-y-0.5 hover:border-primary/40">
                <Icon
                  name={t.icon}
                  className="size-4 text-primary transition-transform group-hover:scale-110"
                />
                {t.name}
              </div>
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ── How it works / Features ───────────────────────────────── */
const FEATURES = [
  {
    icon: FolderTree,
    title: "Auto-organized",
    desc: "Every document is sorted into Exam → Subject → Class → Chapter → Type → Year → Language. Nothing is ever uncategorized.",
  },
  {
    icon: SearchIcon,
    title: "Instant search",
    desc: "Find any resource in milliseconds with autocomplete and powerful filters.",
  },
  {
    icon: ShieldCheck,
    title: "Only legal sources",
    desc: "We only index resources from approved sources that permit redistribution. We never bypass paywalls.",
  },
  {
    icon: RefreshCw,
    title: "Always fresh",
    desc: "Automated jobs detect new material, update metadata and remove broken links — daily.",
  },
  {
    icon: Zap,
    title: "Blazing fast",
    desc: "Edge-cached, image-optimized and mobile-first. Built to feel instant on any connection.",
  },
  {
    icon: Bookmark,
    title: "Made for studying",
    desc: "Bookmarks, reading history, study planner and progress tracking — all in one dashboard.",
  },
];

export function FeaturesSection() {
  return (
    <section className="container py-16 sm:py-20">
      <SectionHeading
        eyebrow="Why ExamSetu"
        title="Built so you never search ten sites again"
      />
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {FEATURES.map((f, i) => (
          <Reveal key={f.title} delay={(i % 3) * 0.05}>
            <Card className="h-full p-6 transition-all hover:shadow-lg">
              <div className="mb-4 grid size-11 place-items-center rounded-xl bg-primary/10 text-primary">
                <f.icon className="size-5" />
              </div>
              <h3 className="font-semibold">{f.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{f.desc}</p>
            </Card>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ── Premium banner ────────────────────────────────────────── */
export function PremiumBanner() {
  return (
    <section className="container py-16 sm:py-20">
      <Reveal>
        <div className="relative overflow-hidden rounded-3xl border bg-gradient-to-br from-indigo-600 via-violet-600 to-fuchsia-600 p-8 text-white shadow-2xl sm:p-12">
          <div className="pointer-events-none absolute -right-20 -top-20 size-72 rounded-full bg-white/10 blur-3xl" />
          <div className="relative max-w-2xl">
            <Badge className="bg-white/20 text-white">
              <Sparkles className="mr-1 size-3" /> Premium
            </Badge>
            <h2 className="mt-4 text-3xl font-bold sm:text-4xl">
              Study without limits — from ₹99/month
            </h2>
            <p className="mt-3 text-white/80">
              No ads, unlimited &amp; offline downloads, advanced search,
              study analytics and exclusive themes. Cancel anytime.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button size="lg" variant="secondary" asChild>
                <Link href="/premium">View plans</Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white/40 bg-transparent text-white hover:bg-white/10"
                asChild
              >
                <Link href="/signup">Start free</Link>
              </Button>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
