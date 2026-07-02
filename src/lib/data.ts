/**
 * Data-access contract for ExamSetu.
 *
 * This is the STABLE interface that pages and other agents implement against.
 * Every function tries a Prisma query first, maps DB rows to the UI types in
 * `@/types`, and on ANY error (e.g. no database running) gracefully falls back
 * to the demo arrays in `@/lib/constants`. The returned shapes always match
 * `@/types` exactly so pages typecheck and the app runs with or without a DB.
 *
 * Filtering/sorting semantics mirror `components/resources/resources-explorer.tsx`.
 */

import { prisma } from "@/lib/prisma";
import {
  EXAMS,
  SUBJECTS,
  RESOURCE_TYPES,
  DEMO_RESOURCES,
} from "@/lib/constants";
import type {
  Exam,
  Subject,
  ResourceTypeMeta,
  Resource,
  ExamSlug,
  SubjectSlug,
  Language,
  Difficulty,
  ResourceFormat,
} from "@/types";

// ─────────────────────────────────────────────────────────────
// Mapping helpers — DB rows → UI types
// ─────────────────────────────────────────────────────────────

/** A DB resource row with its relations included. */
type ResourceRow = {
  id: string;
  slug: string;
  title: string;
  description: string;
  classLevel: string;
  chapter: string;
  format: string;
  year: number | null;
  language: string;
  difficulty: string | null;
  views: number;
  downloads: number;
  rating: number;
  ratingCount: number;
  updatedAt: Date;
  source: string;
  isPremium: boolean;
  fileUrl: string | null;
  exam: { slug: string };
  subject: { slug: string };
  resourceType: { slug: string };
  tags: { tag: { slug: string } }[];
};

function toDateString(value: Date | string): string {
  if (typeof value === "string") return value.slice(0, 10);
  return value.toISOString().slice(0, 10);
}

function mapResource(row: ResourceRow): Resource {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    description: row.description,
    exam: row.exam.slug as ExamSlug,
    subject: row.subject.slug as SubjectSlug,
    classLevel: row.classLevel as Resource["classLevel"],
    chapter: row.chapter,
    resourceType: row.resourceType.slug,
    format: row.format as ResourceFormat,
    year: row.year ?? undefined,
    language: row.language as Language,
    difficulty: (row.difficulty as Difficulty | null) ?? undefined,
    tags: row.tags.map((t) => t.tag.slug),
    views: row.views,
    downloads: row.downloads,
    rating: row.rating,
    ratingCount: row.ratingCount,
    updatedAt: toDateString(row.updatedAt),
    source: row.source,
    isPremium: row.isPremium,
    fileUrl: row.fileUrl ?? null,
  };
}

const resourceInclude = {
  exam: { select: { slug: true } },
  subject: { select: { slug: true } },
  resourceType: { select: { slug: true } },
  tags: { include: { tag: { select: { slug: true } } } },
} as const;

/** Map a DB exam row (with subject join + resource count) to the UI Exam type. */
type ExamRow = {
  slug: string;
  name: string;
  fullName: string;
  description: string;
  color: string;
  icon: string;
  subjects: { subject: { slug: string } }[];
  _count: { resources: number };
};

function mapExam(row: ExamRow): Exam {
  return {
    slug: row.slug as ExamSlug,
    name: row.name,
    fullName: row.fullName,
    description: row.description,
    color: row.color,
    icon: row.icon,
    resourceCount: row._count.resources,
    subjects: row.subjects.map((s) => s.subject.slug as SubjectSlug),
  };
}

type SubjectRow = {
  slug: string;
  name: string;
  description: string;
  color: string;
  icon: string;
  _count: { resources: number };
};

function mapSubject(row: SubjectRow): Subject {
  return {
    slug: row.slug as SubjectSlug,
    name: row.name,
    description: row.description,
    color: row.color,
    icon: row.icon,
    resourceCount: row._count.resources,
  };
}

// ─────────────────────────────────────────────────────────────
// Shared sort/filter helpers (mirror resources-explorer.tsx)
// ─────────────────────────────────────────────────────────────

function sortResources(list: Resource[], sort?: string): Resource[] {
  switch (sort) {
    case "newest":
      return [...list].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
    case "most-downloaded":
      return [...list].sort((a, b) => b.downloads - a.downloads);
    case "most-viewed":
      return [...list].sort((a, b) => b.views - a.views);
    case "highest-rated":
      return [...list].sort((a, b) => b.rating - a.rating);
    default:
      return list;
  }
}

