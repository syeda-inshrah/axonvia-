import type { Faq } from '@/lib/types'

// The site's core FAQ, always shown (it doesn't depend on the database). FAQs published from the admin are
// listed after these, and the chat assistant answers from both.
const QA: [string, string][] = [
  [
    'What kind of businesses do you work with?',
    'Service businesses of all sizes, especially clinics, real estate, coaches, agencies, e-commerce and home services, anywhere in the world.',
  ],
  [
    'How much does a project cost?',
    'Every project is scoped individually. After a free 20-minute audit, you receive a clear fixed-price or milestone-based quote before any work begins.',
  ],
  [
    'How long does a typical project take?',
    'Simple automations can be live in days; larger systems usually take 1–4 weeks, delivered in focused sprints with regular demos.',
  ],
  ['Do I need technical knowledge?', 'No. We handle the build, testing and setup, and walk your team through everything.'],
  [
    'Which tools can you connect?',
    'Most modern tools with an API or webhooks: CRMs, Google Workspace, email, calendars, WhatsApp, forms, databases and more.',
  ],
  [
    'Do you work with international clients and time zones?',
    'Yes. We work with clients in the US, UK, UAE and worldwide and schedule calls in your time zone.',
  ],
  ['What happens after launch?', 'We monitor, fix, and improve your system, and offer ongoing support as your needs grow.'],
  [
    'Is my data secure?',
    'We follow security best practices, use your own accounts wherever possible, and only access what the system needs.',
  ],
]

export const CORE_FAQS: Faq[] = QA.map(([question, answer], i) => ({
  id: `core-${i + 1}`,
  question,
  answer,
  isPublished: true,
  sortOrder: i,
}))

/** Core FAQs first, then admin-published ones whose question isn't already covered. */
export function withCoreFaqs(published: Faq[]): Faq[] {
  const seen = new Set(CORE_FAQS.map((faq) => faq.question.trim().toLowerCase()))
  return [...CORE_FAQS, ...published.filter((faq) => !seen.has(faq.question.trim().toLowerCase()))]
}
