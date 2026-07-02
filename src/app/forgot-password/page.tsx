"use client";

import * as React from "react";
import Link from "next/link";
import { GraduationCap, Mail, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function ForgotPasswordPage() {
  const [email, setEmail] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [sent, setSent] = React.useState(false);
  const [error, setError] = React.useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error ?? "Something went wrong. Please try again.");
      } else {
        setSent(true);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-16">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <div className="mx-auto mb-4 grid size-12 place-items-center rounded-2xl bg-gradient-to-br from-indigo-500 to-fuchsia-500 text-white shadow-lg shadow-violet-500/30">
            <GraduationCap className="size-6" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Reset your password</h1>
          <p className="text-sm text-muted-foreground">
            Enter your email and we&apos;ll send you a reset link.
          </p>
        </div>

        <div className="glass-strong rounded-2xl border p-6 shadow-xl">
          {sent ? (
            <div className="text-center space-y-3">
              <div className="mx-auto grid size-12 place-items-center rounded-full bg-emerald-500/10">
                <Mail className="size-6 text-emerald-500" />
              </div>
              <p className="font-medium">Check your inbox</p>
              <p className="text-sm text-muted-foreground">
                If <strong>{email}</strong> is registered, you&apos;ll receive a
                password reset link within a few minutes.
              </p>
              <Button variant="outline" className="w-full" asChild>
                <Link href="/login">
                  <ArrowLeft className="size-4" />
                  Back to log in
                </Link>
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1">
                <label htmlFor="email" className="text-sm font-medium">
                  Email address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    required
                    autoComplete="email"
                    className="pl-9"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              {error && (
                <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
                  {error}
                </p>
              )}

              <Button
                type="submit"
                variant="gradient"
                className="w-full"
                disabled={loading}
              >
                {loading && (
                  <span className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                )}
                Send reset link
              </Button>
            </form>
          )}
        </div>

        <p className="text-center text-sm text-muted-foreground">
          <Link
            href="/login"
            className="inline-flex items-center gap-1 font-medium text-foreground hover:underline underline-offset-4"
          >
            <ArrowLeft className="size-3.5" />
            Back to log in
          </Link>
        </p>
      </div>
    </div>
  );
}
