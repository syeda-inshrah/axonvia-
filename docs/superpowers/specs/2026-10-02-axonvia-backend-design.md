# Axonvia Website — Backend Design

**Date:** 2026-10-02
**Status:** Approved for implementation planning (revised: Neon replaces Supabase)

## 1. Purpose & Scope

The Axonvia marketing site (see `AXONVIA_WEBSITE_SPEC.md` for the frontend blueprint) is currently a static design spec with no backend. This document specifies the backend that supports it:

1. Contact/booking form submissions
2. A CMS for dynamic content (Projects, Testimonials, FAQs)
3. Newsletter / lead capture
4. An admin/auth system to manage the above

Out of scope for this doc: the frontend section implementation (covered separately), payment processing, multi-tenant/multi-admin role hierarchies (single admin role is sufficient at this stage).

**Revision note:** The original version of this spec used Supabase (Postgres + Auth + Storage). The project has switched to **Neon** (serverless Postgres only). Neon has no built-in Auth or Storage service, so this revision adds Auth.js (NextAuth) for admin login and drops Storage entirely — `image_url`/`avatar_url` fields remain plain text URL columns pointing to externally-hosted images, with no upload pipeline built in this phase.

## 2. Infrastructure

- **Database:** Neon (serverless Postgres), accessed via `@neondatabase/serverless` and **Drizzle ORM**.
- **App framework:** Next.js (App Router) — Server Actions used as the API layer instead of a separate REST service, to avoid a second deployable and keep type-safety end to end.
- **Auth:** Auth.js (NextAuth v5) with the Credentials provider, backed by an `admin_users` table in the same Neon database. Passwords hashed with bcrypt.
- **Email delivery:** Resend, triggered from Server Actions after a successful database write.
- **Scheduling:** Cal.com, embedded client-side via `@calcom/embed-react`. No custom backend logic — Cal.com hosts the booking state itself.

## 3. Data Model

All tables are defined as a Drizzle schema (`lib/db/schema.ts`) and migrated with `drizzle-kit`.

### `leads`
| Column | Type | Notes |
|---|---|---|
| id | uuid, pk, default random | |
| name | text, not null | |
| email | text, not null | |
| company | text, nullable | |
| message | text, nullable | |
| source | text, not null, default `'contact_form'` | distinguishes entry point if more forms are added later |
| status | text, not null, default `'new'` | one of `new`, `contacted`, `closed` |
| created_at | timestamptz, not null, default now | |

### `newsletter_subscribers`
| Column | Type | Notes |
|---|---|---|
| id | uuid, pk, default random | |
| email | text, not null, unique | |
| status | text, not null, default `'subscribed'` | one of `subscribed`, `unsubscribed` |
| created_at | timestamptz, not null, default now | |

### `projects`
| Column | Type | Notes |
|---|---|---|
| id | uuid, pk, default random | |
| name | text, not null | |
| description | text, not null | |
| stats | jsonb, not null, default `[]` | array of short strings |
| tags | text[], not null, default `{}` | tech tags |
| image_url | text, nullable | plain URL to an externally-hosted image |
| link | text, nullable | external/detail link |
| is_featured | boolean, not null, default `false` | only one row should be featured at a time (enforced at the application layer) |
| status | text, not null, default `'coming_soon'` | one of `live`, `coming_soon` |
| sort_order | integer, not null, default `0` | |

### `testimonials`
| Column | Type | Notes |
|---|---|---|
| id | uuid, pk, default random | |
| quote | text, not null | |
| client_name | text, not null | |
| client_role | text, nullable | |
| avatar_url | text, nullable | plain URL to an externally-hosted image |
| is_published | boolean, not null, default `false` | |
| sort_order | integer, not null, default `0` | |

### `faqs`
| Column | Type | Notes |
|---|---|---|
| id | uuid, pk, default random | |
| question | text, not null | |
| answer | text, not null | |
| is_published | boolean, not null, default `true` | |
| sort_order | integer, not null, default `0` | |

### `admin_users`
| Column | Type | Notes |
|---|---|---|
| id | uuid, pk, default random | |
| email | text, not null, unique | |
| password_hash | text, not null | bcrypt hash |
| created_at | timestamptz, not null, default now | |

Admin accounts are provisioned by running a one-off script (`scripts/create-admin.ts`) that hashes a password and inserts a row — there is no public signup route anywhere in the app.

## 4. Authorization Model

Unlike the Supabase version of this design, there is no PostgREST layer sitting in front of Neon, so there are no `anon`/`authenticated` Postgres roles to attach Row-Level Security policies to. Neon is reached **only** through the server-side Drizzle client inside Server Actions and Server Components — it is never exposed directly to the browser.

Given that, authorization is enforced at the **application layer**, not the database layer:

