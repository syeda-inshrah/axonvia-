'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Logo } from '@/components/ui/Logo'

const navLinks = [
  { href: '#services', label: 'Services' },
  { href: '#projects', label: 'Work' },
  { href: '#how-it-works', label: 'Process' },
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
    handleScroll()
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    if (!menuOpen) return

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') setMenuOpen(false)
    }
    document.addEventListener('keydown', handleKeyDown)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [menuOpen])

  // Over the navy hero the bar is transparent with light text; once scrolled it turns frosted off-white.
  const onDark = !scrolled

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 h-16 md:h-[72px] border-b transition-colors duration-300 ${
        scrolled ? 'bg-[var(--nav-bg)] backdrop-blur-xl border-[var(--rule)]' : 'bg-transparent border-transparent'
      }`}
    >
      <div className="mx-auto flex h-full max-w-[1280px] items-center justify-between px-5 md:px-10">
        <Link
          href="/"
          className={`flex items-center gap-2.5 font-semibold text-lg tracking-[-0.02em] transition-colors duration-300 ${
            onDark ? 'text-white' : 'text-[var(--text-primary)]'
          }`}
        >
          <Logo className="h-7 w-7" />
          Axonvia
        </Link>

        <nav className="hidden md:flex items-center gap-8" aria-label="Primary">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`link-underline text-sm transition-colors duration-300 ${
                onDark ? 'text-[var(--on-ink-soft)] hover:text-white' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className={`hidden md:block ${onDark ? 'on-ink' : ''}`}>
          <Button href="#final-cta" variant={onDark ? 'inverse' : 'primary'}>
            Book a Call
          </Button>
        </div>

        <button
          className={`md:hidden ${onDark ? 'text-white' : 'text-[var(--text-primary)]'}`}
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
                className="h-14 flex items-center border-b border-[var(--rule)] text-[var(--text-primary)] text-xl font-medium"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <Button href="#final-cta" size="large" className="mt-6 w-full">
            Book a Call
          </Button>
        </div>
      )}
    </header>
  )
}
