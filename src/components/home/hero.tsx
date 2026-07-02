"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Search, Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EXAMS } from "@/lib/constants";

const POPULAR = ["Kinematics notes", "NEET Biology PYQ", "Calculus formula sheet", "Organic chemistry"];

const stats = [
  { value: "15,000+", label: "Resources" },
  { value: "4", label: "Exams" },
  { value: "100%", label: "Free" },
  { value: "0", label: "Logins to browse" },
];

export function Hero() {
  const router = useRouter();
  const [q, setQ] = React.useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(q.trim() ? `/resources?q=${encodeURIComponent(q.trim())}` : "/resources");
  };

  return (
    <section className="relative overflow-hidden">
      {/* Background glows + grid */}
      <div className="pointer-events-none absolute inset-0 bg-grid [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]" />
      <div className="pointer-events-none absolute -top-40 left-1/2 size-[600px] -translate-x-1/2 rounded-full bg-gradient-to-br from-indigo-500/30 via-violet-500/20 to-fuchsia-500/20 blur-3xl" />

      <div className="container relative py-20 sm:py-28 lg:py-32">
        <div className="mx-auto max-w-3xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Link
              href="/premium"
              className="glass inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium shadow-sm transition-transform hover:scale-[1.02]"
            >
              <Sparkles className="size-4 text-primary" />
              Now organizing 15,000+ free resources
              <ArrowRight className="size-3.5" />
            </Link>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.05 }}
            className="mt-6 text-4xl font-extrabold tracking-tight sm:text-6xl"
          >
            One Platform. <span className="text-gradient">Every Resource.</span>
            <br className="hidden sm:block" /> Every Exam.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mx-auto mt-5 max-w-2xl text-lg text-muted-foreground"
          >
            India&apos;s largest organized library of{" "}
            <span className="font-semibold text-foreground">free</span> study
            material for JEE Main, JEE Advanced, NEET &amp; KCET. Stop searching
            dozens of sites — it&apos;s all here, perfectly categorized.
          </motion.p>

          {/* Search */}
          <motion.form
            onSubmit={submit}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="glass-strong mx-auto mt-8 flex max-w-xl items-center gap-2 rounded-2xl p-2 shadow-xl"
          >
            <Search className="ml-2 size-5 shrink-0 text-muted-foreground" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search notes, PYQs, mock tests, formula sheets…"
              className="h-11 w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
              aria-label="Search resources"
              suppressHydrationWarning
            />
            <Button type="submit" variant="gradient" className="shrink-0">
              Search
            </Button>
          </motion.form>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="mt-4 flex flex-wrap items-center justify-center gap-2 text-sm"
          >
            <span className="text-muted-foreground">Popular:</span>
            {POPULAR.map((p) => (
              <Link
                key={p}
                href={`/resources?q=${encodeURIComponent(p)}`}
                className="rounded-full border border-border bg-background/50 px-3 py-1 text-xs transition-colors hover:border-primary/40 hover:text-primary"
              >
                {p}
              </Link>
            ))}
          </motion.div>

          {/* Exam quick pills */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-8 flex flex-wrap justify-center gap-3"
          >
            {EXAMS.map((e) => (
              <Link
                key={e.slug}
                href={`/exams/${e.slug}`}
                className="glass rounded-xl px-4 py-2 text-sm font-semibold transition-transform hover:scale-105"
              >
                {e.name}
              </Link>
            ))}
          </motion.div>
        </div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.35 }}
          className="mx-auto mt-16 grid max-w-3xl grid-cols-2 gap-4 sm:grid-cols-4"
        >
          {stats.map((s) => (
            <div
              key={s.label}
              className="glass rounded-2xl p-5 text-center shadow-sm"
            >
              <div className="text-2xl font-bold text-gradient sm:text-3xl">
                {s.value}
              </div>
              <div className="mt-1 text-xs text-muted-foreground sm:text-sm">
                {s.label}
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
