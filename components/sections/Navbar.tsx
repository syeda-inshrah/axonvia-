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
    window.addEventListener('scroll', handleScroll, { passive: true })
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

  // A floating glass bar: transparent over the hero, then frosted with a hairline and soft shadow once scrolled.
  return (
    <header
      className={`fixed inset-x-3 top-3 z-50 mx-auto h-14 max-w-[1160px] rounded-2xl border transition-[background-color,border-color,box-shadow] duration-500 md:top-4 md:h-16 ${
        scrolled
          ? 'border-white/70 bg-[var(--nav-bg)] shadow-[0_10px_40px_-20px_rgba(10,20,51,0.35)] backdrop-blur-xl'
          : 'border-transparent bg-transparent'
      }`}
    >
      <div className="flex h-full items-center justify-between pl-4 pr-2 md:pl-5">
        <Link href="/" className="flex items-center gap-2.5 text-lg font-semibold tracking-[-0.02em] text-[var(--text-primary)]">
          <Logo className="h-7 w-7" />
          Axonvia
        </Link>

        <nav className="hidden items-center gap-1 md:flex" aria-label="Primary">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="link-underline rounded-lg px-3 py-2 text-sm text-[var(--text-secondary)] transition-colors hover:text-[var(--text-primary)]"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:block">
          <Button href="#final-cta">Book a Call</Button>
        </div>

        <button
          className="flex h-10 w-10 items-center justify-center text-[var(--text-primary)] md:hidden"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {menuOpen && (
        <div className="fixed inset-x-0 bottom-0 top-[4.25rem] bg-[var(--bg-primary)]/95 px-5 py-8 backdrop-blur-xl md:hidden">
          <nav className="flex flex-col gap-2" aria-label="Mobile">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="flex h-14 items-center border-b border-[var(--rule)] text-xl font-medium text-[var(--text-primary)]"
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
