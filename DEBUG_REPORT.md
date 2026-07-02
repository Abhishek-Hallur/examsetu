# Debug & QA Report - Phase 9 & 10

## Bugs Found & Fixed
- **In-Memory Rate Limiter in Multi-Instance Environment**: Fixed by migrating from an in-memory sliding window rate limiter to `@upstash/ratelimit` paired with `@upstash/redis`, enabling true distributed rate limiting across serverless or multi-instance deployments.
- **Silent Error Swallowing in `data.ts`**: Implemented structured logging using `pino`. We imported the logger to `data.ts` and ensure all caught errors are now actively logged before gracefully falling back.
- **Playwright and Vitest Environment Setup**: Addressed issues finding testing dependencies (`jsdom` for unit testing React components with Vitest, `@playwright/test` for E2E tests). Successfully initialized configs and resolved the missing `jsdom` module error.
- **Vulnerabilities**: Addressed a moderate NextAuth.js Email Misdelivery vulnerability by upgrading `next-auth` to `5.0.0-beta.31`. (Note: We elected to skip force-fixing a `postcss` vulnerability since it originates within Next.js and would require downgrading Next.js to an unsupported version).
- **ESLint Configuration Warning (Next 15 CLI Migration)**: Addressed the depreciation of `next lint` by migrating configurations to the new flat-file architecture (`eslint.config.mjs`) ensuring compliance with ESLint v9+.

## Files Changed
- `package.json` / `package-lock.json`
- `src/lib/rate-limit.ts`
- `src/lib/logger.ts` (new)
- `src/lib/data.ts`
- `src/app/api/auth/forgot-password/route.ts`
- `src/app/api/auth/register/route.ts`
- `src/app/api/auth/reset-password/route.ts`
- `src/app/api/newsletter/route.ts` (new)
- `src/app/api/resources/[id]/download/route.ts`
- `src/app/api/resources/[id]/view/route.ts`
- `src/components/home/newsletter.tsx`
- `src/app/blog/page.tsx`
- `src/app/layout.tsx`
- `public/manifest.json` (new)
- `.eslintrc.json` (deleted)
- `eslint.config.mjs` (new)
- `playwright.config.ts` (new)
- `vitest.config.ts` (new)
- `tests/example.test.ts` (new)
- `e2e/example.spec.ts` (new)

## Security Issues Addressed
- NextAuth.js version updated to resolve a moderate vulnerability.
- Rate limits properly backed by Redis to prevent distributed Denial of Service and Brute Force attacks.

## Test Cases Added
- Basic Unit Test via `vitest` in `tests/example.test.ts`
- Basic Integration/E2E Test via `Playwright` in `e2e/example.spec.ts`

## Manual Test Results
- ✅ Production build (`npm run build`) successfully compiles with 0 errors.
- ✅ TypeScript checks (`npm run typecheck`) successfully complete with 0 errors.
- ✅ E2E Tests via Playwright (`npm run test:e2e`) run and pass against a running production build.
- ✅ Unit tests via Vitest (`npm run test`) successfully execute.
- ✅ ESLint (`npm run lint`) runs smoothly off the new flat config file.

## Performance Improvements
- Redis limits state check durations across clustered environments.
- Upstash implementations provide quick REST responses without relying strictly on raw TCP socket integrations.

## Remaining Known Limitations
- The Prisma database needs to be properly seeded with actual data for E2E tests to scale.
- No automated Github Action/CI pipelines exist yet, although scripts are fully primed for one.
- Playwright currently tests one simple baseline layout to ensure the build works; larger interaction paths require dedicated DB fixtures.