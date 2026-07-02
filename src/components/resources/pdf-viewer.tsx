"use client";

import { FileText, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PdfViewerProps {
  fileUrl?: string | null;
  title: string;
}

export function PdfViewer({ fileUrl, title }: PdfViewerProps) {
  if (!fileUrl) {
    return (
      <div className="mt-8 grid aspect-[4/3] place-items-center rounded-2xl border border-dashed bg-muted/20">
        <div className="text-center text-muted-foreground">
          <FileText className="mx-auto size-12 opacity-40" />
          <p className="mt-3 font-medium">No preview available</p>
          <p className="mt-1 text-sm">
            This resource doesn&apos;t have a direct file link yet.
          </p>
        </div>
      </div>
    );
  }

  // Use Google Docs viewer for PDFs hosted anywhere
  const viewerUrl = `https://docs.google.com/viewer?url=${encodeURIComponent(fileUrl)}&embedded=true`;

  return (
    <div className="mt-8 overflow-hidden rounded-2xl border bg-muted/10">
      <div className="flex items-center justify-between border-b bg-card px-4 py-2">
        <span className="truncate text-sm font-medium text-muted-foreground">
          {title}
        </span>
        <Button variant="ghost" size="sm" asChild>
          <a href={fileUrl} target="_blank" rel="noopener noreferrer">
            <ExternalLink className="size-3.5" />
            Open
          </a>
        </Button>
      </div>
      <iframe
        src={viewerUrl}
        className="aspect-[3/4] w-full"
        title={title}
        sandbox="allow-scripts allow-same-origin allow-popups"
        loading="lazy"
      />
    </div>
  );
}
