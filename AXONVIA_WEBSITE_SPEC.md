# AXONVIA — Website Specification

**Purpose of this document:** This is the single source of truth for building the Axonvia agency website. A developer or AI coding agent should be able to build the entire site from this file alone, with no other context needed. No code is included here — this is blueprint only.

---

## 0. GLOBAL DESIGN SYSTEM

### 0.1 Brand Identity
- **Name:** Axonvia
- **Positioning:** A premium AI automation agency that designs, builds, and deploys intelligent AI agents and automation systems for businesses across industries (not tied to one vertical).
- **Tone:** Confident, intelligent, future-forward, credible — not hype-y, not generic "AI buzzword" marketing.
- **Tagline options (pick one for Hero):** "Intelligence that works for your business." / "We build the agents that run your business." / "Automation, Agentic."

### 0.2 Color Palette
| Token | Hex | Usage |
|---|---|---|
| `--bg-primary` | `#05070D` | Base page background (near-black navy) |
| `--bg-secondary` | `#0A0E1A` | Section alternate background |
| `--bg-card` | `#0F1420` | Card/panel background (glass base) |
| `--accent-cyan` | `#2DD4FF` | Primary glow accent, links, highlights |
| `--accent-purple` | `#9B5CFF` | Secondary glow accent, gradients |
| `--accent-gradient` | `linear-gradient(135deg, #2DD4FF 0%, #9B5CFF 100%)` | Buttons, headline highlights, icon fills |
| `--text-primary` | `#F5F7FA` | Headings, primary text |
| `--text-secondary` | `#9BA3B5` | Body copy, descriptions |
| `--text-muted` | `#5C6478` | Captions, labels, metadata |
| `--border-glass` | `rgba(255,255,255,0.08)` | Card borders |
| `--border-glow` | `rgba(45,212,255,0.35)` | Hover/active border glow |
| `--success` | `#4ADE80` | Status indicators (e.g., "Live" badges) |

### 0.3 Typography
- **Headings font:** "Clash Display" or "Satoshi" (fallback: "General Sans", then system sans) — geometric, modern, slightly futuristic.
- **Body font:** "Inter" — clean, highly legible at small sizes.
- **Monospace (for code snippets / tech tags):** "JetBrains Mono" or "Space Mono".
- **Scale:**
  - H1: 56–72px desktop / 36–40px mobile, weight 600–700, line-height 1.05–1.1
  - H2: 40–48px desktop / 28–32px mobile, weight 600
  - H3: 24–28px, weight 600
  - Body large: 18–20px, weight 400, line-height 1.6
  - Body: 16px, weight 400, line-height 1.6
  - Caption/label: 13–14px, weight 500, uppercase, letter-spacing 0.08em

### 0.4 Buttons
- **Primary CTA:** Filled with `--accent-gradient`, white/near-black text (use dark text `#05070D` for contrast on bright gradient), fully rounded or 12px radius, subtle outer glow (`box-shadow: 0 0 24px rgba(45,212,255,0.35)`), scale-up 1.03 + brighter glow on hover, 200ms ease transition.
- **Secondary CTA:** Transparent background, 1px `--border-glass` border, text in `--text-primary`; on hover border transitions to `--border-glow` and text to `--accent-cyan`.
- **Ghost/text link:** No border, `--accent-cyan` text, underline animates in from left on hover.
- **Shape:** 12–14px border radius standard; pill-shape (999px) only for small tags/badges.
- **Padding:** 14px vertical / 28px horizontal for standard buttons; 18px/36px for large hero CTAs.

### 0.5 Cards
- **Glassmorphism base:** `background: rgba(15,20,32,0.6)`, `backdrop-filter: blur(16px)`, 1px `--border-glass` border, 16–20px border radius.
- **Hover state:** Border transitions to `--border-glow`, subtle lift (`translateY(-4px)`), soft glow shadow in cyan or purple depending on card's accent, 250ms ease.
- **Inner padding:** 32px desktop / 20px mobile.
- **Icon container inside cards:** 48x48px rounded square (12px radius), gradient-tinted background at 12% opacity, icon in `--accent-cyan` or gradient stroke.

