'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/Button'

const navLinks = [
  { href: '#services', label: 'Services' },
  { href: '#how-it-works', label: 'How It Works' },
  { href: '#projects', label: 'Projects' },
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
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 h-16 md:h-20 transition-colors duration-300 ${
        scrolled ? 'bg-[rgba(5,7,13,0.7)] backdrop-blur-xl border-b border-[var(--border-glass)]' : 'bg-transparent'
      }`}
    >
      <div className="mx-auto flex h-full max-w-[1320px] items-center justify-between px-5 md:px-10">
        <Link href="/" className="text-[var(--text-primary)] font-semibold text-lg">
          Axonvia
        </Link>

        <nav className="hidden md:flex items-center gap-8" aria-label="Primary">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-4">
          <Button href="#final-cta" variant="secondary">
            Book a Call
          </Button>
          <Button href="#final-cta">Get Started</Button>
        </div>

        <button
          className="md:hidden text-[var(--text-primary)]"
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
                className="h-14 flex items-center text-[var(--text-primary)] text-lg"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="mt-6 flex flex-col gap-3">
            <Button href="#final-cta" variant="secondary" className="w-full">
              Book a Call
            </Button>
            <Button href="#final-cta" className="w-full">
              Get Started
            </Button>
          </div>
        </div>
      )}
    </header>
  )
}
