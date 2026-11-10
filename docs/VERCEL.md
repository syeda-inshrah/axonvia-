# Deploying to Vercel

The site is a standard Next.js 16 App Router app, so Vercel detects and builds it with no extra configuration.
No `vercel.json` is needed. On Vercel the build runs `npm run vercel-build`, which first applies the database
migrations (`scripts/migrate-deploy.ts`) to Vercel's own `DATABASE_URL`, then runs `next build`.

## Project settings

- **Framework preset:** Next.js (auto-detected)
- **Build command / output:** defaults (Vercel runs the `vercel-build` script; output `.next`). Don't override the
  build command, or migrations stop running on deploy.
- **Node.js version:** 24.x (Vercel's default) or 22.x. Node 20 is deprecated on Vercel.

## Environment variables

Add these in **Project → Settings → Environment Variables** (Production, and Preview if you use preview
deployments). Never commit real values. See `docs/ENVIRONMENT.md` for details on each.

| Variable | Required | Notes |
| --- | --- | --- |
| `DATABASE_URL` | Yes | Neon Postgres connection string (the Vercel ↔ Neon integration can set it for you). |
| `AUTH_SECRET` | Yes | New random value for production: `openssl rand -base64 32`. |
| `RESEND_API_KEY` | Yes | Without it, submissions are saved but no emails are sent. |
| `RESEND_FROM_EMAIL` | Yes | Sender on a domain verified in Resend (a `@gmail.com` address cannot be used). |
| `ADMIN_NOTIFICATION_EMAIL` | Recommended | Inbox for new-lead alerts, e.g. `axonvia@gmail.com`. |
| `GEMINI_API_KEY` | For the chat assistant | Google Gemini API key (server-only). Without it the chat replies that it's unavailable and points to the contact form. |
| `NEXT_PUBLIC_CONTACT_EMAIL` | Yes | Public contact address, e.g. `axonvia@gmail.com`. |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` | First deploy only | Creates the first admin during the build if that email has no account (password: 12+ characters). Existing accounts are never changed; remove `ADMIN_PASSWORD` once you can sign in. |

`AUTH_URL` is **not** needed on Vercel: Auth.js trusts the host automatically when the `VERCEL` environment
variable is present. `NEXT_PUBLIC_*` values are inlined at build time, so redeploy after changing them.
The site URL (`SITE_URL`) and booking destination (`BOOKING_URL`) live in `lib/site.ts`, not in Vercel.

## After the first deploy

1. Check the build log for `migrate-deploy: database schema is up to date` (and the `admin bootstrap:` line).
   Migrations only `CREATE TABLE IF NOT EXISTS` and are recorded in `drizzle.__drizzle_migrations`, so existing
   tables and data are never touched and re-running is a no-op. To check a database by hand, run
   `npm run db:status` (read-only) with `DATABASE_URL` pointing at it.
2. Sign in at `/admin/login` with `ADMIN_EMAIL` / `ADMIN_PASSWORD` (or create an admin with `scripts/create-admin.ts`,
   see `docs/ENVIRONMENT.md`), then remove `ADMIN_PASSWORD` from Vercel.
3. Send one test contact message and one newsletter signup; confirm they appear under Admin → Leads / Newsletter
   and that the emails arrive.

Failures are logged as one JSON line each (Vercel → Logs): `lead_save_error` (with `emailedInstead` when the
enquiry was emailed to the team because it couldn't be saved), `subscriber_save_error`, `email_send_error` and
`db_query_error`.

## Notes

- The chat assistant (`app/api/chat`) calls Google Gemini (`gemini-3.5-flash`) and streams the reply. Each visitor
  is limited to 20 messages per 10 minutes and each reply is capped at 2,048 tokens; set usage limits for the key's
  project in Google AI Studio as well. Failures are logged as one `chat_api_error` JSON line (no secrets).
- Sign-in lockouts and form rate limits (`lib/rate-limit.ts`) are kept in function memory, so on Vercel each
  instance counts separately. A shared store (e.g. Upstash Redis via the Vercel Marketplace) would make them global.
- The local PGlite database mode (`DATABASE_URL=pglite:...`) is for local development only; never set it on Vercel.
