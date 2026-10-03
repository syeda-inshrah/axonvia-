# Axonvia Frontend Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the real marketing page from `AXONVIA_WEBSITE_SPEC.md` — all 13 sections, Navbar, Footer — on top of the existing backend, wiring Projects/Testimonials/FAQ to the live CMS and reusing the existing `ContactForm`/`NewsletterForm`/`CalEmbed` components.

**Architecture:** Next.js App Router, Tailwind v4 (`@theme` CSS tokens), Framer Motion for scroll-reveal and the Hero's animated SVG, `lucide-react` for icons. Dynamic sections (Projects, Testimonials, FAQ) are React Server Components reading directly from the existing `getPublished*` query functions; every other section is static presentational content matching the spec's copy exactly.

**Tech Stack:** Next.js 16, Tailwind CSS v4, Framer Motion, lucide-react, next/font/google (Space Grotesk, Inter, JetBrains Mono), Vitest + React Testing Library.

**Spec:** `docs/superpowers/specs/2026-10-04-axonvia-frontend-design.md` (and `AXONVIA_WEBSITE_SPEC.md` for exact copy/layout).

## Global Constraints

- Every section's copy and layout follows `AXONVIA_WEBSITE_SPEC.md` exactly, except the two deviations the design spec records (fonts; live-CMS data sourcing) and the TechStack chip correction this plan makes (Supabase → Neon, to match what was actually built).
- Fonts are Space Grotesk (headings), Inter (body), JetBrains Mono (tags) via `next/font/google` — no font files to source.
- All color/spacing tokens come from the CSS variables defined in Task 1 — no hardcoded hex values in section components.
- Scroll-reveal animation: Framer Motion `whileInView`/`animate` with the shared `fadeUp`/`staggerContainer` variants from `lib/animations.ts`; `prefers-reduced-motion` is respected globally per Task 2.
- Tests assert rendered content, structure, and data-wiring — not animation timing (jsdom has no real `IntersectionObserver`, and Framer Motion's children still render synchronously regardless of `whileInView` firing).
- `ContactForm`, `NewsletterForm`, `CalEmbed` keep their existing behavior and tests unchanged — only their visual styling is touched.

---

## File Structure

```
app/
  page.tsx, layout.tsx, globals.css   (rewritten)

components/ui/
  buttonStyles.ts, Button.tsx, Badge.tsx, GlassCard.tsx, SectionHeader.tsx
  GradientBlob.tsx, MotionSafeProvider.tsx

components/sections/
  Navbar.tsx, Hero.tsx, Services.tsx, HowItWorks.tsx, Projects.tsx,
  TechStack.tsx, Process.tsx, WhyAxonvia.tsx, About.tsx, Testimonials.tsx,
  Faq.tsx, FinalCta.tsx, Footer.tsx

lib/animations.ts
scripts/seed-content.ts
```

---

### Task 1: Fonts, design tokens, and dependencies

**Files:**
- Modify: `app/layout.tsx`, `app/globals.css`, `package.json`

**Interfaces:**
- Produces: CSS custom properties (`--bg-primary`, `--accent-gradient`, etc.) and font CSS variables (`--font-heading`, `--font-body`, `--font-mono`) available globally — consumed by every later task.

- [ ] **Step 1: Install dependencies**

```bash
npm install framer-motion@latest lucide-react@latest
```

- [ ] **Step 2: Write `app/globals.css`**

```css
@import "tailwindcss";

:root {
  --bg-primary: #05070D;
  --bg-secondary: #0A0E1A;
  --bg-card: #0F1420;
  --accent-cyan: #2DD4FF;
  --accent-purple: #9B5CFF;
  --accent-gradient: linear-gradient(135deg, #2DD4FF 0%, #9B5CFF 100%);
  --text-primary: #F5F7FA;
  --text-secondary: #9BA3B5;
  --text-muted: #5C6478;
  --border-glass: rgba(255,255,255,0.08);
  --border-glow: rgba(45,212,255,0.35);
  --success: #4ADE80;
}

body {
  background-color: var(--bg-primary);
  color: var(--text-primary);
  font-family: var(--font-body), sans-serif;
}

.grid-texture {
  background-image:
    linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px);
  background-size: 48px 48px;
}

.gradient-blob {
  animation: blob-drift 20s ease-in-out infinite;
}

@keyframes blob-drift {
  0%, 100% { transform: translate(0, 0) scale(1); }
  33% { transform: translate(40px, -30px) scale(1.1); }
  66% { transform: translate(-30px, 20px) scale(0.95); }
}

[data-reduced-motion='true'] .gradient-blob {
  animation: none;
}
```

- [ ] **Step 3: Write `app/layout.tsx`**

```tsx
import { Space_Grotesk, Inter, JetBrains_Mono } from 'next/font/google'
import { MotionSafeProvider } from '@/components/ui/MotionSafeProvider'
import './globals.css'

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-heading',
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-body',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
})

export const metadata = {
  title: 'Axonvia — Intelligence that works for your business.',
  description:
    'Axonvia designs, builds, and deploys intelligent automation systems — from lead generation to customer operations.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${inter.variable} ${jetbrainsMono.variable}`}>
      <body>
        <MotionSafeProvider>{children}</MotionSafeProvider>
      </body>
    </html>
  )
}
```

- [ ] **Step 4: Verify the app builds**

Run: `npm run build`
Expected: build succeeds (Task 2 adds `MotionSafeProvider`, so this will fail until that exists — proceed to Task 2 before verifying)

- [ ] **Step 5: Commit**

```bash
git add app/globals.css app/layout.tsx package.json package-lock.json
git commit -m "feat: add design tokens, fonts, and animation dependencies"
```

---

### Task 2: Reduced-motion provider and shared animation variants

**Files:**
- Create: `components/ui/MotionSafeProvider.tsx`, `lib/animations.ts`
- Test: `components/ui/MotionSafeProvider.test.tsx`, `lib/animations.test.ts`

**Interfaces:**
- Produces: `<MotionSafeProvider>` (sets `data-reduced-motion` on `<html>`), `fadeUp` and `staggerContainer(delay?)` Framer Motion variants — consumed by every section task.

- [ ] **Step 1: Write the failing tests**

```tsx
// components/ui/MotionSafeProvider.test.tsx
import { render } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'

const useReducedMotion = vi.fn()
vi.mock('framer-motion', () => ({ useReducedMotion }))

describe('MotionSafeProvider', () => {
  beforeEach(() => useReducedMotion.mockReset())

  it('sets data-reduced-motion=true on the html element when preferred', async () => {
    useReducedMotion.mockReturnValue(true)
    const { MotionSafeProvider } = await import('./MotionSafeProvider')
    render(<MotionSafeProvider>child</MotionSafeProvider>)

    expect(document.documentElement.getAttribute('data-reduced-motion')).toBe('true')
  })

  it('sets data-reduced-motion=false otherwise', async () => {
    useReducedMotion.mockReturnValue(false)
    const { MotionSafeProvider } = await import('./MotionSafeProvider')
    render(<MotionSafeProvider>child</MotionSafeProvider>)

    expect(document.documentElement.getAttribute('data-reduced-motion')).toBe('false')
  })
})
```

```ts
// lib/animations.test.ts
import { describe, it, expect } from 'vitest'
import { fadeUp, staggerContainer } from './animations'

describe('animation variants', () => {
  it('fadeUp fades up from below', () => {
    expect(fadeUp.hidden).toEqual({ opacity: 0, y: 24 })
    expect(fadeUp.visible).toMatchObject({ opacity: 1, y: 0 })
  })

  it('staggerContainer applies the given delay to children', () => {
    const variants = staggerContainer(0.2) as { visible: { transition: { staggerChildren: number } } }
    expect(variants.visible.transition.staggerChildren).toBe(0.2)
  })

  it('staggerContainer defaults to a 0.1s delay', () => {
    const variants = staggerContainer() as { visible: { transition: { staggerChildren: number } } }
    expect(variants.visible.transition.staggerChildren).toBe(0.1)
  })
})
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npm test -- components/ui/MotionSafeProvider lib/animations`
Expected: FAIL — neither file exists yet

- [ ] **Step 3: Write `components/ui/MotionSafeProvider.tsx`**

```tsx
'use client'

import { useEffect } from 'react'
import { useReducedMotion } from 'framer-motion'

export function MotionSafeProvider({ children }: { children: React.ReactNode }) {
  const prefersReducedMotion = useReducedMotion()

  useEffect(() => {
    document.documentElement.setAttribute('data-reduced-motion', prefersReducedMotion ? 'true' : 'false')
  }, [prefersReducedMotion])

  return <>{children}</>
}
```

- [ ] **Step 4: Write `lib/animations.ts`**

```ts
import type { Variants } from 'framer-motion'

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
}

