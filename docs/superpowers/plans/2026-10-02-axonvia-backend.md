# Axonvia Backend Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the Neon-backed Next.js backend supporting contact/newsletter forms, a CMS for projects/testimonials/FAQs, Auth.js admin auth, and a Cal.com booking embed.

**Architecture:** Next.js App Router with Server Actions as the only API layer. Neon (serverless Postgres) accessed via Drizzle ORM — no separate REST service, no PostgREST/RLS layer. Authorization is enforced in the Server Action layer (`requireAdminUser()`) since Neon is only ever reached through our own trusted server code. Auth.js (NextAuth v5, Credentials provider) backs admin login against an `admin_users` table. Resend sends transactional email after successful DB writes. Cal.com is embedded client-side for booking, with a `mailto:` fallback until a real Cal.com link is configured.

**Tech Stack:** Next.js 14 (App Router, TypeScript), Tailwind CSS, Neon (`@neondatabase/serverless`), Drizzle ORM + drizzle-kit, Auth.js v5 (`next-auth@beta`) + bcryptjs, Resend, Zod, `@calcom/embed-react`, Vitest + React Testing Library.

**Spec:** `docs/superpowers/specs/2026-10-02-axonvia-backend-design.md`

## Global Constraints

- Next.js App Router only; Server Actions are the API layer — no separate REST/GraphQL service.
- Neon is reached only through the server-side Drizzle client (`lib/db`) — never exposed to the browser.
- Authorization is application-layer: every admin-only action calls `requireAdminUser()` before touching the database.
- No public admin signup route exists anywhere in the app; admin accounts are provisioned via `scripts/create-admin.ts`.
- A failed Resend send never rolls back or blocks a database write that already succeeded.
- The Cal.com CTA falls back to a `mailto:` link whenever `NEXT_PUBLIC_CAL_LINK` is unset.
- Unit tests mock `@/lib/db`, Resend, Auth.js, and Cal.com — no test hits a live external service.

## ⚠️ Human checkpoint before Task 2's manual step can be verified

Task 2 requires creating a real Neon project (neon.tech) and generating an `AUTH_SECRET` — this cannot be done by an automated worker. Everything through Task 1 can be built and tested without it. Tasks from Task 2 onward that touch the database need `DATABASE_URL` and `AUTH_SECRET` in `.env.local` before their manual/browser verification steps can be run — but automated unit tests (which mock `@/lib/db` and `@/auth`) do not need it.

---

## File Structure

```
package.json, tsconfig.json, next.config.ts, tailwind.config.ts, postcss.config.js
vitest.config.ts, vitest.setup.ts, drizzle.config.ts
.env.local.example
auth.ts                                    — Auth.js (NextAuth) config
middleware.ts                              — root auth middleware

app/
  layout.tsx, page.tsx, globals.css
  api/auth/[...nextauth]/route.ts          — Auth.js route handlers
  actions/
    contact.ts, newsletter.ts, auth.ts, projects.ts, testimonials.ts, faqs.ts, leads.ts, subscribers.ts
  admin/
    login/page.tsx, layout.tsx
    projects/page.tsx, testimonials/page.tsx, faqs/page.tsx, leads/page.tsx
    newsletter/page.tsx, newsletter/export/route.ts
  dev/contact-test/page.tsx

components/
  ContactForm.tsx, NewsletterForm.tsx, CalEmbed.tsx
  admin/
    SignOutButton.tsx
    ProjectForm.tsx, ProjectsTable.tsx, ProjectsAdminClient.tsx
    TestimonialForm.tsx, TestimonialsTable.tsx, TestimonialsAdminClient.tsx
    FaqForm.tsx, FaqsTable.tsx, FaqsAdminClient.tsx
    LeadsTable.tsx, SubscribersTable.tsx

lib/
  db/index.ts, db/schema.ts
  auth-credentials.ts, require-admin.ts
  validations.ts, email.ts
  queries/content.ts

scripts/create-admin.ts
drizzle/                                    — generated migrations
```

---

### Task 1: Project scaffold

**Files:**
- Create: `package.json`, `tsconfig.json`, `next.config.ts`, `tailwind.config.ts`, `postcss.config.js`, `vitest.config.ts`, `vitest.setup.ts`, `.env.local.example`, `.gitignore` (append)
- Create: `app/layout.tsx`, `app/page.tsx`, `app/globals.css`
- Test: `app/page.test.tsx`

**Interfaces:**
- Produces: a runnable Next.js dev server, `npm test` wired to Vitest, `@/*` import alias.

- [ ] **Step 1: Initialize npm and install dependencies**

```bash
npm init -y
npm install next@latest react@latest react-dom@latest drizzle-orm@latest @neondatabase/serverless@latest next-auth@beta bcryptjs@latest resend@latest zod@latest @calcom/embed-react@latest
npm install -D typescript @types/node @types/react @types/react-dom @types/bcryptjs tailwindcss postcss autoprefixer eslint eslint-config-next vitest @vitejs/plugin-react @testing-library/react @testing-library/jest-dom jsdom drizzle-kit tsx
```

- [ ] **Step 2: Write `tsconfig.json`**

```json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": { "@/*": ["./*"] }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

- [ ] **Step 3: Write `next.config.ts`**

```ts
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {}

export default nextConfig
```

- [ ] **Step 4: Write `tailwind.config.ts` and `postcss.config.js`**

```ts
// tailwind.config.ts
import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: { extend: {} },
  plugins: [],
}

export default config
```

```js
// postcss.config.js
module.exports = {
  plugins: { tailwindcss: {}, autoprefixer: {} },
}
```

- [ ] **Step 5: Write `app/globals.css`, `app/layout.tsx`, `app/page.tsx`**

```css
/* app/globals.css */
@tailwind base;
@tailwind components;
@tailwind utilities;
```

```tsx
// app/layout.tsx
import './globals.css'

export const metadata = { title: 'Axonvia' }

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
```

```tsx
// app/page.tsx
export default function HomePage() {
  return <main>Axonvia — backend under construction</main>
}
```

- [ ] **Step 6: Write `vitest.config.ts` and `vitest.setup.ts`**

```ts
// vitest.config.ts
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    globals: true,
  },
  resolve: {
    alias: { '@': path.resolve(__dirname, './') },
  },
})
```

```ts
// vitest.setup.ts
import '@testing-library/jest-dom/vitest'
```

- [ ] **Step 7: Write `.env.local.example`**

```
DATABASE_URL=
AUTH_SECRET=
RESEND_API_KEY=
RESEND_FROM_EMAIL=
ADMIN_NOTIFICATION_EMAIL=
NEXT_PUBLIC_CAL_LINK=
```

- [ ] **Step 8: Add `package.json` scripts**

Edit `package.json` to add:

```json
"scripts": {
  "dev": "next dev",
  "build": "next build",
  "start": "next start",
  "lint": "next lint",
  "test": "vitest run",
  "db:generate": "drizzle-kit generate",
  "db:migrate": "drizzle-kit migrate"
}
```

- [ ] **Step 9: Append to `.gitignore`**

```
node_modules
.next
.env.local
```

- [ ] **Step 10: Write the smoke test**

```tsx
// app/page.test.tsx
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import HomePage from './page'

describe('HomePage', () => {
  it('renders the placeholder heading', () => {
    render(<HomePage />)
    expect(screen.getByText(/Axonvia/i)).toBeInTheDocument()
  })
})
```

- [ ] **Step 11: Run the test suite and verify it passes**

Run: `npm test`
Expected: 1 test file, 1 test, PASS

- [ ] **Step 12: Verify the app builds**

Run: `npm run build`
Expected: build succeeds with no errors

- [ ] **Step 13: Commit**

```bash
git add -A
git commit -m "chore: scaffold Next.js project with Tailwind and Vitest"
```

---

### Task 2: Drizzle schema and Neon migration

**Files:**
- Create: `lib/db/schema.ts`, `drizzle.config.ts`

**Interfaces:**
- Produces: `leads`, `newsletterSubscribers`, `projects`, `testimonials`, `faqs`, `adminUsers` Drizzle table objects — consumed by every task from Task 3 onward.

- [ ] **Step 1: Write `lib/db/schema.ts`**

```ts
import { pgTable, uuid, text, timestamp, boolean, integer, jsonb } from 'drizzle-orm/pg-core'

export const leads = pgTable('leads', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  email: text('email').notNull(),
  company: text('company'),
  message: text('message'),
  source: text('source').notNull().default('contact_form'),
  status: text('status', { enum: ['new', 'contacted', 'closed'] }).notNull().default('new'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
})

export const newsletterSubscribers = pgTable('newsletter_subscribers', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: text('email').notNull().unique(),
  status: text('status', { enum: ['subscribed', 'unsubscribed'] }).notNull().default('subscribed'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
})

export const projects = pgTable('projects', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  description: text('description').notNull(),
  stats: jsonb('stats').$type<string[]>().notNull().default([]),
  tags: text('tags').array().notNull().default([]),
  imageUrl: text('image_url'),
  link: text('link'),
  isFeatured: boolean('is_featured').notNull().default(false),
  status: text('status', { enum: ['live', 'coming_soon'] }).notNull().default('coming_soon'),
  sortOrder: integer('sort_order').notNull().default(0),
})

export const testimonials = pgTable('testimonials', {
  id: uuid('id').primaryKey().defaultRandom(),
  quote: text('quote').notNull(),
  clientName: text('client_name').notNull(),
  clientRole: text('client_role'),
  avatarUrl: text('avatar_url'),
  isPublished: boolean('is_published').notNull().default(false),
  sortOrder: integer('sort_order').notNull().default(0),
})

export const faqs = pgTable('faqs', {
  id: uuid('id').primaryKey().defaultRandom(),
  question: text('question').notNull(),
  answer: text('answer').notNull(),
  isPublished: boolean('is_published').notNull().default(true),
  sortOrder: integer('sort_order').notNull().default(0),
})

export const adminUsers = pgTable('admin_users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: text('email').notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
})
```

- [ ] **Step 2: Write `drizzle.config.ts`**

```ts
import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  schema: './lib/db/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: { url: process.env.DATABASE_URL! },
})
```

- [ ] **Step 3: ⚠️ Manual step (requires a human with a Neon account)**

1. Create a project at https://neon.tech (or use an existing one).
2. Copy the pooled connection string from the Neon dashboard into `.env.local` as `DATABASE_URL`.
3. Generate an Auth.js secret: `npx auth secret` (or `openssl rand -base64 33`) and set it as `AUTH_SECRET` in `.env.local`.

- [ ] **Step 4: Generate and run the migration**

Run: `npm run db:generate -- --name init`
Expected: a new SQL file appears under `drizzle/`

Run: `npm run db:migrate`
Expected: migration applies cleanly against the Neon database

- [ ] **Step 5: Commit**

```bash
git add lib/db/schema.ts drizzle.config.ts drizzle
git commit -m "feat: add Drizzle schema and initial Neon migration"
```

---

### Task 3: Neon/Drizzle client and shared types

**Files:**
- Create: `lib/db/index.ts`, `lib/types.ts`
- Test: `lib/db/index.test.ts`

**Interfaces:**
- Consumes: `DATABASE_URL` env var, schema from Task 2.
- Produces: `db` (Drizzle client, from `lib/db/index.ts`), plus `Lead`, `NewsletterSubscriber`, `Project`, `Testimonial`, `Faq` types — used by every data-access task from Task 6 onward.

- [ ] **Step 1: Write the failing test**

```ts
// lib/db/index.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest'

const neonClient = { mocked: 'neon-client' }
const neon = vi.fn(() => neonClient)
vi.mock('@neondatabase/serverless', () => ({ neon }))

const drizzleInstance = { mocked: 'drizzle-instance' }
const drizzle = vi.fn(() => drizzleInstance)
vi.mock('drizzle-orm/neon-http', () => ({ drizzle }))

