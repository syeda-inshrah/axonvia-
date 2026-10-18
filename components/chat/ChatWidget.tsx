'use client'

import { useCallback, useEffect, useRef, useState, type FormEvent } from 'react'
import { MessageCircle, Send, X } from 'lucide-react'
import { Logo } from '@/components/ui/Logo'

type ChatMessage = { role: 'user' | 'assistant'; content: string }

const GREETING =
  'Hi! I can answer questions about Axonvia’s AI automation services and how we work. What would you like to know?'
const SUGGESTIONS = ['What services do you offer?', 'How does your process work?', 'How do I get in touch?']
// Matches the server's limits; older turns are dropped so long chats keep working.
const MAX_HISTORY = 19
const MAX_LENGTH = 1000

export function ChatWidget() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [busy, setBusy] = useState(false)
  const launcherRef = useRef<HTMLButtonElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const endRef = useRef<HTMLDivElement>(null)

  // The launcher is unmounted while the panel is open, so focus returns to it after the panel closes.
  const restoreFocus = useRef(false)
  const close = useCallback(() => {
    restoreFocus.current = true
    setOpen(false)
  }, [])

  useEffect(() => {
    if (!open && restoreFocus.current) {
      restoreFocus.current = false
      launcherRef.current?.focus()
    }
  }, [open])

  useEffect(() => {
    if (!open) return
    inputRef.current?.focus()
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') close()
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [open, close])

  useEffect(() => {
    endRef.current?.scrollIntoView?.({ block: 'end' })
  }, [messages])

  async function send(text: string) {
    const content = text.trim().slice(0, MAX_LENGTH)
    if (!content || busy) return

    // Drop the oldest turns if needed, keeping the first sent message a visitor message.
    const question: ChatMessage = { role: 'user', content }
    let history = [...messages, question].slice(-MAX_HISTORY)
    while (history[0]?.role === 'assistant') history = history.slice(1)

    setMessages([...messages, question, { role: 'assistant', content: '' }])
    setInput('')
    setBusy(true)

    const appendToReply = (chunk: string) =>
      setMessages((current) => {
        const next = [...current]
        const last = next[next.length - 1]
        next[next.length - 1] = { ...last, content: last.content + chunk }
        return next
      })

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ messages: history }),
      })

      if (!response.ok || !response.body) {
        const data = await response.json().catch(() => null)
        appendToReply(data?.error ?? 'Sorry, something went wrong. Please try again or use the contact form below.')
        return
      }

      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      for (;;) {
        const { done, value } = await reader.read()
        if (done) break
        appendToReply(decoder.decode(value, { stream: true }))
      }
    } catch {
      appendToReply('Sorry, I couldn’t connect. Please check your connection or use the contact form below.')
    } finally {
      setBusy(false)
    }
  }

  function onSubmit(event: FormEvent) {
    event.preventDefault()
    void send(input)
  }

  return (
    <>
      {!open && (
        <button
          ref={launcherRef}
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Chat with Axonvia"
          className="fixed bottom-5 right-5 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[image:var(--accent-gradient)] text-[#05070D] shadow-[0_0_24px_rgba(45,212,255,0.35)] transition-transform duration-200 hover:scale-105"
        >
          <MessageCircle aria-hidden="true" className="h-6 w-6" />
        </button>
      )}

      {open && (
        <div
          role="dialog"
          aria-label="Axonvia assistant"
          className="fixed inset-0 z-40 flex flex-col bg-[var(--bg-secondary)] sm:inset-auto sm:bottom-5 sm:right-5 sm:h-[min(600px,calc(100vh-2.5rem))] sm:w-[380px] sm:rounded-2xl sm:border sm:border-[var(--border-glass)] sm:shadow-[0_0_40px_rgba(0,0,0,0.5)]"
        >
          <header className="flex items-center justify-between gap-3 border-b border-[var(--border-glass)] px-4 py-3">
            <div className="flex items-center gap-2.5">
              <Logo className="h-7 w-7" />
              <div>
                <p className="text-sm font-semibold text-[var(--text-primary)]">Axonvia assistant</p>
                <p className="text-xs text-[var(--text-muted)]">AI answers. A person replies to the contact form.</p>
              </div>
            </div>
            <button
              type="button"
              onClick={close}
              aria-label="Close chat"
              className="rounded-lg p-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            >
              <X aria-hidden="true" className="h-5 w-5" />
            </button>
          </header>

          <div className="flex-1 space-y-3 overflow-y-auto px-4 py-4" aria-live="polite">
            <Bubble role="assistant">{GREETING}</Bubble>
            {messages.length === 0 && (
              <div className="flex flex-wrap gap-2 pt-1">
                {SUGGESTIONS.map((suggestion) => (
                  <button
                    key={suggestion}
                    type="button"
                    onClick={() => void send(suggestion)}
                    className="rounded-full border border-[var(--border-glass)] px-3 py-1.5 text-xs text-[var(--text-secondary)] transition-colors hover:border-[var(--border-glow)] hover:text-[var(--accent-cyan)]"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            )}
            {messages.map((message, index) => (
              <Bubble key={index} role={message.role}>
                {message.content || (busy && index === messages.length - 1 ? <TypingDots /> : '')}
              </Bubble>
            ))}
            <div ref={endRef} />
          </div>

          <div className="border-t border-[var(--border-glass)] px-4 pb-4 pt-3">
            <a
              href="#final-cta"
              onClick={() => setOpen(false)}
              className="mb-3 block rounded-lg border border-[var(--border-glass)] py-2 text-center text-sm text-[var(--text-primary)] transition-colors hover:border-[var(--border-glow)] hover:text-[var(--accent-cyan)]"
            >
              Contact us
            </a>
            <form onSubmit={onSubmit} className="flex items-end gap-2">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' && !event.shiftKey) {
                    event.preventDefault()
                    void send(input)
                  }
                }}
                aria-label="Your message"
                placeholder="Ask about our services…"
                rows={1}
                maxLength={MAX_LENGTH}
                className="max-h-32 min-h-[44px] flex-1 resize-none rounded-xl border border-[var(--border-glass)] bg-[var(--bg-card)] px-3 py-2.5 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:border-[var(--border-glow)] focus:outline-none"
              />
              <button
                type="submit"
                disabled={busy}
                aria-label="Send"
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[image:var(--accent-gradient)] text-[#05070D] disabled:opacity-50"
              >
                <Send aria-hidden="true" className="h-4 w-4" />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  )
}

function Bubble({ role, children }: { role: ChatMessage['role']; children: React.ReactNode }) {
  const mine = role === 'user'
  return (
    <div className={`flex ${mine ? 'justify-end' : 'justify-start'}`}>
      <p
        className={`max-w-[85%] whitespace-pre-wrap rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
          mine
            ? 'bg-[rgba(45,212,255,0.12)] text-[var(--text-primary)]'
            : 'border border-[var(--border-glass)] bg-[var(--bg-card)] text-[var(--text-secondary)]'
        }`}
      >
        {children}
      </p>
    </div>
  )
}

function TypingDots() {
  return (
    <span className="inline-flex gap-1" aria-label="Assistant is typing">
      {[0, 1, 2].map((dot) => (
        <span
          key={dot}
          className="h-1.5 w-1.5 animate-pulse rounded-full bg-[var(--text-muted)]"
          style={{ animationDelay: `${dot * 150}ms` }}
        />
      ))}
    </span>
  )
}
