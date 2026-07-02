"use client";

import * as React from "react";
import {
  Download,
  Bookmark,
  Share2,
  Flag,
  Loader2,
  Check,
  BookmarkCheck,
  Star,
} from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface ResourceSidebarProps {
  resourceId: string;
  isPremium: boolean;
  slug: string;
}

export function ResourceSidebar({
  resourceId,
  isPremium,
  slug,
}: ResourceSidebarProps) {
  const { data: session } = useSession();
  const router = useRouter();

  const [downloading, setDownloading] = React.useState(false);
  const [downloaded, setDownloaded] = React.useState(false);
  const [bookmarked, setBookmarked] = React.useState(false);
  const [bookmarkLoading, setBookmarkLoading] = React.useState(false);
  const [copied, setCopied] = React.useState(false);
  const [rating, setRating] = React.useState(0);
  const [ratingHover, setRatingHover] = React.useState(0);
  const [ratingDone, setRatingDone] = React.useState(false);

  // Check initial bookmark state
  React.useEffect(() => {
    if (!session?.user) return;
    fetch(`/api/resources/${resourceId}/bookmark`)
      .then((r) => r.json())
      .then((d) => setBookmarked(d.bookmarked ?? false))
      .catch(() => {});
  }, [resourceId, session?.user]);

  // Track view on mount
  React.useEffect(() => {
    fetch(`/api/resources/${resourceId}/view`, { method: "POST" }).catch(() => {});
  }, [resourceId]);

  async function handleDownload() {
    setDownloading(true);
    try {
      const res = await fetch(`/api/resources/${resourceId}/download`, {
        method: "POST",
      });
      const data = await res.json();

      if (res.status === 401) {
        router.push(`/login?callbackUrl=/resources/${slug}`);
        return;
      }
      if (res.status === 403) {
        router.push("/premium");
        return;
      }
      if (!res.ok) {
        alert(data.error ?? "Download failed");
        return;
      }

      if (data.fileUrl) {
        window.open(data.fileUrl, "_blank", "noopener,noreferrer");
      } else {
        alert("No file available for this resource yet.");
      }

      setDownloaded(true);
      setTimeout(() => setDownloaded(false), 3000);
    } finally {
      setDownloading(false);
    }
  }

  async function handleBookmark() {
    if (!session?.user) {
      router.push(`/login?callbackUrl=/resources/${slug}`);
      return;
    }
    setBookmarkLoading(true);
    try {
      const res = await fetch(`/api/resources/${resourceId}/bookmark`, {
        method: "POST",
      });
      const data = await res.json();
      setBookmarked(data.bookmarked ?? false);
    } finally {
      setBookmarkLoading(false);
    }
  }

  async function handleShare() {
    const url = window.location.href;
    if (navigator.share) {
      await navigator.share({ url }).catch(() => {});
    } else {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  async function handleRate(value: number) {
    if (!session?.user) {
      router.push(`/login?callbackUrl=/resources/${slug}`);
      return;
    }
    setRating(value);
    await fetch(`/api/resources/${resourceId}/rate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ value }),
    });
    setRatingDone(true);
  }

  return (
    <aside className="space-y-4">
      <Card className="p-5">
        <Button
          variant="gradient"
          className="w-full"
          size="lg"
          onClick={handleDownload}
          disabled={downloading}
        >
          {downloading ? (
            <Loader2 className="size-4 animate-spin" />
          ) : downloaded ? (
            <Check className="size-4" />
          ) : (
            <Download className="size-4" />
          )}
          {isPremium ? "Download (Premium)" : "Download"}
        </Button>

        <div className="mt-3 grid grid-cols-2 gap-2">
          <Button
            variant={bookmarked ? "default" : "outline"}
            onClick={handleBookmark}
            disabled={bookmarkLoading}
          >
            {bookmarkLoading ? (
              <Loader2 className="size-4 animate-spin" />
            ) : bookmarked ? (
              <BookmarkCheck className="size-4" />
            ) : (
              <Bookmark className="size-4" />
            )}
            {bookmarked ? "Saved" : "Save"}
          </Button>

          <Button variant="outline" onClick={handleShare}>
            <Share2 className="size-4" />
            {copied ? "Copied!" : "Share"}
          </Button>
        </div>

        <Button
          variant="ghost"
          className="mt-2 w-full text-muted-foreground"
          onClick={() =>
            alert(
              "Thank you for reporting. Our team will review this resource."
            )
          }
        >
          <Flag className="size-4" />
          Report broken link
        </Button>
      </Card>

      {/* Star rating */}
      <Card className="p-5">
        <h3 className="mb-3 text-sm font-semibold">Rate this resource</h3>
        {ratingDone ? (
          <p className="text-sm text-muted-foreground">
            Thanks for rating! You gave it {rating} star{rating !== 1 ? "s" : ""}.
          </p>
        ) : (
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((v) => (
              <button
                key={v}
                onMouseEnter={() => setRatingHover(v)}
                onMouseLeave={() => setRatingHover(0)}
                onClick={() => handleRate(v)}
                className="transition-transform hover:scale-110 focus-visible:outline-none"
                aria-label={`Rate ${v} star${v !== 1 ? "s" : ""}`}
              >
                <Star
                  className={
                    v <= (ratingHover || rating)
                      ? "size-6 fill-amber-400 text-amber-400"
                      : "size-6 text-muted-foreground"
                  }
                />
              </button>
            ))}
          </div>
        )}
      </Card>
    </aside>
  );
}