describe('db client', () => {
  beforeEach(() => {
    process.env.DATABASE_URL = 'postgresql://user:pass@host/db'
    neon.mockClear()
    drizzle.mockClear()
  })

  it('creates a Neon client from DATABASE_URL and wraps it with drizzle', async () => {
    vi.resetModules()
    const { db } = await import('./index')

    expect(neon).toHaveBeenCalledWith('postgresql://user:pass@host/db')
    expect(drizzle).toHaveBeenCalledWith(neonClient, expect.any(Object))
    expect(db).toBe(drizzleInstance)
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- lib/db`
Expected: FAIL — `lib/db/index.ts` does not exist

- [ ] **Step 3: Write `lib/db/index.ts`**

```ts
import { neon } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'
import * as schema from './schema'

const sql = neon(process.env.DATABASE_URL!)
export const db = drizzle(sql, { schema })
```

- [ ] **Step 4: Write `lib/types.ts`**

```ts
export interface Lead {
  id: string
  name: string
  email: string
  company: string | null
  message: string | null
  source: string
  status: 'new' | 'contacted' | 'closed'
  createdAt: Date
}

export interface NewsletterSubscriber {
  id: string
  email: string
  status: 'subscribed' | 'unsubscribed'
  createdAt: Date
}

export interface Project {
  id: string
  name: string
  description: string
  stats: string[]
  tags: string[]
  imageUrl: string | null
  link: string | null
  isFeatured: boolean
  status: 'live' | 'coming_soon'
  sortOrder: number
}

export interface Testimonial {
  id: string
  quote: string
  clientName: string
  clientRole: string | null
  avatarUrl: string | null
  isPublished: boolean
  sortOrder: number
}

export interface Faq {
  id: string
  question: string
  answer: string
  isPublished: boolean
  sortOrder: number
}
```

- [ ] **Step 5: Run test to verify it passes**

Run: `npm test -- lib/db`
Expected: PASS

- [ ] **Step 6: Commit**

```bash
git add lib/db/index.ts lib/db/index.test.ts lib/types.ts
git commit -m "feat: add Neon/Drizzle client and shared data types"
```

---

### Task 4: Validation schemas

**Files:**
- Create: `lib/validations.ts`
- Test: `lib/validations.test.ts`

**Interfaces:**
- Produces: `contactFormSchema`, `ContactFormInput`, `newsletterSchema`, `NewsletterInput` — consumed by Tasks 6 and 7.

- [ ] **Step 1: Write the failing test**

```ts
// lib/validations.test.ts
import { describe, it, expect } from 'vitest'
import { contactFormSchema, newsletterSchema } from './validations'

describe('contactFormSchema', () => {
  it('accepts a valid submission', () => {
    const result = contactFormSchema.safeParse({
      name: 'Jane Doe',
      email: 'jane@example.com',
      company: 'Acme',
      message: 'Tell me more',
    })
    expect(result.success).toBe(true)
  })

  it('rejects a missing name', () => {
    const result = contactFormSchema.safeParse({ name: '', email: 'jane@example.com' })
    expect(result.success).toBe(false)
  })

  it('rejects an invalid email', () => {
    const result = contactFormSchema.safeParse({ name: 'Jane', email: 'not-an-email' })
    expect(result.success).toBe(false)
  })
})

describe('newsletterSchema', () => {
  it('accepts a valid email', () => {
    expect(newsletterSchema.safeParse({ email: 'jane@example.com' }).success).toBe(true)
  })

  it('rejects an invalid email', () => {
    expect(newsletterSchema.safeParse({ email: 'nope' }).success).toBe(false)
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- lib/validations`
Expected: FAIL — `lib/validations.ts` does not exist

- [ ] **Step 3: Write `lib/validations.ts`**

```ts
import { z } from 'zod'

export const contactFormSchema = z.object({
  name: z.string().trim().min(1, 'Name is required').max(200),
  email: z.string().trim().email('Enter a valid email address'),
  company: z.string().trim().max(200).optional().or(z.literal('')),
  message: z.string().trim().max(2000).optional().or(z.literal('')),
})

export type ContactFormInput = z.infer<typeof contactFormSchema>

export const newsletterSchema = z.object({
  email: z.string().trim().email('Enter a valid email address'),
})

export type NewsletterInput = z.infer<typeof newsletterSchema>
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- lib/validations`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add lib/validations.ts lib/validations.test.ts
git commit -m "feat: add contact form and newsletter validation schemas"
```

---

### Task 5: Resend email helper

**Files:**
- Create: `lib/email.ts`
- Test: `lib/email.test.ts`

**Interfaces:**
- Consumes: `RESEND_API_KEY`, `RESEND_FROM_EMAIL`, `ADMIN_NOTIFICATION_EMAIL` env vars.
- Produces: `sendContactNotification(lead)`, `sendContactConfirmation(lead)`, `sendNewsletterWelcome(email)`, `LeadEmailPayload` type — consumed by Tasks 6 and 7.

- [ ] **Step 1: Write the failing test**

```ts
// lib/email.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest'

const send = vi.fn(async () => ({ data: { id: 'email_123' }, error: null }))
vi.mock('resend', () => ({
  Resend: vi.fn().mockImplementation(() => ({ emails: { send } })),
}))

describe('email helpers', () => {
  beforeEach(() => {
    process.env.RESEND_API_KEY = 'test-key'
    process.env.RESEND_FROM_EMAIL = 'Axonvia <hello@axonvia.example>'
    process.env.ADMIN_NOTIFICATION_EMAIL = 'admin@axonvia.example'
    send.mockClear()
  })

  it('sendContactNotification sends to the admin address', async () => {
    const { sendContactNotification } = await import('./email')
    await sendContactNotification({ name: 'Jane', email: 'jane@example.com' })

    expect(send).toHaveBeenCalledWith(
      expect.objectContaining({ to: 'admin@axonvia.example', subject: expect.stringContaining('Jane') })
    )
  })

  it('sendContactConfirmation sends to the submitter', async () => {
    const { sendContactConfirmation } = await import('./email')
    await sendContactConfirmation({ name: 'Jane', email: 'jane@example.com' })

    expect(send).toHaveBeenCalledWith(expect.objectContaining({ to: 'jane@example.com' }))
  })

  it('sendNewsletterWelcome sends to the subscriber', async () => {
    const { sendNewsletterWelcome } = await import('./email')
    await sendNewsletterWelcome('jane@example.com')

    expect(send).toHaveBeenCalledWith(expect.objectContaining({ to: 'jane@example.com' }))
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- lib/email`
Expected: FAIL — `lib/email.ts` does not exist

- [ ] **Step 3: Write `lib/email.ts`**

```ts
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

const FROM_EMAIL = process.env.RESEND_FROM_EMAIL ?? 'Axonvia <onboarding@resend.dev>'
const ADMIN_EMAIL = process.env.ADMIN_NOTIFICATION_EMAIL ?? 'hello@axonvia.example'

export interface LeadEmailPayload {
  name: string
  email: string
  company?: string
  message?: string
}

export async function sendContactNotification(lead: LeadEmailPayload) {
  return resend.emails.send({
    from: FROM_EMAIL,
    to: ADMIN_EMAIL,
    subject: `New lead: ${lead.name}`,
    text: `Name: ${lead.name}\nEmail: ${lead.email}\nCompany: ${lead.company ?? '—'}\nMessage: ${lead.message ?? '—'}`,
  })
}

export async function sendContactConfirmation(lead: LeadEmailPayload) {
  return resend.emails.send({
    from: FROM_EMAIL,
    to: lead.email,
    subject: 'We received your message — Axonvia',
    text: `Hi ${lead.name},\n\nThanks for reaching out to Axonvia. We'll get back to you shortly.\n\n— Axonvia`,
  })
}

export async function sendNewsletterWelcome(email: string) {
  return resend.emails.send({
    from: FROM_EMAIL,
    to: email,
    subject: "You're subscribed — Axonvia",
    text: `Thanks for subscribing to Axonvia updates. We'll keep you posted.`,
  })
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- lib/email`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add lib/email.ts lib/email.test.ts
git commit -m "feat: add Resend email helper functions"
```

---

### Task 6: Contact form Server Action

**Files:**
- Create: `app/actions/contact.ts`
- Test: `app/actions/contact.test.ts`

**Interfaces:**
- Consumes: `db` (from `lib/db`), `leads` table (from `lib/db/schema`), `contactFormSchema`, `sendContactNotification`/`sendContactConfirmation`.
- Produces: `submitContactForm(formData: FormData): Promise<ActionResult>`, `ActionResult { success: boolean; error?: string }` — reused by Tasks 7, 10, 12, 13, 14, 15.

- [ ] **Step 1: Write the failing tests**

```ts
// app/actions/contact.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest'

const values = vi.fn(async () => {})
const insert = vi.fn(() => ({ values }))
vi.mock('@/lib/db', () => ({ db: { insert } }))

const sendContactNotification = vi.fn(async () => {})
const sendContactConfirmation = vi.fn(async () => {})
vi.mock('@/lib/email', () => ({ sendContactNotification, sendContactConfirmation }))

function formDataFrom(fields: Record<string, string>) {
  const fd = new FormData()
  Object.entries(fields).forEach(([key, value]) => fd.set(key, value))
  return fd
}

describe('submitContactForm', () => {
  beforeEach(() => {
    values.mockClear()
    insert.mockClear()
    sendContactNotification.mockClear()
    sendContactConfirmation.mockClear()
  })

  it('returns an error for invalid input without touching the database', async () => {
    const { submitContactForm } = await import('./contact')
    const result = await submitContactForm(formDataFrom({ name: '', email: 'bad' }))

    expect(result.success).toBe(false)
    expect(insert).not.toHaveBeenCalled()
  })

  it('inserts the lead and sends both emails on valid input', async () => {
    const { submitContactForm } = await import('./contact')
    const result = await submitContactForm(
      formDataFrom({ name: 'Jane', email: 'jane@example.com', company: 'Acme', message: 'Hi' })
    )

    expect(result).toEqual({ success: true })
    expect(values).toHaveBeenCalledWith(
      expect.objectContaining({ name: 'Jane', email: 'jane@example.com' })
    )
    expect(sendContactNotification).toHaveBeenCalled()
    expect(sendContactConfirmation).toHaveBeenCalled()
  })

  it('returns an error when the database insert throws', async () => {
    values.mockRejectedValueOnce(new Error('db down'))
    const { submitContactForm } = await import('./contact')
    const result = await submitContactForm(
      formDataFrom({ name: 'Jane', email: 'jane@example.com' })
    )

    expect(result.success).toBe(false)
  })
})
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npm test -- app/actions/contact`
Expected: FAIL — `app/actions/contact.ts` does not exist

- [ ] **Step 3: Write `app/actions/contact.ts`**

```ts
'use server'

import { db } from '@/lib/db'
import { leads } from '@/lib/db/schema'
import { contactFormSchema } from '@/lib/validations'
import { sendContactNotification, sendContactConfirmation } from '@/lib/email'

export interface ActionResult {
  success: boolean
  error?: string
}

export async function submitContactForm(formData: FormData): Promise<ActionResult> {
  const parsed = contactFormSchema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    company: formData.get('company') ?? '',
    message: formData.get('message') ?? '',
  })

  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? 'Invalid input' }
  }

  const { name, email, company, message } = parsed.data

  try {
    await db.insert(leads).values({
      name,
      email,
      company: company || null,
      message: message || null,
    })
  } catch {
    return { success: false, error: 'Something went wrong saving your message. Please try again.' }
  }

  try {
    await Promise.all([
      sendContactNotification({ name, email, company, message }),
      sendContactConfirmation({ name, email, company, message }),
    ])
  } catch (emailError) {
    console.error('Contact form email send failed:', emailError)
  }

  return { success: true }
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npm test -- app/actions/contact`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add app/actions/contact.ts app/actions/contact.test.ts
git commit -m "feat: add submitContactForm server action"
```

---

### Task 7: Newsletter Server Action

**Files:**
- Create: `app/actions/newsletter.ts`
- Test: `app/actions/newsletter.test.ts`

**Interfaces:**
- Consumes: `db`, `newsletterSubscribers` table, `newsletterSchema`, `sendNewsletterWelcome`, `ActionResult` (Task 6).
- Produces: `subscribeNewsletter(formData: FormData): Promise<ActionResult>`.

- [ ] **Step 1: Write the failing tests**

```ts
// app/actions/newsletter.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest'

const onConflictDoUpdate = vi.fn(async () => {})
const values = vi.fn(() => ({ onConflictDoUpdate }))
const insert = vi.fn(() => ({ values }))
vi.mock('@/lib/db', () => ({ db: { insert } }))

const sendNewsletterWelcome = vi.fn(async () => {})
vi.mock('@/lib/email', () => ({ sendNewsletterWelcome }))

function formDataFrom(fields: Record<string, string>) {
  const fd = new FormData()
  Object.entries(fields).forEach(([key, value]) => fd.set(key, value))
  return fd
}

describe('subscribeNewsletter', () => {
  beforeEach(() => {
    onConflictDoUpdate.mockClear()
    values.mockClear()
    sendNewsletterWelcome.mockClear()
  })

  it('returns an error for an invalid email', async () => {
    const { subscribeNewsletter } = await import('./newsletter')
    const result = await subscribeNewsletter(formDataFrom({ email: 'nope' }))

    expect(result.success).toBe(false)
    expect(values).not.toHaveBeenCalled()
  })

  it('upserts the subscriber and sends a welcome email on valid input', async () => {
    const { subscribeNewsletter } = await import('./newsletter')
    const result = await subscribeNewsletter(formDataFrom({ email: 'jane@example.com' }))

    expect(result).toEqual({ success: true })
    expect(values).toHaveBeenCalledWith({ email: 'jane@example.com', status: 'subscribed' })
    expect(onConflictDoUpdate).toHaveBeenCalled()
    expect(sendNewsletterWelcome).toHaveBeenCalledWith('jane@example.com')
  })

  it('returns an error when the database upsert throws', async () => {
    onConflictDoUpdate.mockRejectedValueOnce(new Error('db down'))
    const { subscribeNewsletter } = await import('./newsletter')
    const result = await subscribeNewsletter(formDataFrom({ email: 'jane@example.com' }))

    expect(result.success).toBe(false)
  })
})
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npm test -- app/actions/newsletter`
Expected: FAIL — `app/actions/newsletter.ts` does not exist

- [ ] **Step 3: Write `app/actions/newsletter.ts`**

```ts
'use server'

import { db } from '@/lib/db'
import { newsletterSubscribers } from '@/lib/db/schema'
import { newsletterSchema } from '@/lib/validations'
import { sendNewsletterWelcome } from '@/lib/email'
import type { ActionResult } from '@/app/actions/contact'

export async function subscribeNewsletter(formData: FormData): Promise<ActionResult> {
  const parsed = newsletterSchema.safeParse({ email: formData.get('email') })

  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? 'Invalid input' }
  }

  const { email } = parsed.data

  try {
    await db
      .insert(newsletterSubscribers)
      .values({ email, status: 'subscribed' })
      .onConflictDoUpdate({ target: newsletterSubscribers.email, set: { status: 'subscribed' } })
  } catch {
    return { success: false, error: 'Something went wrong subscribing. Please try again.' }
  }

  try {
    await sendNewsletterWelcome(email)
  } catch (emailError) {
    console.error('Newsletter welcome email failed:', emailError)
  }

  return { success: true }
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npm test -- app/actions/newsletter`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add app/actions/newsletter.ts app/actions/newsletter.test.ts
git commit -m "feat: add subscribeNewsletter server action"
```

---

### Task 8: Form components and dev test page

**Files:**
- Create: `components/ContactForm.tsx`, `components/NewsletterForm.tsx`, `app/dev/contact-test/page.tsx`
- Test: `components/ContactForm.test.tsx`, `components/NewsletterForm.test.tsx`

**Interfaces:**
- Consumes: `submitContactForm` (Task 6), `subscribeNewsletter` (Task 7).
- Produces: `<ContactForm />`, `<NewsletterForm />` — reused unchanged by the real marketing page when it's built separately.

- [ ] **Step 1: Write the failing tests**

```tsx
// components/ContactForm.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'

const submitContactForm = vi.fn()
vi.mock('@/app/actions/contact', () => ({ submitContactForm }))

describe('ContactForm', () => {
  beforeEach(() => submitContactForm.mockReset())

  it('shows a success message after a successful submit', async () => {
    submitContactForm.mockResolvedValue({ success: true })
    const { ContactForm } = await import('./ContactForm')
    render(<ContactForm />)

    fireEvent.change(screen.getByPlaceholderText('Name'), { target: { value: 'Jane' } })
    fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'jane@example.com' } })
    fireEvent.click(screen.getByRole('button', { name: /send/i }))

    await waitFor(() => expect(screen.getByTestId('form-success')).toBeInTheDocument())
  })

  it('shows an error message after a failed submit', async () => {
    submitContactForm.mockResolvedValue({ success: false, error: 'Enter a valid email address' })
    const { ContactForm } = await import('./ContactForm')
    render(<ContactForm />)

    fireEvent.click(screen.getByRole('button', { name: /send/i }))

    await waitFor(() => expect(screen.getByTestId('form-error')).toHaveTextContent('Enter a valid email address'))
  })
})
```

```tsx
// components/NewsletterForm.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'

const subscribeNewsletter = vi.fn()
vi.mock('@/app/actions/newsletter', () => ({ subscribeNewsletter }))

describe('NewsletterForm', () => {
  beforeEach(() => subscribeNewsletter.mockReset())

  it('shows a success message after a successful subscribe', async () => {
    subscribeNewsletter.mockResolvedValue({ success: true })
    const { NewsletterForm } = await import('./NewsletterForm')
    render(<NewsletterForm />)

    fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'jane@example.com' } })
    fireEvent.click(screen.getByRole('button', { name: /subscribe/i }))

    await waitFor(() => expect(screen.getByTestId('newsletter-success')).toBeInTheDocument())
  })
})
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npm test -- components/ContactForm components/NewsletterForm`
Expected: FAIL — components don't exist yet

- [ ] **Step 3: Write `components/ContactForm.tsx`**

```tsx
'use client'

import { useState, useTransition } from 'react'
import { submitContactForm } from '@/app/actions/contact'

export function ContactForm() {
  const [isPending, startTransition] = useTransition()
  const [result, setResult] = useState<{ success: boolean; error?: string } | null>(null)

  function handleSubmit(formData: FormData) {
    startTransition(async () => {
      const res = await submitContactForm(formData)
      setResult(res)
    })
  }

  return (
    <form action={handleSubmit}>
      <input name="name" placeholder="Name" required />
      <input name="email" type="email" placeholder="Email" required />
      <input name="company" placeholder="Company" />
      <textarea name="message" placeholder="Message" />
      <button type="submit" disabled={isPending}>
        {isPending ? 'Sending…' : 'Send'}
      </button>
      {result?.success && <p data-testid="form-success">Thanks — we&apos;ll be in touch.</p>}
      {result && !result.success && <p data-testid="form-error">{result.error}</p>}
    </form>
  )
}
```

- [ ] **Step 4: Write `components/NewsletterForm.tsx`**

```tsx
'use client'

import { useState, useTransition } from 'react'
import { subscribeNewsletter } from '@/app/actions/newsletter'

export function NewsletterForm() {
  const [isPending, startTransition] = useTransition()
  const [result, setResult] = useState<{ success: boolean; error?: string } | null>(null)

  function handleSubmit(formData: FormData) {
    startTransition(async () => {
      const res = await subscribeNewsletter(formData)
      setResult(res)
    })
  }

  return (
    <form action={handleSubmit}>
      <input name="email" type="email" placeholder="Email" required />
      <button type="submit" disabled={isPending}>
        {isPending ? 'Subscribing…' : 'Subscribe'}
      </button>
      {result?.success && <p data-testid="newsletter-success">Subscribed — welcome aboard.</p>}
      {result && !result.success && <p data-testid="newsletter-error">{result.error}</p>}
    </form>
  )
}
```

- [ ] **Step 5: Write `app/dev/contact-test/page.tsx`**

```tsx
import { ContactForm } from '@/components/ContactForm'
import { NewsletterForm } from '@/components/NewsletterForm'

export default function ContactTestPage() {
  return (
    <main style={{ padding: 40 }}>
      <h1>Dev test harness — remove once the real marketing page is built</h1>
      <section>
        <h2>Contact form</h2>
        <ContactForm />
      </section>
      <section>
        <h2>Newsletter</h2>
        <NewsletterForm />
      </section>
    </main>
  )
}
```

- [ ] **Step 6: Run tests to verify they pass**

Run: `npm test -- components/ContactForm components/NewsletterForm`
Expected: PASS

- [ ] **Step 7: Manual verification (requires `.env.local` from Task 2 and Resend credentials)**

Run `npm run dev`, open `http://localhost:3000/dev/contact-test`, submit both forms, and confirm: a row appears in Neon's `leads`/`newsletter_subscribers` tables (check via Neon's SQL editor), and (if `RESEND_API_KEY` is set) the notification/confirmation/welcome emails arrive.

- [ ] **Step 8: Commit**

```bash
git add components/ContactForm.tsx components/NewsletterForm.tsx components/ContactForm.test.tsx components/NewsletterForm.test.tsx app/dev/contact-test/page.tsx
git commit -m "feat: add contact and newsletter form components with dev test page"
```

---

### Task 9: Public content queries

**Files:**
- Create: `lib/queries/content.ts`
- Test: `lib/queries/content.test.ts`

**Interfaces:**
- Consumes: `db`, `projects`/`testimonials`/`faqs` tables, `Project`/`Testimonial`/`Faq` types.
- Produces: `getPublishedProjects()`, `getPublishedTestimonials()`, `getPublishedFaqs()` — for the real marketing page (built separately) to call from Server Components.

- [ ] **Step 1: Write the failing test**

```ts
// lib/queries/content.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { projects, testimonials, faqs } from '@/lib/db/schema'

function makeChain(result: unknown) {
  const orderBy = vi.fn(async () => result)
  const where = vi.fn(() => ({ orderBy }))
  return { where, orderBy }
}

describe('content queries', () => {
  let from: ReturnType<typeof vi.fn>
  let select: ReturnType<typeof vi.fn>

  beforeEach(() => {
    vi.resetModules()
  })

  it('getPublishedProjects filters by status=live and orders by sortOrder', async () => {
    const chain = makeChain([{ id: '1', name: 'RevenueOS' }])
    from = vi.fn(() => ({ where: chain.where }))
    select = vi.fn(() => ({ from }))
    vi.doMock('@/lib/db', () => ({ db: { select } }))

    const { getPublishedProjects } = await import('./content')
    const result = await getPublishedProjects()

    expect(from).toHaveBeenCalledWith(projects)
    expect(chain.where).toHaveBeenCalledTimes(1)
    expect(result).toEqual([{ id: '1', name: 'RevenueOS' }])
  })

  it('getPublishedProjects returns an empty array when the query throws', async () => {
    const where = vi.fn(() => ({ orderBy: vi.fn(async () => { throw new Error('boom') }) }))
    from = vi.fn(() => ({ where }))
    select = vi.fn(() => ({ from }))
    vi.doMock('@/lib/db', () => ({ db: { select } }))

    const { getPublishedProjects } = await import('./content')
    const result = await getPublishedProjects()

    expect(result).toEqual([])
  })

  it('getPublishedTestimonials queries the testimonials table', async () => {
    const chain = makeChain([])
    from = vi.fn(() => ({ where: chain.where }))
    select = vi.fn(() => ({ from }))
    vi.doMock('@/lib/db', () => ({ db: { select } }))

    const { getPublishedTestimonials } = await import('./content')
    await getPublishedTestimonials()

    expect(from).toHaveBeenCalledWith(testimonials)
  })

  it('getPublishedFaqs queries the faqs table', async () => {
    const chain = makeChain([])
    from = vi.fn(() => ({ where: chain.where }))
    select = vi.fn(() => ({ from }))
    vi.doMock('@/lib/db', () => ({ db: { select } }))

    const { getPublishedFaqs } = await import('./content')
    await getPublishedFaqs()

    expect(from).toHaveBeenCalledWith(faqs)
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- lib/queries/content`
Expected: FAIL — `lib/queries/content.ts` does not exist

- [ ] **Step 3: Write `lib/queries/content.ts`**

```ts
import { db } from '@/lib/db'
import { projects, testimonials, faqs } from '@/lib/db/schema'
import { eq, asc } from 'drizzle-orm'
import type { Project, Testimonial, Faq } from '@/lib/types'

export async function getPublishedProjects(): Promise<Project[]> {
  try {
    return (await db
      .select()
      .from(projects)
      .where(eq(projects.status, 'live'))
      .orderBy(asc(projects.sortOrder))) as Project[]
  } catch (error) {
    console.error('getPublishedProjects failed:', error)
    return []
  }
}

export async function getPublishedTestimonials(): Promise<Testimonial[]> {
  try {
    return (await db
      .select()
      .from(testimonials)
      .where(eq(testimonials.isPublished, true))
      .orderBy(asc(testimonials.sortOrder))) as Testimonial[]
  } catch (error) {
    console.error('getPublishedTestimonials failed:', error)
    return []
  }
}

export async function getPublishedFaqs(): Promise<Faq[]> {
  try {
    return (await db
      .select()
      .from(faqs)
      .where(eq(faqs.isPublished, true))
      .orderBy(asc(faqs.sortOrder))) as Faq[]
  } catch (error) {
    console.error('getPublishedFaqs failed:', error)
    return []
  }
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- lib/queries/content`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add lib/queries/content.ts lib/queries/content.test.ts
git commit -m "feat: add public content query functions for projects, testimonials, and FAQs"
```

---

### Task 10: Admin auth — Auth.js, admin_users, requireAdminUser, middleware

**Files:**
- Create: `lib/auth-credentials.ts`, `lib/require-admin.ts`, `auth.ts`, `app/api/auth/[...nextauth]/route.ts`, `middleware.ts`, `app/actions/auth.ts`, `app/admin/login/page.tsx`, `scripts/create-admin.ts`
- Test: `lib/auth-credentials.test.ts`, `lib/require-admin.test.ts`, `middleware.test.ts`, `app/actions/auth.test.ts`

**Interfaces:**
- Consumes: `db`, `adminUsers` table.
- Produces: `verifyAdminCredentials(email, password)`, `requireAdminUser(): Promise<{id, email}>` (throws `'UNAUTHENTICATED'` — consumed by Tasks 12–16), `isProtectedRoute(pathname): boolean`, `signInAction(formData): Promise<{error?: string}>`, `signOutAction(): Promise<void>` (consumed by Task 11's `SignOutButton`).

- [ ] **Step 1: Write the failing tests**

```ts
// lib/auth-credentials.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest'

const limit = vi.fn()
const where = vi.fn(() => ({ limit }))
const from = vi.fn(() => ({ where }))
const select = vi.fn(() => ({ from }))
vi.mock('@/lib/db', () => ({ db: { select } }))

const compare = vi.fn()
vi.mock('bcryptjs', () => ({ default: { compare } }))

describe('verifyAdminCredentials', () => {
  beforeEach(() => {
    limit.mockReset()
    compare.mockReset()
  })

  it('returns null when no user matches the email', async () => {
    limit.mockResolvedValue([])
    const { verifyAdminCredentials } = await import('./auth-credentials')

    await expect(verifyAdminCredentials('nobody@axonvia.example', 'pw')).resolves.toBeNull()
  })

  it('returns null when the password does not match', async () => {
    limit.mockResolvedValue([{ id: 'u1', email: 'admin@axonvia.example', passwordHash: 'hash' }])
    compare.mockResolvedValue(false)
    const { verifyAdminCredentials } = await import('./auth-credentials')

    await expect(verifyAdminCredentials('admin@axonvia.example', 'wrong')).resolves.toBeNull()
  })

  it('returns the user when the password matches', async () => {
    limit.mockResolvedValue([{ id: 'u1', email: 'admin@axonvia.example', passwordHash: 'hash' }])
    compare.mockResolvedValue(true)
    const { verifyAdminCredentials } = await import('./auth-credentials')

    await expect(verifyAdminCredentials('admin@axonvia.example', 'right')).resolves.toEqual({
      id: 'u1',
      email: 'admin@axonvia.example',
    })
  })
})
```

```ts
// lib/require-admin.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest'

const auth = vi.fn()
vi.mock('@/auth', () => ({ auth }))

describe('requireAdminUser', () => {
  beforeEach(() => auth.mockReset())

  it('returns the user when a session exists', async () => {
    auth.mockResolvedValue({ user: { id: 'u1', email: 'admin@axonvia.example' } })
    const { requireAdminUser } = await import('./require-admin')

    await expect(requireAdminUser()).resolves.toEqual({ id: 'u1', email: 'admin@axonvia.example' })
  })

  it('throws when there is no session', async () => {
    auth.mockResolvedValue(null)
    const { requireAdminUser } = await import('./require-admin')

    await expect(requireAdminUser()).rejects.toThrow('UNAUTHENTICATED')
  })
})
```

```ts
// middleware.test.ts
import { describe, it, expect } from 'vitest'
import { isProtectedRoute } from './middleware'

describe('isProtectedRoute', () => {
  it('protects /admin and its subpaths', () => {
    expect(isProtectedRoute('/admin')).toBe(true)
    expect(isProtectedRoute('/admin/projects')).toBe(true)
  })

  it('does not protect /admin/login', () => {
    expect(isProtectedRoute('/admin/login')).toBe(false)
  })

  it('does not protect public routes', () => {
    expect(isProtectedRoute('/')).toBe(false)
    expect(isProtectedRoute('/dev/contact-test')).toBe(false)
  })
})
```

```ts
// app/actions/auth.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { AuthError } from 'next-auth'

const signIn = vi.fn()
const signOut = vi.fn()
vi.mock('@/auth', () => ({ signIn, signOut }))

function formDataFrom(fields: Record<string, string>) {
  const fd = new FormData()
  Object.entries(fields).forEach(([key, value]) => fd.set(key, value))
  return fd
}

describe('signInAction', () => {
  beforeEach(() => signIn.mockReset())

  it('returns an error when fields are missing', async () => {
    const { signInAction } = await import('./auth')
    const result = await signInAction(formDataFrom({ email: '' }))

    expect(result.error).toBeDefined()
    expect(signIn).not.toHaveBeenCalled()
  })

  it('returns an error message when Auth.js rejects the credentials', async () => {
    signIn.mockRejectedValueOnce(new AuthError('Invalid credentials'))
    const { signInAction } = await import('./auth')
    const result = await signInAction(
      formDataFrom({ email: 'admin@axonvia.example', password: 'wrong' })
    )

    expect(result).toEqual({ error: 'Invalid email or password.' })
  })

  it('re-throws non-auth errors (e.g. the Auth.js redirect signal on success)', async () => {
    signIn.mockRejectedValueOnce(new Error('NEXT_REDIRECT'))
    const { signInAction } = await import('./auth')

    await expect(
      signInAction(formDataFrom({ email: 'admin@axonvia.example', password: 'right' }))
    ).rejects.toThrow('NEXT_REDIRECT')
  })
})

describe('signOutAction', () => {
  it('calls Auth.js signOut with a redirect to the login page', async () => {
    const { signOutAction } = await import('./auth')
    await signOutAction()

    expect(signOut).toHaveBeenCalledWith({ redirectTo: '/admin/login' })
  })
})
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npm test -- lib/auth-credentials lib/require-admin middleware app/actions/auth`
Expected: FAIL — none of the source files exist yet

- [ ] **Step 3: Write `lib/auth-credentials.ts`**

```ts
import { db } from '@/lib/db'
import { adminUsers } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import bcrypt from 'bcryptjs'

export async function verifyAdminCredentials(email: string, password: string) {
  const [user] = await db.select().from(adminUsers).where(eq(adminUsers.email, email)).limit(1)
  if (!user) return null

  const valid = await bcrypt.compare(password, user.passwordHash)
  if (!valid) return null

  return { id: user.id, email: user.email }
}
```

- [ ] **Step 4: Write `auth.ts` (root)**

```ts
import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import { verifyAdminCredentials } from '@/lib/auth-credentials'

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      credentials: { email: {}, password: {} },
      async authorize(credentials) {
        const email = credentials?.email
        const password = credentials?.password
        if (typeof email !== 'string' || typeof password !== 'string') return null
        return verifyAdminCredentials(email, password)
      },
    }),
  ],
  pages: { signIn: '/admin/login' },
  session: { strategy: 'jwt' },
})
```

- [ ] **Step 5: Write `app/api/auth/[...nextauth]/route.ts`**

```ts
import { handlers } from '@/auth'

