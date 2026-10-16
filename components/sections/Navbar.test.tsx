// components/sections/Navbar.test.tsx
import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { Navbar } from './Navbar'

describe('Navbar', () => {
  it('renders the brand and primary nav links', () => {
    render(<Navbar />)
    expect(screen.getByRole('link', { name: 'Axonvia' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Services' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'FAQ' })).toBeInTheDocument()
  })

  it('underlines desktop nav links with the animated underline', () => {
    render(<Navbar />)
    const primaryNav = screen.getByRole('navigation', { name: 'Primary' })
    for (const link of primaryNav.querySelectorAll('a')) {
      expect(link).toHaveClass('link-underline')
    }
  })

  it('opens and closes the mobile menu', () => {
    render(<Navbar />)
    fireEvent.click(screen.getByRole('button', { name: 'Open menu' }))
    expect(screen.getByRole('navigation', { name: 'Mobile' })).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Close menu' }))
    expect(screen.queryByRole('navigation', { name: 'Mobile' })).not.toBeInTheDocument()
  })

  it('shows the solid background immediately when the page loads already scrolled', () => {
    Object.defineProperty(window, 'scrollY', { configurable: true, value: 400 })
    try {
      render(<Navbar />)
      expect(screen.getByRole('banner')).toHaveClass('backdrop-blur-xl')
    } finally {
      Object.defineProperty(window, 'scrollY', { configurable: true, value: 0 })
    }
  })

  it('closes the mobile menu on Escape', () => {
    render(<Navbar />)
    fireEvent.click(screen.getByRole('button', { name: 'Open menu' }))
    fireEvent.keyDown(document, { key: 'Escape' })
    expect(screen.queryByRole('navigation', { name: 'Mobile' })).not.toBeInTheDocument()
  })

  it('locks page scrolling while the mobile menu is open', () => {
    render(<Navbar />)
    fireEvent.click(screen.getByRole('button', { name: 'Open menu' }))
    expect(document.body.style.overflow).toBe('hidden')

    fireEvent.click(screen.getByRole('button', { name: 'Close menu' }))
    expect(document.body.style.overflow).toBe('')
  })

  it('points every Book a Call link at the booking section, not a missing anchor', () => {
    render(<Navbar />)
    for (const link of screen.getAllByRole('link', { name: 'Book a Call' })) {
      expect(link).toHaveAttribute('href', '#final-cta')
    }
  })
})
