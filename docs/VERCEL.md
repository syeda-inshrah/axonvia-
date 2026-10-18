# Deploying to Vercel

The site is a standard Next.js 16 App Router app, so Vercel detects and builds it with no extra configuration
(`npm run build` → `next build`). No `vercel.json` is needed.

## Project settings

- **Framework preset:** Next.js (auto-detected)
- **Build command / output:** defaults (`next build`, `.next`)
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
| `ANTHROPIC_API_KEY` | For the chat assistant | Claude API key (server-only). Without it the chat replies that it's unavailable and points to the contact form. |
| `NEXT_PUBLIC_CONTACT_EMAIL` | Yes | Public contact address, e.g. `axonvia@gmail.com`. |
| `NEXT_PUBLIC_SITE_URL` | Yes | Production origin without trailing slash, e.g. `https://axonvia.vercel.app` or your domain. |
| `NEXT_PUBLIC_CAL_LINK` | Optional | Cal.com event path; without it booking buttons open an email instead. |

`AUTH_URL` is **not** needed on Vercel: Auth.js trusts the host automatically when the `VERCEL` environment
variable is present. `NEXT_PUBLIC_*` values are inlined at build time, so redeploy after changing them.

## After the first deploy

1. Apply migrations to the production database: `npm run db:migrate` with `DATABASE_URL` pointing at it.
2. Create the first admin (`scripts/create-admin.ts`, see `docs/ENVIRONMENT.md`) and sign in at `/admin/login`.
3. Send one test contact message and one newsletter signup and confirm the emails arrive.

## Notes

- The chat assistant (`app/api/chat`) calls Claude Opus 5.5 and streams the reply. Each visitor is limited to
  20 messages per 10 minutes and each reply is capped at 4,096 tokens; set a monthly spend limit for the key in the
  Anthropic Console as well.
- Sign-in lockouts and form rate limits (`lib/rate-limit.ts`) are kept in function memory, so on Vercel each
  instance counts separately. A shared store (e.g. Upstash Redis via the Vercel Marketplace) would make them global.
- The local PGlite database mode (`DATABASE_URL=pglite:...`) is for local development only; never set it on Vercel.
