// lib/page-metadata.test.ts
import { describe, expect, it } from 'vitest'
import { pageMetadata } from './page-metadata'

describe('pageMetadata', () => {
  it('gives a subpage its own canonical, title and description on every card, with the share image kept', () => {
    const meta = pageMetadata({ title: 'AI Chatbots', description: 'Chatbots.', path: '/ai-chatbots' })
    expect(meta).toMatchObject({
      title: 'AI Chatbots',
      description: 'Chatbots.',
      alternates: { canonical: '/ai-chatbots' },
      openGraph: { title: 'AI Chatbots | Axonvia', description: 'Chatbots.', url: '/ai-chatbots', images: [{ url: '/opengraph-image' }] },
      twitter: { card: 'summary_large_image', title: 'AI Chatbots | Axonvia', description: 'Chatbots.', images: ['/twitter-image'] },
    })
  })
})
