import { afterEach, describe, expect, it, vi } from "vitest";
import { getIp, rateLimit } from "../src/lib/rate-limit";

describe("rateLimit", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("uses a non-network development fallback when Upstash is not configured", async () => {
    vi.stubEnv("NODE_ENV", "development");
    vi.stubEnv("UPSTASH_REDIS_REST_URL", "");
    vi.stubEnv("