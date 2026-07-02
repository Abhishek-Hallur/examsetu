import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import type { Role } from "@prisma/client";

const ADMIN_ROLES: Role[] = ["ADMIN", "MODERATOR"];

async function requireAdmin() {
  const session = await auth();
  const role = session?.user?.role as Role | undefined;
  if (!session?.user || !role || !ADMIN_ROLES.includes(role)) {
    return { error: NextResponse.json({ error: "Forbidden" }, { status: 403 }) };
  }
  return { error: null };
}

// PATCH /api/admin/resources/[id] — update resource fields
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { error } = await requireAdmin();
  if (error) return error;

  const { id } = await params;

  try {
    const body = await req.json();

    // Build update payload — only include defined fields
    const data: Record<string, unknown> = {};
    const scalar = [
      "title", "description", "classLevel", "chapter", "format",
      "language", "difficulty", "source", "fileUrl", "isPremium", "published",
    ] as const;
    for (const key of scalar) {
      if (key in body) data[key] = body[key];
    }
    if ("year" in body) data.year = body.year ? Number(body.year) : null;
    if ("examId" in body) data.examId = body.examId;
    if ("subjectId" in body) data.subjectId = body.subjectId;
    if ("resourceTypeId" in body) data.resourceTypeId = body.resourceTypeId;

    const resource = await prisma.resource.update({ where: { id }, data });
    return NextResponse.json({ resource });
  } catch (err) {
    console.error("[admin/resources/[id] PATCH]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// DELETE /api/admin/resources/[id] — soft-delete (unpublish)
export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { error } = await requireAdmin();
  if (error) return error;

  const { id } = await params;

  try {
    await prisma.resource.update({ where: { id }, data: { published: false } });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[admin/resources/[id] DELETE]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
