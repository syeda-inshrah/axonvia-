import { Section } from '@/components/ui/SectionHeader'

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
        <div className="grid grid-cols-2 gap-x-8 gap-y-10 md:grid-cols-4 lg:col-span-8">
          {stack.map((group) => (
            <div key={group.layer} className="border-t border-[var(--rule-strong)] pt-4">
              <h3 className="text-sm text-[var(--text-muted)]">{group.layer}</h3>
              <ul className="mt-3 space-y-1.5">
                {group.tools.map((tool) => (
                  <li key={tool} className="font-medium text-[var(--text-primary)]">
                    {tool}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </Section>
  )
}
