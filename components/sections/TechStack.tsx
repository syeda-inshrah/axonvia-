import { Section } from '@/components/ui/SectionHeader'

const tools = [
  'Claude API',
  'OpenAI',
  'n8n',
  'Make',
  'LangChain',
  'Python',
  'Next.js',
  'React',
  'Node.js',
  'FastAPI',
  'PostgreSQL',
  'WhatsApp API',
  'REST & Webhooks',
]

/** One clean row of badges (it wraps onto more lines on narrow screens; nothing scrolls or repeats). */
export function TechStack() {
  return (
    <Section labelledBy="stack-title">
      <div data-reveal className="mx-auto max-w-2xl text-center">
        <h2
          id="stack-title"
          className="text-[clamp(2rem,4.2vw,3.25rem)] leading-[1.05] font-semibold tracking-[-0.035em] text-[var(--text-primary)]"
        >
          Built on proven, modern technology
        </h2>
        <p className="mt-4 text-[var(--text-secondary)]">Chosen per project for reliability and long-term upkeep, not novelty.</p>
      </div>

      <ul data-reveal className="mx-auto mt-12 flex max-w-[1000px] flex-wrap justify-center gap-3" aria-label="Technologies we use">
        {tools.map((tool) => (
          <li
            key={tool}
            className="whitespace-nowrap rounded-xl border border-[var(--rule)] bg-[var(--glass)] px-4 py-2.5 text-[0.9375rem] font-medium text-[var(--text-primary)] shadow-[var(--shadow-card)] backdrop-blur-md"
          >
            {tool}
          </li>
        ))}
      </ul>
    </Section>
  )
}
