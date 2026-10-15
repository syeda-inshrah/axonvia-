import { db } from '@/lib/db'
import { faqs, projects } from '@/lib/db/schema'

const faqRows = [
  {
    question: 'What kind of businesses do you work with?',
    answer:
      'We work across industries — real estate, e-commerce, services, and more. If a process can be automated or an agent can handle it, we can likely help.',
    isPublished: true,
    sortOrder: 0,
  },
  {
    question: 'How long does a typical project take?',
    answer:
      'Most projects range from 2–6 weeks depending on scope, from initial discovery to a live, tested system.',
    isPublished: true,
    sortOrder: 1,
  },
  {
    question: 'Do I need technical knowledge to work with you?',
    answer: 'Not at all. We handle the technical build — you just need to know your business processes.',
    isPublished: true,
    sortOrder: 2,
  },
  {
    question: 'What happens after launch?',
    answer:
      'We offer ongoing support and optimization packages so your system keeps improving post-launch.',
    isPublished: true,
    sortOrder: 3,
  },
  {
    question: "What's the cost of a project?",
    answer:
      'Pricing depends on scope and complexity — we provide a clear, fixed quote after the discovery call, no surprises.',
    isPublished: true,
    sortOrder: 4,
  },
]

const projectRow = {
  name: 'RevenueOS',
  description:
    'A multi-agent AI system for real estate businesses — automatically qualifying leads, recommending properties, and booking appointments without manual follow-up.',
  stats: ['Multi-agent system', 'Real estate lead automation', 'End-to-end booking flow'],
  tags: ['Claude API', 'FastAPI', 'Next.js'],
  imageUrl: null,
  link: null,
  isFeatured: true,
  status: 'live' as const,
  sortOrder: 0,
}

async function main() {
  await db.insert(faqs).values(faqRows)
  await db.insert(projects).values(projectRow)
  console.log(`Seeded ${faqRows.length} FAQs and 1 project.`)
}

main()