export const { GET, POST } = handlers
```

- [ ] **Step 6: Write `lib/require-admin.ts`**

```ts
import { auth } from '@/auth'

export async function requireAdminUser() {
  const session = await auth()
  if (!session?.user) {
    throw new Error('UNAUTHENTICATED')
  }
  return session.user
}
```

- [ ] **Step 7: Write `middleware.ts`**

```ts
import { auth } from '@/auth'
import { NextResponse } from 'next/server'

export function isProtectedRoute(pathname: string): boolean {
  return pathname.startsWith('/admin') && pathname !== '/admin/login'
}

export default auth((req) => {
  if (isProtectedRoute(req.nextUrl.pathname) && !req.auth) {
    return NextResponse.redirect(new URL('/admin/login', req.nextUrl))
  }
})

export const config = {
  matcher: ['/admin/:path*'],
}
```

- [ ] **Step 8: Write `app/actions/auth.ts`**

```ts
'use server'

import { signIn, signOut } from '@/auth'
import { AuthError } from 'next-auth'

export async function signInAction(formData: FormData): Promise<{ error?: string }> {
  const email = formData.get('email')
  const password = formData.get('password')

  if (typeof email !== 'string' || typeof password !== 'string' || !email || !password) {
    return { error: 'Email and password are required.' }
  }

  try {
    await signIn('credentials', { email, password, redirectTo: '/admin' })
    return {}
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: 'Invalid email or password.' }
    }
    throw error
  }
}

