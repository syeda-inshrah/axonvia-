/** The canonical origin, without a trailing slash: metadataBase, canonical and Open Graph URLs, sitemap, robots,
 * JSON-LD and links in emails all come from here. Change this one line when the domain changes. */
export const SITE_URL = 'https://www.axonviaai.com'

/**
 * Where every "Book a Free Automation Audit" button goes. Until a booking page exists it scrolls to the contact
 * form; change this one line to a Cal.com link (https://cal.com/…) and every button opens it in a new tab instead.
 */
export const BOOKING_URL = '#final-cta'

export const siteConfig = {
  name: 'Axonvia',
  tagline: 'AI that works for your business.',
  positioning:
    'We help businesses automate operations, manage leads intelligently, and build AI-powered systems that save time and support growth.',
  // The real inbox. NEXT_PUBLIC_CONTACT_EMAIL overrides it everywhere (e.g. for a domain address later).
  contactEmail: process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'axonvia@gmail.com',
  location: 'Karachi, Pakistan',
  serviceArea: 'Serving clients worldwide',
  social: {
    instagram: 'https://www.instagram.com/axonvia.ai/',
    facebook: 'https://www.facebook.com/Axonvia/',
    x: 'https://x.com/axonvia_ai',
    linkedin: 'https://www.linkedin.com/in/syedainshrahkhatoon/',
  },
  xHandle: '@axonvia_ai',
  url: SITE_URL,
}

/** The five services, used by the Services section, the footer, the assistant's knowledge and structured data. */
export const services = [
  {
    slug: 'process-automation',
    title: 'Business Process Automation',
    description:
      'We automate repetitive tasks, connect your tools, and make your workflows and daily operations run efficiently.',
    examples: ['Repetitive data entry handled automatically', 'Reports and notifications that send themselves', 'Approvals routed to the right person'],
  },
  {
    slug: 'lead-management',
    title: 'Intelligent Lead Management',
    description:
      'Capture leads automatically, organize and qualify them, manage follow-ups, and automate your CRM workflows and appointment scheduling.',
    examples: ['Instant replies to new enquiries', 'Automatic follow-up sequences', 'Calendar booking & reminders'],
  },
  {
    slug: 'ai-agents',
    title: 'AI Agents & Intelligent Assistants',
    description:
      'AI agents that handle business tasks, customer support assistants, and intelligent systems for multi-step workflows, including voice agents when your business needs them.',
    examples: ['Customer support on your website and WhatsApp', 'Agents that complete multi-step tasks', 'Hand-off to your team when a person is needed'],
  },
  {
    slug: 'custom-software',
    title: 'Custom AI-Powered Software',
    description:
      'Web applications, internal dashboards, AI integrations, and custom digital tools built around your requirements.',
    examples: ['Internal dashboards for your team', 'Web apps with AI built in', 'AI added to the tools you already use'],
  },
  {
    slug: 'integration',
    title: 'System Integration & Workflow Design',
    description:
      'We connect your CRM, email, databases, APIs and business tools so information and tasks move smoothly between them.',
    examples: ['CRM, email and calendar kept in sync', 'Databases and APIs connected', 'One workflow instead of copy-paste between tools'],
  },
] as const
