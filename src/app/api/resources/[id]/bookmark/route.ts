import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json(
      { error: "Sign in to bookmark resources" },
      { status: 401 }
    );
  }

  const { id: resourceId } = await params;
  const userId = session.user.id;

  const existing = await prisma.bookmark.findUnique({
    where: { userId_resourceId: { userId, resourceId } },
  });

  if (existing) {
    await prisma.bookmark.delete({
      where: { userId_resourceId: { userId, resourceId } },
    });
    return NextResponse.json({ bookmarked: false });
  }

  await prisma.bookmark.create({ data: { userId, resourceId } });
  return NextResponse.json({ bookmarked: true });
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ bookmarked: false });
  }

  const { id: resourceId } = await params;
  const userId = session.user.id;

  const existing = await prisma.bookmark.findUnique({
    where: { userId_resourceId: { userId, resourceId } },
  });

  return NextResponse.json({ bookmarked: !!existing });
}
