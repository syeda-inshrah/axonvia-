// components/sections/Faq.test.tsx
import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'

const getPublishedFaqs = vi.fn()
vi.mock('@/lib/queries/content', () => ({ getPublishedFaqs }))

describe('Faq', () => {
  beforeEach(() => getPublishedFaqs.mockReset())

  it('renders each question and reveals its answer when clicked', async () => {
    getPublishedFaqs.mockResolvedValue([
      { id: '1', question: 'What do you do?', answer: 'We build AI agents.', isPublished: true, sortOrder: 0 },
    ])

    const { Faq } = await import('./Faq')
    render(await Faq())

    expect(screen.getByText('What do you do?')).toBeInTheDocument()
    expect(screen.queryByText('We build AI agents.')).not.toBeInTheDocument()

    fireEvent.click(screen.getByText('What do you do?'))
    expect(screen.getByText('We build AI agents.')).toBeInTheDocument()
  })

  it('tells assistive tech whether each question is expanded and which panel it controls', async () => {
    getPublishedFaqs.mockResolvedValue([
      { id: '1', question: 'What do you do?', answer: 'We build AI agents.', isPublished: true, sortOrder: 0 },
    ])

    const { Faq } = await import('./Faq')
    render(await Faq())

    const trigger = screen.getByRole('button', { name: 'What do you do?' })
    expect(trigger).toHaveAttribute('aria-expanded', 'false')

    fireEvent.click(trigger)
    expect(trigger).toHaveAttribute('aria-expanded', 'true')
    const panel = screen.getByRole('region', { name: 'What do you do?' })
    expect(trigger).toHaveAttribute('aria-controls', panel.id)
    expect(panel).toHaveTextContent('We build AI agents.')
  })

  it('points visitors to email or a call when no FAQs are published yet', async () => {
    getPublishedFaqs.mockResolvedValue([])
    const { Faq } = await import('./Faq')
    render(await Faq())

    expect(screen.getByRole('link', { name: 'axonvia@gmail.com' })).toHaveAttribute(
      'href',
      'mailto:axonvia@gmail.com'
    )
    expect(screen.getByRole('link', { name: 'book a call' })).toHaveAttribute('href', '#final-cta')
  })
})