/** Prisma orderBy equivalent of the sort options above. */
function prismaOrderBy(sort?: string) {
  switch (sort) {
    case "newest":
      return { updatedAt: "desc" as const };
    case "most-downloaded":
      return { downloads: "desc" as const };
    case "most-viewed":
      return { views: "desc" as const };
    case "highest-rated":
      return { rating: "desc" as const };
    default:
      return undefined;
  }
}

// ─────────────────────────────────────────────────────────────
// Exams
// ─────────────────────────────────────────────────────────────

export async function getExams(): Promise<Exam[]> {
  try {
    const rows = await prisma.exam.findMany({
      orderBy: { order: "asc" },
      include: {
        subjects: { include: { subject: { select: { slug: true } } } },
        _count: { select: { resources: true } },
      },
    });
    if (rows.length === 0) return EXAMS;
    return rows.map(mapExam);
  } catch {
    return EXAMS;
  }
}

export async function getExamBySlug(slug: string): Promise<Exam | null> {
  try {
    const row = await prisma.exam.findUnique({
      where: { slug },
      include: {
        subjects: { include: { subject: { select: { slug: true } } } },
        _count: { select: { resources: true } },
      },
    });
    if (!row) return EXAMS.find((e) => e.slug === slug) ?? null;
    return mapExam(row);
  } catch {
    return EXAMS.find((e) => e.slug === slug) ?? null;
  }
}

// ─────────────────────────────────────────────────────────────
// Subjects
// ─────────────────────────────────────────────────────────────

export async function getSubjects(): Promise<Subject[]> {
  try {
    const rows = await prisma.subject.findMany({
      orderBy: { name: "asc" },
      include: { _count: { select: { resources: true } } },
    });
    if (rows.length === 0) return SUBJECTS;
    return rows.map(mapSubject);
  } catch {
    return SUBJECTS;
  }
}

export async function getSubjectBySlug(slug: string): Promise<Subject | null> {
  try {
    const row = await prisma.subject.findUnique({
      where: { slug },
      include: { _count: { select: { resources: true } } },
    });
    if (!row) return SUBJECTS.find((s) => s.slug === slug) ?? null;
    return mapSubject(row);
  } catch {
    return SUBJECTS.find((s) => s.slug === slug) ?? null;
  }
}

// ─────────────────────────────────────────────────────────────
// Resource types
// ─────────────────────────────────────────────────────────────

export async function getResourceTypes(): Promise<ResourceTypeMeta[]> {
  try {
    const rows = await prisma.resourceType.findMany({
      orderBy: { name: "asc" },
    });
    if (rows.length === 0) return RESOURCE_TYPES;
    return rows.map((r) => ({ slug: r.slug, name: r.name, icon: r.icon }));
  } catch {
    return RESOURCE_TYPES;
  }
}

// ─────────────────────────────────────────────────────────────
// Resources
// ─────────────────────────────────────────────────────────────

export async function getResourceBySlug(slug: string): Promise<Resource | null> {
  try {
    const row = await prisma.resource.findUnique({
      where: { slug },
      include: resourceInclude,
    });
    if (!row) return DEMO_RESOURCES.find((r) => r.slug === slug) ?? null;
    return mapResource(row as ResourceRow);
  } catch {
    return DEMO_RESOURCES.find((r) => r.slug === slug) ?? null;
  }
}

export interface SearchResourcesOptions {
  q?: string;
  exam?: string;
  subject?: string;
  type?: string;
  language?: string;
  sort?: string;
  page?: number;
  pageSize?: number;
}

export interface SearchResourcesResult {
  results: Resource[];
  total: number;
}

const DEFAULT_PAGE_SIZE = 24;

// ─────────────────────────────────────────────────────────────
// Dashboard queries
// ─────────────────────────────────────────────────────────────

export async function getDashboardStats(userId: string): Promise<{
  bookmarks: number;
  downloads: number;
  views: number;
}> {
  try {
    const [bookmarks, downloads, views] = await Promise.all([
      prisma.bookmark.count({ where: { userId } }),
      prisma.userDownload.count({ where: { userId } }),
      prisma.userView.count({ where: { userId } }),
    ]);
    return { bookmarks, downloads, views };
  } catch {
    return { bookmarks: 0, downloads: 0, views: 0 };
  }
}

export async function getUserBookmarks(
  userId: string,
  page = 1,
  pageSize = 12
): Promise<{ results: Resource[]; total: number }> {
  try {
    const [total, rows] = await Promise.all([
      prisma.bookmark.count({ where: { userId } }),
      prisma.bookmark.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * pageSize,
        take: pageSize,
        include: { resource: { include: resourceInclude } },
      }),
    ]);
    return {
      results: rows.map((b) => mapResource(b.resource as ResourceRow)),
      total,
    };
  } catch {
    return { results: [], total: 0 };
  }
}

