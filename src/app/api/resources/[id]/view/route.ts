import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { rateLimit, getIp } from "@/lib/rate-limit";

// 5 views per resource per IP per hour
const LIMIT = 5;
const WINDOW = 60 * 60 * 1000;

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const ip = getIp(req);
  const { allowed } = await rateLimit(`view:${id}:${ip}`, LIMIT, WINDOW);

  if (!allowed) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  try {
    const session = await auth();
    await prisma.$transaction([
      prisma.resource.update({
        where: { id },
        data: { views: { increment: 1 } },
      }),
      ...(session?.user
        ? [
            prisma.userView.upsert({
              where: { userId_resourceId: { userId: session.user.id, resourceId: id } },
              update: { viewedAt: new Date() },
              create: { userId: session.user.id, resourceId: id },
            }),
          ]
        : []),
    ]);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Resource not found" }, { status: 404 });
  }
}
