# ExamSetu

> **One Platform. Every Resource. Every Exam.**
>
> An organized educational-resource platform for JEE Main, JEE Advanced, NEET and KCET.

Built with Next.js 15, React 19, TypeScript, Tailwind CSS, Prisma, PostgreSQL and Auth.js.

---

## Current implementation

The repository is no longer a Phase 1 demo. The current codebase includes:

- Database-backed exams, subjects, resource types and resources
- Search, filtering, pagination and resource detail pages
- Google and credentials authentication
- Password reset flow
- Protected student dashboard
- Bookmark, view, download and rating APIs
- Admin dashboard at `/admin`
- Admin resource management, user roles and report moderation
- Razorpay checkout and webhook routes
- Upstash-backed distributed rate limiting
- Structured server logging
- Vitest and Playwright configuration with baseline tests

Fake resource entries and fake testimonials are not used by the active homepage or database seed.

See [`codebase_audit_report.md`](./codebase_audit_report.md) for the latest verified audit and remaining work.

---

## Local setup

### 1. Install dependencies

```bash
npm ci
```

### 2. Configure environment variables

```bash
cp .env.example .env
```

At minimum, configure:

```text
DATABASE_URL
AUTH_SECRET
```

For distributed rate limiting, including Vercel deployments, also configure:

```text
UPSTASH_REDIS_REST_URL
UPSTASH_REDIS_REST_TOKEN
```

Google OAuth, SMTP, Razorpay, Cloudflare R2 and AdSense variables are required only when those features are enabled. Never commit real secrets.

### 3. Prepare the database

```bash
npm run prisma:generate
npm run prisma:migrate
npm run db:seed
```

The seed creates catalog metadata such as exams, subjects and resource types. It does not insert fake educational resources.

### 4. Start the app

```bash
npm run dev
```

Open <http://localhost:3000>.

---

## Admin access

The admin panel is available at:

```text
/admin
```

Access rules:

- Unauthenticated users are redirected to `/login`.
- `ADMIN` and `MODERATOR` roles can access protected admin pages and supported moderation/resource APIs.
- User role changes require the `ADMIN` role.
- Authenticated non-admin users receive `403 Forbidden`.

The first administrator must be assigned through the trusted production database. Do not add a hardcoded admin email, shared password, browser-side role override or hidden bypass.

---

## Vercel deployment

Add the required values under **Project Settings → Environment Variables** for both Preview and Production as appropriate.

Core production variables:

```text
NEXT_PUBLIC_APP_URL
DATABASE_URL
AUTH_SECRET
UPSTASH_REDIS_REST_URL
UPSTASH_REDIS_REST_TOKEN
```

Feature-specific variables are listed in `.env.example`.

After changing environment variables, create a new deployment. The build command is:

```bash
npm run build
```

---

## Project structure

```text
examsetu/
├─ prisma/                    # PostgreSQL schema, migrations and safe catalog seed
├─ public/                    # Static assets and web manifest
├─ src/
│  ├─ app/
│  │  ├─ api/                 # Auth, user, resource, premium and admin APIs
│  │  ├─ admin/               # Protected admin dashboard
│  │  ├─ dashboard/           # Protected student dashboard
│  │  ├─ exams/ subjects/     # Catalog browsing
│  │  ├─ resources/           # Search and resource details
│  │  └─ login/ signup/       # Authentication pages
│  ├─ components/             # UI, admin, dashboard and feature components
│  ├─ lib/                    # Prisma, data access, logging and rate limiting
│  ├─ auth.ts                 # Full Auth.js configuration
│  ├─ auth.config.ts          # Edge-compatible auth callbacks
│  └─ middleware.ts           # Dashboard and admin route guards
├─ tests/                     # Vitest unit tests
├─ e2e/                       # Playwright smoke tests
├─ codebase_audit_report.md   # Current targeted audit
└─ .env.example               # Environment-variable names only
```

---

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the development server |
| `npm run build` | Generate Prisma Client and create a production build |
| `npm run start` | Start the production build |
| `npm run lint` | Run ESLint |
| `npm run typecheck` | Run TypeScript checks without emitting files |
| `npm test` | Run Vitest unit tests |
| `npm run test:e2e` | Run Playwright tests |
| `npm run prisma:generate` | Generate Prisma Client |
| `npm run prisma:migrate` | Create/apply a development migration |
| `npm run prisma:studio` | Open Prisma Studio |
| `npm run db:seed` | Seed safe catalog metadata |
| `npm run format` | Format the repository with Prettier |

Before merging or deploying, run:

```bash
npm run lint
npm run typecheck
npm test
npm run build
npm run test:e2e
```

---

## Legal and ethics

ExamSetu should only organize or host resources from approved sources that permit indexing or redistribution, such as official public archives, open courseware and authorized state-board material.

The platform must not bypass authentication, paywalls, access controls or copyright restrictions. Unverified or low-confidence material should be sent to moderation instead of being published automatically.
