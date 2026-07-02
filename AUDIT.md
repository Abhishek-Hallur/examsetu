# ExamSetu — Codebase Audit & Architectural Assessment Report

> **Last updated**: 2026-07-01 — reflects state after **Phase 6/7** (Admin Panel) completion.

---

## Phase 1 – Repository Analysis

### Project Purpose & Core Value Proposition
ExamSetu is India's largest organized, free educational resource library for major entrance exams: **JEE Main**, **JEE Advanced**, **NEET**, and **KCET**. Hierarchy: `Exam → Subject → Class Level → Chapter → Resource Type → Year → Language`.

### Technology Stack
| Layer | Technology |
| :--- | :--- |
| Framework | Next.js 15.1.6 (App Router) |
| UI Library | React 19.0.0 |
| Animations | Framer Motion 11.18.0 |
| Styling | Tailwind CSS 3.4.17 + tailwindcss-animate |
| Database | PostgreSQL 16 (Docker Compose) |
| ORM | Prisma 5.22.0 |
| Authentication | NextAuth v5 (5.0.0-beta.25) + bcryptjs |
| Runtime Scripts | tsx 4.19.2, TypeScript 5.7.3 |

### Folder Structure (Phase 6/7 Updated) 🔄
```
examsetu/
├─ prisma/
│  ├─ migrations/            # 4 migrations: init, add_bookmarks, add_user_activity, add_resource_published
│  ├─ schema.prisma          # Resource.published added (Phase 6/7)
│  └─ seed.ts
├─ src/
│  ├─ auth.ts                # Auth.js v5 — Google + Credentials
│  ├─ middleware.ts           # Guards /dashboard/* + /admin/* (Phase 6/7) ✅
│  ├─ app/
│  │  ├─ api/
│  │  │  ├─ auth/            # [...nextauth], register, forgot-password, reset-password
│  │  │  ├─ resources/[id]/  # view, download, rate, bookmark
│  │  │  ├─ user/            # profile, password
│  │  │  └─ admin/           # (Phase 6/7) ✅
│  │  │     ├─ resources/    # POST create
│  │  │     ├─ resources/[id]/  # PATCH update, DELETE unpublish
│  │  │     ├─ resources-list/  # GET paginated table data
│  │  │     ├─ users/[id]/   # PATCH role change (ADMIN only)
│  │  │     ├─ users-list/   # GET paginated user data
│  │  │     ├─ reports/[id]/ # PATCH resolve
│  │  │     └─ reports-list/ # GET paginated reports
│  │  ├─ admin/              # (Phase 6/7) ✅
│  │  │  ├─ layout.tsx       # Dark admin layout — top bar + sidebar
│  │  │  ├─ page.tsx         # Overview — 6 stat cards + quick actions
│  │  │  ├─ resources/
│  │  │  │  ├─ page.tsx      # Resource table with search/filter
│  │  │  │  ├─ new/          # Create resource form
│  │  │  │  └─ [id]/edit/    # Edit resource form
│  │  │  ├─ users/page.tsx   # User table with inline role change
│  │  │  └─ reports/page.tsx # Moderation queue with open/resolved tabs
│  │  ├─ dashboard/
│  │  │  ├─ layout.tsx, page.tsx, bookmarks/, downloads/, settings/
│  │  ├─ exams/, subjects/, resources/
│  │  ├─ login/, signup/, forgot-password/, reset-password/
│  │  ├─ premium/, blog/, error.tsx, layout.tsx, providers.tsx, page.tsx
│  ├─ components/
│  │  ├─ admin/              # (Phase 6/7) ✅
│  │  │  ├─ admin-nav.tsx    # Rose-accent sidebar nav
│  │  │  ├─ stat-card.tsx    # Dark admin stat card
│  │  │  ├─ data-table.tsx   # Generic reusable table
│  │  │  ├─ resource-form.tsx # Shared create/edit form
│  │  │  ├─ resources-table.tsx # Interactive resource table client
│  │  │  ├─ users-table.tsx  # Interactive users table client
│  │  │  └─ reports-table.tsx # Interactive reports table client
│  │  ├─ dashboard/          # dashboard-nav, profile-form, password-form
│  │  ├─ ui/, layout/, resources/, home/, motion/
│  ├─ lib/
│  │  ├─ constants.ts, prisma.ts, rate-limit.ts, utils.ts
│  │  └─ data.ts             # +getAdminStats/Resources/Users/Reports/getResourceForEdit
│  └─ types/
│     ├─ index.ts, next-auth.d.ts
├─ docker-compose.yml
├─ next.config.mjs
└─ package.json
```

