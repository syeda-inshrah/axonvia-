// components/ui/Badge.test.tsx
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { Badge } from './Badge'

describe('Badge', () => {
  it('renders its children inside a pill', () => {
    render(<Badge>✦ AI Automation Agency</Badge>)
    expect(screen.getByText('✦ AI Automation Agency')).toBeInTheDocument()
  })
})
