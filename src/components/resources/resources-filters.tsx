"use client";

import * as React from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  EXAMS,
  SUBJECTS,
  RESOURCE_TYPES,
  LANGUAGES,
} from "@/lib/constants";
import { cn } from "@/lib/utils";

const SORTS = [
  { value: "relevance", label: "Relevance" },
  { value: "newest", label: "Newest" },
  { value: "most-downloaded", label: "Most Downloaded" },
  { value: "most-viewed", label: "Most Viewed" },
  { value: "highest-rated", label: "Highest Rated" },
];

interface Props {
  /** Total result count — passed from the server component for display. */
  total: number;
}

/**
 * Client component that owns filter/sort UI state and syncs it to the URL.
 * Lives in the LEFT column of the results grid.
 * The actual data fetch is performed by the parent ResourcesExplorer server
 * component which re-renders on each URL navigation.
 */
export function ResourcesFilters({ total }: Props) {
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const [q, setQ] = React.useState(params.get("q") ?? "");
  const [exam, setExam] = React.useState(params.get("exam") ?? "");
  const [subject, setSubject] = React.useState(params.get("subject") ?? "");
  const [type, setType] = React.useState(params.get("type") ?? "");
  const [language, setLanguage] = React.useState(params.get("language") ?? "");
  const [sort, setSort] = React.useState(params.get("sort") ?? "relevance");
  const [showFilters, setShowFilters] = React.useState(false);

  /** Build and push new URL params, triggering a server re-render. */
  const push = React.useCallback(
    (overrides: Record<string, string> = {}) => {
      const state = { q, exam, subject, type, language, sort, ...overrides };
      const sp = new URLSearchParams();
      if (state.q) sp.set("q", state.q);
      if (state.exam) sp.set("exam", state.exam);
      if (state.subject) sp.set("subject", state.subject);
      if (state.type) sp.set("type", state.type);
      if (state.language) sp.set("language", state.language);
      if (state.sort !== "relevance") sp.set("sort", state.sort);
      const qs = sp.toString();
      router.push(qs ? `${pathname}?${qs}` : pathname);
    },
    [q, exam, subject, type, language, sort, pathname, router]
  );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    push();
  };

  const handleChange = (key: string, value: string) => {
    const setters: Record<string, (v: string) => void> = {
      exam: setExam,
      subject: setSubject,
      type: setType,
      language: setLanguage,
      sort: setSort,
    };
    setters[key]?.(value);
    push({ [key]: value });
  };

  const clearAll = () => {
    setExam(""); setSubject(""); setType(""); setLanguage("");
    push({ exam: "", subject: "", type: "", language: "" });
  };

  const activeFilters = [exam, subject, type, language].filter(Boolean).length;

  const FilterSelect = ({
    value,
    filterKey,
    label,
    children,
  }: {
    value: string;
    filterKey: string;
    label: string;
    children: React.ReactNode;
  }) => (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium text-muted-foreground">
        {label}
      </span>
      <select
        value={value}
        onChange={(e) => handleChange(filterKey, e.target.value)}
        className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        {children}
      </select>
    </label>
  );

  return (
    <>
      {/* ── Search bar spans full width (above the 2-col grid) ── */}
      <form
        onSubmit={handleSearch}
        className="glass-strong col-span-full flex items-center gap-2 rounded-2xl p-2 shadow-sm"
      >
        <Search className="ml-2 size-5 shrink-0 text-muted-foreground" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search resources…"
          className="h-10 w-full bg-transparent text-sm outline-none"
          aria-label="Search resources"
          suppressHydrationWarning
        />
        <Button type="submit" variant="gradient" className="shrink-0">
          Search
        </Button>
        {/* Mobile filter toggle */}
        <Button
          type="button"
          variant="outline"
          className="shrink-0 gap-2 lg:hidden"
          onClick={() => setShowFilters((v) => !v)}
          aria-label="Toggle filters"
        >
          <SlidersHorizontal className="size-4" />
          {activeFilters > 0 && <Badge>{activeFilters}</Badge>}
        </Button>
      </form>

      {/* ── Filter sidebar ── */}
      <aside
        className={cn(
          "space-y-4 rounded-2xl border bg-card p-5 lg:block",
          showFilters ? "block" : "hidden"
        )}
      >
        <div className="flex items-center justify-between">
          <h2 className="font-semibold">Filters</h2>
          {activeFilters > 0 && (
            <button
              onClick={clearAll}
              className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
            >
              <X className="size-3" /> Clear
            </button>
          )}
        </div>
        <FilterSelect value={exam} filterKey="exam" label="Exam">
          <option value="">All exams</option>
          {EXAMS.map((e) => (
            <option key={e.slug} value={e.slug}>{e.name}</option>
          ))}
        </FilterSelect>
        <FilterSelect value={subject} filterKey="subject" label="Subject">
          <option value="">All subjects</option>
          {SUBJECTS.map((s) => (
            <option key={s.slug} value={s.slug}>{s.name}</option>
          ))}
        </FilterSelect>
        <FilterSelect value={type} filterKey="type" label="Resource type">
          <option value="">All types</option>
          {RESOURCE_TYPES.map((t) => (
            <option key={t.slug} value={t.slug}>{t.name}</option>
          ))}
        </FilterSelect>
        <FilterSelect value={language} filterKey="language" label="Language">
          <option value="">All languages</option>
          {LANGUAGES.map((l) => (
            <option key={l} value={l}>{l}</option>
          ))}
        </FilterSelect>

        {/* Sort — also in sidebar for desktop */}
        <FilterSelect value={sort} filterKey="sort" label="Sort by">
          {SORTS.map((s) => (
            <option key={s.value} value={s.value}>{s.label}</option>
          ))}
        </FilterSelect>

        <p className="text-xs text-muted-foreground">
          {total} result{total === 1 ? "" : "s"}
        </p>
      </aside>
    </>
  );
}
