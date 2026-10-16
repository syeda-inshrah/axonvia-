// lib/usePrefersReducedMotion.test.tsx
import { render, screen } from '@testing-library/react'
import { renderToString } from 'react-dom/server'
import { describe, it, expect, vi } from 'vitest'
import { usePrefersReducedMotion } from './usePrefersReducedMotion'

vi.mock('framer-motion', async (importOriginal) => ({
  ...(await importOriginal<typeof import('framer-motion')>()),
  useReducedMotion: () => true,
}))

function Probe() {
  return <span data-testid="probe">{String(usePrefersReducedMotion())}</span>
}

describe('usePrefersReducedMotion', () => {
  it('reports no preference during the first render, so client markup matches the server and hydrates cleanly', () => {
    expect(renderToString(<Probe />)).toContain('false')
  })

  it('reports the visitor preference once mounted', () => {
    render(<Probe />)
    expect(screen.getByTestId('probe')).toHaveTextContent('true')
  })
})
