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

  it('always shows the eight core questions, even when the database has no FAQs (or is unavailable)', async () => {
    getPublishedFaqs.mockResolvedValue([])
    const { Faq } = await import('./Faq')
    render(await Faq())

    const questions = screen.getAllByRole('button').map((b) => b.textContent)
    expect(questions).toEqual([
      'What kind of businesses do you work with?',
      'How much does a project cost?',
      'How long does a typical project take?',
      'Do I need technical knowledge?',
      'Which tools can you connect?',
      'Do you work with international clients and time zones?',
      'What happens after launch?',
      'Is my data secure?',
    ])
    fireEvent.click(screen.getByRole('button', { name: 'How much does a project cost?' }))
    expect(screen.getByText(/fixed-price or milestone-based quote before any work begins/)).toBeInTheDocument()
  })

  it('lists admin-published FAQs after the core ones, without repeating a core question', async () => {
    getPublishedFaqs.mockResolvedValue([
      { id: 'a', question: 'Is my data secure?', answer: 'duplicate', isPublished: true, sortOrder: 0 },
      { id: 'b', question: 'Do you offer training?', answer: 'Yes.', isPublished: true, sortOrder: 1 },
    ])
    const { Faq } = await import('./Faq')
    render(await Faq())
    const questions = screen.getAllByRole('button').map((b) => b.textContent)
    expect(questions.filter((q) => q === 'Is my data secure?')).toHaveLength(1)
    expect(questions.at(-1)).toBe('Do you offer training?')
  })

  it('points visitors to email or the free audit for anything else', async () => {
    getPublishedFaqs.mockResolvedValue([])
    const { Faq } = await import('./Faq')
    render(await Faq())

    expect(screen.getByRole('link', { name: 'axonvia@gmail.com' })).toHaveAttribute('href', 'mailto:axonvia@gmail.com')
    expect(screen.getByRole('link', { name: 'book a free automation audit' })).toHaveAttribute('href', '#final-cta')
  })
})