export async function signOutAction(): Promise<void> {
  await signOut({ redirectTo: '/admin/login' })
}
```

- [ ] **Step 9: Write `app/admin/login/page.tsx`**

```tsx
import { signInAction } from '@/app/actions/auth'

export default function AdminLoginPage() {
  return (
    <main>
      <h1>Admin login</h1>
      <form action={signInAction}>
        <input name="email" type="email" placeholder="Email" required />
        <input name="password" type="password" placeholder="Password" required />
        <button type="submit">Log in</button>
      </form>
    </main>
  )
}
```

- [ ] **Step 10: Write `scripts/create-admin.ts`**

```ts
import { db } from '@/lib/db'
import { adminUsers } from '@/lib/db/schema'
import bcrypt from 'bcryptjs'

async function main() {
  const [email, password] = process.argv.slice(2)
  if (!email || !password) {
    console.error('Usage: npx tsx scripts/create-admin.ts <email> <password>')
    process.exit(1)
  }

  const passwordHash = await bcrypt.hash(password, 10)
  await db.insert(adminUsers).values({ email, passwordHash })
  console.log(`Admin user created: ${email}`)
}

main()
```

- [ ] **Step 11: Run tests to verify they pass**

Run: `npm test -- lib/auth-credentials lib/require-admin middleware app/actions/auth`
Expected: PASS

- [ ] **Step 12: Manual verification (requires `.env.local` from Task 2)**

Run `npx tsx scripts/create-admin.ts admin@axonvia.example your-password` to create an admin user. Run `npm run dev`, visit `http://localhost:3000/admin` while logged out, and confirm it redirects to `/admin/login`. Log in with those credentials and confirm it redirects to `/admin`.

- [ ] **Step 13: Commit**

```bash
git add lib/auth-credentials.ts lib/require-admin.ts auth.ts app/api/auth middleware.ts app/actions/auth.ts app/admin/login/page.tsx scripts/create-admin.ts lib/auth-credentials.test.ts lib/require-admin.test.ts middleware.test.ts app/actions/auth.test.ts
git commit -m "feat: add Auth.js admin authentication, middleware protection, and login page"
```

---

### Task 11: Admin layout and sign-out button

**Files:**
- Create: `app/admin/layout.tsx`, `components/admin/SignOutButton.tsx`
- Test: `components/admin/SignOutButton.test.tsx`

**Interfaces:**
- Consumes: `signOutAction` (Task 10).
- Produces: the `/admin/*` layout shell with nav links, consumed visually by Tasks 12–16's pages.

- [ ] **Step 1: Write the failing test**

```tsx
// components/admin/SignOutButton.test.tsx
import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'

const signOutAction = vi.fn()
vi.mock('@/app/actions/auth', () => ({ signOutAction }))

describe('SignOutButton', () => {
  it('calls signOutAction when clicked', async () => {
    const { SignOutButton } = await import('./SignOutButton')
    render(<SignOutButton />)

    fireEvent.click(screen.getByRole('button', { name: /sign out/i }))

    expect(signOutAction).toHaveBeenCalled()
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- components/admin/SignOutButton`
Expected: FAIL — component does not exist