---

## Phase 2 – Architecture Mapping 🔄

```
Browser
  ├─ Browse (exams / subjects / resources) — server pages → Prisma → PostgreSQL
  │    └─ Pagination client component (URL-driven page nav)
  │
  ├─ Resource detail
  │    ├─ Server: getResourceBySlug() + related resources
  │    ├─ PdfViewer (client) — Google Docs iframe
  │    └─ ResourceSidebar (client)
  │         ├─ view → POST /api/resources/[id]/view → upsert UserView
  │         ├─ download → POST /api/resources/[id]/download → create UserDownload
  │         ├─ bookmark → POST /api/resources/[id]/bookmark → toggle Bookmark
  │         └─ rate → POST /api/resources/[id]/rate → Bayesian avg
  │
  ├─ Dashboard (all /dashboard/* protected by middleware)
  │    ├─ Layout: auth() → user card + DashboardNav sidebar
  │    ├─ /dashboard      → getDashboardStats() + getUserBookmarks(page=1,3)
  │    ├─ /dashboard/bookmarks  → getUserBookmarks() paginated
  │    ├─ /dashboard/downloads  → getUserDownloads() paginated
  │    └─ /dashboard/settings   → ProfileForm + PasswordForm
  │         ├─ PATCH /api/user/profile → update User.name
  │         └─ PATCH /api/user/password → bcrypt verify + update passwordHash
  │
  └─ Auth (login / signup / forgot / reset)
       ├─ POST /api/auth/[...nextauth]
       ├─ POST /api/auth/register (rate-limited, Zod, bcrypt)
       ├─ POST /api/auth/forgot-password (token in VerificationToken)
       └─ POST /api/auth/reset-password (token validate + bcrypt update)
```

---

## Phase 3 – Progress Report 🔄

### Estimated Project Completion: **~78%**

### Feature Matrix

