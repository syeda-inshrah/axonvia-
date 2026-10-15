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
})
