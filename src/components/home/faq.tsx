"use client";

import * as React from "react";
import { ChevronDown } from "lucide-react";
import { Reveal } from "@/components/motion/reveal";
import { SectionHeading } from "@/components/home/section-heading";
import { FAQS } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function FaqSection() {
  const [open, setOpen] = React.useState<number | null>(0);

  return (
    <section className="container py-16 sm:py-20">
      <SectionHeading eyebrow="FAQ" title="Questions, answered" />
      <div className="mx-auto max-w-3xl space-y-3">
        {FAQS.map((f, i) => {
          const isOpen = open === i;
          return (
            <Reveal key={f.q} delay={i * 0.03}>
              <div className="overflow-hidden rounded-xl border bg-card">
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="flex w-full items-center justify-between gap-4 p-5 text-left font-medium"
                  aria-expanded={isOpen}
                  suppressHydrationWarning
                >
                  {f.q}
                  <ChevronDown
                    className={cn(
                      "size-5 shrink-0 text-muted-foreground transition-transform",
                      isOpen && "rotate-180"
                    )}
                  />
                </button>
                <div
                  className={cn(
                    "grid transition-all duration-300",
                    isOpen
                      ? "grid-rows-[1fr] opacity-100"
                      : "grid-rows-[0fr] opacity-0"
                  )}
                >
                  <div className="overflow-hidden">
                    <p className="px-5 pb-5 text-sm text-muted-foreground">
                      {f.a}
                    </p>
                  </div>
                </div>
              </div>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
