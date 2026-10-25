import Link from 'next/link'
import { BookingButton } from '@/components/ui/BookingButton'
import { NewsletterForm } from '@/components/NewsletterForm'
import { Logo } from '@/components/ui/Logo'
import { FacebookIcon, InstagramIcon, LinkedInIcon, XIcon } from '@/components/ui/SocialIcons'
import { services, siteConfig } from '@/lib/site'

const navigateLinks = [
  { href: '#services', label: 'Services' },
  { href: '#how-it-works', label: 'How it works' },
  { href: '#about', label: 'About' },
  { href: '#faq', label: 'FAQ' },
]

// The same five services as the Services section (lib/site.ts).
const serviceLinks = services.map((service) => service.title)

const socialLinks = [
  { href: siteConfig.social.instagram, label: 'Axonvia on Instagram', Icon: InstagramIcon },
  { href: siteConfig.social.facebook, label: 'Axonvia on Facebook', Icon: FacebookIcon },
  { href: siteConfig.social.x, label: 'Axonvia on X', Icon: XIcon },
  { href: siteConfig.social.linkedin, label: 'Axonvia founder on LinkedIn', Icon: LinkedInIcon },
]

const linkClasses = 'link-underline w-fit hover:text-[var(--text-primary)]'

export function Footer() {
  return (
    <footer className="px-5 md:px-10 pt-8 pb-28">
      <div className="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr] gap-10">
        <div>
          <p className="flex items-center gap-2.5 font-semibold text-[var(--text-primary)]">
            <Logo className="h-6 w-6" />
            {siteConfig.name}
          </p>
          <p className="mt-2 text-sm text-[var(--text-muted)]">{siteConfig.tagline}</p>
          <div className="mt-4 flex gap-3">
            {socialLinks.map(({ href, label, Icon }) => (
              <a
                key={href}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                title={label}
                className="flex h-10 w-10 items-center justify-center rounded-lg border border-[var(--rule-strong)] text-[var(--text-secondary)] transition-colors duration-200 hover:border-[var(--text-primary)] hover:text-[var(--text-primary)]"
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
          <h3 className="mt-6 text-sm font-semibold text-[var(--text-primary)]">Stay in the loop</h3>
          <p className="mt-1 mb-3 text-sm text-[var(--text-muted)]">Occasional updates from Axonvia. No spam.</p>
          <NewsletterForm />
          <p className="mt-3 text-xs text-[var(--text-muted)]">
            Unsubscribe any time. See our{' '}
            <Link href="/privacy" className="link-underline hover:text-[var(--text-primary)]">
              Privacy Policy
            </Link>
            .
          </p>
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
            <span>
              {siteConfig.location}
              <br />
              {siteConfig.serviceArea}
            </span>
            <BookingButton variant="secondary" className="mt-2 w-fit">
              Book a Free Audit
            </BookingButton>
          </div>
        </div>
      </div>

      <div className="mt-14 border-t border-[var(--rule)] pt-6 max-w-[1200px] mx-auto flex flex-col md:flex-row justify-between gap-2 text-xs text-[var(--text-muted)]">
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