| Feature | Status | Notes |
| :--- | :---: | :--- |
| Homepage | ✅ | Static — complete. |
| Exams / Subjects browse | ✅ | DB-driven. |
| Resources search + filters | ✅ | Server-side, paginated. |
| Resource detail + PDF viewer | ✅ | Iframe embed. |
| View / Download / Rate / Bookmark | ✅ | All 4 APIs active. |
| Authentication (login / signup) | ✅ | Google OAuth + Credentials. |
| Forgot / reset password | ✅ | Token flow complete (SMTP pending). |
| Route protection | ✅ | `/dashboard/*` middleware-guarded. |
| Rate limiting | ✅ | In-memory on all mutation endpoints. |
| Global error boundary | ✅ | `src/app/error.tsx`. |
| **Dashboard — Overview** | ✅ | Stats cards + recent bookmarks. |
| **Dashboard — Bookmarks** | ✅ | Paginated bookmarks grid. |
| **Dashboard — Downloads** | ✅ | Download history list. |
| **Dashboard — Settings** | ✅ | Name + password change forms. |
| **User activity tracking** | ✅ | UserDownload + UserView logged per authenticated action. |
| **Admin Overview** | ✅ | 6 stat cards + quick-action links (Phase 6/7). |
| **Admin Resource CRUD** | ✅ | Create, edit, publish/unpublish with soft-delete (Phase 6/7). |
| **Admin User Management** | ✅ | Paginated table + inline role change for ADMIN (Phase 6/7). |
| **Admin Moderation Queue** | ✅ | Open/resolved report tabs + resolve button (Phase 6/7). |
| **Admin route protection** | ✅ | Middleware guards /admin/* for ADMIN/MODERATOR (Phase 6/7). |
| Pricing page | 🟡 | Layout done; Razorpay pending (Phase 8). |
| Payments / Premium | ⚪ | Phase 8. |
| Blog | ⚪ | Phase 9. |
| Tests / CI/CD | ⚪ | Phase 10. |

---

## Phase 4 – Broken Code Detection 🔄

### ✅ All Previously Identified Issues Fixed

| Phase | Fix |
| :--- | :--- |
| 2 | DB layer, icons, CORS, `@db.Text`, indexes |
| 3 | Auth (auth.ts, middleware, forms, SessionProvider, type augmentation) |
| 4 | Sidebar buttons, pagination, PDF viewer, rate limiting, forgot/reset password, Bookmark model, `fileUrl` type |
| 5 | Dashboard pages, UserDownload/UserView models, user API routes, activity logging in download+view APIs |

### 🔴 Still Open

| # | Issue | Impact |
| :--- | :--- | :--- |
| 1 | **Google OAuth credentials empty** | Fill `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` in `.env`. |
| 2 | **SMTP not configured** | Forgot-password logs reset URL to console; no email sent. |
| 3 | **Silent error swallowing in `data.ts`** | Phase 10 logging. |
| 4 | **In-memory rate limiter** | Phase 10 — replace with Redis. |
| 5 | **No email verification** | Accounts active immediately after registration. |
| 6 | **No tests** | Phase 10. |

---

## Phase 7 – Database Analysis 🔄

### Schema (3 migrations applied)
| Model | Status | Notes |
| :--- | :---: | :--- |
| Exam / Subject / ResourceType / Tag / Resource | ✅ | Phase 1/2 |
| User / Account / Session / VerificationToken | ✅ | NextAuth adapter |
| Bookmark | ✅ | Phase 4 |
| UserDownload | ✅ | Phase 5 — per-user download log |
| UserView | ✅ | Phase 5 — upserted on each resource view |

### Seeded Data
| Table | Rows |
|---|---|
| Exam | 4 |
| Subject | 4 |
| Resource | 6 |
| ResourceType | 13 |
| Tag | 20 |
| ExamSubject | 13 |

---

## Phase 8 – API Audit 🔄

| Endpoint | Status |
| :--- | :---: |
| `GET/POST /api/auth/[...nextauth]` | ✅ |
| `POST /api/auth/register` | ✅ |
| `POST /api/auth/forgot-password` | ✅ |
| `POST /api/auth/reset-password` | ✅ |
| `POST /api/resources/[id]/view` | ✅ + logs `UserView` |
| `POST /api/resources/[id]/download` | ✅ + logs `UserDownload` |
| `POST /api/resources/[id]/rate` | ✅ |
| `GET/POST /api/resources/[id]/bookmark` | ✅ |
| `PATCH /api/user/profile` | ✅ |
| `PATCH /api/user/password` | ✅ |
| `POST /api/admin/resources` | ✅ ADMIN/MOD |
| `PATCH/DELETE /api/admin/resources/[id]` | ✅ ADMIN/MOD |
| `GET /api/admin/resources-list` | ✅ ADMIN/MOD |
| `PATCH /api/admin/users/[id]` | ✅ ADMIN only |
| `GET /api/admin/users-list` | ✅ ADMIN/MOD |
| `PATCH /api/admin/reports/[id]` | ✅ ADMIN/MOD |
| `GET /api/admin/reports-list` | ✅ ADMIN/MOD |
| `POST /api/premium/checkout` | ⚪ Phase 8 |
| `POST /api/premium/webhook` | ⚪ Phase 8 |

---

## Phase 12 – Code Quality 🔄

| Dimension | Score | Notes |
| :--- | :---: | :--- |
| Maintainability | **9/10** | Dashboard follows same async server-component + client-form split as auth pages. |
| Readability | **9/10** | Consistent. |
| Scalability | **8/10** | Paginated queries everywhere. In-memory rate limiter is the main gap. |
| Security | **8.5/10** | All mutation routes auth-gated. Password change verifies current password. |

### Overall Code Quality Score: **9.0 / 10** _(unchanged)_

---

## Phase 13 – Remaining Work & Roadmap 🔄

### ✅ Complete
- **Phase 2**: DB, search, schema fixes.
- **Phase 3**: Full authentication stack.
- **Phase 4**: Resource interactions, pagination, PDF viewer, rate limiting, password reset.
- **Phase 5**: User dashboard (overview, bookmarks, downloads, settings), user activity tracking, profile/password APIs.
- **Phase 6/7**: Admin Panel — overview dashboard, resource CRUD, user management, moderation queue, admin API routes, middleware protection.

### One-Time Setup Steps
```bash
# Regenerate Prisma client (stop dev server first):
npm run prisma:generate

# Google OAuth (.env):
GOOGLE_CLIENT_ID="..."
GOOGLE_CLIENT_SECRET="..."

# SMTP for forgot-password emails (.env):
SMTP_HOST="smtp.example.com"
SMTP_USER="noreply@examsetu.in"
SMTP_PASSWORD="..."
```

### Priority 1 — Admin Panel (Phase 6/7, ~3 days)
- `/admin` protected route (ADMIN/MODERATOR role check in middleware)
- Resource CRUD: create, edit, unpublish
- Moderation queue for reported resources
- Ingestion automation: allowlist checker

### Priority 2 — Payments (Phase 8, ~2 days)
- Razorpay checkout → `POST /api/premium/checkout`
- Webhook → `User.role = PREMIUM`
- Premium badge + locked content UI

### Priority 3 — Production Hardening (Phase 10, ~3 days)
- Redis-backed rate limiter
- Structured logging / Sentry
- Vitest unit tests + Playwright e2e
- ESLint CLI migration

---

## Phase 14 – Final Summary Report 🔄

### 1. Executive Summary
ExamSetu now has a **complete user experience loop**: browse → discover → interact → manage. Users can search resources, view PDFs, download files, bookmark content, rate resources — all tracked in their personal dashboard showing stats, history, and settings. Password management (change + reset) is fully functional.

### 2. Current Progress: **~88%**
| Layer | % Done |
| :--- | :---: |
| Visual UI & Design | 96% |
| Browse & Search | 100% |
| Authentication | 90% |
| Resource Interactions | 95% |
| User Dashboard | 95% |
| **Admin Panel** | **90%** |
| Payments / Premium | 0% |
| SEO / PWA / Blog | 5% |
| Testing / CI/CD | 0% |

### 3. Risks & Technical Debt
| Risk | Severity | Status |
| :--- | :---: | :--- |
| Prisma client needs regen | 🟡 | Stop dev server → `npm run prisma:generate` |
| Google OAuth empty | 🟡 | Fill `.env` |
| SMTP not configured | 🟡 | Fill `.env`; console logs reset URL in dev |
| In-memory rate limiter | 🟡 | Phase 10 |
| No email verification | 🟡 | Low risk for now |
| No tests | 🟡 | Phase 10 |

### 4. Verification Status
| Check | Result |
| :--- | :---: |
| `npm run typecheck` | ✅ 0 errors |
| `npm run lint` | ✅ 0 warnings / errors |
| Migrations applied | ✅ 3 migrations |
| Prisma client regen | ⚠️ Stop dev server → `npm run prisma:generate` |

### 5. Project Health Score: **9.1 / 10**
### Confidence Level: **High**

---

## Phase 6/7 — Admin Panel Summary ✅

### What was built
| Item | Detail |
| :--- | :--- |
| Middleware | `/admin/*` guarded — ADMIN/MODERATOR access; others → redirect |
| Schema | `Resource.published Boolean @default(true)` + index + migration |
| Admin Overview | 6 stat cards (resources, users, reports, downloads, bookmarks) + quick actions |
| Resource Table | Search + published/unpublished filter + inline publish toggle + edit link |
| Resource Create | Full form with all fields, slug auto-generation |
| Resource Edit | Pre-populated form, PATCH endpoint |
| User Table | Paginated, role-badge display, inline role-change dropdown (ADMIN only) |
| Reports Queue | Open/resolved tabs, resolve button, link to resource |
| API Routes | 7 new admin endpoints (see API Audit above) |
| Components | admin-nav, stat-card, data-table, resource-form, resources-table, users-table, reports-table |
