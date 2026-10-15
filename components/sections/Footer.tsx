import Link from 'next/link'
import { CalEmbed } from '@/components/CalEmbed'

export function Footer() {
  return (
    <footer className="border-t border-[var(--border-glass)] px-5 md:px-10 py-16">
      <div className="max-w-[1320px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-10">
        <div>
          <p className="font-semibold text-[var(--text-primary)]">Axonvia</p>
          <p className="mt-2 text-sm text-[var(--text-muted)]">Intelligence that works for your business.</p>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-[var(--text-primary)]">Navigate</h3>
          <nav className="mt-3 flex flex-col gap-2 text-sm text-[var(--text-secondary)]">
            <Link href="#services">Services</Link>
            <Link href="#how-it-works">How It Works</Link>
            <Link href="#projects">Projects</Link>
            <Link href="#about">About</Link>
            <Link href="#faq">FAQ</Link>
          </nav>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-[var(--text-primary)]">Services</h3>
          <nav className="mt-3 flex flex-col gap-2 text-sm text-[var(--text-secondary)]">
            <Link href="#services">AI Agent Development</Link>
            <Link href="#services">Workflow Automation</Link>
            <Link href="#services">AI Products</Link>
            <Link href="#services">Chatbots &amp; Conversational AI</Link>
            <Link href="#services">Consulting</Link>
          </nav>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-[var(--text-primary)]">Contact</h3>
          <div className="mt-3 flex flex-col gap-2 text-sm text-[var(--text-secondary)]">
            <a href="mailto:hello@axonvia.example">hello@axonvia.example</a>
            <span>Karachi, Pakistan</span>
            <CalEmbed variant="secondary" className="mt-2 w-fit">
              Book a Call
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
