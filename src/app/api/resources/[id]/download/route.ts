import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { rateLimit, getIp } from "@/lib/rate-limit";

// 20 downloads per IP per hour
const LIMIT = 20;
const WINDOW = 60 * 60 * 1000;

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const ip = getIp(req);
  const { allowed } = await rateLimit(`download:${id}:${ip}`, LIMIT, WINDOW);

  if (!allowed) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  const resource = await prisma.resource.findUnique({
    where: { id },
    select: { id: true, isPremium: true, fileUrl: true },
  });

  if (!resource) {
    return NextResponse.json({ error: "Resource not found" }, { status: 404 });
  }

  const session = await auth();

  if (resource.isPremium) {
    if (!session?.user) {
      return NextResponse.json(
        { error: "Sign in to download premium resources" },
        { status: 401 }
      );
    }
    if (
      session.user.role !== "PREMIUM" &&
      session.user.role !== "ADMIN" &&
      session.user.role !== "MODERATOR"
    ) {
      return NextResponse.json(
        { error: "Premium subscription required" },
        { status: 403 }
      );
    }
  }

  // Increment global counter + log per-user record in one transaction
  await prisma.$transaction([
    prisma.resource.update({
      where: { id },
      data: { downloads: { increment: 1 } },
    }),
    ...(session?.user
      ? [prisma.userDownload.create({ data: { userId: session.user.id, resourceId: id } })]
      : []),
  ]);

  return NextResponse.json({ ok: true, fileUrl: resource.fileUrl });
}