- [ ] **Step 3: Write `components/admin/SignOutButton.tsx`**

```tsx
'use client'

import { signOutAction } from '@/app/actions/auth'

export function SignOutButton() {
  return <button onClick={() => signOutAction()}>Sign out</button>
}
```

- [ ] **Step 4: Write `app/admin/layout.tsx`**

```tsx
import Link from 'next/link'
import { SignOutButton } from '@/components/admin/SignOutButton'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <nav>
        <Link href="/admin/leads">Leads</Link>
        <Link href="/admin/newsletter">Newsletter</Link>
        <Link href="/admin/projects">Projects</Link>
        <Link href="/admin/testimonials">Testimonials</Link>
        <Link href="/admin/faqs">FAQs</Link>
        <SignOutButton />
      </nav>
      <main>{children}</main>
    </div>
  )
}
```

- [ ] **Step 5: Run test to verify it passes**

Run: `npm test -- components/admin/SignOutButton`
Expected: PASS

- [ ] **Step 6: Commit**

```bash
git add app/admin/layout.tsx components/admin/SignOutButton.tsx components/admin/SignOutButton.test.tsx
git commit -m "feat: add admin layout shell with navigation and sign-out"
```

---

### Task 12: Admin Projects CRUD

**Files:**
- Create: `app/actions/projects.ts`, `app/admin/projects/page.tsx`, `components/admin/ProjectForm.tsx`, `components/admin/ProjectsTable.tsx`, `components/admin/ProjectsAdminClient.tsx`
- Test: `app/actions/projects.test.ts`, `components/admin/ProjectForm.test.tsx`, `components/admin/ProjectsTable.test.tsx`

**Interfaces:**
- Consumes: `requireAdminUser` (Task 10), `db`, `projects` table, `Project` type, `ActionResult` (Task 6).
- Produces: `listProjectsForAdmin()`, `createProject(input)`, `updateProject(id, input)`, `deleteProject(id)`.

- [ ] **Step 1: Write the failing action test**

```ts
// app/actions/projects.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { projects } from '@/lib/db/schema'

const requireAdminUser = vi.fn(async () => ({ id: 'admin1', email: 'admin@axonvia.example' }))
vi.mock('@/lib/require-admin', () => ({ requireAdminUser }))

const orderBy = vi.fn(async () => [{ id: '1', name: 'RevenueOS' }])
const from = vi.fn(() => ({ orderBy }))
const select = vi.fn(() => ({ from }))
const values = vi.fn(async () => {})
const insert = vi.fn(() => ({ values }))
const updateWhere = vi.fn(async () => {})
const set = vi.fn(() => ({ where: updateWhere }))
const update = vi.fn(() => ({ set }))
const deleteWhere = vi.fn(async () => {})
const del = vi.fn(() => ({ where: deleteWhere }))
vi.mock('@/lib/db', () => ({ db: { select, insert, update, delete: del } }))

const baseInput = {
  name: 'RevenueOS',
  description: 'desc',
  stats: [],
  tags: [],
  imageUrl: null,
  link: null,
  isFeatured: false,
  status: 'coming_soon' as const,
  sortOrder: 0,
}

describe('project admin actions', () => {
  beforeEach(() => {
    requireAdminUser.mockClear()
    values.mockClear()
    updateWhere.mockClear()
    deleteWhere.mockClear()
  })

  it('listProjectsForAdmin requires an admin and returns all rows', async () => {
    const { listProjectsForAdmin } = await import('./projects')
    const result = await listProjectsForAdmin()

    expect(requireAdminUser).toHaveBeenCalled()
    expect(from).toHaveBeenCalledWith(projects)
    expect(result).toEqual([{ id: '1', name: 'RevenueOS' }])
  })

  it('createProject rejects when not authenticated', async () => {
    requireAdminUser.mockRejectedValueOnce(new Error('UNAUTHENTICATED'))
    const { createProject } = await import('./projects')
    const result = await createProject(baseInput)

    expect(result).toEqual({ success: false, error: 'Not authenticated' })
    expect(values).not.toHaveBeenCalled()
  })

  it('createProject inserts when authenticated', async () => {
    const { createProject } = await import('./projects')
    const result = await createProject(baseInput)

    expect(result).toEqual({ success: true })
    expect(values).toHaveBeenCalledWith(baseInput)
  })

  it('deleteProject deletes by id when authenticated', async () => {
    const { deleteProject } = await import('./projects')
    const result = await deleteProject('1')

    expect(result).toEqual({ success: true })
    expect(deleteWhere).toHaveBeenCalled()
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- app/actions/projects`
Expected: FAIL — `app/actions/projects.ts` does not exist

- [ ] **Step 3: Write `app/actions/projects.ts`**

```ts
'use server'

import { db } from '@/lib/db'
import { projects } from '@/lib/db/schema'
import { eq, asc } from 'drizzle-orm'
import { requireAdminUser } from '@/lib/require-admin'
import type { ActionResult } from '@/app/actions/contact'
import type { Project } from '@/lib/types'

export async function listProjectsForAdmin(): Promise<Project[]> {
  await requireAdminUser()
  return (await db.select().from(projects).orderBy(asc(projects.sortOrder))) as Project[]
}

export async function createProject(input: Omit<Project, 'id'>): Promise<ActionResult> {
  try {
    await requireAdminUser()
  } catch {
    return { success: false, error: 'Not authenticated' }
  }

  try {
    await db.insert(projects).values(input)
    return { success: true }
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to save' }
  }
}

export async function updateProject(
  id: string,
  input: Partial<Omit<Project, 'id'>>
): Promise<ActionResult> {
  try {
    await requireAdminUser()
  } catch {
    return { success: false, error: 'Not authenticated' }
  }

  try {
    await db.update(projects).set(input).where(eq(projects.id, id))
    return { success: true }
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to save' }
  }
}

export async function deleteProject(id: string): Promise<ActionResult> {
  try {
    await requireAdminUser()
  } catch {
    return { success: false, error: 'Not authenticated' }
  }

  try {
    await db.delete(projects).where(eq(projects.id, id))
    return { success: true }
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to delete' }
  }
}
```

- [ ] **Step 4: Run the action test to verify it passes**

Run: `npm test -- app/actions/projects`
Expected: PASS

- [ ] **Step 5: Write the failing component tests**

```tsx
// components/admin/ProjectForm.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'

const createProject = vi.fn()
const updateProject = vi.fn()
vi.mock('@/app/actions/projects', () => ({ createProject, updateProject }))

describe('ProjectForm', () => {
  beforeEach(() => {
    createProject.mockReset()
    updateProject.mockReset()
  })

  it('calls createProject when adding a new project', async () => {
    createProject.mockResolvedValue({ success: true })
    const { ProjectForm } = await import('./ProjectForm')
    render(<ProjectForm project={null} onSaved={() => {}} />)

    fireEvent.change(screen.getByPlaceholderText('Project name'), { target: { value: 'RevenueOS' } })
    fireEvent.change(screen.getByPlaceholderText('Description'), { target: { value: 'desc' } })
    fireEvent.click(screen.getByRole('button', { name: /add project/i }))

    await waitFor(() => expect(createProject).toHaveBeenCalled())
  })

  it('calls updateProject when editing an existing project', async () => {
    updateProject.mockResolvedValue({ success: true })
    const { ProjectForm } = await import('./ProjectForm')
    const project = {
      id: '1',
      name: 'RevenueOS',
      description: 'desc',
      stats: [],
      tags: [],
      imageUrl: null,
      link: null,
      isFeatured: false,
      status: 'live' as const,
      sortOrder: 0,
    }
    render(<ProjectForm project={project} onSaved={() => {}} />)

    fireEvent.click(screen.getByRole('button', { name: /save/i }))

    await waitFor(() => expect(updateProject).toHaveBeenCalledWith('1', expect.any(Object)))
  })
})
```

```tsx
// components/admin/ProjectsTable.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'

const deleteProject = vi.fn(async () => ({ success: true }))
vi.mock('@/app/actions/projects', () => ({ deleteProject }))

describe('ProjectsTable', () => {
  it('calls deleteProject when the delete button is clicked', async () => {
    const { ProjectsTable } = await import('./ProjectsTable')
    const project = {
      id: '1',
      name: 'RevenueOS',
      description: 'desc',
      stats: [],
      tags: [],
      imageUrl: null,
      link: null,
      isFeatured: false,
      status: 'live' as const,
      sortOrder: 0,
    }
    render(<ProjectsTable projects={[project]} onEdit={() => {}} />)

    fireEvent.click(screen.getByRole('button', { name: /delete/i }))

    await waitFor(() => expect(deleteProject).toHaveBeenCalledWith('1'))
  })
})
```

- [ ] **Step 6: Run tests to verify they fail**

Run: `npm test -- components/admin/ProjectForm components/admin/ProjectsTable`
Expected: FAIL — components don't exist yet

- [ ] **Step 7: Write `components/admin/ProjectForm.tsx`**

```tsx
'use client'

import { useState, useTransition } from 'react'
import { createProject, updateProject } from '@/app/actions/projects'
import type { Project } from '@/lib/types'

export function ProjectForm({
  project,
  onSaved,
}: {
  project: Project | null
  onSaved: () => void
}) {
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  function handleSubmit(formData: FormData) {
    const input = {
      name: String(formData.get('name') ?? ''),
      description: String(formData.get('description') ?? ''),
      stats: project?.stats ?? [],
      tags: project?.tags ?? [],
      imageUrl: project?.imageUrl ?? null,
      link: (formData.get('link') as string) || null,
      isFeatured: project?.isFeatured ?? false,
      status: (project?.status ?? 'coming_soon') as Project['status'],
      sortOrder: project?.sortOrder ?? 0,
    }

    startTransition(async () => {
      const result = project ? await updateProject(project.id, input) : await createProject(input)
      setError(result.success ? null : result.error ?? 'Failed to save')
      if (result.success) onSaved()
    })
  }

  return (
    <form action={handleSubmit}>
      <input name="name" placeholder="Project name" defaultValue={project?.name} required />
      <textarea
        name="description"
        placeholder="Description"
        defaultValue={project?.description}
        required
      />
      <input name="link" placeholder="Link" defaultValue={project?.link ?? ''} />
      <button type="submit" disabled={isPending}>
        {isPending ? 'Saving…' : project ? 'Save' : 'Add project'}
      </button>
      {error && <p data-testid="project-form-error">{error}</p>}
    </form>
  )
}
```

- [ ] **Step 8: Write `components/admin/ProjectsTable.tsx`**

```tsx
'use client'

import { useTransition } from 'react'
import { deleteProject } from '@/app/actions/projects'
import type { Project } from '@/lib/types'

export function ProjectsTable({
  projects,
  onEdit,
}: {
  projects: Project[]
  onEdit: (project: Project) => void
}) {
  const [isPending, startTransition] = useTransition()

  function handleDelete(id: string) {
    startTransition(async () => {
      await deleteProject(id)
    })
  }

  return (
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Status</th>
          <th>Featured</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {projects.map((project) => (
          <tr key={project.id}>
            <td>{project.name}</td>
            <td>{project.status}</td>
            <td>{project.isFeatured ? 'Yes' : 'No'}</td>
            <td>
              <button onClick={() => onEdit(project)}>Edit</button>
              <button onClick={() => handleDelete(project.id)} disabled={isPending}>
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
```

- [ ] **Step 9: Write `components/admin/ProjectsAdminClient.tsx`**

```tsx
'use client'

import { useState } from 'react'
import { ProjectForm } from '@/components/admin/ProjectForm'
import { ProjectsTable } from '@/components/admin/ProjectsTable'
import type { Project } from '@/lib/types'

export function ProjectsAdminClient({ projects }: { projects: Project[] }) {
  const [editing, setEditing] = useState<Project | null>(null)

  return (
    <>
      <ProjectForm key={editing?.id ?? 'new'} project={editing} onSaved={() => setEditing(null)} />
      <ProjectsTable projects={projects} onEdit={setEditing} />
    </>
  )
}
```

- [ ] **Step 10: Write `app/admin/projects/page.tsx`**