### 0.6 Shadows & Depth
- Standard card shadow: `0 8px 32px rgba(0,0,0,0.4)`
- Glow shadow (on hover/active): `0 0 40px rgba(45,212,255,0.2)` or purple equivalent
- No harsh drop shadows anywhere — everything soft, diffused, glow-based rather than realistic-light-based.

### 0.7 Animation Style
- **Library assumption:** Framer Motion (React) or equivalent CSS/JS scroll-trigger library.
- **Entrance animations:** Fade-up (opacity 0→1, translateY 24px→0), staggered by 80–120ms per child element, triggered on scroll-into-view (intersection observer, threshold 0.2).
- **Hover micro-interactions:** All interactive elements (buttons, cards, nav links) respond within 150–250ms ease transitions — no instant snaps.
- **Background ambience:** Slow-moving radial gradient blobs (cyan/purple, 40–60% opacity, heavily blurred ~120px) drifting subtly behind content in hero and section-break areas — creates the "glow" atmosphere without being distracting. Animation duration 15–25s loops, ease-in-out.
- **Scroll effects:** Subtle parallax on hero background blobs (move slower than foreground content); sticky navbar with background blur that intensifies on scroll past 50px; section reveal animations as described above.
- **No:** bouncy/elastic easing, flashy confetti, aggressive auto-playing carousels.

### 0.8 Responsive Breakpoints
- Desktop: ≥1200px (max content width 1280–1320px, centered)
- Tablet: 768–1199px
- Mobile: <768px
- General mobile behavior: multi-column grids collapse to single column; nav collapses to hamburger menu; font sizes scale down per 0.3 above; horizontal padding reduces from 80px (desktop) → 40px (tablet) → 20px (mobile); animations remain but reduce motion distance (12px instead of 24px) for performance.

### 0.9 Overall Page Flow
Navbar (sticky) → Hero → Services → Agentic AI/How It Works → Projects/Portfolio → Technologies/Capabilities → Process → Why Axonvia → About/Founder → Testimonials/Trust → FAQ → Final CTA → Footer.

Each major section alternates between `--bg-primary` and `--bg-secondary` to create subtle visual rhythm without hard dividing lines — use a soft gradient transition (80–120px) between sections instead of a hard color cut.

---

## 1. NAVBAR

**Purpose:** Persistent navigation and brand presence; primary conversion entry point (CTA always visible).

