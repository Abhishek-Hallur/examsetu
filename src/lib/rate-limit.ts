import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetAt: number;
}

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL || "http://localhost:8079",
  token: process.env.UPSTASH_REDIS_REST_TOKEN || "example_token",
});

export async function rateLimit(
  key: string,
  limit: number,
  windowMs: number
): Promise<RateLimitResult> {
  const windowSecs = Math.max(1, Math.floor(windowMs / 1000));
  const ratelimit = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(limit, `${windowSecs} s`),
  });

  const result = await ratelimit.limit(key);

  return {
    allowed: result.success,
    remaining: result.remaining,
    resetAt: result.reset,
  };
}

/** Returns the client IP from Next.js request headers. */
export function getIp(req: Request): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    "unknown"
  );
}