```tsx
import { listProjectsForAdmin } from '@/app/actions/projects'
import { ProjectsAdminClient } from '@/components/admin/ProjectsAdminClient'

export default async function AdminProjectsPage() {
  const projects = await listProjectsForAdmin()

  return (
    <main>
      <h1>Projects</h1>
      <ProjectsAdminClient projects={projects} />
    </main>
  )
}
```

- [ ] **Step 11: Run tests to verify they pass**

Run: `npm test -- components/admin/ProjectForm components/admin/ProjectsTable`
Expected: PASS

- [ ] **Step 12: Commit**

```bash
git add app/actions/projects.ts app/actions/projects.test.ts app/admin/projects/page.tsx components/admin/ProjectForm.tsx components/admin/ProjectsTable.tsx components/admin/ProjectsAdminClient.tsx components/admin/ProjectForm.test.tsx components/admin/ProjectsTable.test.tsx
git commit -m "feat: add admin CRUD for projects"
```

---

### Task 13: Admin Testimonials CRUD

**Files:**
- Create: `app/actions/testimonials.ts`, `app/admin/testimonials/page.tsx`, `components/admin/TestimonialForm.tsx`, `components/admin/TestimonialsTable.tsx`, `components/admin/TestimonialsAdminClient.tsx`
- Test: `app/actions/testimonials.test.ts`, `components/admin/TestimonialForm.test.tsx`

**Interfaces:**
- Consumes: `requireAdminUser`, `db`, `testimonials` table, `Testimonial` type, `ActionResult`.
- Produces: `listTestimonialsForAdmin()`, `createTestimonial(input)`, `updateTestimonial(id, input)`, `deleteTestimonial(id)`.

- [ ] **Step 1: Write the failing action test**

```ts
// app/actions/testimonials.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { testimonials } from '@/lib/db/schema'

const requireAdminUser = vi.fn(async () => ({ id: 'admin1', email: 'admin@axonvia.example' }))
vi.mock('@/lib/require-admin', () => ({ requireAdminUser }))

const orderBy = vi.fn(async () => [{ id: '1', quote: 'Great work' }])
const from = vi.fn(() => ({ orderBy }))
const select = vi.fn(() => ({ from }))
const values = vi.fn(async () => {})
const insert = vi.fn(() => ({ values }))
const deleteWhere = vi.fn(async () => {})
const del = vi.fn(() => ({ where: deleteWhere }))
vi.mock('@/lib/db', () => ({ db: { select, insert, delete: del } }))

const baseInput = {
  quote: 'Great work',
  clientName: 'Jane',
  clientRole: 'CEO',
  avatarUrl: null,
  isPublished: false,
  sortOrder: 0,
}

describe('testimonial admin actions', () => {
  beforeEach(() => {
    requireAdminUser.mockClear()
    values.mockClear()
    deleteWhere.mockClear()
  })

  it('listTestimonialsForAdmin requires an admin and returns all rows', async () => {
    const { listTestimonialsForAdmin } = await import('./testimonials')
    const result = await listTestimonialsForAdmin()

    expect(requireAdminUser).toHaveBeenCalled()
    expect(from).toHaveBeenCalledWith(testimonials)
    expect(result).toEqual([{ id: '1', quote: 'Great work' }])
  })

  it('createTestimonial rejects when not authenticated', async () => {
    requireAdminUser.mockRejectedValueOnce(new Error('UNAUTHENTICATED'))
    const { createTestimonial } = await import('./testimonials')
    const result = await createTestimonial(baseInput)

    expect(result).toEqual({ success: false, error: 'Not authenticated' })
    expect(values).not.toHaveBeenCalled()
  })

  it('createTestimonial inserts when authenticated', async () => {
    const { createTestimonial } = await import('./testimonials')
    const result = await createTestimonial(baseInput)

    expect(result).toEqual({ success: true })
    expect(values).toHaveBeenCalledWith(baseInput)
  })

  it('deleteTestimonial deletes by id when authenticated', async () => {
    const { deleteTestimonial } = await import('./testimonials')
    const result = await deleteTestimonial('1')

    expect(result).toEqual({ success: true })
    expect(deleteWhere).toHaveBeenCalled()
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- app/actions/testimonials`
Expected: FAIL

- [ ] **Step 3: Write `app/actions/testimonials.ts`**

```ts
'use server'

import { db } from '@/lib/db'
import { testimonials } from '@/lib/db/schema'
import { eq, asc } from 'drizzle-orm'
import { requireAdminUser } from '@/lib/require-admin'
import type { ActionResult } from '@/app/actions/contact'
import type { Testimonial } from '@/lib/types'

export async function listTestimonialsForAdmin(): Promise<Testimonial[]> {
  await requireAdminUser()
  return (await db.select().from(testimonials).orderBy(asc(testimonials.sortOrder))) as Testimonial[]
}

export async function createTestimonial(input: Omit<Testimonial, 'id'>): Promise<ActionResult> {
  try {
    await requireAdminUser()
  } catch {
    return { success: false, error: 'Not authenticated' }
  }

  try {
    await db.insert(testimonials).values(input)
    return { success: true }
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to save' }
  }
}

export async function updateTestimonial(
  id: string,
  input: Partial<Omit<Testimonial, 'id'>>
): Promise<ActionResult> {
  try {
    await requireAdminUser()
  } catch {
    return { success: false, error: 'Not authenticated' }
  }

  try {
    await db.update(testimonials).set(input).where(eq(testimonials.id, id))
    return { success: true }
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to save' }
  }
}

export async function deleteTestimonial(id: string): Promise<ActionResult> {
  try {
    await requireAdminUser()
  } catch {
    return { success: false, error: 'Not authenticated' }
  }

  try {
    await db.delete(testimonials).where(eq(testimonials.id, id))
    return { success: true }
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to delete' }
  }
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- app/actions/testimonials`
Expected: PASS

- [ ] **Step 5: Write the failing component test**

```tsx
// components/admin/TestimonialForm.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'

const createTestimonial = vi.fn()
const updateTestimonial = vi.fn()
vi.mock('@/app/actions/testimonials', () => ({ createTestimonial, updateTestimonial }))

describe('TestimonialForm', () => {
  beforeEach(() => {
    createTestimonial.mockReset()
    updateTestimonial.mockReset()
  })

  it('calls createTestimonial when adding a new testimonial', async () => {
    createTestimonial.mockResolvedValue({ success: true })
    const { TestimonialForm } = await import('./TestimonialForm')
    render(<TestimonialForm testimonial={null} onSaved={() => {}} />)

    fireEvent.change(screen.getByPlaceholderText('Quote'), { target: { value: 'Great work' } })
    fireEvent.change(screen.getByPlaceholderText('Client name'), { target: { value: 'Jane' } })
    fireEvent.click(screen.getByRole('button', { name: /add testimonial/i }))

    await waitFor(() => expect(createTestimonial).toHaveBeenCalled())
  })
})
```

- [ ] **Step 6: Run test to verify it fails**

Run: `npm test -- components/admin/TestimonialForm`
Expected: FAIL

- [ ] **Step 7: Write `components/admin/TestimonialForm.tsx`**

```tsx
'use client'

import { useState, useTransition } from 'react'
import { createTestimonial, updateTestimonial } from '@/app/actions/testimonials'
import type { Testimonial } from '@/lib/types'

export function TestimonialForm({
  testimonial,
  onSaved,
}: {
  testimonial: Testimonial | null
  onSaved: () => void
}) {
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  function handleSubmit(formData: FormData) {
    const input = {
      quote: String(formData.get('quote') ?? ''),
      clientName: String(formData.get('client_name') ?? ''),
      clientRole: (formData.get('client_role') as string) || null,
      avatarUrl: testimonial?.avatarUrl ?? null,
      isPublished: testimonial?.isPublished ?? false,
      sortOrder: testimonial?.sortOrder ?? 0,
    }

    startTransition(async () => {
      const result = testimonial
        ? await updateTestimonial(testimonial.id, input)
        : await createTestimonial(input)
      setError(result.success ? null : result.error ?? 'Failed to save')
      if (result.success) onSaved()
    })
  }

  return (
    <form action={handleSubmit}>
      <textarea name="quote" placeholder="Quote" defaultValue={testimonial?.quote} required />
      <input
        name="client_name"
        placeholder="Client name"
        defaultValue={testimonial?.clientName}
        required
      />
      <input
        name="client_role"
        placeholder="Client role"
        defaultValue={testimonial?.clientRole ?? ''}
      />
      <button type="submit" disabled={isPending}>
        {isPending ? 'Saving…' : testimonial ? 'Save' : 'Add testimonial'}
      </button>
      {error && <p data-testid="testimonial-form-error">{error}</p>}
    </form>
  )
}
```

- [ ] **Step 8: Write `components/admin/TestimonialsTable.tsx`**

```tsx
'use client'

import { useTransition } from 'react'
import { deleteTestimonial } from '@/app/actions/testimonials'
import type { Testimonial } from '@/lib/types'

export function TestimonialsTable({
  testimonials,
  onEdit,
}: {
  testimonials: Testimonial[]
  onEdit: (testimonial: Testimonial) => void
}) {
  const [isPending, startTransition] = useTransition()

  function handleDelete(id: string) {
    startTransition(async () => {
      await deleteTestimonial(id)
    })
  }

  return (
    <table>
      <thead>
        <tr>
          <th>Client</th>
          <th>Published</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {testimonials.map((testimonial) => (
          <tr key={testimonial.id}>
            <td>{testimonial.clientName}</td>
            <td>{testimonial.isPublished ? 'Yes' : 'No'}</td>
            <td>
              <button onClick={() => onEdit(testimonial)}>Edit</button>
              <button onClick={() => handleDelete(testimonial.id)} disabled={isPending}>
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
```

- [ ] **Step 9: Write `components/admin/TestimonialsAdminClient.tsx`**

```tsx
'use client'

import { useState } from 'react'
import { TestimonialForm } from '@/components/admin/TestimonialForm'
import { TestimonialsTable } from '@/components/admin/TestimonialsTable'
import type { Testimonial } from '@/lib/types'

export function TestimonialsAdminClient({ testimonials }: { testimonials: Testimonial[] }) {
  const [editing, setEditing] = useState<Testimonial | null>(null)

  return (
    <>
      <TestimonialForm
        key={editing?.id ?? 'new'}
        testimonial={editing}
        onSaved={() => setEditing(null)}
      />
      <TestimonialsTable testimonials={testimonials} onEdit={setEditing} />
    </>
  )
}
```

- [ ] **Step 10: Write `app/admin/testimonials/page.tsx`**

```tsx
import { listTestimonialsForAdmin } from '@/app/actions/testimonials'
import { TestimonialsAdminClient } from '@/components/admin/TestimonialsAdminClient'

export default async function AdminTestimonialsPage() {
  const testimonials = await listTestimonialsForAdmin()

  return (
    <main>
      <h1>Testimonials</h1>
      <TestimonialsAdminClient testimonials={testimonials} />
    </main>
  )
}
```

- [ ] **Step 11: Run tests to verify they pass**

Run: `npm test -- components/admin/TestimonialForm`
Expected: PASS

- [ ] **Step 12: Commit**

```bash
git add app/actions/testimonials.ts app/actions/testimonials.test.ts app/admin/testimonials/page.tsx components/admin/TestimonialForm.tsx components/admin/TestimonialsTable.tsx components/admin/TestimonialsAdminClient.tsx components/admin/TestimonialForm.test.tsx
git commit -m "feat: add admin CRUD for testimonials"
```

---

### Task 14: Admin FAQs CRUD

**Files:**
- Create: `app/actions/faqs.ts`, `app/admin/faqs/page.tsx`, `components/admin/FaqForm.tsx`, `components/admin/FaqsTable.tsx`, `components/admin/FaqsAdminClient.tsx`
- Test: `app/actions/faqs.test.ts`, `components/admin/FaqForm.test.tsx`

**Interfaces:**
- Consumes: `requireAdminUser`, `db`, `faqs` table, `Faq` type, `ActionResult`.
- Produces: `listFaqsForAdmin()`, `createFaq(input)`, `updateFaq(id, input)`, `deleteFaq(id)`.

- [ ] **Step 1: Write the failing action test**

