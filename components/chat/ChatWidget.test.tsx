// components/chat/ChatWidget.test.tsx
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { ChatWidget } from './ChatWidget'

function streamedResponse(...chunks: string[]) {
  const encoder = new TextEncoder()
  const body = new ReadableStream<Uint8Array>({
    start(controller) {
      for (const chunk of chunks) controller.enqueue(encoder.encode(chunk))
      controller.close()
    },
  })
  return new Response(body, { status: 200, headers: { 'content-type': 'text/plain; charset=utf-8' } })
}

const fetchMock = vi.fn()

describe('ChatWidget', () => {
  beforeEach(() => {
    fetchMock.mockReset()
    vi.stubGlobal('fetch', fetchMock)
  })
  afterEach(() => vi.unstubAllGlobals())

  function open() {
    render(<ChatWidget />)
    fireEvent.click(screen.getByRole('button', { name: 'Chat with Axonvia' }))
    return screen.getByRole('dialog', { name: 'Axonvia assistant' })
  }

  it('starts closed and opens a labelled chat panel with a greeting and a contact link', () => {
    render(<ChatWidget />)
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Chat with Axonvia' }))
    expect(screen.getByRole('dialog', { name: 'Axonvia assistant' })).toBeInTheDocument()
    expect(screen.getByText(/I can answer questions about Axonvia/)).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Contact us' })).toHaveAttribute('href', '#final-cta')
  })

  it('sends the conversation to /api/chat and shows the streamed reply', async () => {
    fetchMock.mockResolvedValue(streamedResponse('We build ', 'AI agents.'))
    open()

    fireEvent.change(screen.getByLabelText('Your message'), { target: { value: 'What do you do?' } })
    fireEvent.click(screen.getByRole('button', { name: 'Send' }))

    await waitFor(() => expect(screen.getByText('We build AI agents.')).toBeInTheDocument())
    expect(fetchMock).toHaveBeenCalledWith(
      '/api/chat',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ messages: [{ role: 'user', content: 'What do you do?' }] }),
      })
    )
  })

  it('asks a suggested question in one tap', async () => {
    fetchMock.mockResolvedValue(streamedResponse('Six services.'))
    open()
    fireEvent.click(screen.getByRole('button', { name: 'What services do you offer?' }))

    await waitFor(() => expect(screen.getByText('Six services.')).toBeInTheDocument())
    expect(JSON.parse(fetchMock.mock.calls[0][1].body).messages[0].content).toBe('What services do you offer?')
  })

  it('shows the server’s message when chat is unavailable', async () => {
    fetchMock.mockResolvedValue(
      new Response(JSON.stringify({ error: 'Chat is unavailable right now. Please use the contact form.' }), {
        status: 503,
        headers: { 'content-type': 'application/json' },
      })
    )
    open()
    fireEvent.change(screen.getByLabelText('Your message'), { target: { value: 'Hello' } })
    fireEvent.click(screen.getByRole('button', { name: 'Send' }))

    await waitFor(() => expect(screen.getByText(/Chat is unavailable right now/)).toBeInTheDocument())
  })

  it('does not send empty messages', () => {
    open()
    fireEvent.click(screen.getByRole('button', { name: 'Send' }))
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('closes on Escape and on the contact link, returning focus to the chat button', () => {
    open()
    act(() => {
      fireEvent.keyDown(document, { key: 'Escape' })
    })
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Chat with Axonvia' })).toHaveFocus()

    fireEvent.click(screen.getByRole('button', { name: 'Chat with Axonvia' }))
    fireEvent.click(screen.getByRole('link', { name: 'Contact us' }))
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })
})
