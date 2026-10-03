# Axonvia Website — Frontend Design

**Date:** 2026-10-04
**Status:** Approved for implementation planning

## 1. Purpose & Scope

This document specifies how to build the real marketing page described in `AXONVIA_WEBSITE_SPEC.md` (the content/visual source of truth — exact copy, layout, and animation behavior for all 13 sections, Navbar, and Footer live there and are not repeated here) on top of the backend already built (see `docs/superpowers/specs/2026-10-02-axonvia-backend-design.md` and its implementation plan).

This spec covers: the design system implementation (CSS tokens, shared UI primitives), the animation system, how each section integrates with the existing backend (forms, booking embed, CMS-backed content), and content seeding. It does not re-specify copy or layout already fully specified in `AXONVIA_WEBSITE_SPEC.md`.

**Deviations from the original spec, decided during brainstorming:**
- **Fonts:** Clash Display/Satoshi (Fontshare) are replaced with **Space Grotesk** (headings), keeping **Inter** (body) and **JetBrains Mono** (tags/code), all loaded via `next/font/google` — no font files to source/self-host. Space Grotesk is the standard close match for "geometric, modern, slightly futuristic."
- **Data sourcing:** Projects, Testimonials, and FAQ sections render from the live CMS (`getPublishedProjects()`, `getPublishedTestimonials()`, `getPublishedFaqs()`) rather than static placeholder arrays, since the admin CRUD for all three already exists.

## 2. Design Tokens (`app/globals.css`)

Every token from spec §0.2–§0.8 becomes a CSS custom property on `:root` (this is a dark-only site, no light-mode variants):

```css
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
```

A repeating-linear-gradient grid-line texture at 4% opacity is applied as a fixed background layer behind the Hero and section-break areas (pure CSS, no SVG asset).

Breakpoints follow spec §0.8 exactly (desktop ≥1200px, tablet 768–1199px, mobile <768px) via Tailwind's default `md`/`lg` scale mapped to those widths in `tailwind.config` — Tailwind v4's CSS-first config sets this via `@theme` in `globals.css` rather than a JS config file.

## 3. File Structure

```
app/
  page.tsx                     — assembles all sections in document order (spec §0.9)
  layout.tsx                   — next/font setup (Space Grotesk, Inter, JetBrains Mono), metadata
  globals.css                  — design tokens, grid texture, Tailwind v4 @theme block

components/sections/
  Navbar.tsx
  Hero.tsx
  Services.tsx
  HowItWorks.tsx               — spec §4 Part A (concept explainer) + Part B (4-step timeline)
  Projects.tsx                 — Server Component, getPublishedProjects()
  TechStack.tsx
  Process.tsx                  — spec §7 engagement timeline (distinct from HowItWorks Part B)
  WhyAxonvia.tsx
  About.tsx
  Testimonials.tsx             — Server Component, getPublishedTestimonials(), Option A/B fallback
  Faq.tsx                      — Server Component, getPublishedFaqs()
  FinalCta.tsx
  Footer.tsx

components/ui/
  Button.tsx                   — primary/secondary/ghost variants (spec §0.4)
  GlassCard.tsx                 — spec §0.5
  SectionHeader.tsx             — eyebrow + H2 + subtext, used by every section
  Badge.tsx                     — pill eyebrow badge
  GradientBlob.tsx              — ambient drifting background glow (spec §0.7)

components/ (existing, unchanged logic — only restyled to use the new Button/design tokens)
  ContactForm.tsx, NewsletterForm.tsx, CalEmbed.tsx

lib/
  animations.ts                 — shared Framer Motion variants: fadeUp, staggerContainer
  queries/content.ts            — existing, unchanged

scripts/
  seed-content.ts               — one-off: inserts the 5 FAQ rows + the RevenueOS example project
```

## 4. Shared UI Primitives

- **`Button`**: `variant: 'primary' | 'secondary' | 'ghost'`, `size: 'default' | 'large'`. Primary uses `--accent-gradient` background with the glow box-shadow and hover scale from spec §0.4; secondary and ghost per the same section. Used for every CTA across the page, including wrapping `CalEmbed`'s trigger and the form submit buttons.
- **`GlassCard`**: the glassmorphism base (background blur, border, hover lift+glow) from spec §0.5, parameterized by an `accent: 'cyan' | 'purple'` prop for the alternating glow colors spec calls for (e.g. Services cards).
- **`SectionHeader`**: `{ eyebrow, title, subtitle? }` — renders the eyebrow pill, H2 (with optional gradient-highlighted phrase via a `highlight` prop), and subtext paragraph pattern repeated at the top of every major section.
- **`Badge`**: small pill badge, used for the Hero eyebrow and tech-stack chips.
- **`GradientBlob`**: one absolutely-positioned, heavily-blurred radial-gradient div with a CSS `@keyframes` drift+scale-pulse animation (15–25s loop per spec §0.7), `color: 'cyan' | 'purple'` and `className` for positioning. Animates `transform` only, never `filter`, per the spec's performance note — the blur is baked into the element itself via a pre-blurred pseudo-element, not animated live.