- Every admin-only Server Action (create/update/delete on projects, testimonials, FAQs; read/update on leads; read on subscribers) calls `requireAdminUser()` first, which checks the current Auth.js session and throws if there is none. The action returns an error result rather than performing the write/read when this check fails.
- Public-facing reads (published projects/testimonials/FAQs) are plain Drizzle queries filtered by `status = 'live'` / `is_published = true` in application code — no session check needed since they're intentionally public.
- `leads` and `newsletter_subscribers` INSERT (from the contact/newsletter forms) requires no session — anyone can submit — but all other operations on those two tables require `requireAdminUser()`.

This is deliberately simpler than the Supabase RLS model: with a single trusted server-side data-access layer, per-request Postgres role switching would add complexity without adding real security, since nothing ever talks to Neon except our own Server Actions.

## 5. API Layer (Next.js Server Actions)

No standalone REST/GraphQL API. Server Actions call the Drizzle client directly:

- `submitContactForm(formData)` — validates input server-side, inserts into `leads`, then sends two emails via Resend: a notification to the Axonvia inbox and a confirmation to the submitter. Returns a success/error result to the form component (no page reload).
- `subscribeNewsletter(formData)` — validates email format, upserts into `newsletter_subscribers` (reactivates if previously unsubscribed), sends a welcome email via Resend.
- Admin CRUD actions (`createProject`, `updateProject`, `deleteProject`, and equivalents for testimonials/faqs) — each calls `requireAdminUser()` before performing the write.

Public-facing content (Projects, Testimonials, FAQs sections of the marketing site) is read server-side in React Server Components via direct Drizzle queries — no client-side fetching or loading states needed for that content.

## 6. Auth Flow

- Auth.js (NextAuth v5) configured in a root `auth.ts` with the Credentials provider, JWT session strategy, and a custom `/admin/login` sign-in page.
- `/admin/login` — email/password form that calls a `signInAction` Server Action wrapping Auth.js's `signIn('credentials', ...)`.
- Root `middleware.ts` wraps Auth.js's `auth()` helper to check the session on every request under `/admin/*` (except `/admin/login`); unauthenticated requests redirect to `/admin/login`.
- No public registration route exists anywhere in the app. Admin accounts are created via `scripts/create-admin.ts`.

## 7. Admin Dashboard Scope

Functional, unstyled-relative-to-marketing-site UI at `/admin`:

- **Leads** — list view, filter by status, update status (`new` → `contacted` → `closed`).
- **Newsletter Subscribers** — list view, export (CSV) for future use with an external email tool if needed.
- **Projects** — full CRUD, including marking one project as featured and setting `status`.
- **Testimonials** — full CRUD, toggle `is_published`.
- **FAQs** — full CRUD, toggle `is_published`, reorder via `sort_order`.

## 8. Booking Integration

The "Book a Free Strategy Call" / "Book Your Free Call" CTAs (appearing in the Navbar, Hero, and Final CTA sections per the frontend spec) open a Cal.com embed instead of a plain link. This requires a Cal.com account and event-type slug to be provided before this piece can be wired up; until then the CTA falls back to a `mailto:` link.

Capturing completed bookings into the `leads` table via a Cal.com webhook is a reasonable future enhancement but is **not** part of this spec — out of scope for the initial build.

## 9. Error Handling

- Form Server Actions return a typed `{ success: boolean; error?: string }` result rather than throwing — the frontend form component handles both states without needing a try/catch around the action call itself.
- Resend send failures do not roll back the database write — the lead/subscriber is already saved; a failed notification email is logged server-side (console/Vercel logs) but does not surface as an error to the submitter, since their data was captured successfully.
- Admin CRUD actions surface Drizzle/Postgres errors (e.g. constraint violations) back to the dashboard UI as inline error messages.
- Auth.js's `signInAction` catches `AuthError` (invalid credentials) and returns `{ error: ... }`; any other thrown value (including Auth.js's internal redirect signal on success) is re-thrown, per Auth.js's documented Server Actions pattern.

## 10. Environment Variables

- `DATABASE_URL` — Neon connection string (server-only).
- `AUTH_SECRET` — Auth.js session signing secret, generated with `npx auth secret` or `openssl rand -base64 33` (server-only).
- `RESEND_API_KEY` — server-only.
- `RESEND_FROM_EMAIL`, `ADMIN_NOTIFICATION_EMAIL` — server-only, with code-level fallback defaults.
- `NEXT_PUBLIC_CAL_LINK` — Cal.com event slug for the embed (public — it's meant to be visible client-side).

## 11. Implementation Phasing

This spec covers one cohesive backend, but implementation proceeds in phases to keep each step independently testable:

1. Project scaffold + Neon/Drizzle schema and client.
2. Contact form + newsletter signup (public-facing, no auth required) — Server Actions + Resend integration.
3. Admin auth (Auth.js, `admin_users` table, login, middleware) + admin dashboard CRUD for Projects, Testimonials, FAQs.
4. Cal.com embed wired into the three booking CTAs.
