# ExamSetu

> **One Platform. Every Resource. Every Exam.**
> India's largest organized library of **free** educational resources for JEE Main, JEE Advanced, NEET and KCET.

Built with Next.js 15, React 19, TypeScript, Tailwind CSS, Prisma & PostgreSQL.

---

## 🚦 Build status (phased)

| Phase | Scope | Status |
|------:|-------|--------|
| **1** | Foundation + modern homepage (runs with demo data) | ✅ Done |
| 2 | DB schema + browse hierarchy + search | ⏳ Next |
| 3 | Auth (Google/email/OTP) + RBAC | ⏳ |
| 4 | Resource pages + PDF viewer + community | ⏳ |
| 5 | User dashboard | ⏳ |
| 6 | Admin dashboard + moderation | ⏳ |
| 7 | Ingestion + automation (source allowlist) | ⏳ |
| 8 | Payments + premium + ads | ⏳ |
| 9 | SEO, performance, PWA, blog | ⏳ |
| 10 | Testing, CI/CD, docs, deployment | ⏳ |

> **Phase 1 runs without a database** — the homepage and resource browser use demo
> data from `src/lib/constants.ts`. PostgreSQL is wired up in Phase 2.

---

## 🏁 Quick start

```bash
# 1. Install dependencies
npm install

# 2. Copy environment variables
cp .env.example .env

# 3. Run the dev server
npm run dev
```

Open <http://localhost:3000>.

### Optional: database (needed from Phase 2)

Docker isn't required for Phase 1. When you're ready for the DB:

```bash
docker compose up -d        # starts Postgres + Redis
npm run prisma:generate
npm run prisma:migrate
```

Or point `DATABASE_URL` at a free Supabase project instead.

---

## 🗂 Project structure

```
examsetu/
├─ prisma/                 # Prisma schema (+ migrations, seed — Phase 2)
├─ src/
│  ├─ app/                 # Next.js App Router pages
│  │  ├─ exams/            # /exams and /exams/[slug]
│  │  ├─ subjects/         # /subjects and /subjects/[slug]
│  │  ├─ resources/        # /resources (search) and /resources/[slug]
│  │  ├─ premium/ login/ signup/ dashboard/ blog/
│  │  ├─ layout.tsx        # Root layout (navbar, footer, theming)
│  │  └─ page.tsx          # Homepage
│  ├─ components/
│  │  ├─ ui/               # shadcn-style primitives (button, card, …)
│  │  ├─ layout/           # navbar, footer
│  │  ├─ home/             # homepage sections
│  │  ├─ resources/        # search explorer
│  │  └─ motion/           # framer-motion helpers
│  ├─ lib/                 # utils, constants/demo data, prisma client
│  └─ types/               # shared TypeScript types
├─ docker-compose.yml      # Postgres + Redis
└─ .env.example
```

> Folders for `features/`, `services/`, `hooks/`, `api/`, `middleware/`, `tests/`
> and `docs/` are introduced in the phases that need them.

---

## 📜 Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start the dev server |
| `npm run build` | Production build |
| `npm run start` | Run the production build |
| `npm run lint` | Lint |
| `npm run typecheck` | TypeScript check |
| `npm run prisma:generate` | Generate Prisma client |
| `npm run prisma:migrate` | Run migrations (Phase 2) |

---

## ⚖️ Legal & ethics

ExamSetu only organizes and links resources from **approved sources that permit
indexing or redistribution** (NCERT, open courseware, public exam archives, state
board open material). The platform **never** bypasses authentication, paywalls or
copyright. Low-confidence items go to moderation rather than being guessed.
```