## 5. Animation System (`lib/animations.ts`)

```ts
export const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
}

export const staggerContainer = (staggerDelay = 0.1) => ({
  hidden: {},
  visible: { transition: { staggerChildren: staggerDelay } },
})
```

Every section wraps its reveal-on-scroll content in `motion.div` with `variants={fadeUp}` (or a staggered parent + `fadeUp` children), `initial="hidden"`, `whileInView="visible"`, `viewport={{ once: true, amount: 0.2 }}`. A single `useReducedMotion()` check lives in a small `MotionSafeProvider` wrapper used once in `layout.tsx`; when true, `GradientBlob`'s CSS animation is disabled via a data attribute and Framer Motion variants fall back to a plain opacity fade with no `y` offset, per spec's Appendix note.

The Hero's "network of agents" visual (spec §2) is an inline SVG: 5–6 circles (nodes) at fixed positions connected by thin `<line>` elements, each node's `opacity` pulsing via a Framer Motion `animate` loop with staggered delays, and each connecting line animating `stroke-dashoffset` to simulate a traveling light pulse — matches the spec's description without needing a video/Lottie asset.

The Agentic-AI flow diagram (spec §4 Part A) and the Process timeline's progressive line-fill (spec §7) both use `whileInView`-triggered sequential animations on their node children, with the connecting line's `stroke-dashoffset` driven by a `useScroll`-based `scaleX` transform for the Process section's "fills as you scroll" behavior specifically (the one piece of real scroll-linked, not just scroll-triggered, animation on the page).

## 6. Section-by-Section Integration Notes

Only implementation details not already in `AXONVIA_WEBSITE_SPEC.md` are noted here; copy and layout follow the spec exactly.

| Section | Data source | Reuses |
|---|---|---|
| Navbar | static | `Button` (×2), scroll-position state for background-opacity transition |
| Hero | static | `Button` (×2) — primary wraps `CalEmbed`, secondary scroll-links to Projects; `Badge`; inline SVG network visual |
| Services | static (6 cards, spec §3) | `GlassCard`, `SectionHeader` |
| HowItWorks | static | `GlassCard` for flow nodes and timeline steps |
| Projects | **live** — `getPublishedProjects()` | `GlassCard`; the first `isFeatured` live project (falling back to the first live project) renders as the Featured Project card; any *remaining* live projects render as the secondary grid. Per spec §5's stated alternative ("reduce grid to match actual available projects"), the secondary grid is simply omitted when there are no remaining projects — no fabricated "Coming Soon" placeholder cards. If there are zero live projects at all, the section renders only its header with a plain "Projects coming soon" line in place of the featured card. |
| TechStack | static (chip list, spec §6) | `Badge` |
| Process | static (5 steps, spec §7) | `SectionHeader`; scroll-linked line fill per §5 above |
| WhyAxonvia | static | `GlassCard` (lighter variant, no glow, per spec §8) |
| About | static | founder avatar is a placeholder: a circular div with `--accent-gradient` ring and no photo, per spec §9's visual description minus the actual photo asset |
| Testimonials | **live** — `getPublishedTestimonials()` | Option A carousel of `GlassCard`s when ≥1 published testimonial exists; Option B trust-strip fallback (spec §10) when the list is empty — expected at launch, since none are seeded |
| Faq | **live** — `getPublishedFaqs()` | accordion built from spec's interaction pattern; seeded with the 5 real FAQ entries, so no empty state in practice |
| FinalCta | static | `Button` (large), wraps `CalEmbed` |
| Footer | static | plain links; Contact column's email is a `mailto:` link, "Book a Call" wraps `CalEmbed` |

`ContactForm` and `NewsletterForm` (already functional) are restyled in place to use `Button` for their submit controls and the design tokens for input styling — no behavior changes.

## 7. Content Seeding (`scripts/seed-content.ts`)

Run once via `npx tsx scripts/seed-content.ts` against the live Neon database:
- Inserts the 5 FAQ rows with the exact question/answer text from spec §11, `isPublished: true`, sequential `sortOrder`.
- Inserts one `projects` row for RevenueOS with the exact description/stats/tags from spec §5's example, `status: 'live'`, `isFeatured: true`.
- Does not insert any testimonials — the empty state (Option B fallback) is the intended launch state per spec §10.

## 8. Responsive & Accessibility

- Tailwind's responsive utilities implement the breakpoint behavior from spec §0.8 (grid collapse, hamburger nav, padding/font scale) directly in each section component — no separate mobile components.
- `prefers-reduced-motion` is respected globally per §5 above (also disables the Process section's scroll-linked line fill, replaced by an immediately-filled line).
- All interactive elements (buttons, accordion triggers, nav links) get visible focus states (not explicitly specified in the visual spec, but required for keyboard accessibility) using `--border-glow` as the focus ring color to stay on-brand.
