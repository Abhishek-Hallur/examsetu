"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { getProviders, signIn } from "next-auth/react";
import { GraduationCap, Mail, Lock, Chrome } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Suspense } from "react";

const AUTH_ERROR_MESSAGES: Record<string, string> = {
  OAuthAccountNotLinked:
    "This email is already registered with another sign-in method. Log in with your password first.",
  AccessDenied: "Google sign-in was denied. Please try again and allow access.",
  OAuthCallbackError: "Google sign-in could not be completed. Check the OAuth callback configuration.",
  Configuration: "Authentication is not configured correctly on the server.",
};

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const rawCallbackUrl = params.get("callbackUrl") ?? "/dashboard";
  const callbackUrl =
    rawCallbackUrl.startsWith("/") && !rawCallbackUrl.startsWith("//")
      ? rawCallbackUrl
      : "/dashboard";

  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [googleLoading, setGoogleLoading] = React.useState(false);
  const [googleEnabled, setGoogleEnabled] = React.useState(false);

  React.useEffect(() => {
    const authError = params.get("error");
    if (authError) {
      setError(
        AUTH_ERROR_MESSAGES[authError] ??
          "Sign-in failed. Check the server logs for the authentication error."
      );
    }
  }, [params]);

  React.useEffect(() => {
    let active = true;

    getProviders()
      .then((providers) => {
        if (active) setGoogleEnabled(Boolean(providers?.google));
      })
      .catch(() => {
        if (active) setGoogleEnabled(false);
      });

    return () => {
      active = false;
    };
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Invalid email or password. Please try again.");
        return;
      }

      router.push(callbackUrl);
      router.refresh();
    } catch {
      setError("Login service is unavailable. Check the server configuration and try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogle() {
    setError("");
    setGoogleLoading(true);

    try {
      const result = await signIn("google", {
        callbackUrl,
        redirect: false,
      });

      if (!result?.url || result.error) {
        setError("Google sign-in could not start. Check the Google OAuth configuration.");
        setGoogleLoading(false);
        return;
      }

      window.location.assign(result.url);
    } catch {
      setError("Google sign-in could not start. Check the Google OAuth configuration.");
      setGoogleLoading(false);
    }
  }

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-16">
      <div className="w-full max-w-md space-y-6">
        <div className="space-y-2 text-center">
          <div className="mx-auto mb-4 grid size-12 place-items-center rounded-2xl bg-gradient-to-br from-indigo-500 to-fuchsia-500 text-white shadow-lg shadow-violet-500/30">
            <GraduationCap className="size-6" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Welcome back</h1>
          <p className="text-sm text-muted-foreground">
            Log in to access your bookmarks, history and downloads.
          </p>
        </div>

        <div className="glass-strong space-y-5 rounded-2xl border p-6 shadow-xl">
          {googleEnabled && (
            <>
              <Button
                type="button"
                variant="outline"
                className="w-full gap-2"
                onClick={handleGoogle}
                disabled={googleLoading || loading}
              >
                {googleLoading ? (
                  <span className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                ) : (
                  <Chrome className="size-4" />
                )}
                Continue with Google
              </Button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-xs text-muted-foreground">
                  <span className="bg-card px-2">or continue with email</span>
                </div>
              </div>
            </>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label htmlFor="email" className="text-sm font-medium">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  autoComplete="email"
                  required
                  className="pl-9"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="text-sm font-medium">
                  Password
                </label>
                <Link
                  href="/forgot-password"
                  className="text-xs text-muted-foreground transition-colors hover:text-foreground"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  autoComplete="current-password"
                  required
                  className="pl-9"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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
              disabled={loading || googleLoading}
            >
              {loading ? (
                <span className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
              ) : null}
              Log in
            </Button>
          </form>
        </div>

        <p className="text-center text-sm text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link
            href="/signup"
            className="font-medium text-foreground underline-offset-4 hover:underline"
          >
            Sign up free
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
          <div className="size-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
