// components/sections/HowItWorks.test.tsx
import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { HowItWorks } from './HowItWorks'

const motionPrefs = vi.hoisted(() => ({ reduced: false }))
vi.mock('framer-motion', async (importOriginal) => ({
  ...(await importOriginal<typeof import('framer-motion')>()),
  useReducedMotion: () => motionPrefs.reduced,
}))

describe('HowItWorks', () => {
  it('renders the agentic explainer and the 4-step timeline', () => {
    render(<HowItWorks />)

    expect(screen.getByText(/What Makes It/)).toBeInTheDocument()
    expect(screen.getByText('Discover')).toBeInTheDocument()
    expect(screen.getByText('Design')).toBeInTheDocument()
    expect(screen.getByText('Build & Test')).toBeInTheDocument()
    expect(screen.getByText('Deploy & Optimize')).toBeInTheDocument()
  })

  it('links the 5 agent-flow nodes with 4 glowing connectors, in order', () => {
    render(<HowItWorks />)
    const flow = screen.getByRole('list', { name: 'How an AI agent works' })
    const nodes = flow.querySelectorAll('[data-flow-node]')
    expect(Array.from(nodes, (node) => node.textContent)).toEqual([
      'Input (query/trigger)',
      'Agent reasons',
      'Agent takes action',
      'Decision: resolve or escalate',
      'Output / human handoff',
    ])
    expect(flow.querySelectorAll('[data-flow-connector]')).toHaveLength(4)
  })

  it('draws a timeline line that fills as the visitor scrolls, in both orientations', () => {
    const { container } = render(<HowItWorks />)
    expect(container.querySelector('[data-timeline-fill="horizontal"]')).toBeInTheDocument()
    expect(container.querySelector('[data-timeline-fill="vertical"]')).toBeInTheDocument()
  })

  it('shows the timeline line fully drawn for visitors who prefer reduced motion', () => {
    motionPrefs.reduced = true
    try {
      const { container } = render(<HowItWorks />)
      expect(container.querySelector('[data-timeline-fill="horizontal"]')).toHaveAttribute('data-scroll-linked', 'false')
      expect(container.querySelector('[data-timeline-fill="vertical"]')).toHaveAttribute('data-scroll-linked', 'false')
    } finally {
      motionPrefs.reduced = false
    }
  })
})
