import { Badge } from '@/components/ui/Badge'
import { SectionHeader } from '@/components/ui/SectionHeader'

const chips = [
  'Claude API',
  'Agentic AI',
  'OpenAI',
  'FastAPI',
  'Next.js',
  'React',
  'Python',
  'Node.js',
  'PostgreSQL',
  'Neon',
  'LangChain',
  'Vector Databases',
  'REST & Webhooks',
  'WhatsApp API',
]

export function TechStack() {
  return (
    <section className="px-5 md:px-10 py-24">
      <SectionHeader eyebrow="Our Stack" title="Built on Proven, Modern Technology" />

      <div className="mt-12 flex flex-wrap justify-center gap-3 max-w-[900px] mx-auto">
        {chips.map((chip) => (
          <Badge key={chip} className="normal-case text-sm text-[var(--text-secondary)] px-4 py-2">
            {chip}
          </Badge>
        ))}
      </div>
    </section>
  )
}