export function staggerContainer(staggerDelay = 0.1): Variants {
  return {
    hidden: {},
    visible: { transition: { staggerChildren: staggerDelay } },
  }
}
```

- [ ] **Step 5: Run tests to verify they pass**

Run: `npm test -- components/ui/MotionSafeProvider lib/animations`
Expected: PASS

- [ ] **Step 6: Verify the app builds**

Run: `npm run build`
Expected: build succeeds

- [ ] **Step 7: Commit**

```bash
git add components/ui/MotionSafeProvider.tsx components/ui/MotionSafeProvider.test.tsx lib/animations.ts lib/animations.test.ts
git commit -m "feat: add reduced-motion provider and shared animation variants"
```

---

### Task 3: Button and Badge primitives

**Files:**
- Create: `components/ui/buttonStyles.ts`, `components/ui/Button.tsx`, `components/ui/Badge.tsx`
- Test: `components/ui/Button.test.tsx`, `components/ui/Badge.test.tsx`

**Interfaces:**
- Produces: `buttonClasses(variant?, size?, className?)`, `<Button variant? size? href? ...>`, `<Badge>` — consumed by every section task and by the restyled `CalEmbed` (Task 16).

- [ ] **Step 1: Write the failing tests**

```tsx
// components/ui/Button.test.tsx
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { Button } from './Button'

describe('Button', () => {
  it('renders as a button by default', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument()
  })

  it('renders as a link when href is provided', () => {
    render(<Button href="/projects">See work</Button>)
    expect(screen.getByRole('link', { name: 'See work' })).toHaveAttribute('href', '/projects')
  })

  it('applies secondary variant classes', () => {
    render(<Button variant="secondary">Secondary</Button>)
    expect(screen.getByRole('button')).toHaveClass('border')
  })
})
```

```tsx
// components/ui/Badge.test.tsx
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { Badge } from './Badge'

