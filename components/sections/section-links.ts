// The homepage sections linked from the navbar and the footer. Off the homepage they lead back to it, and
// "Services" goes to the services hub. A plain module (not 'use client'), so server and client components share it.
const links = [
  { href: '#services', label: 'Services' },
  { href: '#how-it-works', label: 'How it works' },
  { href: '#about', label: 'About' },
  { href: '#faq', label: 'FAQ' },
]

export function sectionLinks(home: boolean) {
  if (home) return links
  return links.map((link) => ({ ...link, href: link.href === '#services' ? '/services' : `/${link.href}` }))
}
