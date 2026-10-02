# Axonvia Website — Backend Design

**Date:** 2026-10-02
**Status:** Approved for implementation planning

## 1. Purpose & Scope

The Axonvia marketing site (see `AXONVIA_WEBSITE_SPEC.md` for the frontend blueprint) is currently a static design spec with no backend. This document specifies the backend that supports it:

1. Contact/booking form submissions
2. A CMS for dynamic content (Projects, Testimonials, FAQs)
3. Newsletter / lead capture
4. An admin/auth system to manage the above

Out of scope for this doc: the frontend section implementation (covered separately), payment processing, multi-tenant/multi-admin role hierarchies (single admin role is sufficient at this stage).

## 2. Infrastructure

- **Database/Auth/Storage:** Supabase (managed Postgres + Auth + Storage).
- **App framework:** Next.js (App Router) — Server Actions used as the API layer instead of a separate REST service, to avoid a second deployable and keep type-safety end to end.
- **Email delivery:** Resend, triggered from Server Actions after a successful database write.
- **Scheduling:** Cal.com, embedded client-side via `@calcom/embed-react`. No custom backend logic — Cal.com hosts the booking state itself.

## 3. Data Model

All tables live in the Supabase Postgres database (`public` schema).

### `leads`
| Column | Type | Notes |
|---|---|---|
| id | uuid, pk, default `gen_random_uuid()` | |
| name | text, not null | |
| email | text, not null | |
| company | text, nullable | |
| message | text, nullable | |
| source | text, not null, default `'contact_form'` | distinguishes entry point if more forms are added later |
| status | text, not null, default `'new'` | one of `new`, `contacted`, `closed` |
| created_at | timestamptz, not null, default `now()` | |

### `newsletter_subscribers`
| Column | Type | Notes |
|---|---|---|
| id | uuid, pk, default `gen_random_uuid()` | |
| email | text, not null, unique | |
| status | text, not null, default `'subscribed'` | one of `subscribed`, `unsubscribed` |
| created_at | timestamptz, not null, default `now()` | |

### `projects`
| Column | Type | Notes |
|---|---|---|
| id | uuid, pk, default `gen_random_uuid()` | |
| name | text, not null | |
| description | text, not null | |
| stats | jsonb, not null, default `'[]'` | array of short strings, e.g. `["Multi-agent system", "Real estate lead automation"]` |
| tags | text[], not null, default `'{}'` | tech tags, e.g. `{Claude API, FastAPI, Next.js}` |
| image_url | text, nullable | points to Supabase Storage |
| link | text, nullable | external/detail link |
| is_featured | boolean, not null, default `false` | only one row should be featured at a time (enforced at the application layer, not a DB constraint) |
| status | text, not null, default `'coming_soon'` | one of `live`, `coming_soon` |
| sort_order | int, not null, default `0` | |

### `testimonials`
| Column | Type | Notes |
|---|---|---|
| id | uuid, pk, default `gen_random_uuid()` | |
| quote | text, not null | |
| client_name | text, not null | |
| client_role | text, nullable | |
| avatar_url | text, nullable | points to Supabase Storage |
| is_published | boolean, not null, default `false` | |
| sort_order | int, not null, default `0` | |

### `faqs`
| Column | Type | Notes |
|---|---|---|
| id | uuid, pk, default `gen_random_uuid()` | |
| question | text, not null | |
| answer | text, not null | |
| is_published | boolean, not null, default `true` | |
| sort_order | int, not null, default `0` | |

**Admin identity** is handled entirely by Supabase Auth — there is no separate `admins` table. Admin accounts are provisioned manually via the Supabase dashboard (no public sign-up flow exists or is planned).

## 4. Row-Level Security

RLS is enabled on every table above. Policies:

- **`projects`, `testimonials`, `faqs`** (public-readable, admin-writable):
  - `SELECT`: allowed for the `anon` role, restricted to rows where `status = 'live'` (projects) or `is_published = true` (testimonials, faqs).
  - `INSERT` / `UPDATE` / `DELETE`: allowed only for `authenticated` role.
- **`leads`, `newsletter_subscribers`** (public-writable, admin-readable):
  - `INSERT`: allowed for the `anon` role (anyone can submit a form), with no `SELECT`/`UPDATE`/`DELETE` grant — a submitter cannot read back other people's data.
  - `SELECT` / `UPDATE` / `DELETE`: allowed only for `authenticated` role.

No table grants blanket access to `anon` beyond the specific operation it needs.

## 5. API Layer (Next.js Server Actions)

No standalone REST/GraphQL API. Server Actions call the Supabase client directly:

- `submitContactForm(formData)` — validates input server-side, inserts into `leads`, then sends two emails via Resend: a notification to the Axonvia inbox and a confirmation to the submitter. Returns a success/error result to the form component (no page reload).
- `subscribeNewsletter(email)` — validates email format, inserts into `newsletter_subscribers` (on conflict: if already subscribed, no-op; if previously unsubscribed, reactivate), sends a welcome email via Resend.
- Admin CRUD actions (`createProject`, `updateProject`, `deleteProject`, and equivalents for testimonials/faqs) — each checks the current Supabase session server-side before performing the write, independent of the RLS policy (defense in depth: the action itself refuses to run for an unauthenticated caller, not just the database).

Public-facing content (Projects, Testimonials, FAQs sections of the marketing site) is read server-side in React Server Components via direct Supabase queries — no client-side fetching or loading states needed for that content.

## 6. Auth Flow

- `/admin/login` — email/password form, calls Supabase Auth `signInWithPassword`.
- Next.js middleware checks the Supabase session cookie on every request under `/admin/*`; unauthenticated requests redirect to `/admin/login`.
- No public registration route exists anywhere in the app.

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
- Admin CRUD actions surface Supabase errors (e.g. constraint violations) back to the dashboard UI as inline error messages.

## 10. Environment Variables

- `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` — public, used by RSC/client reads under RLS.
- `SUPABASE_SERVICE_ROLE_KEY` — server-only, used only where an action must bypass RLS (none currently planned; all writes go through the normal authenticated/anon grants above).
- `RESEND_API_KEY` — server-only.
- `NEXT_PUBLIC_CAL_LINK` — Cal.com event slug for the embed.

## 11. Implementation Phasing

This spec covers one cohesive backend, but implementation proceeds in phases to keep each step independently testable:

1. Supabase project setup — schema migration (all 5 tables) + RLS policies.
2. Contact form + newsletter signup (public-facing, no auth required) — Server Actions + Resend integration.
3. Admin auth (login + middleware protection) + admin dashboard CRUD for Projects, Testimonials, FAQs.
4. Cal.com embed wired into the three booking CTAs.
