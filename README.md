# ResumeSaaS – Full‑stack Resume & Cover Letter Builder

A production‑ready MVP you can run locally right now. It features:

- ✅ Next.js 14 (App Router) + TypeScript
- ✅ Auth (NextAuth Credentials) – demo user seeded
- ✅ Prisma + SQLite (no external DB needed)
- ✅ Resume editor with live preview
- ✅ PDF export using `@react-pdf/renderer`
- ✅ Cover letter generator (rule‑based, offline)
- ✅ TailwindCSS UI
- 🧪 Optional: switch to Postgres by updating `DATABASE_URL`

## Quick start

```bash
# 1) Install deps
pnpm i   # or npm i / yarn

# 2) Create .env
cp .env.example .env

# 3) Push schema & seed demo data
pnpm prisma:push
pnpm seed

# 4) Run
pnpm dev
# open http://localhost:3000

# Demo user
# email: demo@demo.com
# pass : password123
```

## Building for production

```bash
pnpm build && pnpm start
```

## Switch to Postgres (optional)

- Set `DATABASE_URL=postgresql://USER:PASSWORD@HOST:5432/DB?schema=public`
- Run `pnpm prisma:push`

## Notes

- No external payment provider is wired in this MVP to ensure it "just works" locally.
- You can add plans easily by setting a `plan` on `User` and gating features in the UI/API.