export interface DownloadHistoryItem {
  id: string;
  downloadedAt: Date;
  resource: Resource;
}

export async function getUserDownloads(
  userId: string,
  page = 1,
  pageSize = 15
): Promise<{ results: DownloadHistoryItem[]; total: number }> {
  try {
    const [total, rows] = await Promise.all([
      prisma.userDownload.count({ where: { userId } }),
      prisma.userDownload.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * pageSize,
        take: pageSize,
        include: { resource: { include: resourceInclude } },
      }),
    ]);
    return {
      results: rows.map((d) => ({
        id: d.id,
        downloadedAt: d.createdAt,
        resource: mapResource(d.resource as ResourceRow),
      })),
      total,
    };
  } catch {
    return { results: [], total: 0 };
  }
}

export async function searchResources(
  opts: SearchResourcesOptions = {}
): Promise<SearchResourcesResult> {
  const { q, exam, subject, type, language, sort } = opts;
  const page = Math.max(1, opts.page ?? 1);
  const pageSize = Math.max(1, opts.pageSize ?? DEFAULT_PAGE_SIZE);

  try {
    const where = {
      published: true,
      ...(exam ? { exam: { slug: exam } } : {}),
      ...(subject ? { subject: { slug: subject } } : {}),
      ...(type ? { resourceType: { slug: type } } : {}),
      ...(language ? { language } : {}),
      ...(q
        ? {
            OR: [
              { title: { contains: q, mode: "insensitive" as const } },
              { description: { contains: q, mode: "insensitive" as const } },
              { chapter: { contains: q, mode: "insensitive" as const } },
              { tags: { some: { tag: { slug: { contains: q, mode: "insensitive" as const } } } } },
            ],
          }
        : {}),
    };

    const [total, rows] = await Promise.all([
      prisma.resource.count({ where }),
      prisma.resource.findMany({
        where,
        orderBy: prismaOrderBy(sort),
        skip: (page - 1) * pageSize,
        take: pageSize,
        include: resourceInclude,
      }),
    ]);

    return {
      results: (rows as ResourceRow[]).map(mapResource),
      total,
    };
  } catch {
    // Demo fallback — mirrors resources-explorer.tsx filtering exactly.
    let list = DEMO_RESOURCES.filter((r) => {
      const hay =
        `${r.title} ${r.description} ${r.chapter} ${r.tags.join(" ")}`.toLowerCase();
      if (q && !hay.includes(q.toLowerCase())) return false;
      if (exam && r.exam !== exam) return false;
      if (subject && r.subject !== subject) return false;
      if (type && r.resourceType !== type) return false;
      if (language && r.language !== language) return false;
      return true;
    });

    list = sortResources(list, sort);

    const total = list.length;
    const start = (page - 1) * pageSize;
    const results = list.slice(start, start + pageSize);
    return { results, total };
  }
}

// ─────────────────────────────────────────────────────────────
// Admin queries
// ─────────────────────────────────────────────────────────────

export interface AdminStats {
  totalResources: number;
  publishedResources: number;
  totalUsers: number;
  openReports: number;
  totalDownloads: number;
  totalBookmarks: number;
}

export async function getAdminStats(): Promise<AdminStats> {
  try {
    const [totalResources, publishedResources, totalUsers, openReports, totalDownloads, totalBookmarks] =
      await Promise.all([
        prisma.resource.count(),
        prisma.resource.count({ where: { published: true } }),
        prisma.user.count(),
        prisma.report.count({ where: { resolved: false } }),
        prisma.userDownload.count(),
        prisma.bookmark.count(),
      ]);
    return { totalResources, publishedResources, totalUsers, openReports, totalDownloads, totalBookmarks };
  } catch {
    return { totalResources: 0, publishedResources: 0, totalUsers: 0, openReports: 0, totalDownloads: 0, totalBookmarks: 0 };
  }
}

export interface AdminResourceRow {
  id: string;
  slug: string;
  title: string;
  exam: string;
  subject: string;
  resourceType: string;
  classLevel: string;
  format: string;
  language: string;
  isPremium: boolean;
  published: boolean;
  views: number;
  downloads: number;
  rating: number;
  ratingCount: number;
  createdAt: Date;
}