**Structure:**
- **Left:** Axonvia logo (icon + wordmark, light-theme circular logo on dark background — rendered with a subtle glow halo behind it since it's a light logo on dark nav) — clicking returns to top of homepage.
- **Center:** Nav links — `Services` · `How It Works` · `Projects` · `About` · `FAQ` (horizontal, 32px gap, 15px font, `--text-secondary` default / `--text-primary` on hover with underline animation).
- **Right:** Secondary button `Book a Call` (ghost style) + Primary button `Get Started` (gradient CTA).

**Behavior:**
- Fixed/sticky at top, `background: rgba(5,7,13,0.7)`, `backdrop-filter: blur(20px)` — background opacity increases from 0 to 0.7 as user scrolls past 50px (starts fully transparent over hero).
- Bottom 1px hairline border in `--border-glass`, appears only once scrolled.
- Height: 80px desktop, 64px mobile.

**Mobile behavior:**
- Center nav links collapse into a hamburger icon (right side, before/replacing CTA buttons).
- Tapping hamburger opens a full-screen overlay menu: dark background with blur, nav links stacked vertically (large touch targets, 56px height each), both CTA buttons at bottom, close (X) icon top-right. Overlay fades/slides in from top, 300ms.

**Icons/visuals:** Axonvia logo mark, hamburger icon (3-line → X morph animation on open).

---

## 2. HERO SECTION

**Purpose:** Communicate what Axonvia does within 3 seconds, establish premium credibility, drive the primary CTA.

**Layout:** Centered, full-viewport-height (min-height 90vh), vertically centered content, generous top padding to clear navbar.

**Content (exact copy):**
- **Eyebrow label** (small pill badge, top): `✦ AI Automation Agency`
- **H1 (headline):** "We Build AI Agents That Run Your Business" — with "AI Agents" rendered in the accent gradient as a highlighted phrase.
- **Subheadline (body-large, `--text-secondary`, max-width ~620px, centered):** "Axonvia designs, builds, and deploys intelligent automation systems — from lead generation to customer operations — so your business runs on autopilot, not overtime."
- **CTA row (horizontal, centered, 16px gap):**
  - Primary button: `Book a Free Strategy Call`
  - Secondary button: `See Our Work` (scrolls to Projects section)
- **Trust row** (small, below CTAs, `--text-muted`, 13px): "Trusted by businesses automating sales, operations & support" — optionally with 3–4 small greyscale client/partner logo placeholders in a horizontal row.

**Visuals:**
- Background: deep navy/black base with 2–3 large, heavily-blurred radial gradient blobs (one cyan, one purple) positioned asymmetrically (e.g., top-right and bottom-left), slow drifting animation per 0.7 above.
- Optional centerpiece visual below the trust row: an abstract animated illustration representing a "network of AI agents" — glowing nodes connected by thin animated light-trail lines, pulsing softly. Could be rendered as an SVG/canvas animation or a looping video/Lottie.
- Faint grid-line texture overlay (very low opacity, ~4%) across the full hero background for technical/blueprint feel.

**Animations:**
- Eyebrow badge fades in first, then H1 (word-by-word or line fade-up), then subheadline, then CTAs — staggered 100–150ms each on page load (not scroll-triggered, since it's above the fold).
- Background blobs animate continuously (slow drift + scale pulse).

**Responsive/mobile:** H1 drops to 36–40px, stacks to single column, CTA buttons stack full-width on mobile (<480px) or remain side-by-side if space allows (480–768px), trust logos wrap to 2 rows.

---

## 3. SERVICES SECTION

**Purpose:** Clearly list what Axonvia offers as an agency (not product-specific) — the core service menu.

**Section header (centered, above grid):**
- Eyebrow: `What We Do`
- H2: "AI Systems Built Around Your Business"
- Subtext: "From a single automated workflow to a full agentic system — we build what actually moves the needle."

**Layout:** 3-column grid desktop (2-column tablet, 1-column mobile), 24px gap, cards of equal height.

**Service Cards (content for each):**
1. **AI Agent Development** — icon: node/agent icon. "Custom AI agents that handle lead qualification, customer queries, scheduling, and more — trained on your business logic."
2. **Workflow Automation** — icon: flow/arrows icon. "End-to-end automation of repetitive operations — from data entry to multi-step approval chains."
3. **AI-Powered Products** — icon: layered-cube icon. "Full web applications with AI at the core, built and shipped from MVP to production."
4. **Conversational AI & Chatbots** — icon: chat-bubble/spark icon. "Intelligent chat and voice interfaces integrated into WhatsApp, websites, and internal tools."
5. **Data & Integration** — icon: database/link icon. "Connecting your tools, CRMs, and databases into one automated pipeline."
6. **AI Strategy & Consulting** — icon: compass/lightbulb icon. "Helping teams identify where AI delivers real ROI before a single line of code is written."

**Card structure:** icon container (top-left) → service title (H3) → 2-line description (`--text-secondary`) → optional small "Learn more →" ghost link bottom-left, appears on hover.

**Animations:** Cards fade-up on scroll, staggered by column/row position (grid stagger, ~80ms per card). On hover: lift + glow border (cyan for odd cards, purple for even — alternating accent per card for visual variety).

**Mobile:** Single column, full-width cards, stacked with 16px gap.

---

## 4. AGENTIC AI / HOW IT WORKS SECTION

**Purpose:** Demystify "agentic AI" for a non-technical business audience and show the engagement process at a conceptual level.

**Layout:** Two-part section.
**Part A — Concept explainer (left-right split):**
- **Left (40%):** H2: "What Makes It *Agentic*?" + body copy: "Unlike a simple chatbot, our AI agents can reason, make decisions, take multi-step actions, and hand off to a human when needed — operating like a digital team member, not just a script."
- **Right (60%):** Visual diagram — animated flow showing: `Input (query/trigger)` → `Agent reasons` → `Agent takes action (calls tool/API)` → `Decision: resolve or escalate` → `Output/human handoff`. Rendered as a horizontal flowchart with glowing connector lines, each node a small glass card with an icon, animating sequentially (light pulse travels left to right) on scroll-into-view, looping.

**Part B — "How It Works" steps (below, full-width, 4-step horizontal timeline desktop / vertical mobile):**
1. **Discover** — "We map your workflows and identify automation opportunities."
2. **Design** — "We architect the agent system — logic, tools, integrations."
3. **Build & Test** — "We develop and rigorously test before anything goes live."
4. **Deploy & Optimize** — "We launch, monitor, and continuously improve performance."

**Structure for timeline:** Numbered circular nodes (01–04) connected by a horizontal line (vertical on mobile), each node has a short title + 1-line description below/beside it. Line fills progressively (like a progress bar) as user scrolls through the section — connects visually to the idea of a process in motion.

**Icons:** reasoning/brain icon, tool/wrench icon, decision-branch icon, handoff/person icon for Part A nodes; magnifying glass, blueprint, code-brackets, rocket for Part B steps.

**Mobile:** Part A stacks (text above diagram, diagram becomes vertical flow). Part B timeline becomes vertical with connecting line on the left side, numbers in circles, content to the right of each.

---

## 5. PROJECTS / PORTFOLIO SECTION

**Purpose:** Build credibility by showcasing real/example work — flagship project featured prominently.

**Section header:** Eyebrow: `Our Work` · H2: "Systems We've Built"

**Layout:** Featured project (large card, full-width) followed by a 2-column grid of additional/smaller project cards (can be marked "Case Study Coming Soon" if real case studies aren't ready yet).

**Featured Project Card:**
- Large glass card, split layout: left side (45%) = project visual/mockup screenshot or abstract dashboard illustration; right side (55%) = content.
- Content: small label "Featured Project", project name, 2–3 line description, 3–4 result/stat chips (e.g., "Multi-agent system", "Real estate lead automation", "End-to-end booking flow"), tag pills for tech used (e.g., `Claude API` `FastAPI` `Next.js`), a `View Details →` ghost link.
- Example content (using RevenueOS as the flagship): Name: "RevenueOS" / Description: "A multi-agent AI system for real estate businesses — automatically qualifying leads, recommending properties, and booking appointments without manual follow-up."

**Secondary Project Cards (2-column grid):** Smaller cards with the same structure in condensed form — image/visual top, title, 1-line description, tag pills, "View →" link. Use 2–3 placeholder cards if additional case studies aren't ready (label clearly as "Coming Soon" with a subtle locked/dimmed treatment, or simply reduce grid to match actual available projects).

**Animations:** Featured card fades up first; grid cards stagger in below. On hover, project visual zooms slightly (scale 1.05, overflow hidden) while card lifts.

**Mobile:** Featured card stacks (visual on top, content below). Grid becomes single column.

---

## 6. TECHNOLOGIES / CAPABILITIES SECTION

**Purpose:** Signal technical credibility to more technical stakeholders (CTOs, technical founders) without overwhelming non-technical visitors.

**Section header:** Eyebrow: `Our Stack` · H2: "Built on Proven, Modern Technology"

**Layout:** Centered logo/tag cloud — a grid or flex-wrap of technology badges/pills, grouped loosely by category but displayed as one cohesive flowing layout (not rigid categorized lists, to keep it visually light).

**Content (tags/badges to include):** `Claude API` `Agentic AI` `OpenAI` `FastAPI` `Next.js` `React` `Python` `Node.js` `PostgreSQL` `Supabase` `LangChain` `Vector Databases` `REST & Webhooks` `WhatsApp API` — each rendered as a pill/chip: icon (if available) + label, glass background, subtle border, on a soft hover glow.

**Optional sub-layout:** Group into 3 invisible clusters for layout purposes only (AI/Models, Backend/Infra, Frontend/Integration) but don't label them with hard section headers — just let natural spacing group them, OR use 3 small unlabeled columns on desktop that collapse to a single wrapped flow on mobile.

**Animations:** Chips fade in with a light stagger (like a "scatter settling into place" effect — scale from 0.9→1 + fade), subtle continuous float (tiny vertical bob, different phase per chip) for a living, ambient feel.

**Mobile:** Flex-wrap continues to work naturally; chips may reduce font size slightly and padding to fit more per row.

---

## 7. PROCESS SECTION

**Purpose:** Set clear expectations on engagement structure/timeline — reduces buyer uncertainty, feels transparent and professional.

*(Note: If Section 4's "How It Works" already covers process at a high level, this section should go one level deeper into the actual engagement/project process — e.g., contract to delivery — to avoid duplication.)*

**Section header:** Eyebrow: `Our Process` · H2: "From First Call to Live System"

**Layout:** Vertical stepped timeline, left-aligned numbers/icons with a connecting vertical line, content to the right (reverses to centered/simplified on mobile).

**Steps (content):**
1. **Discovery Call** (Week 0) — "We understand your business, bottlenecks, and goals — no obligation, no jargon."
2. **Proposal & Scope** (Week 0–1) — "You receive a clear scope, timeline, and fixed-price or milestone-based quote."
3. **Build Sprint** (Week 1–3, varies by project) — "Our team builds in focused sprints, with regular check-ins and demos."
4. **Testing & Handoff** (Final week) — "Rigorous testing, documentation, and a walkthrough before go-live."
5. **Support & Iteration** (Ongoing) — "Post-launch monitoring, optimization, and support as your needs evolve."

**Visual element per step:** Small numbered icon node (outlined circle, number inside) + optional small supporting icon (calendar, document, code, checkmark, chart) to the right of the number, inside the content block.

**Animations:** Each step fades up individually as scrolled into view; connecting line draws progressively downward (stroke-dashoffset animation) synced to scroll position.

**Mobile:** Line remains on the left (thinner), numbers smaller, text full-width to the right — standard vertical timeline, no layout change needed beyond spacing reduction.

---

## 8. WHY AXONVIA SECTION

**Purpose:** Differentiate from generic AI agencies / freelancers — the "why us" trust-building section.

**Section header:** Eyebrow: `Why Axonvia` · H2: "Not Just Another AI Agency"

**Layout:** Asymmetric 2-column: left column (40%) = short positioning statement; right column (60%) = 2x2 grid of differentiator cards (or a vertical stack on narrower desktop).

**Left column content:** H3-style supporting line: "We don't sell hype — we ship systems that work." + short paragraph: "Every agent we build is tested against real business scenarios, not demos. We stay hands-on from strategy through to post-launch support."

**Right column — Differentiator cards (4 total):**
1. **Built, Not Templated** — "Every system is custom-architected for your workflows — no generic chatbot wrappers."
2. **Full-Stack Capability** — "From AI logic to production-grade web apps — one team, start to finish."
3. **Transparent Process** — "Clear timelines, clear pricing, regular updates — no black box."
4. **Long-Term Partnership** — "We support and iterate on what we build — automation isn't a one-time deploy."

**Card style:** Smaller/lighter cards than Services section (less visual weight, more text-focused) — icon (small, top-left) + bold short title + 1–2 line description, no border glow needed here (keep this section calmer/more confident in tone vs. flashy).

**Animations:** Left column text fades up once; right column cards stagger in as a 2x2 grid (or sequential if stacked).

**Mobile:** Stacks fully vertical — left column text first, then differentiator cards full-width stacked.

---

## 9. ABOUT / FOUNDER SECTION

**Purpose:** Add a human face and story to the brand — builds trust, especially important for a new agency without a long track record.

**Layout:** Two-column split — left (40%) = founder photo/visual; right (60%) = narrative content.

**Left column:**
- Professional founder photo (circular or rounded-square frame, subtle gradient border glow matching the brand accent), positioned with generous surrounding whitespace/glow halo.
- Below photo (optional): small social icon row (LinkedIn, X/Twitter, Instagram) in minimal icon-only style.

**Right column content (exact copy structure):**
- Eyebrow: `About Axonvia`
- H2: "Built by Engineers Who've Shipped Real AI Systems"
- Body paragraph: "Axonvia was founded to close the gap between AI hype and AI that actually works in production. We're a team of engineers and builders who design agentic systems grounded in real business logic — not demos."
- **Founder quote block** (styled distinctly — larger italic text, left border accent in gradient color, or a large quotation mark icon): "We don't just talk about automation — we build it, test it, and stand behind it after launch." — *Founder & CEO, Axonvia*
- Small stat row below (optional, 3 stats in a horizontal row): e.g., `5-person team` · `Multi-agent systems` · `Full-stack delivery`

**Animations:** Photo fades/scales in from one side; text content fades up with stagger on paragraph/quote/stats.

**Mobile:** Stacks — photo centered on top (smaller size), content below, stat row wraps to 2+1 or stacks fully.

---

## 10. TESTIMONIALS / TRUST SECTION

**Purpose:** Social proof. (If real client testimonials aren't yet available, this section should be built to support easy future population, with a graceful fallback design.)

**Section header:** Eyebrow: `What People Say` · H2: "Trusted to Deliver"

**Layout — Option A (if testimonials exist):** Horizontal auto-scrolling or manually-swipeable carousel of testimonial cards, 3 visible at a time on desktop (1 on mobile), each card: quote text, client name, client role/company, optional small avatar or company logo.

**Layout — Option B (fallback, if no testimonials yet):** Replace with a "Trust/Credibility" strip instead — e.g., founder credentials, technologies mastered, or a simple statement section: H3: "Early-stage and building in public" + short honest note + a CTA to "Be one of our first case studies" linking to the contact/booking flow. This avoids fake/empty testimonial cards.

**Card style (if used):** Glass card, large opening-quote icon (faded, background decorative element), quote text in `--text-primary` at body-large size, divider line, then name (bold) + role (muted) below.

**Animations:** Carousel auto-advances every ~5s (pauses on hover/touch), smooth slide transition (not instant jump), dot/line progress indicators below.

**Mobile:** Single card visible at a time, swipeable (touch drag), dot indicators centered below.

---

## 11. FAQ SECTION

**Purpose:** Pre-empt objections and reduce friction before the final CTA.

**Section header:** Eyebrow: `FAQ` · H2: "Common Questions"

**Layout:** Centered, max-width ~760px, accordion list (single column).

**FAQ items (content):**
1. **"What kind of businesses do you work with?"** — "We work across industries — real estate, e-commerce, services, and more. If a process can be automated or an agent can handle it, we can likely help."
2. **"How long does a typical project take?"** — "Most projects range from 2–6 weeks depending on scope, from initial discovery to a live, tested system."
3. **"Do I need technical knowledge to work with you?"** — "Not at all. We handle the technical build — you just need to know your business processes."
4. **"What happens after launch?"** — "We offer ongoing support and optimization packages so your system keeps improving post-launch."
5. **"What's the cost of a project?"** — "Pricing depends on scope and complexity — we provide a clear, fixed quote after the discovery call, no surprises."

**Accordion behavior:** Each item is a row with the question (bold, `--text-primary`) and a `+` icon (right-aligned) that rotates to `×` when expanded; answer text slides/fades open below (height auto-animate, 250–300ms ease); only one item open at a time (or allow multiple — either is acceptable, but single-open is cleaner). Closed items separated by a thin `--border-glass` divider line.

**Animations:** List fades up on scroll-into-view; accordion expand/collapse uses smooth height + opacity transition, chevron/plus icon rotates 45deg on open.

**Mobile:** Same accordion pattern, full-width, slightly reduced padding.

---

## 12. FINAL CTA SECTION

**Purpose:** Last, high-impact conversion push before the footer.

**Layout:** Full-width, centered content, visually distinct — larger glow intensity than other sections, feels like a "destination" moment.

**Content:**
- H2 (large, centered): "Ready to Put AI to Work in Your Business?"
- Subtext: "Book a free strategy call — we'll show you exactly where automation can save you time and grow revenue."
- CTA button (large, primary gradient style): `Book Your Free Call`
- Small reassurance line below button (`--text-muted`, small): "No commitment. 20-minute call. Real answers."

**Visuals:** Intensified version of the hero's background glow treatment — larger, brighter blobs, possibly a centered radial glow directly behind the headline for emphasis. Could include a subtle animated border/frame around the whole section (glass panel containing the full CTA content) to visually bookend the page before the footer.

**Animations:** Section fades/scales in as a whole block on scroll-into-view (slightly more dramatic than other sections — e.g., scale from 0.96→1 + fade); button has the standard hover glow/lift behavior.

**Mobile:** Headline scales down per type scale, button remains full-width or near-full-width for easy tapping, generous vertical padding maintained for impact.

---

## 13. FOOTER

**Purpose:** Secondary navigation, legal/contact info, brand close-out.

**Layout:** 4-column grid desktop (collapses to 2-column then 1-column stacked on smaller screens), full-width, `--bg-primary` or slightly darker, top border in `--border-glass`.

**Columns:**
1. **Brand column:** Axonvia logo (small), 1-line tagline, social icon row (LinkedIn, Instagram, X/Twitter) — minimal icon buttons with hover glow.
2. **Navigate:** Links — Services, How It Works, Projects, About, FAQ.
3. **Services:** Links — AI Agent Development, Workflow Automation, AI Products, Chatbots & Conversational AI, Consulting (links can scroll to Services section anchors).
4. **Contact:** Email address (as a mailto link), optional location ("Karachi, Pakistan"), and the primary CTA button repeated small (`Book a Call`).

**Bottom bar (below the 4 columns, thin divider above it):** Left: `© 2026 Axonvia. All rights reserved.` — Right: small links `Privacy Policy` · `Terms of Service` (can be placeholder pages initially).

**Visuals:** Keep visually quiet/minimal compared to rest of page — no glow blobs here, just clean typography and subtle structure, signaling "end of page."

**Mobile:** Columns stack vertically in order (Brand → Navigate → Services → Contact), each full-width, generous spacing between groups; bottom bar stacks (copyright above, legal links below, centered).

---

## APPENDIX: Build Notes for Developer

- All section backgrounds should blend into each other via gradient transition zones, not hard edges — reinforces the premium, seamless "one continuous experience" feel.
- Reduce motion: respect `prefers-reduced-motion` — disable ambient blob drift and large entrance animations (keep simple opacity fades only) for users with this preference set.
- Performance: background blob animations should be GPU-accelerated (transform/opacity only, avoid animating blur/filter directly if possible — animate a transform on a pre-blurred element instead).
- All CTAs throughout the page should point to the same primary conversion action (booking call / contact) unless explicitly a "View Project" or anchor-scroll link — keep the funnel singular and clear.
- Logo usage: the light-theme circular logo should get a soft glow/halo treatment wherever placed on dark backgrounds (navbar, footer) so it doesn't look flat against the dark theme.