```ts
// app/actions/faqs.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { faqs } from '@/lib/db/schema'

const requireAdminUser = vi.fn(async () => ({ id: 'admin1', email: 'admin@axonvia.example' }))
vi.mock('@/lib/require-admin', () => ({ requireAdminUser }))

const orderBy = vi.fn(async () => [{ id: '1', question: 'What do you do?' }])
const from = vi.fn(() => ({ orderBy }))
const select = vi.fn(() => ({ from }))
const values = vi.fn(async () => {})
const insert = vi.fn(() => ({ values }))
const deleteWhere = vi.fn(async () => {})
const del = vi.fn(() => ({ where: deleteWhere }))
vi.mock('@/lib/db', () => ({ db: { select, insert, delete: del } }))

const baseInput = {
  question: 'What do you do?',
  answer: 'We build AI agents.',
  isPublished: true,
  sortOrder: 0,
}

describe('faq admin actions', () => {
  beforeEach(() => {
    requireAdminUser.mockClear()
    values.mockClear()
    deleteWhere.mockClear()
  })

  it('listFaqsForAdmin requires an admin and returns all rows', async () => {
    const { listFaqsForAdmin } = await import('./faqs')
    const result = await listFaqsForAdmin()

    expect(requireAdminUser).toHaveBeenCalled()
    expect(from).toHaveBeenCalledWith(faqs)
    expect(result).toEqual([{ id: '1', question: 'What do you do?' }])
  })

  it('createFaq rejects when not authenticated', async () => {
    requireAdminUser.mockRejectedValueOnce(new Error('UNAUTHENTICATED'))
    const { createFaq } = await import('./faqs')
    const result = await createFaq(baseInput)

    expect(result).toEqual({ success: false, error: 'Not authenticated' })
    expect(values).not.toHaveBeenCalled()
  })

  it('createFaq inserts when authenticated', async () => {
    const { createFaq } = await import('./faqs')
    const result = await createFaq(baseInput)

    expect(result).toEqual({ success: true })
    expect(values).toHaveBeenCalledWith(baseInput)
  })

  it('deleteFaq deletes by id when authenticated', async () => {
    const { deleteFaq } = await import('./faqs')
    const result = await deleteFaq('1')

    expect(result).toEqual({ success: true })
    expect(deleteWhere).toHaveBeenCalled()
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- app/actions/faqs`
Expected: FAIL

- [ ] **Step 3: Write `app/actions/faqs.ts`**

```ts
'use server'

import { db } from '@/lib/db'
import { faqs } from '@/lib/db/schema'
import { eq, asc } from 'drizzle-orm'
import { requireAdminUser } from '@/lib/require-admin'
import type { ActionResult } from '@/app/actions/contact'
import type { Faq } from '@/lib/types'

export async function listFaqsForAdmin(): Promise<Faq[]> {
  await requireAdminUser()
  return (await db.select().from(faqs).orderBy(asc(faqs.sortOrder))) as Faq[]
}

export async function createFaq(input: Omit<Faq, 'id'>): Promise<ActionResult> {
  try {
    await requireAdminUser()
  } catch {
    return { success: false, error: 'Not authenticated' }
  }

  try {
    await db.insert(faqs).values(input)
    return { success: true }
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to save' }
  }
}

export async function updateFaq(id: string, input: Partial<Omit<Faq, 'id'>>): Promise<ActionResult> {
  try {
    await requireAdminUser()
  } catch {
    return { success: false, error: 'Not authenticated' }
  }

  try {
    await db.update(faqs).set(input).where(eq(faqs.id, id))
    return { success: true }
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to save' }
  }
}

export async function deleteFaq(id: string): Promise<ActionResult> {
  try {
    await requireAdminUser()
  } catch {
    return { success: false, error: 'Not authenticated' }
  }

  try {
    await db.delete(faqs).where(eq(faqs.id, id))
    return { success: true }
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to delete' }
  }
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- app/actions/faqs`
Expected: PASS

- [ ] **Step 5: Write the failing component test**

```tsx
// components/admin/FaqForm.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'

const createFaq = vi.fn()
const updateFaq = vi.fn()
vi.mock('@/app/actions/faqs', () => ({ createFaq, updateFaq }))

describe('FaqForm', () => {
  beforeEach(() => {
    createFaq.mockReset()
    updateFaq.mockReset()
  })

  it('calls createFaq when adding a new FAQ', async () => {
    createFaq.mockResolvedValue({ success: true })
    const { FaqForm } = await import('./FaqForm')
    render(<FaqForm faq={null} onSaved={() => {}} />)

    fireEvent.change(screen.getByPlaceholderText('Question'), { target: { value: 'What do you do?' } })
    fireEvent.change(screen.getByPlaceholderText('Answer'), { target: { value: 'We build AI agents.' } })
    fireEvent.click(screen.getByRole('button', { name: /add faq/i }))

    await waitFor(() => expect(createFaq).toHaveBeenCalled())
  })
})
```

- [ ] **Step 6: Run test to verify it fails**

Run: `npm test -- components/admin/FaqForm`
Expected: FAIL

- [ ] **Step 7: Write `components/admin/FaqForm.tsx`**

```tsx
'use client'

import { useState, useTransition } from 'react'
import { createFaq, updateFaq } from '@/app/actions/faqs'
import type { Faq } from '@/lib/types'

export function FaqForm({ faq, onSaved }: { faq: Faq | null; onSaved: () => void }) {
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  function handleSubmit(formData: FormData) {
    const input = {
      question: String(formData.get('question') ?? ''),
      answer: String(formData.get('answer') ?? ''),
      isPublished: faq?.isPublished ?? true,
      sortOrder: faq?.sortOrder ?? 0,
    }

    startTransition(async () => {
      const result = faq ? await updateFaq(faq.id, input) : await createFaq(input)
      setError(result.success ? null : result.error ?? 'Failed to save')
      if (result.success) onSaved()
    })
  }

  return (
    <form action={handleSubmit}>
      <input name="question" placeholder="Question" defaultValue={faq?.question} required />
      <textarea name="answer" placeholder="Answer" defaultValue={faq?.answer} required />
      <button type="submit" disabled={isPending}>
        {isPending ? 'Saving…' : faq ? 'Save' : 'Add FAQ'}
      </button>
      {error && <p data-testid="faq-form-error">{error}</p>}
    </form>
  )
}
```

- [ ] **Step 8: Write `components/admin/FaqsTable.tsx`**

```tsx
'use client'

import { useTransition } from 'react'
import { deleteFaq } from '@/app/actions/faqs'
import type { Faq } from '@/lib/types'

export function FaqsTable({ faqs, onEdit }: { faqs: Faq[]; onEdit: (faq: Faq) => void }) {
  const [isPending, startTransition] = useTransition()

  function handleDelete(id: string) {
    startTransition(async () => {
      await deleteFaq(id)
    })
  }

  return (
    <table>
      <thead>
        <tr>
          <th>Question</th>
          <th>Published</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {faqs.map((faq) => (
          <tr key={faq.id}>
            <td>{faq.question}</td>
            <td>{faq.isPublished ? 'Yes' : 'No'}</td>
            <td>
              <button onClick={() => onEdit(faq)}>Edit</button>
              <button onClick={() => handleDelete(faq.id)} disabled={isPending}>
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
```

- [ ] **Step 9: Write `components/admin/FaqsAdminClient.tsx`**

```tsx
'use client'

import { useState } from 'react'
import { FaqForm } from '@/components/admin/FaqForm'
import { FaqsTable } from '@/components/admin/FaqsTable'
import type { Faq } from '@/lib/types'

export function FaqsAdminClient({ faqs }: { faqs: Faq[] }) {
  const [editing, setEditing] = useState<Faq | null>(null)

  return (
    <>
      <FaqForm key={editing?.id ?? 'new'} faq={editing} onSaved={() => setEditing(null)} />
      <FaqsTable faqs={faqs} onEdit={setEditing} />
    </>
  )
}
```

- [ ] **Step 10: Write `app/admin/faqs/page.tsx`**

```tsx
import { listFaqsForAdmin } from '@/app/actions/faqs'
import { FaqsAdminClient } from '@/components/admin/FaqsAdminClient'

export default async function AdminFaqsPage() {
  const faqs = await listFaqsForAdmin()

  return (
    <main>
      <h1>FAQs</h1>
      <FaqsAdminClient faqs={faqs} />
    </main>
  )
}
```

- [ ] **Step 11: Run tests to verify they pass**

Run: `npm test -- components/admin/FaqForm`
Expected: PASS

- [ ] **Step 12: Commit**

```bash
git add app/actions/faqs.ts app/actions/faqs.test.ts app/admin/faqs/page.tsx components/admin/FaqForm.tsx components/admin/FaqsTable.tsx components/admin/FaqsAdminClient.tsx components/admin/FaqForm.test.tsx
git commit -m "feat: add admin CRUD for FAQs"
```

---

### Task 15: Admin Leads view

**Files:**
- Create: `app/actions/leads.ts`, `app/admin/leads/page.tsx`, `components/admin/LeadsTable.tsx`
- Test: `app/actions/leads.test.ts`, `components/admin/LeadsTable.test.tsx`

**Interfaces:**
- Consumes: `requireAdminUser`, `db`, `leads` table, `Lead` type, `ActionResult`.
- Produces: `listLeadsForAdmin()`, `updateLeadStatus(id, status)`.

- [ ] **Step 1: Write the failing action test**

```ts
// app/actions/leads.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { leads } from '@/lib/db/schema'

const requireAdminUser = vi.fn(async () => ({ id: 'admin1', email: 'admin@axonvia.example' }))
vi.mock('@/lib/require-admin', () => ({ requireAdminUser }))

const orderBy = vi.fn(async () => [{ id: '1', name: 'Jane', status: 'new' }])
const from = vi.fn(() => ({ orderBy }))
const select = vi.fn(() => ({ from }))
const updateWhere = vi.fn(async () => {})
const set = vi.fn(() => ({ where: updateWhere }))
const update = vi.fn(() => ({ set }))
vi.mock('@/lib/db', () => ({ db: { select, update } }))

describe('lead admin actions', () => {
  beforeEach(() => {
    requireAdminUser.mockClear()
    set.mockClear()
    updateWhere.mockClear()
  })

  it('listLeadsForAdmin requires an admin and returns all rows', async () => {
    const { listLeadsForAdmin } = await import('./leads')
    const result = await listLeadsForAdmin()

    expect(requireAdminUser).toHaveBeenCalled()
    expect(from).toHaveBeenCalledWith(leads)
    expect(result).toEqual([{ id: '1', name: 'Jane', status: 'new' }])
  })

  it('updateLeadStatus rejects when not authenticated', async () => {
    requireAdminUser.mockRejectedValueOnce(new Error('UNAUTHENTICATED'))
    const { updateLeadStatus } = await import('./leads')
    const result = await updateLeadStatus('1', 'contacted')

    expect(result).toEqual({ success: false, error: 'Not authenticated' })
    expect(set).not.toHaveBeenCalled()
  })

  it('updateLeadStatus updates status when authenticated', async () => {
    const { updateLeadStatus } = await import('./leads')
    const result = await updateLeadStatus('1', 'contacted')

    expect(result).toEqual({ success: true })
    expect(set).toHaveBeenCalledWith({ status: 'contacted' })
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- app/actions/leads`
Expected: FAIL

- [ ] **Step 3: Write `app/actions/leads.ts`**

```ts
'use server'

import { db } from '@/lib/db'
import { leads } from '@/lib/db/schema'
import { eq, desc } from 'drizzle-orm'
import { requireAdminUser } from '@/lib/require-admin'
import type { ActionResult } from '@/app/actions/contact'
import type { Lead } from '@/lib/types'

export async function listLeadsForAdmin(): Promise<Lead[]> {
  await requireAdminUser()
  return (await db.select().from(leads).orderBy(desc(leads.createdAt))) as Lead[]
}

export async function updateLeadStatus(id: string, status: Lead['status']): Promise<ActionResult> {
  try {
    await requireAdminUser()
  } catch {
    return { success: false, error: 'Not authenticated' }
  }

  try {
    await db.update(leads).set({ status }).where(eq(leads.id, id))
    return { success: true }
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to update' }
  }
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- app/actions/leads`
Expected: PASS

- [ ] **Step 5: Write the failing component test**

