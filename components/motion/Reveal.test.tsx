// components/motion/Reveal.test.tsx
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Reveal, Stagger, StaggerItem } from './Reveal'

describe('scroll reveal primitives', () => {
  it('render their content (visible to assistive tech before and after animating)', () => {
    render(
      <Reveal className="wrapper">
        <p>Revealed text</p>
      </Reveal>
    )
    expect(screen.getByText('Revealed text')).toBeInTheDocument()
    expect(screen.getByText('Revealed text').parentElement).toHaveClass('wrapper')
  })

  it('stagger children in a container that keeps its layout classes', () => {
    const { container } = render(
      <Stagger className="grid gap-6" data-testid="group">
        <StaggerItem>One</StaggerItem>
        <StaggerItem>Two</StaggerItem>
      </Stagger>
    )
    expect(screen.getByTestId('group')).toHaveClass('grid', 'gap-6')
    expect(container).toHaveTextContent('OneTwo')
  })
})
