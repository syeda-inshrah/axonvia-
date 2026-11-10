// components/sections/WhoWeHelp.test.tsx
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { WhoWeHelp } from './WhoWeHelp'

describe('WhoWeHelp', () => {
  it('lists the six industries and links Real Estate to its page', () => {
    render(<WhoWeHelp />)
    expect(screen.getAllByRole('listitem')).toHaveLength(6)
    expect(screen.getByRole('link', { name: 'Real Estate' })).toHaveAttribute('href', '/real-estate-ai-automation')
    expect(screen.getAllByRole('link')).toHaveLength(1)
  })
})
