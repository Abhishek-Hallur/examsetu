# Debug & QA Report - Phase 9 & 10

## Bugs Found & Fixed
- **In-Memory Rate Limiter in Multi-Instance Environment**: Migrated from an in-memory limiter to `@upstash/ratelimit` with `@upstash/redis` for distributed rate limiting.
- **Missing Upstash environment variables**: `.env.example` now documents the exact `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` variables consumed by the runtime.
- **Fake Redis defaults**: Removed the placeholder localhost URL and fake token. Development now uses an explicit non-network fallback; production fails with a clear configuration error instead of silently using fake credentials.
- **Placeholder unit test**: Replaced `expect(true).toBe(true)` with tests for development fallback behavior, production configuration enforcement, and proxy IP extraction.
- **Silent Error Swallowing in `data.ts`**: Implemented structured logging using `pino`.
- **Playwright and Vitest Environment Setup**: Added the required test dependencies and configuration.
- **NextAuth vulnerability**: Updated `next-auth` to `5.0.0-beta.31` for the previously identified email-misdelivery advisory.
- **ESLint Configuration**: Migrated to ESLint v9 flat configuration.

## Files Changed During the Original Phase 9/10 Work
- `package.json` / `package-lock.json`
- `src/lib/rate-limit.ts`
- `src/lib/logger.ts`
- `src/lib/data.ts`
- Authentication and resource API routes
- Newsletter, blog, manifest, ESLint, Playwright, and Vitest files

## July 13, 2026 Re-Audit

### Verified
- `/admin/:path*` is protected by middleware.
- Unauthenticated admin requests redirect to `/login` with a local callback path.
- Authenticated users without `ADMIN` or `MODERATOR` receive `403 Forbidden`.
- Checked admin APIs repeat authorization on the server.
- User role changes require `ADMIN` and block changing the current administrator's own role.
- Demo resources and fake testimonials were removed from the active homepage and seed process.
- The admin route is `/admin`.

### Corrected
- The previous unit test did not test rate limiting; it only asserted `true`.
- The runtime expected Upstash REST variables that were absent from `.env.example`.
- The Redis client used fake fallback credentials, which could cause confusing runtime failures.

### Not Re-Verified in This Re-Audit
The following commands must run in CI or a local checkout before merging. They were not executed by this repository-only review:

```bash
npm ci
npm run lint
npm run typecheck
npm test
npm run build
npm run test:e2e
```

Historical pass claims below apply to the earlier development run only and are not proof that the current branch passes.

## Historical Manual Test Results
- Production build was reported as compiling successfully.
- TypeScript checks were reported as passing.
- The baseline Playwright title test was reported as passing.
- Vitest and ESLint were reported as passing.

## Current Test Coverage
- Unit tests cover rate-limit configuration behavior and IP extraction.
- E2E coverage still contains only a basic homepage-title smoke test.
- Admin authentication, resource CRUD, payments, password reset, and database workflows do not yet have meaningful automated integration coverage.

## Remaining Known Limitations
- Real educational resources must be added through the admin panel or an approved ingestion process.
- No GitHub Actions workflow currently enforces linting, type checks, tests, and builds on every pull request.
- Playwright needs database fixtures and tests for major user and admin flows.
- Email verification is not enforced for credentials accounts.
- SMTP, Google OAuth, database, Upstash, Razorpay, and other production secrets must be configured in Vercel.
- Production security cannot be described as having “no vulnerabilities”; dependency scanning and application testing must continue.
