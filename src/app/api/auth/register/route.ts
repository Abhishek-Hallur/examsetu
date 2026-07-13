import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { rateLimit, getIp } from "@/lib/rate-limit";
import { logger } from "@/lib/logger";

const LIMIT = 5;
const WINDOW = 60 * 60 * 1000;

const schema = z.object({
  name: z.string().trim().min(2).max(50),
  email: z.string().trim().email().transform((value) => value.toLowerCase()),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export async function POST(req: Request) {
  try {
    const ip = getIp(req);
    const { allowed } = await rateLimit(`register:${ip}`, LIMIT, WINDOW);

    if (!allowed) {
      return NextResponse.json(
        { error: "Too many attempts. Please try again later." },
        { status: 429 }
      );
    }

    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
    }

    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      const message = parsed.error.errors[0]?.message ?? "Invalid input";
      return NextResponse.json({ error: message }, { status: 400 });
    }

    const { name, email, password } = parsed.data;
    const existing = await prisma.user.findUnique({ where: { email } });

    if (existing) {
      return NextResponse.json(
        { error: "An account with this email already exists" },
        { status: 409 }
      );
    }

    const passwordHash = await bcrypt.hash(password, 12);
    await prisma.user.create({
      data: { name, email, passwordHash },
    });

    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (error) {
    logger.error({ error }, "Registration failed");
    return NextResponse.json(
      { error: "Registration service is unavailable. Check the database and server configuration." },
      { status: 503 }
    );
  }
}
