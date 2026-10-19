import { Check, UserRound } from 'lucide-react'

// An illustrative run of the kind of agent Axonvia builds: it reads a request, checks the business's systems,
// acts, and hands off when a decision needs a person. Played step by step by the Hero's GSAP timeline.
export const RUN = [
  { time: '09:14:02', action: 'Message received on WhatsApp', detail: '“Can I move Thursday’s appointment to Friday afternoon?”' },
  { time: '09:14:03', action: 'Found the customer in the CRM', detail: 'Ayesha Khan, three previous bookings' },
  { time: '09:14:04', action: 'Checked the calendar', detail: 'Friday 2:30 pm and 4:00 pm are free' },
  { time: '09:14:06', action: 'Replied with both times', detail: 'In the same WhatsApp conversation' },
  { time: '09:15:40', action: 'Rebooked for Friday, 4:00 pm', detail: 'Calendar updated and confirmation sent' },
  {
    time: '09:15:41',
    action: 'Handed to Sara at the front desk',
    detail: 'A deposit refund needs a person’s approval',
    handoff: true,
  },
]

export function AgentRunLog({ onReplay, canReplay }: { onReplay?: () => void; canReplay: boolean }) {
  return (
    <figure data-intro data-log-panel className="relative">
      <div className="overflow-hidden rounded-xl border border-[var(--rule)] bg-[var(--bg-card)] shadow-[var(--shadow-raised)]">
        <div className="flex items-center justify-between gap-4 border-b border-[var(--rule)] px-5 py-3.5">
          <p className="text-sm font-medium text-[var(--text-primary)]">One request, handled end to end</p>
          {canReplay ? (
            <button
              type="button"
              onClick={onReplay}
              className="link-underline text-sm text-[var(--accent-cyan)]"
            >
              Replay
            </button>
          ) : (
            <span className="flex items-center gap-2 text-sm text-[var(--text-muted)]">
              <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-[var(--accent-cyan)]" />
              Agent run
            </span>
          )}
        </div>

        <div aria-hidden="true" className="h-px bg-[var(--rule)]">
          <div data-log-progress className="h-px origin-left bg-[var(--accent-cyan)]" />
        </div>

        <ol className="divide-y divide-[var(--rule)]">
          {RUN.map((step) => (
            <li
              key={step.time}
              data-log-row
              data-handoff={step.handoff ? '' : undefined}
              className={`grid grid-cols-[4.5rem_1fr_1.25rem] items-start gap-3 px-5 py-3.5 ${
                step.handoff ? 'bg-[var(--tint)]' : ''
              }`}
            >
              <time className="pt-[3px] font-mono text-xs tabular-nums text-[var(--text-muted)]">{step.time}</time>
              <div className="min-w-0">
                <p className="text-[0.9375rem] font-medium leading-snug text-[var(--text-primary)]">{step.action}</p>
                <p className="mt-0.5 text-sm leading-snug text-[var(--text-secondary)]">{step.detail}</p>
              </div>
              <span className="relative mt-0.5 flex h-5 w-5 items-center justify-center">
                <span data-log-pending aria-hidden="true" className="absolute h-2 w-2 rounded-full bg-[var(--accent-cyan)] opacity-0" />
                {step.handoff ? (
                  <UserRound data-log-done aria-label="Handed to a person" className="h-4 w-4 text-[var(--accent-cyan)]" />
                ) : (
                  <Check data-log-done aria-label="Done" className="h-4 w-4 text-[var(--success)]" />
                )}
              </span>
            </li>
          ))}
        </ol>

        <div className="flex items-center gap-6 border-t border-[var(--rule)] px-5 py-3.5 text-sm text-[var(--text-secondary)]">
          <span>6 steps in 1 min 39 s</span>
          <span className="h-4 w-px bg-[var(--rule-strong)]" aria-hidden="true" />
          <span>1 handed to a person</span>
        </div>
      </div>
      <figcaption className="mt-4 max-w-[30rem] text-sm text-[var(--text-muted)]">
        An example of the agents we build: they read the request, check your systems, act, and bring in your team
        when a decision needs a person.
      </figcaption>
    </figure>
  )
}
