import { afterEach, describe, expect, it, vi } from "vitest";
import { getIp, rateLimit } from "../src/lib/rate-limit";

describe("rateLimit", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("uses a non-network development fallback when Upstash is not configured", async () => {
    vi.stubEnv("NODE_ENV", "development");
    vi.stubEnv("UPSTASH_REDIS_REST_URL", "");
    vi.stubEnv("UPSTASH_REDIS_REST_TOKEN", "");

    const before = Date.now();
    const result = await rateLimit("test-key", 5, 60_000);

    expect(result.allowed).toBe(true);
    expect(result.remaining).toBe(5);
    expect(result.resetAt).toBeGreaterThanOrEqual(before + 60_000);
  });

  it("fails clearly in production when Upstash is not configured", async () => {
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("UPSTASH_REDIS_REST_URL", "");
    vi.stubEnv("UPSTASH_REDIS_REST_TOKEN", "");

    await expect(rateLimit("test-key", 5, 60_000)).rejects.toThrow(
      /UPSTASH_REDIS_REST_URL/
    );
  });
});

describe("getIp", () => {
  it("uses the first forwarded IP", () => {
    const request = new Request("https://example.com", {
      headers: { "x-forwarded-for": "203.0.113.10, 198.51.100.2" },
    });

    expect(getIp(request)).toBe("203.0.113.10");
  });

  it("falls back to x-real-ip and then unknown", () => {
    const realIpRequest = new Request("https://example.com", {
      headers: { "x-real-ip": "203.0.113.11" },
    });
    const unknownRequest = new Request("https://example.com");

    expect(getIp(realIpRequest)).toBe("203.0.113.11");
    expect(getIp(unknownRequest)).toBe("unknown");
  });
});
