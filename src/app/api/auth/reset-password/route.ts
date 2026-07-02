import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { rateLimit, getIp } from "@/lib/rate-limit";

const LIMIT = 5;
const WINDOW = 15 * 60 * 1000;

const schema = z.object({
  token: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(8),
});

export async function POST(req: Request) {
  const ip = getIp(req);
  const { allowed } = rateLimit(`reset:${ip}`, LIMIT, WINDOW);
  if (!allowed) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  const { token, email, password } = parsed.data;
  const identifier = `password-reset:${email}`;

  const record = await prisma.verificationToken.findUnique({
    where: { identifier_token: { identifier, token } },
  });

  if (!record || record.expires < new Date()) {
    return NextResponse.json(
      { error: "Reset link is invalid or has expired" },
      { status: 400 }
    );
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const passwordHash = await bcrypt.hash(password, 12);

  await Promise.all([
    prisma.user.update({ where: { id: user.id }, data: { passwordHash } }),
    prisma.verificationToken.delete({
      where: { identifier_token: { identifier, token } },
    }),
  ]);

  return NextResponse.json({ ok: true });
}
