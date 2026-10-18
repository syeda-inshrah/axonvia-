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
  // Absolute base for links in emails and share previews; set NEXT_PUBLIC_SITE_URL to the production domain.
  url: (process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000').replace(/\/+$/, ''),
}