```tsx
// components/admin/LeadsTable.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'

const updateLeadStatus = vi.fn(async () => ({ success: true }))
vi.mock('@/app/actions/leads', () => ({ updateLeadStatus }))

describe('LeadsTable', () => {
  it('calls updateLeadStatus when the status select changes', async () => {
    const { LeadsTable } = await import('./LeadsTable')
    const lead = {
      id: '1',
      name: 'Jane',
      email: 'jane@example.com',
      company: null,
      message: null,
      source: 'contact_form',
      status: 'new' as const,
      createdAt: new Date('2026-10-02T00:00:00Z'),
    }
    render(<LeadsTable leads={[lead]} />)

    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'contacted' } })

    await waitFor(() => expect(updateLeadStatus).toHaveBeenCalledWith('1', 'contacted'))
  })
})
```

- [ ] **Step 6: Run test to verify it fails**

Run: `npm test -- components/admin/LeadsTable`
Expected: FAIL

- [ ] **Step 7: Write `components/admin/LeadsTable.tsx`**

```tsx
'use client'

import { useTransition } from 'react'
import { updateLeadStatus } from '@/app/actions/leads'
import type { Lead } from '@/lib/types'

export function LeadsTable({ leads }: { leads: Lead[] }) {
  const [, startTransition] = useTransition()

  function handleStatusChange(id: string, status: Lead['status']) {
    startTransition(async () => {
      await updateLeadStatus(id, status)
    })
  }

  return (
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Email</th>
          <th>Company</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        {leads.map((lead) => (
          <tr key={lead.id}>
            <td>{lead.name}</td>
            <td>{lead.email}</td>
            <td>{lead.company ?? '—'}</td>
            <td>
              <select
                defaultValue={lead.status}
                onChange={(e) => handleStatusChange(lead.id, e.target.value as Lead['status'])}
              >
                <option value="new">New</option>
                <option value="contacted">Contacted</option>
                <option value="closed">Closed</option>
              </select>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
```

- [ ] **Step 8: Write `app/admin/leads/page.tsx`**

```tsx
import { listLeadsForAdmin } from '@/app/actions/leads'
import { LeadsTable } from '@/components/admin/LeadsTable'

export default async function AdminLeadsPage() {
  const leads = await listLeadsForAdmin()

  return (
    <main>
      <h1>Leads</h1>
      <LeadsTable leads={leads} />
    </main>
  )
}
```

- [ ] **Step 9: Run tests to verify they pass**

Run: `npm test -- components/admin/LeadsTable`
Expected: PASS

- [ ] **Step 10: Commit**

```bash
git add app/actions/leads.ts app/actions/leads.test.ts app/admin/leads/page.tsx components/admin/LeadsTable.tsx components/admin/LeadsTable.test.tsx
git commit -m "feat: add admin leads view with status updates"
```

---

### Task 16: Admin Newsletter subscribers view and CSV export

**Files:**
- Create: `app/actions/subscribers.ts`, `app/admin/newsletter/page.tsx`, `app/admin/newsletter/export/route.ts`, `components/admin/SubscribersTable.tsx`
- Test: `app/actions/subscribers.test.ts`, `app/admin/newsletter/export/route.test.ts`

**Interfaces:**
- Consumes: `requireAdminUser`, `db`, `newsletterSubscribers` table, `NewsletterSubscriber` type.
- Produces: `listSubscribersForAdmin()`, `GET` route handler for CSV export.

- [ ] **Step 1: Write the failing action test**

```ts
// app/actions/subscribers.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { newsletterSubscribers } from '@/lib/db/schema'

const requireAdminUser = vi.fn(async () => ({ id: 'admin1', email: 'admin@axonvia.example' }))
vi.mock('@/lib/require-admin', () => ({ requireAdminUser }))

const orderBy = vi.fn(async () => [{ id: '1', email: 'jane@example.com', status: 'subscribed' }])
const from = vi.fn(() => ({ orderBy }))
const select = vi.fn(() => ({ from }))
vi.mock('@/lib/db', () => ({ db: { select } }))

describe('listSubscribersForAdmin', () => {
  beforeEach(() => requireAdminUser.mockClear())

  it('requires an admin and returns all subscribers newest first', async () => {
    const { listSubscribersForAdmin } = await import('./subscribers')
    const result = await listSubscribersForAdmin()

    expect(requireAdminUser).toHaveBeenCalled()
    expect(from).toHaveBeenCalledWith(newsletterSubscribers)
    expect(result).toEqual([{ id: '1', email: 'jane@example.com', status: 'subscribed' }])
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- app/actions/subscribers`
Expected: FAIL

- [ ] **Step 3: Write `app/actions/subscribers.ts`**

```ts
'use server'

import { db } from '@/lib/db'
import { newsletterSubscribers } from '@/lib/db/schema'
import { desc } from 'drizzle-orm'
import { requireAdminUser } from '@/lib/require-admin'
import type { NewsletterSubscriber } from '@/lib/types'

export async function listSubscribersForAdmin(): Promise<NewsletterSubscriber[]> {
  await requireAdminUser()
  return (await db
    .select()
    .from(newsletterSubscribers)
    .orderBy(desc(newsletterSubscribers.createdAt))) as NewsletterSubscriber[]
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- app/actions/subscribers`
Expected: PASS

- [ ] **Step 5: Write the failing route test**

```ts
// app/admin/newsletter/export/route.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest'

const requireAdminUser = vi.fn(async () => ({ id: 'admin1', email: 'admin@axonvia.example' }))
vi.mock('@/lib/require-admin', () => ({ requireAdminUser }))

const orderBy = vi.fn(async () => [
  { email: 'jane@example.com', status: 'subscribed', createdAt: new Date('2026-10-02T00:00:00Z') },
])
const from = vi.fn(() => ({ orderBy }))
const select = vi.fn(() => ({ from }))
vi.mock('@/lib/db', () => ({ db: { select } }))

describe('GET /admin/newsletter/export', () => {
  beforeEach(() => requireAdminUser.mockClear())

  it('returns 401 when not authenticated', async () => {
    requireAdminUser.mockRejectedValueOnce(new Error('UNAUTHENTICATED'))
    const { GET } = await import('./route')
    const response = await GET()

    expect(response.status).toBe(401)
  })

  it('returns a CSV body when authenticated', async () => {
    const { GET } = await import('./route')
    const response = await GET()
    const body = await response.text()

    expect(response.headers.get('Content-Type')).toBe('text/csv')
    expect(body).toContain('email,status,created_at')
    expect(body).toContain('jane@example.com,subscribed,')
  })
})
```

- [ ] **Step 6: Run test to verify it fails**

Run: `npm test -- app/admin/newsletter/export`
Expected: FAIL

- [ ] **Step 7: Write `app/admin/newsletter/export/route.ts`**

```ts
import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { newsletterSubscribers } from '@/lib/db/schema'
import { desc } from 'drizzle-orm'
import { requireAdminUser } from '@/lib/require-admin'

export async function GET() {
  try {
    await requireAdminUser()
  } catch {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  const rows = await db
    .select()
    .from(newsletterSubscribers)
    .orderBy(desc(newsletterSubscribers.createdAt))

  const header = 'email,status,created_at'
  const lines = rows.map((row) => `${row.email},${row.status},${row.createdAt.toISOString()}`)
  const csv = [header, ...lines].join('\n')

  return new NextResponse(csv, {
    headers: {
      'Content-Type': 'text/csv',
      'Content-Disposition': 'attachment; filename="subscribers.csv"',
    },
  })
}
```

- [ ] **Step 8: Run test to verify it passes**

Run: `npm test -- app/admin/newsletter/export`
Expected: PASS

- [ ] **Step 9: Write `components/admin/SubscribersTable.tsx`**

```tsx
import type { NewsletterSubscriber } from '@/lib/types'

export function SubscribersTable({ subscribers }: { subscribers: NewsletterSubscriber[] }) {
  return (
    <table>
      <thead>
        <tr>
          <th>Email</th>
          <th>Status</th>
          <th>Subscribed at</th>
        </tr>
      </thead>
      <tbody>
        {subscribers.map((subscriber) => (
          <tr key={subscriber.id}>
            <td>{subscriber.email}</td>
            <td>{subscriber.status}</td>
            <td>{new Date(subscriber.createdAt).toLocaleString()}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
```

- [ ] **Step 10: Write `app/admin/newsletter/page.tsx`**

```tsx
import { listSubscribersForAdmin } from '@/app/actions/subscribers'
import { SubscribersTable } from '@/components/admin/SubscribersTable'

export default async function AdminNewsletterPage() {
  const subscribers = await listSubscribersForAdmin()

  return (
    <main>
      <h1>Newsletter Subscribers</h1>
      <a href="/admin/newsletter/export">Export CSV</a>
      <SubscribersTable subscribers={subscribers} />
    </main>
  )
}
```

- [ ] **Step 11: Commit**

```bash
git add app/actions/subscribers.ts app/actions/subscribers.test.ts app/admin/newsletter/page.tsx app/admin/newsletter/export/route.ts app/admin/newsletter/export/route.test.ts components/admin/SubscribersTable.tsx
git commit -m "feat: add admin newsletter subscribers view with CSV export"
```

---

### Task 17: Cal.com booking embed

**Files:**
- Create: `components/CalEmbed.tsx`
- Test: `components/CalEmbed.test.tsx`

**Interfaces:**
- Consumes: `NEXT_PUBLIC_CAL_LINK` env var, `@calcom/embed-react`'s `getCalApi`.
- Produces: `<CalEmbed>{children}</CalEmbed>` — to be dropped into the Navbar/Hero/Final-CTA "Book a Call" buttons when the real marketing page is built.

- [ ] **Step 1: Write the failing tests**

```tsx
// components/CalEmbed.test.tsx
import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi, afterEach } from 'vitest'

vi.mock('@calcom/embed-react', () => ({
  getCalApi: vi.fn(async () => vi.fn()),
}))

describe('CalEmbed', () => {
  const originalEnv = process.env.NEXT_PUBLIC_CAL_LINK

  afterEach(() => {
    process.env.NEXT_PUBLIC_CAL_LINK = originalEnv
    vi.resetModules()
  })

  it('renders a mailto fallback link when no Cal.com link is configured', async () => {
    delete process.env.NEXT_PUBLIC_CAL_LINK
    const { CalEmbed } = await import('./CalEmbed')
    render(<CalEmbed>Book a Call</CalEmbed>)

    const fallback = screen.getByTestId('cal-fallback')
    expect(fallback).toHaveAttribute('href', expect.stringContaining('mailto:'))
  })

  it('renders a Cal.com trigger button when a link is configured', async () => {
    process.env.NEXT_PUBLIC_CAL_LINK = 'axonvia/strategy-call'
    const { CalEmbed } = await import('./CalEmbed')
    render(<CalEmbed>Book a Call</CalEmbed>)

    const trigger = screen.getByTestId('cal-trigger')
    expect(trigger).toHaveAttribute('data-cal-link', 'axonvia/strategy-call')
  })
})
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npm test -- components/CalEmbed`
Expected: FAIL — `components/CalEmbed.tsx` does not exist

- [ ] **Step 3: Write `components/CalEmbed.tsx`**

```tsx
'use client'

import { useEffect } from 'react'
import { getCalApi } from '@calcom/embed-react'

export function CalEmbed({ children }: { children: React.ReactNode }) {
  const calLink = process.env.NEXT_PUBLIC_CAL_LINK

  useEffect(() => {
    if (!calLink) return

    ;(async () => {
      const cal = await getCalApi()
      cal('ui', { theme: 'dark', styles: { branding: { brandColor: '#2DD4FF' } } })
    })()
  }, [calLink])

  if (!calLink) {
    return (
      <a href="mailto:hello@axonvia.example" data-testid="cal-fallback">
        {children}
      </a>
    )
  }

  return (
    <button data-cal-link={calLink} data-testid="cal-trigger">
      {children}
    </button>
  )
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npm test -- components/CalEmbed`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add components/CalEmbed.tsx components/CalEmbed.test.tsx
git commit -m "feat: add Cal.com booking embed with mailto fallback"
```

---

## Final verification

- [ ] Run the full test suite: `npm test` — expect all tests across all 17 tasks to PASS.
- [ ] Run `npm run build` — expect a clean production build.
- [ ] With `.env.local` populated (Task 2) and an admin user created (Task 10): manually walk through contact form → newsletter signup → admin login → create/edit/delete one project, testimonial, and FAQ → view leads and subscribers → export subscribers CSV.
