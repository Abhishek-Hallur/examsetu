import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import type { Role } from "@prisma/client";

const ADMIN_ROLES: Role[] = ["ADMIN", "MODERATOR"];

async function requireAdmin() {
  const session = await auth();
  const role = session?.user?.role as Role | undefined;
  if (!session?.user || !role || !ADMIN_ROLES.includes(role)) {
    return { error: NextResponse.json({ error: "Forbidden" }, { status: 403 }), session: null };
  }
  return { error: null, session };
}

// POST /api/admin/resources — create a new resource
export async function POST(req: Request) {
  const { error } = await requireAdmin();
  if (error) return error;

  try {
    const body = await req.json();
    const {
      title, description, examId, subjectId, resourceTypeId,
      classLevel, chapter, format, year, language, difficulty,
      source, fileUrl, isPremium, published, tags,
    } = body;

    // Validate required fields
    if (!title || !examId || !subjectId || !resourceTypeId || !classLevel || !chapter || !format || !language || !source) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Build slug from title
    const baseSlug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
    const uniqueSuffix = Date.now().toString(36);
    const slug = `${baseSlug}-${uniqueSuffix}`;

    const resource = await prisma.resource.create({
      data: {
        slug,
        title,
        description: description ?? "",
        examId,
        subjectId,
        resourceTypeId,
        classLevel,
        chapter,
        format,
        year: year ? Number(year) : null,
        language,
        difficulty: difficulty || null,
        source,
        fileUrl: fileUrl || null,
        isPremium: isPremium ?? false,
        published: published ?? true,
        ...(tags && tags.length > 0
          ? {
              tags: {
                create: (tags as string[]).map((tagSlug: string) => ({
                  tag: { connect: { slug: tagSlug } },
                })),
              },
            }
          : {}),
      },
    });

    return NextResponse.json({ resource }, { status: 201 });
  } catch (err) {
    console.error("[admin/resources POST]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
