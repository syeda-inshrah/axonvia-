// components/ui/Button.test.tsx
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { Button } from './Button'

describe('Button', () => {
  it('renders as a button by default', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument()
  })

  it('renders as a link when href is provided', () => {
    render(<Button href="/projects">See work</Button>)
    expect(screen.getByRole('link', { name: 'See work' })).toHaveAttribute('href', '/projects')
  })

  it('applies secondary variant classes', () => {
    render(<Button variant="secondary">Secondary</Button>)
    expect(screen.getByRole('button')).toHaveClass('border')
  })

  it('gives the ghost variant the animated underline instead of an instant one', () => {
    render(<Button variant="ghost">Ghost</Button>)
    expect(screen.getByRole('button')).toHaveClass('link-underline')
    expect(screen.getByRole('button')).not.toHaveClass('hover:underline')
  })
})
