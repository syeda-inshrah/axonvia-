import { Section } from '@/components/ui/SectionHeader'

// Each tool carries the layer of a system it sits in, shown as a quiet label on its chip.
const stack = [
  { layer: 'AI and agents', tools: ['Claude API', 'OpenAI', 'Agentic AI', 'LangChain', 'Vector Databases'] },
  { layer: 'Applications', tools: ['Next.js', 'React', 'Node.js', 'Python', 'FastAPI'] },
  { layer: 'Data', tools: ['PostgreSQL', 'Neon'] },
  { layer: 'Integrations', tools: ['REST & Webhooks', 'WhatsApp API'] },
]

const chips = stack.flatMap((group) => group.tools.map((tool) => ({ tool, layer: group.layer })))
const rows = [chips.filter((_, i) => i % 2 === 0), chips.filter((_, i) => i % 2 === 1)]

function Chip({ tool, layer }: { tool: string; layer: string }) {
  return (
    <span className="flex shrink-0 items-baseline gap-2.5 whitespace-nowrap rounded-2xl border border-[var(--rule)] bg-[var(--glass)] px-5 py-3 shadow-[var(--shadow-card)] backdrop-blur-md">
      <span className="text-lg font-medium text-[var(--text-primary)]">{tool}</span>
      <span className="text-xs text-[var(--text-muted)]">{layer}</span>
    </span>
  )
}

/**
 * Two rows of the stack slide past in opposite directions (CSS marquee, transform only) and pause on hover.
 * Each row is a real list read once by assistive tech; the second copy that makes the loop seamless is hidden
 * from it. Reduced motion stops the slide.
 */
export function TechStack() {
  return (
    <Section labelledBy="stack-title" className="overflow-hidden">
      <div data-reveal className="max-w-2xl">
        <h2 id="stack-title" className="text-[2rem] leading-[1.08] font-semibold text-[var(--text-primary)] md:text-[2.75rem]">
          Built on proven, modern technology
        </h2>
        <p className="mt-4 text-[var(--text-secondary)]">Chosen per project for reliability and long-term upkeep, not novelty.</p>
      </div>

      <div className="marquee relative -mx-5 mt-14 space-y-4 [mask-image:linear-gradient(90deg,transparent,#000_8%,#000_92%,transparent)] md:-mx-10">
        {rows.map((row, r) => (
          <div key={r} className="flex">
            <div className="marquee-track flex w-max gap-4 pr-4" data-reverse={r === 1 ? '' : undefined} style={{ ['--marquee-duration' as string]: `${46 + r * 8}s` }}>
              <ul className="flex gap-4" aria-label={r === 0 ? 'Technologies we use' : 'More technologies we use'}>
                {row.map((chip) => (
                  <li key={chip.tool}>
                    <Chip {...chip} />
                  </li>
                ))}
              </ul>
              <ul className="flex gap-4" aria-hidden="true">
                {row.map((chip) => (
                  <li key={chip.tool}>
                    <Chip {...chip} />
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </Section>
  )
}
