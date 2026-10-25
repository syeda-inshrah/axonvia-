# Environment variables

Set these in `.env.local` for local development and in your hosting provider's settings for production.
Never commit real values. `.env.local.example` lists every name with an empty value.

| Variable | Required | Used for | Without it |
| --- | --- | --- | --- |
| `DATABASE_URL` | **Yes** | Neon Postgres connection string (leads, subscribers, CMS content, admin users). | The site renders with empty Projects/FAQ/Testimonials; forms and admin fail. |
| `AUTH_SECRET` | **Yes** | Signs admin sessions (Auth.js) and newsletter unsubscribe links. Generate with `openssl rand -base64 32` (or `npx auth secret`). Use a different value per environment. | Admin sign-in fails; welcome emails are not sent (they can't carry a valid unsubscribe link). |
| `AUTH_URL` | **Yes** unless hosted on Vercel | The site's own origin for Auth.js, e.g. `https://axonvia.com` (locally `http://localhost:3000`). Vercel detects it automatically. | Admin sign-in fails with `UntrustedHost` on self-hosted servers and `next start`. |
| `RESEND_API_KEY` | **Yes** | Sending contact notifications, contact confirmations, and newsletter welcome emails. | Submissions are saved but no emails go out (errors are logged). |
| `RESEND_FROM_EMAIL` | **Yes** | Sender, e.g. `Axonvia <hello@your-domain>`. The domain must be verified in Resend. | Falls back to Resend's test sender `onboarding@resend.dev`, which only delivers to your own Resend account. |
| `ADMIN_NOTIFICATION_EMAIL` | Recommended | Inbox that receives "New lead" notifications. | Falls back to `NEXT_PUBLIC_CONTACT_EMAIL`, then to `axonvia@gmail.com`. |
| `GEMINI_API_KEY` | Recommended | Google Gemini API key for the website chat assistant (`app/api/chat`, model `gemini-3.5-flash`). Server-only: never prefix it with `NEXT_PUBLIC_`. Create one in Google AI Studio (aistudio.google.com/apikey). | The chat button still appears, but replies say the assistant is unavailable and point to the contact form. |
| `NEXT_PUBLIC_CONTACT_EMAIL` | **Yes** for launch | Public contact address shown in the footer, FAQ, legal pages, and the booking fallback. | Falls back to `axonvia@gmail.com`. |

The site URL and the booking destination are not environment variables: they are `SITE_URL` and `BOOKING_URL`
in `lib/site.ts`. Change `SITE_URL` when the domain changes (it drives metadata, canonical URLs, Open Graph,
the sitemap, robots.txt, JSON-LD and email links). `BOOKING_URL` is `#final-cta` (the contact form) until there
is a booking page; set it to a full Cal.com link and every "Book a Free Automation Audit" button opens it.

`NEXT_PUBLIC_*` values are compiled into the site at build time: **rebuild and redeploy after changing them.**

## Running everything locally without the shared database

Set `DATABASE_URL=pglite:.local-db` in `.env.local` to use an embedded Postgres (PGlite) stored in the
git-ignored `.local-db/` folder. Contact messages, subscribers, content, and admin accounts then live only on
your machine. `@electric-sql/pglite` is a dev dependency, so this mode is for local development only.

```bash
npm run db:local                      # create/update the local database from drizzle/ migrations
node --env-file=.env.local node_modules/.bin/tsx scripts/create-admin.ts you@example.com
npm run build && npm start            # http://localhost:3000
```

`npm run db:local` refuses to run unless `DATABASE_URL` starts with `pglite:`. Stop the server before running
scripts against the same folder: PGlite allows one process at a time. Delete `.local-db/` to start over.

## One-off script variables

| Variable | Used by |
| --- | --- |
| `ADMIN_PASSWORD` | Optional for `scripts/create-admin.ts`; if unset the script prompts for the password without echoing it. |

## Creating the first admin

```bash
node --env-file=.env.local node_modules/.bin/tsx scripts/create-admin.ts you@your-domain
```

Passwords must be at least 12 characters. Every admin has full access to leads, subscribers, and content.

## Security notes

- **Sign-in rate limiting** (5 failed attempts per account, 20 per IP, per 15 minutes) and **form rate limiting**
  (contact: 5/hour per IP; newsletter: 10/hour per IP; at most 3 confirmation/welcome emails per address per day)
  are kept in server memory. On a single server that is enough. On serverless or multi-instance hosting each
  instance counts separately and counts reset on cold start, so for stronger guarantees move `lib/rate-limit.ts`
  to a shared store such as Upstash Redis.
- Rate limits identify clients by the `x-forwarded-for` header, which hosts like Vercel set. Behind a proxy that
  does not set it, all visitors share one bucket.
- Security headers (CSP, HSTS, frame and content-type protections) are set in `next.config.ts`. If you add a new
  third-party script, iframe, or font host, add it to the Content-Security-Policy there.
