import { auth } from "@/auth";
import { getAdminReports } from "@/lib/data";
import { NextResponse } from "next/server";
import type { Role } from "@prisma/client";

const ADMIN_ROLES: Role[] = ["ADMIN", "MODERATOR"];

export async function GET(req: Request) {
  const session = await auth();
  const role = session?.user?.role as Role | undefined;
  if (!session?.user || !role || !ADMIN_ROLES.includes(role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const resolved = searchParams.get("resolved") === "true";
  const page = parseInt(searchParams.get("page") ?? "1", 10);

  const data = await getAdminReports({ resolved, page, pageSize: 20 });
  return NextResponse.json(data);
}
