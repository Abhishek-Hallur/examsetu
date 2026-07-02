import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

const schema = z.object({
  value: z.number().int().min(1).max(5),
});

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Sign in to rate resources" }, { status: 401 });
  }

  const { id } = await params;

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Rating must be 1–5" }, { status: 400 });
  }

  const resource = await prisma.resource.findUnique({
    where: { id },
    select: { rating: true, ratingCount: true },
  });

  if (!resource) {
    return NextResponse.json({ error: "Resource not found" }, { status: 404 });
  }

  // Bayesian update: new average weighted by previous count
  const { value } = parsed.data;
  const newCount = resource.ratingCount + 1;
  const newRating =
    (resource.rating * resource.ratingCount + value) / newCount;

  const updated = await prisma.resource.update({
    where: { id },
    data: {
      rating: Math.round(newRating * 10) / 10,
      ratingCount: newCount,
    },
    select: { rating: true, ratingCount: true },
  });

  return NextResponse.json({ ok: true, ...updated });
}
