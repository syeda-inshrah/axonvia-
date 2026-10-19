import { Section } from '@/components/ui/SectionHeader'
import { Stagger, StaggerItem } from '@/components/motion/Reveal'

// Grouped by the layer of a system each tool sits in.
const stack = [
  { layer: 'AI and agents', tools: ['Claude API', 'OpenAI', 'Agentic AI', 'LangChain', 'Vector Databases'] },
  { layer: 'Applications', tools: ['Next.js', 'React', 'Node.js', 'Python', 'FastAPI'] },
  { layer: 'Data', tools: ['PostgreSQL', 'Neon'] },
  { layer: 'Integrations', tools: ['REST & Webhooks', 'WhatsApp API'] },
]

export function TechStack() {
  return (
    <Section labelledBy="stack-title" className="md:py-24!">
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <h2 id="stack-title" className="text-2xl font-semibold text-[var(--text-primary)] md:text-3xl">
            Built on proven, modern technology
          </h2>
          <p className="mt-3 max-w-[22rem] text-[var(--text-secondary)]">
            Chosen per project for reliability and long-term upkeep, not novelty.
          </p>
        </div>
        <Stagger gap={0.06} className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:col-span-8">
          {stack.map((group) => (
            <StaggerItem key={group.layer}>
              <div className="h-full rounded-2xl border border-[var(--rule)] bg-[var(--bg-card)] p-5">
                <h3 className="text-sm text-[var(--text-muted)]">{group.layer}</h3>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {group.tools.map((tool) => (
                    <li
                      key={tool}
                      className="rounded-lg border border-[var(--rule)] bg-[var(--bg-primary)] px-3 py-1.5 text-sm font-medium text-[var(--text-primary)] transition-colors duration-200 hover:border-[var(--border-glow)] hover:text-[var(--accent-cyan)]"
                    >
                      {tool}
                    </li>
                  ))}
                </ul>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </Section>
  )
}
