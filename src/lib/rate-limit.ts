import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetAt: number;
}

function createRedisClient(): Redis | null {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!url || !token) return null;
  return new Redis({ url, token });
}

export async function rateLimit(
  key: string,
  limit: number,
  windowMs: number
): Promise<RateLimitResult> {
  const redis = createRedisClient();

  if (!redis) {
    if (process.env.NODE_ENV === "production") {
      throw new Error(
        "Rate limiting is not configured. Set UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN."
      );
    }

    return {
      allowed: true,
      remaining: limit,
      resetAt: Date.now() + windowMs,
    };
  }

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

/** Returns the client IP from trusted proxy headers supplied by the deployment platform. */
export function getIp(req: Request): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    "unknown"
  );
}
