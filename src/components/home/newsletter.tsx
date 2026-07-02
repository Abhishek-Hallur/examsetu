"use client";

import * as React from "react";
import { Mail, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Reveal } from "@/components/motion/reveal";

export function NewsletterSection() {
  const [email, setEmail] = React.useState("");
  const [done, setDone] = React.useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    try {
      await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      setDone(true);
    } catch (err) {
      console.error("Failed to subscribe", err);
    }
  };

  return (
    <section className="container py-16 sm:py-20">
      <Reveal>
        <div className="glass-strong mx-auto max-w-3xl rounded-3xl p-8 text-center shadow-xl sm:p-12">
          <div className="mx-auto mb-4 grid size-12 place-items-center rounded-2xl bg-primary/10 text-primary">
            <Mail className="size-6" />
          </div>
          <h2 className="text-2xl font-bold sm:text-3xl">
            Get the weekly digest
          </h2>
          <p className="mx-auto mt-2 max-w-md text-muted-foreground">
            New resources, exam news and study tips — once a week. No spam.
          </p>

          {done ? (
            <div className="mt-6 inline-flex items-center gap-2 rounded-xl bg-emerald-500/10 px-4 py-3 text-sm font-medium text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="size-5" />
              You&apos;re subscribed! Check your inbox.
            </div>
          ) : (
            <form
              onSubmit={submit}
              className="mx-auto mt-6 flex max-w-md flex-col gap-2 sm:flex-row"
            >
              <Input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="h-11"
              />
              <Button type="submit" variant="gradient" className="h-11 shrink-0">
                Subscribe
              </Button>
            </form>
          )}
        </div>
      </Reveal>
    </section>
  );
}
