/**
 * The canonical origin, without a trailing slash. An explicit NEXT_PUBLIC_SITE_URL wins (set it for a custom
 * domain); otherwise, on Vercel, the project's production domain (VERCEL_PROJECT_PRODUCTION_URL, set
 * automatically at build and run time, host only) so deploys never advertise localhost; otherwise local dev.
 * Server-side only: Vercel's variable isn't exposed to the browser.
 */
function resolveSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL
  const vercelHost = process.env.VERCEL_PROJECT_PRODUCTION_URL
  const url = explicit || (vercelHost ? `https://${vercelHost}` : 'http://localhost:3000')
  return url.replace(/\/+$/, '')
}

export const siteConfig = {
  name: 'Axonvia',
  tagline: 'Intelligence that works for your business.',
  // Placeholder (.example never resolves) until the real inbox exists; set NEXT_PUBLIC_CONTACT_EMAIL to replace it everywhere.
  contactEmail: process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'hello@axonvia.example',
  location: 'Karachi, Pakistan',
  social: {
    instagram: 'https://www.instagram.com/axonvia_automate/',
    linkedin: 'https://www.linkedin.com/in/syedainshrahkhatoon/',
  },
  // Absolute base for links in emails, share previews, robots.txt and the sitemap.
  url: resolveSiteUrl(),
}
