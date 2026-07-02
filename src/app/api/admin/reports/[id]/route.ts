import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import type { Role } from "@prisma/client";

const ADMIN_ROLES: Role[] = ["ADMIN", "MODERATOR"];

// PATCH /api/admin/reports/[id] — resolve/unresolve a report
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  const role = session?.user?.role as Role | undefined;
  if (!session?.user || !role || !ADMIN_ROLES.includes(role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;

  try {
    const { resolved } = await req.json();
    const report = await prisma.report.update({
      where: { id },
      data: { resolved: resolved ?? true },
    });
    return NextResponse.json({ report });
  } catch (err) {
    console.error("[admin/reports/[id] PATCH]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
