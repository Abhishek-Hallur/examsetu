"use client";

import * as React from "react";
import { Lock } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function PasswordForm({ hasPassword }: { hasPassword: boolean }) {
  const [current, setCurrent] = React.useState("");
  const [next, setNext] = React.useState("");
  const [confirm, setConfirm] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [message, setMessage] = React.useState("");
  const [error, setError] = React.useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage("");
    setError("");

    if (next !== confirm) { setError("New passwords do not match."); return; }
    if (next.length < 8) { setError("Password must be at least 8 characters."); return; }

    setLoading(true);

    const res = await fetch("/api/user/password", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ currentPassword: current, newPassword: next }),
    });

    setLoading(false);

    if (res.ok) {
      setMessage("Password updated successfully.");
      setCurrent(""); setNext(""); setConfirm("");
    } else {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Update failed.");
    }
  }

  if (!hasPassword) {
    return (
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-3">
          <Lock className="size-4 text-muted-foreground" />
          <h2 className="font-semibold">Password</h2>
        </div>
        <p className="text-sm text-muted-foreground">
          Your account uses Google sign-in. Password login is not enabled.
        </p>
      </Card>
    );
  }

  return (
    <Card className="p-6 space-y-4">
      <div className="flex items-center gap-2">
        <Lock className="size-4 text-muted-foreground" />
        <h2 className="font-semibold">Change password</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {[
          { id: "current", label: "Current password", val: current, set: setCurrent, auto: "current-password" },
          { id: "next", label: "New password", val: next, set: setNext, auto: "new-password" },
          { id: "confirm", label: "Confirm new password", val: confirm, set: setConfirm, auto: "new-password" },
        ].map(({ id, label, val, set, auto }) => (
          <div key={id} className="space-y-1">
            <label htmlFor={id} className="text-sm font-medium">{label}</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                id={id}
                type="password"
                placeholder="••••••••"
                required
                autoComplete={auto}
                className="pl-9"
                value={val}
                onChange={(e) => set(e.target.value)}
              />
            </div>
          </div>
        ))}

        {message && (
          <p className="rounded-lg bg-emerald-500/10 px-3 py-2 text-sm text-emerald-500">{message}</p>
        )}
        {error && (
          <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</p>
        )}

        <Button type="submit" disabled={loading}>
          {loading && <span className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent" />}
          Update password
        </Button>
      </form>
    </Card>
  );
}
