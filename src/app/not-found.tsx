import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <section className="container flex min-h-[70vh] flex-col items-center justify-center text-center">
      <p className="text-7xl font-extrabold text-gradient">404</p>
      <h1 className="mt-4 text-2xl font-bold">Page not found</h1>
      <p className="mt-2 max-w-md text-muted-foreground">
        The page you&apos;re looking for doesn&apos;t exist or has moved. Let&apos;s
        get you back to studying.
      </p>
      <div className="mt-6 flex gap-3">
        <Button variant="outline" asChild>
          <Link href="/">Back home</Link>
        </Button>
        <Button variant="gradient" asChild>
          <Link href="/resources">Browse resources</Link>
        </Button>
      </div>
    </section>
  );
}
