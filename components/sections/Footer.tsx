import Link from 'next/link'
import { CalEmbed } from '@/components/CalEmbed'
import { NewsletterForm } from '@/components/NewsletterForm'
import { Logo } from '@/components/ui/Logo'
import { siteConfig } from '@/lib/site'

const navigateLinks = [
  { href: '#services', label: 'Services' },
  { href: '#how-it-works', label: 'How It Works' },
  { href: '#projects', label: 'Projects' },
  { href: '#about', label: 'About' },
  { href: '#faq', label: 'FAQ' },
]

// Mirrors the Services section card titles.
const serviceLinks = [
  'AI Agent Development',
  'Workflow Automation',
  'AI-Powered Products',
  'Conversational AI & Chatbots',
  'Data & Integration',
  'AI Strategy & Consulting',
]

const linkClasses = 'link-underline w-fit hover:text-[var(--text-primary)]'

export function Footer() {
  return (
    <footer className="border-t border-[var(--border-glass)] px-5 md:px-10 py-16">
      <div className="max-w-[1320px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
        <div>
          <p className="flex items-center gap-2.5 font-semibold text-[var(--text-primary)]">
            <Logo className="h-7 w-7" />
            {siteConfig.name}
          </p>
          <p className="mt-2 text-sm text-[var(--text-muted)]">{siteConfig.tagline}</p>
          <h3 className="mt-6 text-sm font-semibold text-[var(--text-primary)]">Stay in the loop</h3>
          <p className="mt-1 mb-3 text-sm text-[var(--text-muted)]">Occasional updates from Axonvia. No spam.</p>
          <NewsletterForm />
        </div>

        <div>
          <h3 className="text-sm font-semibold text-[var(--text-primary)]">Navigate</h3>
          <nav aria-label="Footer" className="mt-3 flex flex-col gap-2 text-sm text-[var(--text-secondary)]">
            {navigateLinks.map((link) => (
              <Link key={link.label} href={link.href} className={linkClasses}>
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-[var(--text-primary)]">Services</h3>
          <nav aria-label="Services" className="mt-3 flex flex-col gap-2 text-sm text-[var(--text-secondary)]">
            {serviceLinks.map((label) => (
              <Link key={label} href="#services" className={linkClasses}>
                {label}
              </Link>
            ))}
          </nav>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-[var(--text-primary)]">Contact</h3>
          <div className="mt-3 flex flex-col gap-2 text-sm text-[var(--text-secondary)]">
            <a href={`mailto:${siteConfig.contactEmail}`} className={linkClasses}>
              {siteConfig.contactEmail}
            </a>
            <span>{siteConfig.location}</span>
            <CalEmbed variant="secondary" className="mt-2 w-fit">
              Book a Call
            </CalEmbed>
          </div>
        </div>
      </div>

      <div className="mt-12 border-t border-[var(--border-glass)] pt-6 max-w-[1320px] mx-auto flex flex-col md:flex-row justify-between gap-2 text-xs text-[var(--text-muted)]">
        <span>© 2026 Axonvia. All rights reserved.</span>
        <div className="flex gap-4">
          <Link href="/privacy" className={linkClasses}>
            Privacy Policy
          </Link>
          <Link href="/terms" className={linkClasses}>
            Terms of Service
          </Link>
        </div>
      </div>
    </footer>
  )
}
