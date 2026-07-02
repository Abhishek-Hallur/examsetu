"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Menu, X, GraduationCap, Search, LogOut, LayoutDashboard } from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { NAV_LINKS, SITE } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function Navbar() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);
  const [userMenuOpen, setUserMenuOpen] = React.useState(false);
  const userMenuRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close user menu on outside click
  React.useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const user = session?.user;
  const initials = user?.name
    ? user.name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2)
    : "U";

  function handleSignOut() {
    setUserMenuOpen(false);
    signOut({ callbackUrl: "/" });
  }

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all",
        scrolled
          ? "glass-strong border-b shadow-sm"
          : "border-b border-transparent bg-transparent"
      )}
    >
      <nav className="container flex h-16 items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2 font-bold">
          <span className="grid size-9 place-items-center rounded-xl bg-gradient-to-br from-indigo-500 to-fuchsia-500 text-white shadow-lg shadow-violet-500/30">
            <GraduationCap className="size-5" />
          </span>
          <span className="text-lg tracking-tight">{SITE.name}</span>
        </Link>

        {/* Desktop nav links */}
        <div className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            >
              {l.label}
            </Link>
          ))}
        </div>

        {/* Desktop right */}
        <div className="hidden items-center gap-2 md:flex">
          <Button variant="ghost" size="icon" asChild aria-label="Search">
            <Link href="/resources">
              <Search className="size-5" />
            </Link>
          </Button>
          <ThemeToggle />

          {status === "loading" ? (
            <div className="size-9 animate-pulse rounded-full bg-muted" />
          ) : user ? (
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setUserMenuOpen((v) => !v)}
                className="flex size-9 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-fuchsia-500 text-sm font-semibold text-white shadow-md ring-2 ring-transparent transition hover:ring-violet-400/50 focus-visible:outline-none focus-visible:ring-violet-400"
                aria-label="User menu"
              >
                {user.image ? (
                  <Image
                    src={user.image}
                    alt={user.name ?? "Avatar"}
                    width={36}
                    height={36}
                    className="rounded-full object-cover"
                  />
                ) : (
                  initials
                )}
              </button>

              {userMenuOpen && (
                <div className="glass-strong absolute right-0 mt-2 w-52 rounded-xl border shadow-xl overflow-hidden">
                  <div className="border-b px-4 py-3">
                    <p className="truncate text-sm font-semibold">{user.name ?? "Student"}</p>
                    <p className="truncate text-xs text-muted-foreground">{user.email}</p>
                  </div>
                  <div className="p-1">
                    <button
                      onClick={() => { setUserMenuOpen(false); router.push("/dashboard"); }}
                      className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-accent transition-colors"
                    >
                      <LayoutDashboard className="size-4" />
                      Dashboard
                    </button>
                    <button
                      onClick={handleSignOut}
                      className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-destructive hover:bg-destructive/10 transition-colors"
                    >
                      <LogOut className="size-4" />
                      Sign out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <>
              <Button variant="ghost" asChild>
                <Link href="/login">Log in</Link>
              </Button>
              <Button variant="gradient" asChild>
                <Link href="/signup">Get started</Link>
              </Button>
            </>
          )}
        </div>

        {/* Mobile right */}
        <div className="flex items-center gap-1 md:hidden">
          <ThemeToggle />
          <Button
            variant="ghost"
            size="icon"
            aria-label="Menu"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </Button>
        </div>
      </nav>

      {/* Mobile drawer */}
      {open && (
        <div className="glass-strong border-t md:hidden">
          <div className="container flex flex-col gap-1 py-4">
            {NAV_LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2.5 text-sm font-medium hover:bg-accent"
              >
                {l.label}
              </Link>
            ))}
            <div className="mt-2 flex gap-2">
              {user ? (
                <>
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => { setOpen(false); router.push("/dashboard"); }}
                  >
                    <LayoutDashboard className="size-4" />
                    Dashboard
                  </Button>
                  <Button
                    variant="ghost"
                    className="flex-1 text-destructive hover:text-destructive"
                    onClick={() => { setOpen(false); signOut({ callbackUrl: "/" }); }}
                  >
                    <LogOut className="size-4" />
                    Sign out
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="outline" className="flex-1" asChild>
                    <Link href="/login" onClick={() => setOpen(false)}>Log in</Link>
                  </Button>
                  <Button variant="gradient" className="flex-1" asChild>
                    <Link href="/signup" onClick={() => setOpen(false)}>Get started</Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