describe('Badge', () => {
  it('renders its children inside a pill', () => {
    render(<Badge>✦ AI Automation Agency</Badge>)
    expect(screen.getByText('✦ AI Automation Agency')).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npm test -- components/ui/Button components/ui/Badge`
Expected: FAIL — none of the source files exist yet

- [ ] **Step 3: Write `components/ui/buttonStyles.ts`**

```ts
export type ButtonVariant = 'primary' | 'secondary' | 'ghost'
export type ButtonSize = 'default' | 'large'

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'bg-[image:var(--accent-gradient)] text-[#05070D] shadow-[0_0_24px_rgba(45,212,255,0.35)] hover:scale-[1.03]',
  secondary:
    'bg-transparent border border-[var(--border-glass)] text-[var(--text-primary)] hover:border-[var(--border-glow)] hover:text-[var(--accent-cyan)]',
  ghost: 'bg-transparent text-[var(--accent-cyan)] hover:underline',
}

const sizeClasses: Record<ButtonSize, string> = {
  default: 'px-7 py-3.5 rounded-xl text-base',
  large: 'px-9 py-[18px] rounded-xl text-lg',
}

const baseClasses =
  'inline-flex items-center justify-center font-medium transition-all duration-200 ease-out'

export function buttonClasses(
  variant: ButtonVariant = 'primary',
  size: ButtonSize = 'default',
  className = ''
): string {
  return `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`.trim()
}
```

- [ ] **Step 4: Write `components/ui/Button.tsx`**

```tsx
import Link from 'next/link'
import type { ReactNode, ButtonHTMLAttributes, AnchorHTMLAttributes } from 'react'
import { buttonClasses, type ButtonVariant, type ButtonSize } from './buttonStyles'

interface CommonProps {
  variant?: ButtonVariant
  size?: ButtonSize
  children: ReactNode
  className?: string
}

type ButtonAsButton = CommonProps & ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined }
type ButtonAsLink = CommonProps & AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }

export function Button({
  variant,
  size,
  children,
  className,
  href,
  ...rest
}: ButtonAsButton | ButtonAsLink) {
  const classes = buttonClasses(variant, size, className)

  if (href) {
    return (
      <Link href={href} className={classes} {...(rest as AnchorHTMLAttributes<HTMLAnchorElement>)}>
        {children}
      </Link>
    )
  }

  return (
    <button className={classes} {...(rest as ButtonHTMLAttributes<HTMLButtonElement>)}>
      {children}
    </button>
  )
}
```

- [ ] **Step 5: Write `components/ui/Badge.tsx`**

```tsx
import type { ReactNode } from 'react'

export function Badge({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={`inline-block rounded-full border border-[var(--border-glass)] px-4 py-1 text-xs font-medium uppercase tracking-wider text-[var(--text-muted)] ${className}`}
    >
      {children}
    </span>
  )
}
```

- [ ] **Step 6: Run tests to verify they pass**

Run: `npm test -- components/ui/Button components/ui/Badge`
Expected: PASS

- [ ] **Step 7: Commit**

```bash
git add components/ui/buttonStyles.ts components/ui/Button.tsx components/ui/Badge.tsx components/ui/Button.test.tsx components/ui/Badge.test.tsx
git commit -m "feat: add Button and Badge primitives"
```

---

### Task 4: GlassCard and SectionHeader primitives

**Files:**
- Create: `components/ui/GlassCard.tsx`, `components/ui/SectionHeader.tsx`
- Test: `components/ui/GlassCard.test.tsx`, `components/ui/SectionHeader.test.tsx`

**Interfaces:**
- Consumes: `Badge` (Task 3).
- Produces: `<GlassCard accent? className?>`, `<SectionHeader eyebrow title highlight? subtitle?>` — consumed by every section task.

- [ ] **Step 1: Write the failing tests**

```tsx
// components/ui/GlassCard.test.tsx
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { GlassCard } from './GlassCard'

describe('GlassCard', () => {
  it('renders its children', () => {
    render(<GlassCard>Card content</GlassCard>)
    expect(screen.getByText('Card content')).toBeInTheDocument()
  })

  it('defaults to the cyan glow and switches to purple when requested', () => {
    const { rerender } = render(<GlassCard>Content</GlassCard>)
    expect(screen.getByText('Content').parentElement).toHaveClass('hover:border-[var(--border-glow)]')

    rerender(<GlassCard accent="purple">Content</GlassCard>)
    expect(screen.getByText('Content').parentElement).toHaveClass('hover:border-[rgba(155,92,255,0.35)]')
  })

  it('omits the hover glow/lift entirely when glow={false}, for calmer sections like Why Axonvia', () => {
    render(<GlassCard glow={false}>Calm content</GlassCard>)
    const card = screen.getByText('Calm content').parentElement as HTMLElement

    expect(card).not.toHaveClass('hover:-translate-y-1')
    expect(card.className).not.toMatch(/hover:shadow-\[0_0_40px/)
  })
})
```

```tsx
// components/ui/SectionHeader.test.tsx
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { SectionHeader } from './SectionHeader'

describe('SectionHeader', () => {
  it('renders the eyebrow, title, and subtitle', () => {
    render(<SectionHeader eyebrow="What We Do" title="AI Systems Built Around Your Business" subtitle="A subtitle" />)

    expect(screen.getByText('What We Do')).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('AI Systems Built Around Your Business')
    expect(screen.getByText('A subtitle')).toBeInTheDocument()
  })

  it('renders the highlighted phrase inside its own span', () => {
    render(<SectionHeader eyebrow="e" title="We Build AI Agents That Run Your Business" highlight="AI Agents" />)

    const heading = screen.getByRole('heading', { level: 2 })
    expect(heading.querySelector('span')).toHaveTextContent('AI Agents')
  })
})
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npm test -- components/ui/GlassCard components/ui/SectionHeader`
Expected: FAIL — neither file exists yet

- [ ] **Step 3: Write `components/ui/GlassCard.tsx`**

```tsx
import type { ReactNode } from 'react'

export function GlassCard({
  children,
  accent = 'cyan',
  glow = true,
  className = '',
}: {
  children: ReactNode
  accent?: 'cyan' | 'purple'
  glow?: boolean
  className?: string
}) {
  const glowClass = !glow
    ? ''
    : accent === 'cyan'
      ? 'hover:-translate-y-1 hover:shadow-[0_0_40px_rgba(45,212,255,0.2)] hover:border-[var(--border-glow)]'
      : 'hover:-translate-y-1 hover:shadow-[0_0_40px_rgba(155,92,255,0.2)] hover:border-[rgba(155,92,255,0.35)]'

  return (
    <div
      className={`rounded-2xl border border-[var(--border-glass)] bg-[rgba(15,20,32,0.6)] backdrop-blur-xl p-8 transition-all duration-300 ease-out ${glowClass} ${className}`}
    >
      {children}
    </div>
  )
}
```

- [ ] **Step 4: Write `components/ui/SectionHeader.tsx`**

```tsx
import { Badge } from './Badge'

export function SectionHeader({
  eyebrow,
  title,
  highlight,
  subtitle,
}: {
  eyebrow: string
  title: string
  highlight?: string
  subtitle?: string
}) {
  const parts = highlight ? title.split(highlight) : [title]

  return (
    <div className="text-center max-w-2xl mx-auto">
      <Badge>{eyebrow}</Badge>
      <h2 className="mt-4 text-3xl md:text-5xl font-semibold text-[var(--text-primary)]">
        {highlight ? (
          <>
            {parts[0]}
            <span className="bg-[image:var(--accent-gradient)] bg-clip-text text-transparent">{highlight}</span>
            {parts[1]}
          </>
        ) : (
          title
        )}
      </h2>
      {subtitle && <p className="mt-4 text-[var(--text-secondary)] text-lg">{subtitle}</p>}
    </div>
  )
}
```

- [ ] **Step 5: Run tests to verify they pass**

Run: `npm test -- components/ui/GlassCard components/ui/SectionHeader`
Expected: PASS

- [ ] **Step 6: Commit**

```bash
git add components/ui/GlassCard.tsx components/ui/SectionHeader.tsx components/ui/GlassCard.test.tsx components/ui/SectionHeader.test.tsx
git commit -m "feat: add GlassCard and SectionHeader primitives"
```

---

### Task 5: GradientBlob primitive

**Files:**
- Create: `components/ui/GradientBlob.tsx`
- Test: `components/ui/GradientBlob.test.tsx`

**Interfaces:**
- Produces: `<GradientBlob color? className?>` — consumed by Hero, FinalCta, and section-break backgrounds.

- [ ] **Step 1: Write the failing test**

```tsx
// components/ui/GradientBlob.test.tsx
import { render } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { GradientBlob } from './GradientBlob'

describe('GradientBlob', () => {
  it('renders as a decorative, hidden element with the cyan accent by default', () => {
    const { container } = render(<GradientBlob />)
    const blob = container.firstChild as HTMLElement

    expect(blob).toHaveAttribute('aria-hidden', 'true')
    expect(blob).toHaveClass('gradient-blob', 'bg-[var(--accent-cyan)]')
  })

  it('applies the purple accent when requested', () => {
    const { container } = render(<GradientBlob color="purple" />)
    expect(container.firstChild).toHaveClass('bg-[var(--accent-purple)]')
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- components/ui/GradientBlob`
Expected: FAIL — `components/ui/GradientBlob.tsx` does not exist

- [ ] **Step 3: Write `components/ui/GradientBlob.tsx`**

```tsx
export function GradientBlob({
  color = 'cyan',
  className = '',
}: {
  color?: 'cyan' | 'purple'
  className?: string
}) {
  const bg = color === 'cyan' ? 'bg-[var(--accent-cyan)]' : 'bg-[var(--accent-purple)]'

  return (
    <div
      className={`gradient-blob pointer-events-none absolute rounded-full opacity-40 blur-[120px] ${bg} ${className}`}
      aria-hidden="true"
    />
  )
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- components/ui/GradientBlob`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add components/ui/GradientBlob.tsx components/ui/GradientBlob.test.tsx
git commit -m "feat: add GradientBlob primitive"
```

---

### Task 6: Navbar

**Files:**
- Create: `components/sections/Navbar.tsx`
- Test: `components/sections/Navbar.test.tsx`

**Interfaces:**
- Consumes: `Button` (Task 3).
- Produces: `<Navbar>` — consumed by `app/page.tsx` (Task 16).

- [ ] **Step 1: Write the failing tests**

```tsx
// components/sections/Navbar.test.tsx
import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { Navbar } from './Navbar'

describe('Navbar', () => {
  it('renders the brand and primary nav links', () => {
    render(<Navbar />)
    expect(screen.getByRole('link', { name: 'Axonvia' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Services' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'FAQ' })).toBeInTheDocument()
  })

  it('opens and closes the mobile menu', () => {
    render(<Navbar />)
    fireEvent.click(screen.getByRole('button', { name: 'Open menu' }))
    expect(screen.getByRole('navigation', { name: 'Mobile' })).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Close menu' }))
    expect(screen.queryByRole('navigation', { name: 'Mobile' })).not.toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- components/sections/Navbar`
Expected: FAIL — `components/sections/Navbar.tsx` does not exist

- [ ] **Step 3: Write `components/sections/Navbar.tsx`**

```tsx
'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/Button'

const navLinks = [
  { href: '#services', label: 'Services' },
  { href: '#how-it-works', label: 'How It Works' },
  { href: '#projects', label: 'Projects' },
  { href: '#about', label: 'About' },
  { href: '#faq', label: 'FAQ' },
]

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    function handleScroll() {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 h-16 md:h-20 transition-colors duration-300 ${
        scrolled ? 'bg-[rgba(5,7,13,0.7)] backdrop-blur-xl border-b border-[var(--border-glass)]' : 'bg-transparent'
      }`}
    >
      <div className="mx-auto flex h-full max-w-[1320px] items-center justify-between px-5 md:px-10">
        <Link href="/" className="text-[var(--text-primary)] font-semibold text-lg">
          Axonvia
        </Link>

        <nav className="hidden md:flex items-center gap-8" aria-label="Primary">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-4">
          <Button href="#book-a-call" variant="secondary">
            Book a Call
          </Button>
          <Button href="#final-cta">Get Started</Button>
        </div>

        <button
          className="md:hidden text-[var(--text-primary)]"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {menuOpen && (
        <div className="md:hidden fixed inset-0 top-16 bg-[var(--bg-primary)] px-5 py-8">
          <nav className="flex flex-col gap-2" aria-label="Mobile">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="h-14 flex items-center text-[var(--text-primary)] text-lg"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="mt-6 flex flex-col gap-3">
            <Button href="#book-a-call" variant="secondary" className="w-full">
              Book a Call
            </Button>
            <Button href="#final-cta" className="w-full">
              Get Started
            </Button>
          </div>
        </div>
      )}
    </header>
  )
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- components/sections/Navbar`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add components/sections/Navbar.tsx components/sections/Navbar.test.tsx
git commit -m "feat: add Navbar section"
```

---

### Task 7: Hero

**Files:**
- Create: `components/sections/Hero.tsx`
- Test: `components/sections/Hero.test.tsx`

**Interfaces:**
- Consumes: `Button`, `Badge` (Task 3), `GradientBlob` (Task 5), `CalEmbed` (existing), `fadeUp`/`staggerContainer` (Task 2).
- Produces: `<Hero>` — consumed by `app/page.tsx` (Task 16).

- [ ] **Step 1: Write the failing test**

```tsx
// components/sections/Hero.test.tsx
import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'

vi.mock('@/components/CalEmbed', () => ({
  CalEmbed: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}))

describe('Hero', () => {
  it('renders the headline, subheadline, and both CTAs', async () => {
    const { Hero } = await import('./Hero')
    render(<Hero />)

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('We Build AI Agents That Run Your Business')
    expect(screen.getByText(/Axonvia designs, builds, and deploys/)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Book a Free Strategy Call' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'See Our Work' })).toHaveAttribute('href', '#projects')
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- components/sections/Hero`
Expected: FAIL — `components/sections/Hero.tsx` does not exist

- [ ] **Step 3: Write `components/sections/Hero.tsx`**

```tsx
'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { CalEmbed } from '@/components/CalEmbed'
import { GradientBlob } from '@/components/ui/GradientBlob'
import { fadeUp, staggerContainer } from '@/lib/animations'

const NODES = [
  { x: 60, y: 60 },
  { x: 220, y: 30 },
  { x: 380, y: 70 },
  { x: 140, y: 150 },
  { x: 320, y: 160 },
  { x: 220, y: 220 },
]
const EDGES: [number, number][] = [
  [0, 1],
  [1, 2],
  [0, 3],
  [1, 4],
  [3, 5],
  [4, 5],
  [1, 3],
]

function HeroNetworkVisual() {
  return (
    <svg viewBox="0 0 440 260" className="relative z-10 mt-12 w-full max-w-md opacity-70" aria-hidden="true">
      {EDGES.map(([from, to], i) => (
        <motion.line
          key={i}
          x1={NODES[from].x}
          y1={NODES[from].y}
          x2={NODES[to].x}
          y2={NODES[to].y}
          stroke="var(--accent-cyan)"
          strokeWidth={1}
          strokeDasharray="4 4"
          animate={{ strokeDashoffset: [0, -16] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear', delay: i * 0.2 }}
        />
      ))}
      {NODES.map((node, i) => (
        <motion.circle
          key={i}
          cx={node.x}
          cy={node.y}
          r={6}
          fill="var(--accent-cyan)"
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 2.5, repeat: Infinity, delay: i * 0.3 }}
        />
      ))}
    </svg>
  )
}

export function Hero() {
  return (
    <section className="relative min-h-[90vh] flex flex-col items-center justify-center overflow-hidden px-5 pt-24 grid-texture">
      <GradientBlob color="cyan" className="w-[480px] h-[480px] -top-20 -right-20" />
      <GradientBlob color="purple" className="w-[480px] h-[480px] bottom-0 -left-20" />

      <motion.div
        initial="hidden"
        animate="visible"
        variants={staggerContainer(0.15)}
        className="relative z-10 max-w-3xl text-center"
      >
        <motion.div variants={fadeUp}>
          <Badge>✦ AI Automation Agency</Badge>
        </motion.div>

        <motion.h1
          variants={fadeUp}
          className="mt-6 text-4xl md:text-7xl font-semibold leading-tight text-[var(--text-primary)]"
        >
          We Build{' '}
          <span className="bg-[image:var(--accent-gradient)] bg-clip-text text-transparent">AI Agents</span> That Run
          Your Business
        </motion.h1>

        <motion.p variants={fadeUp} className="mt-6 text-lg md:text-xl text-[var(--text-secondary)] max-w-xl mx-auto">
          Axonvia designs, builds, and deploys intelligent automation systems — from lead generation to customer
          operations — so your business runs on autopilot, not overtime.
        </motion.p>

        <motion.div variants={fadeUp} className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <CalEmbed>
            <Button size="large">Book a Free Strategy Call</Button>
          </CalEmbed>
          <Button href="#projects" variant="secondary" size="large">
            See Our Work
          </Button>
        </motion.div>

        <motion.p variants={fadeUp} className="mt-10 text-xs text-[var(--text-muted)]">
          Trusted by businesses automating sales, operations &amp; support
        </motion.p>
      </motion.div>

      <HeroNetworkVisual />
    </section>
  )
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- components/sections/Hero`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add components/sections/Hero.tsx components/sections/Hero.test.tsx
git commit -m "feat: add Hero section"
```

---

### Task 8: Services

**Files:**
- Create: `components/sections/Services.tsx`
- Test: `components/sections/Services.test.tsx`

**Interfaces:**
- Consumes: `GlassCard`, `SectionHeader` (Task 4), `fadeUp`/`staggerContainer` (Task 2).
- Produces: `<Services>` — consumed by `app/page.tsx` (Task 16).

- [ ] **Step 1: Write the failing test**

```tsx
// components/sections/Services.test.tsx
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { Services } from './Services'

describe('Services', () => {
  it('renders the section header and all 6 service cards', () => {
    render(<Services />)

    expect(screen.getByRole('heading', { name: 'AI Systems Built Around Your Business' })).toBeInTheDocument()
    expect(screen.getByText('AI Agent Development')).toBeInTheDocument()
    expect(screen.getByText('Workflow Automation')).toBeInTheDocument()
    expect(screen.getByText('AI-Powered Products')).toBeInTheDocument()
    expect(screen.getByText('Conversational AI & Chatbots')).toBeInTheDocument()
    expect(screen.getByText('Data & Integration')).toBeInTheDocument()
    expect(screen.getByText('AI Strategy & Consulting')).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- components/sections/Services`
Expected: FAIL — `components/sections/Services.tsx` does not exist

- [ ] **Step 3: Write `components/sections/Services.tsx`**

```tsx
'use client'

import { motion } from 'framer-motion'
import { Bot, Workflow, Layers, MessageCircle, Database, Compass } from 'lucide-react'
import { GlassCard } from '@/components/ui/GlassCard'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { fadeUp, staggerContainer } from '@/lib/animations'

const services = [
  {
    icon: Bot,
    title: 'AI Agent Development',
    description:
      'Custom AI agents that handle lead qualification, customer queries, scheduling, and more — trained on your business logic.',
    accent: 'cyan' as const,
  },
  {
    icon: Workflow,
    title: 'Workflow Automation',
    description:
      'End-to-end automation of repetitive operations — from data entry to multi-step approval chains.',
    accent: 'purple' as const,
  },
  {
    icon: Layers,
    title: 'AI-Powered Products',
    description: 'Full web applications with AI at the core, built and shipped from MVP to production.',
    accent: 'cyan' as const,
  },
  {
    icon: MessageCircle,
    title: 'Conversational AI & Chatbots',
    description:
      'Intelligent chat and voice interfaces integrated into WhatsApp, websites, and internal tools.',
    accent: 'purple' as const,
  },
  {
    icon: Database,
    title: 'Data & Integration',
    description: 'Connecting your tools, CRMs, and databases into one automated pipeline.',
    accent: 'cyan' as const,
  },
  {
    icon: Compass,
    title: 'AI Strategy & Consulting',
    description: 'Helping teams identify where AI delivers real ROI before a single line of code is written.',
    accent: 'purple' as const,
  },
]

export function Services() {
  return (
    <section id="services" className="px-5 md:px-10 py-24 bg-[var(--bg-secondary)]">
      <SectionHeader
        eyebrow="What We Do"
        title="AI Systems Built Around Your Business"
        subtitle="From a single automated workflow to a full agentic system — we build what actually moves the needle."
      />

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={staggerContainer(0.08)}
        className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-[1320px] mx-auto"
      >
        {services.map((service) => (
          <motion.div key={service.title} variants={fadeUp}>
            <GlassCard accent={service.accent} className="h-full">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--accent-cyan)]/10">
                <service.icon className="h-6 w-6 text-[var(--accent-cyan)]" />
              </div>
              <h3 className="mt-5 text-xl font-semibold text-[var(--text-primary)]">{service.title}</h3>
              <p className="mt-2 text-[var(--text-secondary)]">{service.description}</p>
            </GlassCard>
          </motion.div>
        ))}
      </motion.div>
    </section>
  )
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- components/sections/Services`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add components/sections/Services.tsx components/sections/Services.test.tsx
git commit -m "feat: add Services section"
```

---

### Task 9: HowItWorks

**Files:**
- Create: `components/sections/HowItWorks.tsx`
- Test: `components/sections/HowItWorks.test.tsx`

**Interfaces:**
- Consumes: `GlassCard` (Task 4), `fadeUp`/`staggerContainer` (Task 2).
- Produces: `<HowItWorks>` — consumed by `app/page.tsx` (Task 16).

- [ ] **Step 1: Write the failing test**

```tsx
// components/sections/HowItWorks.test.tsx
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { HowItWorks } from './HowItWorks'

describe('HowItWorks', () => {
  it('renders the agentic explainer and the 4-step timeline', () => {
    render(<HowItWorks />)

    expect(screen.getByText(/What Makes It/)).toBeInTheDocument()
    expect(screen.getByText('Discover')).toBeInTheDocument()
    expect(screen.getByText('Design')).toBeInTheDocument()
    expect(screen.getByText('Build & Test')).toBeInTheDocument()
    expect(screen.getByText('Deploy & Optimize')).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- components/sections/HowItWorks`
Expected: FAIL — `components/sections/HowItWorks.tsx` does not exist

- [ ] **Step 3: Write `components/sections/HowItWorks.tsx`**

```tsx
'use client'

import { motion } from 'framer-motion'
import { Brain, Wrench, GitBranch, UserCheck, Search, PenTool, Code, Rocket } from 'lucide-react'
import { GlassCard } from '@/components/ui/GlassCard'
import { fadeUp, staggerContainer } from '@/lib/animations'

const flowNodes = [
  { icon: Search, label: 'Input (query/trigger)' },
  { icon: Brain, label: 'Agent reasons' },
  { icon: Wrench, label: 'Agent takes action' },
  { icon: GitBranch, label: 'Decision: resolve or escalate' },
  { icon: UserCheck, label: 'Output / human handoff' },
]

const timelineSteps = [
  { icon: Search, number: '01', title: 'Discover', description: 'We map your workflows and identify automation opportunities.' },
  { icon: PenTool, number: '02', title: 'Design', description: 'We architect the agent system — logic, tools, integrations.' },
  { icon: Code, number: '03', title: 'Build & Test', description: 'We develop and rigorously test before anything goes live.' },
  { icon: Rocket, number: '04', title: 'Deploy & Optimize', description: 'We launch, monitor, and continuously improve performance.' },
]

export function HowItWorks() {
  return (
    <section id="how-it-works" className="px-5 md:px-10 py-24">
      <div className="grid grid-cols-1 lg:grid-cols-[40%_60%] gap-10 max-w-[1320px] mx-auto items-center">
        <div>
          <h2 className="text-3xl md:text-4xl font-semibold text-[var(--text-primary)]">
            What Makes It <span className="italic">Agentic</span>?
          </h2>
          <p className="mt-4 text-[var(--text-secondary)] text-lg">
            Unlike a simple chatbot, our AI agents can reason, make decisions, take multi-step actions, and hand off
            to a human when needed — operating like a digital team member, not just a script.
          </p>
        </div>

        <div className="flex flex-wrap gap-4 justify-center">
          {flowNodes.map((node) => (
            <GlassCard key={node.label} className="flex flex-col items-center gap-2 w-36 text-center">
              <node.icon className="h-6 w-6 text-[var(--accent-cyan)]" />
              <span className="text-sm text-[var(--text-secondary)]">{node.label}</span>
            </GlassCard>
          ))}
        </div>
      </div>

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={staggerContainer(0.1)}
        className="mt-20 grid grid-cols-1 md:grid-cols-4 gap-8 max-w-[1320px] mx-auto"
      >
        {timelineSteps.map((step) => (
          <motion.div key={step.number} variants={fadeUp} className="text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-[var(--border-glass)] text-[var(--text-primary)] font-semibold">
              {step.number}
            </div>
            <step.icon className="mx-auto mt-4 h-6 w-6 text-[var(--accent-cyan)]" />
            <h3 className="mt-3 text-lg font-semibold text-[var(--text-primary)]">{step.title}</h3>
            <p className="mt-2 text-[var(--text-secondary)] text-sm">{step.description}</p>
          </motion.div>
        ))}
      </motion.div>
    </section>
  )
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- components/sections/HowItWorks`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add components/sections/HowItWorks.tsx components/sections/HowItWorks.test.tsx
git commit -m "feat: add HowItWorks section"
```

---

### Task 10: Content seeding script

**Files:**
- Create: `scripts/seed-content.ts`

**Interfaces:**
- Consumes: `db`, `faqs`/`projects` tables (existing).
- Produces: 5 published FAQ rows + 1 featured `live` project row in Neon — consumed by Task 11 (Projects) and Task 13 (Faq) for their manual verification steps.

- [ ] **Step 1: Write `scripts/seed-content.ts`**

```ts
import { db } from '@/lib/db'
import { faqs, projects } from '@/lib/db/schema'

const faqRows = [
  {
    question: 'What kind of businesses do you work with?',
    answer:
      'We work across industries — real estate, e-commerce, services, and more. If a process can be automated or an agent can handle it, we can likely help.',
    isPublished: true,
    sortOrder: 0,
  },
  {
    question: 'How long does a typical project take?',
    answer:
      'Most projects range from 2–6 weeks depending on scope, from initial discovery to a live, tested system.',
    isPublished: true,
    sortOrder: 1,
  },
  {
    question: 'Do I need technical knowledge to work with you?',
    answer: 'Not at all. We handle the technical build — you just need to know your business processes.',
    isPublished: true,
    sortOrder: 2,
  },
  {
    question: 'What happens after launch?',
    answer:
      'We offer ongoing support and optimization packages so your system keeps improving post-launch.',
    isPublished: true,
    sortOrder: 3,
  },
  {
    question: "What's the cost of a project?",
    answer:
      'Pricing depends on scope and complexity — we provide a clear, fixed quote after the discovery call, no surprises.',
    isPublished: true,
    sortOrder: 4,
  },
]

const projectRow = {
  name: 'RevenueOS',
  description:
    'A multi-agent AI system for real estate businesses — automatically qualifying leads, recommending properties, and booking appointments without manual follow-up.',
  stats: ['Multi-agent system', 'Real estate lead automation', 'End-to-end booking flow'],
  tags: ['Claude API', 'FastAPI', 'Next.js'],
  imageUrl: null,
  link: null,
  isFeatured: true,
  status: 'live' as const,
  sortOrder: 0,
}

async function main() {
  await db.insert(faqs).values(faqRows)
  await db.insert(projects).values(projectRow)
  console.log(`Seeded ${faqRows.length} FAQs and 1 project.`)
}

main()
```

- [ ] **Step 2: ⚠️ Manual step — run the seed script against the live Neon database**

Run: `node --env-file=.env.local node_modules/.bin/tsx scripts/seed-content.ts`
Expected: `Seeded 5 FAQs and 1 project.`

- [ ] **Step 3: Verify in Neon**

Run a query confirming 5 rows in `faqs` and 1 row in `projects` with `status = 'live'`.

- [ ] **Step 4: Commit**

```bash
git add scripts/seed-content.ts
git commit -m "feat: add content seeding script for FAQs and the RevenueOS example project"
```

---

### Task 11: Projects section

**Files:**
- Create: `components/sections/Projects.tsx`
- Test: `components/sections/Projects.test.tsx`

**Interfaces:**
- Consumes: `getPublishedProjects()` (existing), `GlassCard`, `SectionHeader` (Task 4), `Button` (Task 3).
- Produces: `<Projects>` (async Server Component) — consumed by `app/page.tsx` (Task 16).

- [ ] **Step 1: Write the failing tests**

```tsx
// components/sections/Projects.test.tsx
import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'

const getPublishedProjects = vi.fn()
vi.mock('@/lib/queries/content', () => ({ getPublishedProjects }))

describe('Projects', () => {
  beforeEach(() => getPublishedProjects.mockReset())

  it('renders the first featured project as the Featured Project card', async () => {
    getPublishedProjects.mockResolvedValue([
      {
        id: '1',
        name: 'RevenueOS',
        description: 'A multi-agent AI system for real estate businesses.',
        stats: ['Multi-agent system'],
        tags: ['Claude API'],
        imageUrl: null,
        link: null,
        isFeatured: true,
        status: 'live',
        sortOrder: 0,
      },
    ])

    const { Projects } = await import('./Projects')
    render(await Projects())

    expect(screen.getByText('Featured Project')).toBeInTheDocument()
    expect(screen.getByText('RevenueOS')).toBeInTheDocument()
    expect(screen.getByText('Claude API')).toBeInTheDocument()
  })

  it('omits the secondary grid when there are no remaining projects', async () => {
    getPublishedProjects.mockResolvedValue([
      {
        id: '1',
        name: 'RevenueOS',
        description: 'desc',
        stats: [],
        tags: [],
        imageUrl: null,
        link: null,
        isFeatured: true,
        status: 'live',
        sortOrder: 0,
      },
    ])

    const { Projects } = await import('./Projects')
    render(await Projects())

    expect(screen.queryByTestId('secondary-projects-grid')).not.toBeInTheDocument()
  })

  it('shows a plain coming-soon line when there are no live projects at all', async () => {
    getPublishedProjects.mockResolvedValue([])

    const { Projects } = await import('./Projects')
    render(await Projects())

    expect(screen.getByText(/Projects coming soon/i)).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npm test -- components/sections/Projects`
Expected: FAIL — `components/sections/Projects.tsx` does not exist

- [ ] **Step 3: Write `components/sections/Projects.tsx`**

```tsx
import { getPublishedProjects } from '@/lib/queries/content'
import { GlassCard } from '@/components/ui/GlassCard'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { Button } from '@/components/ui/Button'

export async function Projects() {
  const projects = await getPublishedProjects()
  const [featured, ...rest] = projects

  return (
    <section id="projects" className="px-5 md:px-10 py-24 bg-[var(--bg-secondary)]">
      <SectionHeader eyebrow="Our Work" title="Systems We've Built" />

      <div className="mt-12 max-w-[1320px] mx-auto">
        {!featured && <p className="text-center text-[var(--text-secondary)]">Projects coming soon.</p>}

        {featured && (
          <GlassCard className="grid grid-cols-1 lg:grid-cols-[45%_55%] gap-8">
            <div className="rounded-xl bg-[var(--bg-card)] min-h-[220px]" aria-hidden="true" />
            <div>
              <span className="text-xs uppercase tracking-wider text-[var(--accent-cyan)]">Featured Project</span>
              <h3 className="mt-2 text-2xl font-semibold text-[var(--text-primary)]">{featured.name}</h3>
              <p className="mt-3 text-[var(--text-secondary)]">{featured.description}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {featured.stats.map((stat) => (
                  <span
                    key={stat}
                    className="rounded-full border border-[var(--border-glass)] px-3 py-1 text-xs text-[var(--text-secondary)]"
                  >
                    {stat}
                  </span>
                ))}
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {featured.tags.map((tag) => (
                  <span key={tag} className="font-mono text-xs text-[var(--text-muted)]">
                    {tag}
                  </span>
                ))}
              </div>
              {featured.link && (
                <Button href={featured.link} variant="ghost" className="mt-4">
                  View Details →
                </Button>
              )}
            </div>
          </GlassCard>
        )}

        {rest.length > 0 && (
          <div data-testid="secondary-projects-grid" className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            {rest.map((project) => (
              <GlassCard key={project.id}>
                <h4 className="text-lg font-semibold text-[var(--text-primary)]">{project.name}</h4>
                <p className="mt-2 text-sm text-[var(--text-secondary)]">{project.description}</p>
              </GlassCard>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npm test -- components/sections/Projects`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add components/sections/Projects.tsx components/sections/Projects.test.tsx
git commit -m "feat: add Projects section backed by the live CMS"
```

---

### Task 12: TechStack

**Files:**
- Create: `components/sections/TechStack.tsx`
- Test: `components/sections/TechStack.test.tsx`

**Interfaces:**
- Consumes: `Badge` (Task 3), `SectionHeader` (Task 4).
- Produces: `<TechStack>` — consumed by `app/page.tsx` (Task 16).

- [ ] **Step 1: Write the failing test**

```tsx
// components/sections/TechStack.test.tsx
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { TechStack } from './TechStack'

describe('TechStack', () => {
  it('renders the stack chips, including Neon in place of the unused Supabase', () => {
    render(<TechStack />)

    expect(screen.getByText('Claude API')).toBeInTheDocument()
    expect(screen.getByText('Neon')).toBeInTheDocument()
    expect(screen.queryByText('Supabase')).not.toBeInTheDocument()
    expect(screen.getByText('WhatsApp API')).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- components/sections/TechStack`
Expected: FAIL — `components/sections/TechStack.tsx` does not exist

- [ ] **Step 3: Write `components/sections/TechStack.tsx`**

```tsx
import { Badge } from '@/components/ui/Badge'
import { SectionHeader } from '@/components/ui/SectionHeader'

const chips = [
  'Claude API',
  'Agentic AI',
  'OpenAI',
  'FastAPI',
  'Next.js',
  'React',
  'Python',
  'Node.js',
  'PostgreSQL',
  'Neon',
  'LangChain',
  'Vector Databases',
  'REST & Webhooks',
  'WhatsApp API',
]

export function TechStack() {
  return (
    <section className="px-5 md:px-10 py-24">
      <SectionHeader eyebrow="Our Stack" title="Built on Proven, Modern Technology" />

      <div className="mt-12 flex flex-wrap justify-center gap-3 max-w-[900px] mx-auto">
        {chips.map((chip) => (
          <Badge key={chip} className="normal-case text-sm text-[var(--text-secondary)] px-4 py-2">
            {chip}
          </Badge>
        ))}
      </div>
    </section>
  )
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- components/sections/TechStack`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add components/sections/TechStack.tsx components/sections/TechStack.test.tsx
git commit -m "feat: add TechStack section"
```

---

### Task 13: Process, WhyAxonvia, About

**Files:**
- Create: `components/sections/Process.tsx`, `components/sections/WhyAxonvia.tsx`, `components/sections/About.tsx`
- Test: `components/sections/Process.test.tsx`, `components/sections/WhyAxonvia.test.tsx`, `components/sections/About.test.tsx`

**Interfaces:**
- Consumes: `GlassCard`, `SectionHeader` (Task 4).
- Produces: `<Process>`, `<WhyAxonvia>`, `<About>` — consumed by `app/page.tsx` (Task 16).

- [ ] **Step 1: Write the failing tests**

```tsx
// components/sections/Process.test.tsx
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { Process } from './Process'

describe('Process', () => {
  it('renders all 5 engagement steps', () => {
    render(<Process />)
    expect(screen.getByText('Discovery Call')).toBeInTheDocument()
    expect(screen.getByText('Proposal & Scope')).toBeInTheDocument()
    expect(screen.getByText('Build Sprint')).toBeInTheDocument()
    expect(screen.getByText('Testing & Handoff')).toBeInTheDocument()
    expect(screen.getByText('Support & Iteration')).toBeInTheDocument()
  })
})
```

```tsx
// components/sections/WhyAxonvia.test.tsx
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { WhyAxonvia } from './WhyAxonvia'

describe('WhyAxonvia', () => {
  it('renders all 4 differentiators', () => {
    render(<WhyAxonvia />)
    expect(screen.getByText('Built, Not Templated')).toBeInTheDocument()
    expect(screen.getByText('Full-Stack Capability')).toBeInTheDocument()
    expect(screen.getByText('Transparent Process')).toBeInTheDocument()
    expect(screen.getByText('Long-Term Partnership')).toBeInTheDocument()
  })
})
```

```tsx
// components/sections/About.test.tsx
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { About } from './About'

describe('About', () => {
  it('renders the founder quote and stat row', () => {
    render(<About />)
    expect(screen.getByText(/We don't just talk about automation/)).toBeInTheDocument()
    expect(screen.getByText('5-person team')).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npm test -- components/sections/Process components/sections/WhyAxonvia components/sections/About`
Expected: FAIL — none of the source files exist yet

- [ ] **Step 3: Write `components/sections/Process.tsx`**

```tsx
'use client'

import { motion } from 'framer-motion'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { fadeUp, staggerContainer } from '@/lib/animations'

const steps = [
  { title: 'Discovery Call', when: 'Week 0', description: 'We understand your business, bottlenecks, and goals — no obligation, no jargon.' },
  { title: 'Proposal & Scope', when: 'Week 0–1', description: 'You receive a clear scope, timeline, and fixed-price or milestone-based quote.' },
  { title: 'Build Sprint', when: 'Week 1–3, varies by project', description: 'Our team builds in focused sprints, with regular check-ins and demos.' },
  { title: 'Testing & Handoff', when: 'Final week', description: 'Rigorous testing, documentation, and a walkthrough before go-live.' },
  { title: 'Support & Iteration', when: 'Ongoing', description: 'Post-launch monitoring, optimization, and support as your needs evolve.' },
]

export function Process() {
  return (
    <section className="px-5 md:px-10 py-24 bg-[var(--bg-secondary)]">
      <SectionHeader eyebrow="Our Process" title="From First Call to Live System" />

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={staggerContainer(0.12)}
        className="mt-12 max-w-2xl mx-auto border-l border-[var(--border-glass)] pl-8"
      >
        {steps.map((step, i) => (
          <motion.div key={step.title} variants={fadeUp} className="relative pb-10 last:pb-0">
            <span className="absolute -left-[41px] flex h-8 w-8 items-center justify-center rounded-full border border-[var(--border-glass)] bg-[var(--bg-primary)] text-sm font-semibold text-[var(--text-primary)]">
              {i + 1}
            </span>
            <h3 className="text-lg font-semibold text-[var(--text-primary)]">{step.title}</h3>
            <span className="text-xs text-[var(--text-muted)]">{step.when}</span>
            <p className="mt-2 text-[var(--text-secondary)]">{step.description}</p>
          </motion.div>
        ))}
      </motion.div>
    </section>
  )
}
```

- [ ] **Step 4: Write `components/sections/WhyAxonvia.tsx`**

```tsx
import { GlassCard } from '@/components/ui/GlassCard'

const differentiators = [
  { title: 'Built, Not Templated', description: 'Every system is custom-architected for your workflows — no generic chatbot wrappers.' },
  { title: 'Full-Stack Capability', description: 'From AI logic to production-grade web apps — one team, start to finish.' },
  { title: 'Transparent Process', description: 'Clear timelines, clear pricing, regular updates — no black box.' },
  { title: 'Long-Term Partnership', description: "We support and iterate on what we build — automation isn't a one-time deploy." },
]

export function WhyAxonvia() {
  return (
    <section className="px-5 md:px-10 py-24">
      <div className="max-w-[1320px] mx-auto grid grid-cols-1 lg:grid-cols-[40%_60%] gap-10">
        <div>
          <span className="text-xs uppercase tracking-wider text-[var(--text-muted)]">Why Axonvia</span>
          <h2 className="mt-4 text-3xl font-semibold text-[var(--text-primary)]">
            We don&apos;t sell hype — we ship systems that work.
          </h2>
          <p className="mt-4 text-[var(--text-secondary)]">
            Every agent we build is tested against real business scenarios, not demos. We stay hands-on from
            strategy through to post-launch support.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {differentiators.map((item) => (
            <GlassCard key={item.title} glow={false} className="p-6">
              <h3 className="font-semibold text-[var(--text-primary)]">{item.title}</h3>
              <p className="mt-2 text-sm text-[var(--text-secondary)]">{item.description}</p>
            </GlassCard>
          ))}
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 5: Write `components/sections/About.tsx`**

```tsx
export function About() {
  return (
    <section id="about" className="px-5 md:px-10 py-24 bg-[var(--bg-secondary)]">
      <div className="max-w-[1320px] mx-auto grid grid-cols-1 lg:grid-cols-[40%_60%] gap-10 items-center">
        <div className="flex justify-center">
          <div className="h-48 w-48 rounded-full bg-[var(--bg-card)] ring-2 ring-offset-4 ring-offset-[var(--bg-secondary)]" />
        </div>

        <div>
          <span className="text-xs uppercase tracking-wider text-[var(--text-muted)]">About Axonvia</span>
          <h2 className="mt-4 text-3xl font-semibold text-[var(--text-primary)]">
            Built by Engineers Who&apos;ve Shipped Real AI Systems
          </h2>
          <p className="mt-4 text-[var(--text-secondary)]">
            Axonvia was founded to close the gap between AI hype and AI that actually works in production. We&apos;re
            a team of engineers and builders who design agentic systems grounded in real business logic — not
            demos.
          </p>

          <blockquote className="mt-6 border-l-2 border-[var(--accent-cyan)] pl-4 italic text-lg text-[var(--text-primary)]">
            &quot;We don&apos;t just talk about automation — we build it, test it, and stand behind it after
            launch.&quot;
            <footer className="mt-2 text-sm text-[var(--text-muted)]">— Founder &amp; CEO, Axonvia</footer>
          </blockquote>

          <div className="mt-6 flex gap-6 text-sm text-[var(--text-secondary)]">
            <span>5-person team</span>
            <span>Multi-agent systems</span>
            <span>Full-stack delivery</span>
          </div>
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 6: Run tests to verify they pass**

Run: `npm test -- components/sections/Process components/sections/WhyAxonvia components/sections/About`
Expected: PASS

- [ ] **Step 7: Commit**

```bash
git add components/sections/Process.tsx components/sections/WhyAxonvia.tsx components/sections/About.tsx components/sections/Process.test.tsx components/sections/WhyAxonvia.test.tsx components/sections/About.test.tsx
git commit -m "feat: add Process, WhyAxonvia, and About sections"
```

---

### Task 14: Testimonials and FAQ sections

**Files:**
- Create: `components/sections/Testimonials.tsx`, `components/sections/Faq.tsx`, `components/sections/FaqAccordion.tsx`
- Test: `components/sections/Testimonials.test.tsx`, `components/sections/Faq.test.tsx` (exercises `FaqAccordion` end-to-end — no separate unit test file)

**Interfaces:**
- Consumes: `getPublishedTestimonials()`, `getPublishedFaqs()` (existing), `GlassCard`, `SectionHeader` (Task 4), `Button` (Task 3), `CalEmbed` (existing).
- Produces: `<Testimonials>`, `<Faq>` (async Server Components) — consumed by `app/page.tsx` (Task 16).

- [ ] **Step 1: Write the failing tests**

```tsx
// components/sections/Testimonials.test.tsx
import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'

const getPublishedTestimonials = vi.fn()
vi.mock('@/lib/queries/content', () => ({ getPublishedTestimonials }))
vi.mock('@/components/CalEmbed', () => ({
  CalEmbed: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}))

describe('Testimonials', () => {
  beforeEach(() => getPublishedTestimonials.mockReset())

  it('shows the trust-strip fallback when there are no published testimonials', async () => {
    getPublishedTestimonials.mockResolvedValue([])
    const { Testimonials } = await import('./Testimonials')
    render(await Testimonials())

    expect(screen.getByText(/Early-stage and building in public/)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Be one of our first case studies/i })).toBeInTheDocument()
  })

  it('shows testimonial cards when published testimonials exist', async () => {
    getPublishedTestimonials.mockResolvedValue([
      { id: '1', quote: 'Great work', clientName: 'Jane', clientRole: 'CEO', avatarUrl: null, isPublished: true, sortOrder: 0 },
    ])
    const { Testimonials } = await import('./Testimonials')
    render(await Testimonials())

    expect(screen.getByText('Great work')).toBeInTheDocument()
    expect(screen.getByText('Jane')).toBeInTheDocument()
  })
})
```

```tsx
// components/sections/Faq.test.tsx
import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'

const getPublishedFaqs = vi.fn()
vi.mock('@/lib/queries/content', () => ({ getPublishedFaqs }))

describe('Faq', () => {
  beforeEach(() => getPublishedFaqs.mockReset())

  it('renders each question and reveals its answer when clicked', async () => {
    getPublishedFaqs.mockResolvedValue([
      { id: '1', question: 'What do you do?', answer: 'We build AI agents.', isPublished: true, sortOrder: 0 },
    ])

    const { Faq } = await import('./Faq')
    render(await Faq())

    expect(screen.getByText('What do you do?')).toBeInTheDocument()
    expect(screen.queryByText('We build AI agents.')).not.toBeInTheDocument()

    fireEvent.click(screen.getByText('What do you do?'))
    expect(screen.getByText('We build AI agents.')).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npm test -- components/sections/Testimonials components/sections/Faq`
Expected: FAIL — neither source file exists yet

- [ ] **Step 3: Write `components/sections/Testimonials.tsx`**

```tsx
import { getPublishedTestimonials } from '@/lib/queries/content'
import { GlassCard } from '@/components/ui/GlassCard'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { Button } from '@/components/ui/Button'
import { CalEmbed } from '@/components/CalEmbed'

export async function Testimonials() {
  const testimonials = await getPublishedTestimonials()

  return (
    <section className="px-5 md:px-10 py-24">
      <SectionHeader eyebrow="What People Say" title="Trusted to Deliver" />

      <div className="mt-12 max-w-[1320px] mx-auto">
        {testimonials.length === 0 ? (
          <GlassCard className="text-center max-w-xl mx-auto">
            <h3 className="text-xl font-semibold text-[var(--text-primary)]">Early-stage and building in public</h3>
            <p className="mt-3 text-[var(--text-secondary)]">
              We&apos;re a new agency focused on shipping real systems before collecting testimonials. Be one of the
              first businesses we partner with.
            </p>
            <CalEmbed>
              <Button className="mt-5">Be one of our first case studies</Button>
            </CalEmbed>
          </GlassCard>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((testimonial) => (
              <GlassCard key={testimonial.id}>
                <p className="text-[var(--text-primary)]">{testimonial.quote}</p>
                <div className="mt-4 border-t border-[var(--border-glass)] pt-4">
                  <p className="font-semibold text-[var(--text-primary)]">{testimonial.clientName}</p>
                  {testimonial.clientRole && (
                    <p className="text-sm text-[var(--text-muted)]">{testimonial.clientRole}</p>
                  )}
                </div>
              </GlassCard>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
```

- [ ] **Step 4: Write `components/sections/Faq.tsx`**

```tsx
import { getPublishedFaqs } from '@/lib/queries/content'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { FaqAccordion } from '@/components/sections/FaqAccordion'

export async function Faq() {
  const faqs = await getPublishedFaqs()

  return (
    <section id="faq" className="px-5 md:px-10 py-24 bg-[var(--bg-secondary)]">
      <SectionHeader eyebrow="FAQ" title="Common Questions" />
      <div className="mt-12 max-w-[760px] mx-auto">
        <FaqAccordion items={faqs} />
      </div>
    </section>
  )
}
```

- [ ] **Step 5: Write `components/sections/FaqAccordion.tsx`** (client component, separated from the async `Faq` Server Component since accordion open/close needs `useState`)

```tsx
'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
import type { Faq } from '@/lib/types'

export function FaqAccordion({ items }: { items: Faq[] }) {
  const [openId, setOpenId] = useState<string | null>(null)

  return (
    <div className="divide-y divide-[var(--border-glass)]">
      {items.map((item) => {
        const isOpen = openId === item.id
        return (
          <div key={item.id}>
            <button
              className="flex w-full items-center justify-between py-5 text-left text-[var(--text-primary)] font-medium"
              onClick={() => setOpenId(isOpen ? null : item.id)}
            >
              {item.question}
              <Plus className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-45' : ''}`} />
            </button>
            {isOpen && <p className="pb-5 text-[var(--text-secondary)]">{item.answer}</p>}
          </div>
        )
      })}
    </div>
  )
}
```

- [ ] **Step 6: Run tests to verify they pass**

Run: `npm test -- components/sections/Testimonials components/sections/Faq`
Expected: PASS

- [ ] **Step 7: Commit**

```bash
git add components/sections/Testimonials.tsx components/sections/Faq.tsx components/sections/FaqAccordion.tsx components/sections/Testimonials.test.tsx components/sections/Faq.test.tsx
git commit -m "feat: add Testimonials and FAQ sections backed by the live CMS"
```

---

### Task 15: FinalCta and Footer

**Files:**
- Create: `components/sections/FinalCta.tsx`, `components/sections/Footer.tsx`
- Test: `components/sections/FinalCta.test.tsx`, `components/sections/Footer.test.tsx`

**Interfaces:**
- Consumes: `Button` (Task 3), `GradientBlob` (Task 5), `CalEmbed` (existing).
- Produces: `<FinalCta>`, `<Footer>` — consumed by `app/page.tsx` (Task 16).

- [ ] **Step 1: Write the failing tests**

```tsx
// components/sections/FinalCta.test.tsx
import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'

vi.mock('@/components/CalEmbed', () => ({
  CalEmbed: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}))

describe('FinalCta', () => {
  it('renders the headline and the booking CTA', async () => {
    const { FinalCta } = await import('./FinalCta')
    render(<FinalCta />)

    expect(screen.getByRole('heading', { name: /Ready to Put AI to Work in Your Business\?/ })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Book Your Free Call' })).toBeInTheDocument()
  })
})
```

```tsx
// components/sections/Footer.test.tsx
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { Footer } from './Footer'

describe('Footer', () => {
  it('renders all 4 columns and the copyright line', () => {
    render(<Footer />)

    expect(screen.getByText('Navigate')).toBeInTheDocument()
    expect(screen.getByText('Services')).toBeInTheDocument()
    expect(screen.getByText('Contact')).toBeInTheDocument()
    expect(screen.getByText(/© 2026 Axonvia/)).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npm test -- components/sections/FinalCta components/sections/Footer`
Expected: FAIL — neither source file exists yet

- [ ] **Step 3: Write `components/sections/FinalCta.tsx`**

```tsx
'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/Button'
import { GradientBlob } from '@/components/ui/GradientBlob'
import { CalEmbed } from '@/components/CalEmbed'
import { fadeUp } from '@/lib/animations'

export function FinalCta() {
  return (
    <section id="final-cta" className="relative px-5 md:px-10 py-32 overflow-hidden">
      <GradientBlob color="cyan" className="w-[600px] h-[600px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={fadeUp}
        className="relative z-10 text-center max-w-2xl mx-auto"
      >
        <h2 className="text-3xl md:text-5xl font-semibold text-[var(--text-primary)]">
          Ready to Put AI to Work in Your Business?
        </h2>
        <p className="mt-4 text-[var(--text-secondary)] text-lg">
          Book a free strategy call — we&apos;ll show you exactly where automation can save you time and grow
          revenue.
        </p>
        <CalEmbed>
          <Button size="large" className="mt-8">
            Book Your Free Call
          </Button>
        </CalEmbed>
        <p className="mt-4 text-xs text-[var(--text-muted)]">No commitment. 20-minute call. Real answers.</p>
      </motion.div>
    </section>
  )
}
```

- [ ] **Step 4: Write `components/sections/Footer.tsx`**

```tsx
import Link from 'next/link'
import { CalEmbed } from '@/components/CalEmbed'
import { Button } from '@/components/ui/Button'

export function Footer() {
  return (
    <footer className="border-t border-[var(--border-glass)] px-5 md:px-10 py-16">
      <div className="max-w-[1320px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-10">
        <div>
          <p className="font-semibold text-[var(--text-primary)]">Axonvia</p>
          <p className="mt-2 text-sm text-[var(--text-muted)]">Intelligence that works for your business.</p>
        </div>

        <div>
          <p className="text-sm font-semibold text-[var(--text-primary)]">Navigate</p>
          <nav className="mt-3 flex flex-col gap-2 text-sm text-[var(--text-secondary)]">
            <Link href="#services">Services</Link>
            <Link href="#how-it-works">How It Works</Link>
            <Link href="#projects">Projects</Link>
            <Link href="#about">About</Link>
            <Link href="#faq">FAQ</Link>
          </nav>
        </div>

        <div>
          <p className="text-sm font-semibold text-[var(--text-primary)]">Services</p>
          <nav className="mt-3 flex flex-col gap-2 text-sm text-[var(--text-secondary)]">
            <Link href="#services">AI Agent Development</Link>
            <Link href="#services">Workflow Automation</Link>
            <Link href="#services">AI Products</Link>
            <Link href="#services">Chatbots &amp; Conversational AI</Link>
            <Link href="#services">Consulting</Link>
          </nav>
        </div>

        <div>
          <p className="text-sm font-semibold text-[var(--text-primary)]">Contact</p>
          <div className="mt-3 flex flex-col gap-2 text-sm text-[var(--text-secondary)]">
            <a href="mailto:hello@axonvia.example">hello@axonvia.example</a>
            <span>Karachi, Pakistan</span>
            <CalEmbed>
              <Button size="default" variant="secondary" className="mt-2 w-fit">
                Book a Call
              </Button>
            </CalEmbed>
          </div>
        </div>
      </div>

      <div className="mt-12 border-t border-[var(--border-glass)] pt-6 max-w-[1320px] mx-auto flex flex-col md:flex-row justify-between gap-2 text-xs text-[var(--text-muted)]">
        <span>© 2026 Axonvia. All rights reserved.</span>
        <div className="flex gap-4">
          <Link href="/privacy">Privacy Policy</Link>
          <Link href="/terms">Terms of Service</Link>
        </div>
      </div>
    </footer>
  )
}
```

- [ ] **Step 5: Run tests to verify they pass**

Run: `npm test -- components/sections/FinalCta components/sections/Footer`
Expected: PASS

- [ ] **Step 6: Commit**

```bash
git add components/sections/FinalCta.tsx components/sections/Footer.tsx components/sections/FinalCta.test.tsx components/sections/Footer.test.tsx
git commit -m "feat: add FinalCta and Footer sections"
```

---

### Task 16: Assemble the page and restyle the existing forms/embed

**Files:**
- Modify: `app/page.tsx`, `components/ContactForm.tsx`, `components/NewsletterForm.tsx`, `components/CalEmbed.tsx`
- Create: `app/privacy/page.tsx`, `app/terms/page.tsx` (placeholder pages, linked from the Footer)

**Interfaces:**
- Consumes: every section component from Tasks 6–15.
- Produces: the assembled `/` route; restyled forms with unchanged behavior/tests.

- [ ] **Step 1: Write `app/page.tsx`**

```tsx
import { Navbar } from '@/components/sections/Navbar'
import { Hero } from '@/components/sections/Hero'
import { Services } from '@/components/sections/Services'
import { HowItWorks } from '@/components/sections/HowItWorks'
import { Projects } from '@/components/sections/Projects'
import { TechStack } from '@/components/sections/TechStack'
import { Process } from '@/components/sections/Process'
import { WhyAxonvia } from '@/components/sections/WhyAxonvia'
import { About } from '@/components/sections/About'
import { Testimonials } from '@/components/sections/Testimonials'
import { Faq } from '@/components/sections/Faq'
import { FinalCta } from '@/components/sections/FinalCta'
import { Footer } from '@/components/sections/Footer'

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Services />
        <HowItWorks />
        <Projects />
        <TechStack />
        <Process />
        <WhyAxonvia />
        <About />
        <Testimonials />
        <Faq />
        <FinalCta />
      </main>
      <Footer />
    </>
  )
}
```

- [ ] **Step 2: Rewrite `app/page.test.tsx`**

The old placeholder-page smoke test no longer fits: `HomePage` now renders `Navbar` and `Footer`, both of which contain the text "Axonvia", so the old singular `getByText(/Axonvia/i)` would fail with a multiple-match error. More importantly, `HomePage`'s JSX uses `<Projects />`, `<Testimonials />`, and `<Faq />` as async-Server-Component children — Next's real RSC renderer resolves these, but plain Vitest/React Testing Library's `render()` cannot (it has no mechanism to await a component function used as a JSX tag). Mock those three section components out for this one composition-level test; their real implementations are already covered by their own per-component tests (Tasks 11 and 14).

```tsx
// app/page.test.tsx
import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'

vi.mock('@/components/sections/Projects', () => ({ Projects: () => <div>Projects stub</div> }))
vi.mock('@/components/sections/Testimonials', () => ({ Testimonials: () => <div>Testimonials stub</div> }))
vi.mock('@/components/sections/Faq', () => ({ Faq: () => <div>Faq stub</div> }))
vi.mock('@/components/CalEmbed', () => ({
  CalEmbed: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}))

describe('HomePage', () => {
  it('renders the Navbar brand, Hero headline, and Footer copyright in order', async () => {
    const HomePage = (await import('./page')).default
    render(<HomePage />)

    expect(screen.getByRole('link', { name: 'Axonvia' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      'We Build AI Agents That Run Your Business'
    )
    expect(screen.getByText(/© 2026 Axonvia/)).toBeInTheDocument()
  })
})
```

Run: `npm test -- app/page.test`
Expected: PASS

- [ ] **Step 3: Restyle `components/ContactForm.tsx`** (behavior and existing tests unchanged — only the JSX markup/classes change)

```tsx
'use client'

import { useState, useTransition } from 'react'
import { submitContactForm } from '@/app/actions/contact'
import { buttonClasses } from '@/components/ui/buttonStyles'

export function ContactForm() {
  const [isPending, startTransition] = useTransition()
  const [result, setResult] = useState<{ success: boolean; error?: string } | null>(null)

  function handleSubmit(formData: FormData) {
    startTransition(async () => {
      const res = await submitContactForm(formData)
      setResult(res)
    })
  }

  const inputClasses =
    'w-full rounded-xl border border-[var(--border-glass)] bg-[var(--bg-card)] px-4 py-3 text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:border-[var(--border-glow)] focus:outline-none'

  return (
    <form action={handleSubmit} className="flex flex-col gap-4">
      <input name="name" placeholder="Name" required className={inputClasses} />
      <input name="email" type="email" placeholder="Email" required className={inputClasses} />
      <input name="company" placeholder="Company" className={inputClasses} />
      <textarea name="message" placeholder="Message" className={inputClasses} rows={4} />
      <button type="submit" disabled={isPending} className={buttonClasses('primary', 'default', 'w-full')}>
        {isPending ? 'Sending…' : 'Send'}
      </button>
      {result?.success && <p data-testid="form-success" className="text-[var(--success)]">Thanks — we&apos;ll be in touch.</p>}
      {result && !result.success && <p data-testid="form-error" className="text-red-400">{result.error}</p>}
    </form>
  )
}
```

- [ ] **Step 4: Restyle `components/NewsletterForm.tsx`** (same pattern)

```tsx
'use client'

import { useState, useTransition } from 'react'
import { subscribeNewsletter } from '@/app/actions/newsletter'
import { buttonClasses } from '@/components/ui/buttonStyles'

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
    <form action={handleSubmit} className="flex flex-col sm:flex-row gap-3">
      <input
        name="email"
        type="email"
        placeholder="Email"
        required
        className="flex-1 rounded-xl border border-[var(--border-glass)] bg-[var(--bg-card)] px-4 py-3 text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:border-[var(--border-glow)] focus:outline-none"
      />
      <button type="submit" disabled={isPending} className={buttonClasses('primary')}>
        {isPending ? 'Subscribing…' : 'Subscribe'}
      </button>
      {result?.success && <p data-testid="newsletter-success" className="text-[var(--success)]">Subscribed — welcome aboard.</p>}
      {result && !result.success && <p data-testid="newsletter-error" className="text-red-400">{result.error}</p>}
    </form>
  )
}
```

- [ ] **Step 5: Restyle `components/CalEmbed.tsx`** (same `data-cal-link`/`data-testid` attributes — only the className changes)

```tsx
'use client'

import { useEffect } from 'react'
import { getCalApi } from '@calcom/embed-react'
import { buttonClasses } from '@/components/ui/buttonStyles'

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
      <a href="mailto:hello@axonvia.example" data-testid="cal-fallback" className={buttonClasses()}>
        {children}
      </a>
    )
  }

  return (
    <button data-cal-link={calLink} data-testid="cal-trigger" className={buttonClasses()}>
      {children}
    </button>
  )
}
```

- [ ] **Step 6: Write the placeholder legal pages**

```tsx
// app/privacy/page.tsx
export default function PrivacyPage() {
  return (
    <main className="px-5 py-24 max-w-2xl mx-auto text-[var(--text-secondary)]">
      <h1 className="text-3xl font-semibold text-[var(--text-primary)]">Privacy Policy</h1>
      <p className="mt-4">This page is a placeholder. Full privacy policy coming soon.</p>
    </main>
  )
}
```

```tsx
// app/terms/page.tsx
export default function TermsPage() {
  return (
    <main className="px-5 py-24 max-w-2xl mx-auto text-[var(--text-secondary)]">
      <h1 className="text-3xl font-semibold text-[var(--text-primary)]">Terms of Service</h1>
      <p className="mt-4">This page is a placeholder. Full terms of service coming soon.</p>
    </main>
  )
}
```

- [ ] **Step 7: Run every existing form/embed test to confirm no regression**

Run: `npm test -- components/ContactForm components/NewsletterForm components/CalEmbed`
Expected: PASS (unchanged — these tests only check behavior, not styling)

- [ ] **Step 8: Run the full test suite**

Run: `npm test`
Expected: all tests pass

- [ ] **Step 9: Run the production build**

Run: `npm run build`
Expected: clean build, `/` is server-rendered (`ƒ`) since Projects/Testimonials/Faq fetch live data

- [ ] **Step 10: Commit**

```bash
git add app/page.tsx app/page.test.tsx app/privacy/page.tsx app/terms/page.tsx components/ContactForm.tsx components/NewsletterForm.tsx components/CalEmbed.tsx
git commit -m "feat: assemble the marketing page and restyle existing forms/embed"
```

---

## Final verification

- [ ] Run the full test suite: `npm test` — expect every test across all 16 tasks to PASS.
- [ ] Run `npm run build` — expect a clean production build.
- [ ] Manual browser check (requires a real browser — not available to the agent executing this plan via curl alone): load `/`, confirm every section renders with real seeded content (RevenueOS in Projects, the 5 FAQs expandable, the testimonials trust-strip fallback), submit the contact form and newsletter form, click a booking CTA and confirm the Cal.com embed (or `mailto:` fallback) opens, resize to mobile width and confirm the Navbar collapses to the hamburger menu.
