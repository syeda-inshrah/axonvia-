# Axonvia website

Marketing site and lightweight CMS for Axonvia, built with Next.js 16, React 19, Tailwind CSS v4, Drizzle (Neon
Postgres), Auth.js, and Resend.

## Getting started

```bash
npm install
cp .env.local.example .env.local   # then fill in the values — see docs/ENVIRONMENT.md
npm run db:migrate                  # applies drizzle/ migrations to DATABASE_URL
npm run dev
```

To run everything locally without touching the shared Neon database, set `DATABASE_URL=pglite:.local-db` and run
`npm run db:local` instead of `db:migrate` (see docs/ENVIRONMENT.md).

- Public site: `/` (plus `/privacy`, `/terms`, `/newsletter/unsubscribe`)
- Admin: `/admin` — create the first account with `scripts/create-admin.ts` (see docs/ENVIRONMENT.md)

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Development server |
| `npm test` | Vitest suite |
| `npm run build` / `npm start` | Production build / server |
| `npm run db:generate` / `npm run db:migrate` | Create / apply database migrations |
| `npm run db:local` | Create/update the local PGlite database (local development only) |

`scripts/seed-content.ts` loads starter projects and FAQs. It is not idempotent (running it twice duplicates
FAQs), so run it once, deliberately, against the database you intend to seed.

## Documentation

- `docs/ENVIRONMENT.md`: every environment variable, admin setup, and security notes
- `AXONVIA_WEBSITE_SPEC.md`: design and content spec
