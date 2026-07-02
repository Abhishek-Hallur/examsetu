"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { User } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function ProfileForm({ name, email }: { name: string; email: string }) {
  const router = useRouter();
  const [value, setValue] = React.useState(name);
  const [loading, setLoading] = React.useState(false);
  const [message, setMessage] = React.useState("");
  const [error, setError] = React.useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage("");
    setError("");
    setLoading(true);

    const res = await fetch("/api/user/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: value }),
    });

    setLoading(false);

    if (res.ok) {
      setMessage("Name updated successfully.");
      router.refresh();
    } else {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Update failed.");
    }
  }

  return (
    <Card className="p-6 space-y-4">
      <div className="flex items-center gap-2">
        <User className="size-4 text-muted-foreground" />
        <h2 className="font-semibold">Profile</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1">
          <label htmlFor="name" className="text-sm font-medium">Display name</label>
          <Input
            id="name"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Your full name"
            required
            minLength={2}
          />
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium">Email</label>
          <Input value={email} disabled className="opacity-60 cursor-not-allowed" />
          <p className="text-xs text-muted-foreground">Email cannot be changed.</p>
        </div>

        {message && (
          <p className="rounded-lg bg-emerald-500/10 px-3 py-2 text-sm text-emerald-500">{message}</p>
        )}
        {error && (
          <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</p>
        )}

        <Button type="submit" disabled={loading || value.trim() === name}>
          {loading && <span className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent" />}
          Save changes
        </Button>
      </form>
    </Card>
  );
}