export async function getAdminResources(opts: {
  q?: string;
  page?: number;
  pageSize?: number;
  published?: "all" | "true" | "false";
}): Promise<{ results: AdminResourceRow[]; total: number }> {
  const page = Math.max(1, opts.page ?? 1);
  const pageSize = Math.max(1, opts.pageSize ?? 20);

  const publishedFilter =
    opts.published === "true"
      ? { published: true }
      : opts.published === "false"
      ? { published: false }
      : {};

  const where = {
    ...publishedFilter,
    ...(opts.q
      ? {
          OR: [
            { title: { contains: opts.q, mode: "insensitive" as const } },
            { chapter: { contains: opts.q, mode: "insensitive" as const } },
          ],
        }
      : {}),
  };

  try {
    const [total, rows] = await Promise.all([
      prisma.resource.count({ where }),
      prisma.resource.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * pageSize,
        take: pageSize,
        select: {
          id: true,
          slug: true,
          title: true,
          exam: { select: { name: true } },
          subject: { select: { name: true } },
          resourceType: { select: { name: true } },
          classLevel: true,
          format: true,
          language: true,
          isPremium: true,
          published: true,
          views: true,
          downloads: true,
          rating: true,
          ratingCount: true,
          createdAt: true,
        },
      }),
    ]);
    return {
      results: rows.map((r) => ({
        id: r.id,
        slug: r.slug,
        title: r.title,
        exam: r.exam.name,
        subject: r.subject.name,
        resourceType: r.resourceType.name,
        classLevel: r.classLevel,
        format: r.format,
        language: r.language,
        isPremium: r.isPremium,
        published: r.published,
        views: r.views,
        downloads: r.downloads,
        rating: r.rating,
        ratingCount: r.ratingCount,
        createdAt: r.createdAt,
      })),
      total,
    };
  } catch {
    return { results: [], total: 0 };
  }
}

export interface AdminUserRow {
  id: string;
  name: string | null;
  email: string;
  role: string;
  createdAt: Date;
  _count: { bookmarks: number; userDownloads: number };
}

export async function getAdminUsers(opts: {
  q?: string;
  page?: number;
  pageSize?: number;
}): Promise<{ results: AdminUserRow[]; total: number }> {
  const page = Math.max(1, opts.page ?? 1);
  const pageSize = Math.max(1, opts.pageSize ?? 20);

  const where = opts.q
    ? {
        OR: [
          { name: { contains: opts.q, mode: "insensitive" as const } },
          { email: { contains: opts.q, mode: "insensitive" as const } },
        ],
      }
    : {};

  try {
    const [total, rows] = await Promise.all([
      prisma.user.count({ where }),
      prisma.user.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * pageSize,
        take: pageSize,
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          createdAt: true,
          _count: { select: { bookmarks: true, userDownloads: true } },
        },
      }),
    ]);
    return { results: rows, total };
  } catch {
    return { results: [], total: 0 };
  }
}

export interface AdminReportRow {
  id: string;
  reason: string;
  resolved: boolean;
  createdAt: Date;
  resource: { id: string; title: string; slug: string };
  user: { name: string | null; email: string } | null;
}

export async function getAdminReports(opts: {
  resolved?: boolean;
  page?: number;
  pageSize?: number;
}): Promise<{ results: AdminReportRow[]; total: number }> {
  const page = Math.max(1, opts.page ?? 1);
  const pageSize = Math.max(1, opts.pageSize ?? 20);
  const where = opts.resolved !== undefined ? { resolved: opts.resolved } : {};

  try {
    const [total, rows] = await Promise.all([
      prisma.report.count({ where }),
      prisma.report.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * pageSize,
        take: pageSize,
        select: {
          id: true,
          reason: true,
          resolved: true,
          createdAt: true,
          resource: { select: { id: true, title: true, slug: true } },
          user: { select: { name: true, email: true } },
        },
      }),
    ]);
    return { results: rows, total };
  } catch {
    return { results: [], total: 0 };
  }
}

/** Full resource row for the edit form — includes all relations. */
export async function getResourceForEdit(id: string): Promise<{
  id: string;
  title: string;
  description: string;
  examId: string;
  subjectId: string;
  resourceTypeId: string;
  classLevel: string;
  chapter: string;
  format: string;
  year: number | null;
  language: string;
  difficulty: string | null;
  source: string;
  fileUrl: string | null;
  isPremium: boolean;
  published: boolean;
  tags: string[];
} | null> {
  try {
    const r = await prisma.resource.findUnique({
      where: { id },
      select: {
        id: true,
        title: true,
        description: true,
        examId: true,
        subjectId: true,
        resourceTypeId: true,
        classLevel: true,
        chapter: true,
        format: true,
        year: true,
        language: true,
        difficulty: true,
        source: true,
        fileUrl: true,
        isPremium: true,
        published: true,
        tags: { select: { tag: { select: { slug: true } } } },
      },
    });
    if (!r) return null;
    return { ...r, tags: r.tags.map((t) => t.tag.slug) };
  } catch {
    return null;
  }
}

