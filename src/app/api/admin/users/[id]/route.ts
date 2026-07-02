import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import type { Role } from "@prisma/client";

const VALID_ROLES: Role[] = ["GUEST", "STUDENT", "PREMIUM", "MODERATOR", "ADMIN"];

// PATCH /api/admin/users/[id] — change user role (ADMIN only)
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;

  try {
    const { role } = await req.json();
    if (!role || !VALID_ROLES.includes(role as Role)) {
      return NextResponse.json({ error: "Invalid role" }, { status: 400 });
    }

    // Prevent demoting yourself
    if (id === session.user.id) {
      return NextResponse.json({ error: "Cannot change your own role" }, { status: 400 });
    }

    const user = await prisma.user.update({
      where: { id },
      data: { role: role as Role },
      select: { id: true, name: true, email: true, role: true },
    });

    return NextResponse.json({ user });
  } catch (err) {
    console.error("[admin/users/[id] PATCH]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
