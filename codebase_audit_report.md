# ExamSetu Codebase Audit Report

> Last verified against `main`: July 13, 2026  
> Scope: targeted re-audit of fake data removal, admin access, authorization, Vercel configuration, tests, and documentation accuracy.

## Executive Summary

The application is substantially implemented. Authentication, dashboard pages, admin pages, admin APIs, payments, logging, distributed rate limiting, and baseline tests are present.

The re-audit did not find an obvious admin authentication bypass in the checked routes. Admin pages are protected by middleware, and checked admin APIs repeat authorization on the server.

The concrete issues found during this re-audit were:

1. `.env.example` documented `REDIS_URL`, but runtime code consumed Upstash REST variables.
2. The Redis client contained fake fallback credentials.
3. The unit test was a placeholder that always passed.
4. `README.md` still described the project as a Phase 1 demo.

These issues are fixed on the audit branch.

## Admin Panel Access

- Admin URL: `/admin`
- Production form: `https://<your-vercel-domain>/admin`
- Unauthenticated users are redirected to `/login`.
- Signed-in users without an `ADMIN` or `MODERATOR` role receive `403 Forbidden`.
- Role changes are restricted to `ADMIN` users.

There is no legitimate browser-side method to promote an account. The first administrator must be assigned an `ADMIN` role directly in the trusted production database, for example through the database provider's SQL console or Prisma Studio connected to that database. Do not add a hardcoded admin email, universal password, hidden query parameter, or client-side role override.

## Verified Security Controls

- Middleware protects `/admin/:path*` and `/dashboard/:path*`.
- Admin APIs checked during this audit perform independent server-side role checks.
- Non-admin access returns a real HTTP 403 response.
- The user-role endpoint prevents an administrator from changing their own role.
- The login callback is limited to a local application path by the current flow.
- Fake resource seed entries, fake trending resources, and fake testimonials were removed from active code.

## Vercel Environment Variables

Required for core production operation:

```text
NEXT_PUBLIC_APP_URL
DATABASE_URL
AUTH_SECRET
UPSTASH_REDIS_REST_URL
UPSTASH_REDIS_REST_TOKEN
```

Required when the related feature is enabled:

```text
GOOGLE_CLIENT_ID
GOOGLE_CLIENT_SECRET
SMTP_HOST
SMTP_PORT
SMTP_USER
SMTP_PASSWORD
EMAIL_FROM
RAZORPAY_KEY_ID
RAZORPAY_KEY_SECRET
RAZORPAY_WEBHOOK_SECRET
R2_ACCOUNT_ID
R2_ACCESS_KEY_ID
R2_SECRET_ACCESS_KEY
R2_BUCKET
R2_PUBLIC_URL
NEXT_PUBLIC_ADSENSE_CLIENT_ID
```

Only variables intentionally needed in browser JavaScript should use the `NEXT_PUBLIC_` prefix.

## Fixes Made in This Re-Audit

### Rate-limit configuration

- Added the exact Upstash REST variables to `.env.example`.
- Removed fake URL and token defaults.
- Development can run without making a fake Redis network request.
- Production throws a clear configuration error when distributed rate limiting is not configured.

### Tests

Replaced the placeholder assertion with tests that verify:

- Development behavior without Upstash configuration.
- Production failure when required Upstash variables are missing.
- Forwarded-IP extraction behavior.
- The test file is now named `tests/rate-limit.test.ts` instead of the misleading `example.test.ts`.

### Documentation

- Updated `README.md` to describe the implemented database, authentication, dashboard, admin, payment, and testing features.
- Removed obsolete Phase 1 demo-data instructions.
- Documented the real setup, Vercel variables, admin route, and available scripts.

## Remaining Work

### High priority

- Configure all required Vercel Production and Preview environment variables.
- Assign the first real administrator in the trusted production database.
- Add a GitHub Actions workflow for lint, typecheck, unit tests, build, and E2E smoke tests.
- Add integration tests for admin authorization and resource CRUD.

### Medium priority

- Add database fixtures for Playwright.
- Test payment signature verification and premium activation.
- Test registration, login, password reset, bookmarks, downloads, and role management.
- Add email verification for credentials-based accounts.
- Replace the basic homepage-only E2E smoke test with major user-flow coverage.

## Validation Status

This repository review could inspect committed files but could not execute the project because the execution environment could not reach GitHub to clone the repository. Run the following before merging:

```bash
npm ci
npm run lint
npm run typecheck
npm test
npm run build
npm run test:e2e
```

Do not mark the branch fully verified unless these commands pass with the required environment variables and a test database.

## Final Assessment

- Fake demo resources: removed from active resource data and seeding.
- Admin route: implemented at `/admin`.
- Admin authorization: present in middleware and checked API routes.
- Vercel rate-limit configuration: corrected.
- Fake Redis credentials: removed.
- Placeholder unit test: replaced with real behavioral tests.
- README: updated to the actual project state.
- Zero-vulnerability guarantee: not possible. Continue dependency scanning, code review, and automated security testing.
