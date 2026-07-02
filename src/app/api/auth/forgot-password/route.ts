import { NextResponse } from "next/server";
import { randomBytes } from "crypto";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { rateLimit, getIp } from "@/lib/rate-limit";

// 3 requests per email/IP per 15 minutes
const LIMIT = 3;
const WINDOW = 15 * 60 * 1000;
const TOKEN_TTL = 60 * 60 * 1000; // 1 hour

const schema = z.object({ email: z.string().email() });

export async function POST(req: Request) {
  const ip = getIp(req);
  const { allowed } = await rateLimit(`forgot:${ip}`, LIMIT, WINDOW);
  if (!allowed) {
    return NextResponse.json({ error: "Too many requests. Try again later." }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid email" }, { status: 400 });
  }

  const { email } = parsed.data;

  // Always respond with success to prevent email enumeration
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !user.passwordHash) {
    return NextResponse.json({ ok: true });
  }

  // Store reset token in VerificationToken (reusing NextAuth model)
  const token = randomBytes(32).toString("hex");
  const identifier = `password-reset:${email}`;
  const expires = new Date(Date.now() + TOKEN_TTL);

  await prisma.verificationToken.upsert({
    where: { identifier_token: { identifier, token } },
    update: { expires },
    create: { identifier, token, expires },
  });

  // TODO: send email via SMTP (configure SMTP_HOST, SMTP_USER, SMTP_PASSWORD in .env)
  // The reset link is: /reset-password?token=<token>&email=<email>
  const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${token}&email=${encodeURIComponent(email)}`;
  console.log(`[forgot-password] reset link for ${email}: ${resetUrl}`);

  return NextResponse.json({ ok: true });
}
