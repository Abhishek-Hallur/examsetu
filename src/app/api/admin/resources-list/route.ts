import { auth } from "@/auth";
import { getAdminResources } from "@/lib/data";
import { NextResponse } from "next/server";
import type { Role } from "@prisma/client";

const ADMIN_ROLES: Role[] = ["ADMIN", "MODERATOR"];

// GET /api/admin/resources-list — paginated resource list for admin table
export async function GET(req: Request) {
  const session = await auth();
  const role = session?.user?.role as Role | undefined;
  if (!session?.user || !role || !ADMIN_ROLES.includes(role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q") ?? undefined;
  const page = parseInt(searchParams.get("page") ?? "1", 10);
  const published = (searchParams.get("published") ?? "all") as "all" | "true" | "false";

  const data = await getAdminResources({ q, page, pageSize: 20, published });
  return NextResponse.json(data);
}
