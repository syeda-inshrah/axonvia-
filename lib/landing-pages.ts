// Content for the solution landing pages (/ai-voice-agents, /ai-chatbots, /real-estate-ai-automation), rendered by
// components/landing/LandingPage.tsx. Copy rules: describe what Axonvia builds, never results, client names,
// deployments, prices, statistics or working hours that haven't been confirmed. The hero conversations are
// labelled as examples on the page.

export type LandingFeature = { title: string; description: string }
export type ExampleLine = { from: 'customer' | 'agent' | 'system'; text: string }

export type LandingPageContent = {
  path: string
  /** Used for the breadcrumb and the Service structured data. */
  name: string
  metaTitle: string
  description: string
  eyebrow: string
  h1: string
  intro: string
  example: { title: string; channel: string; lines: ExampleLine[] }
  features: { title: string; subtitle: string; items: LandingFeature[] }
  steps: { title: string; subtitle: string; items: LandingFeature[] }
  useCases: { title: string; subtitle: string; items: LandingFeature[] }
  faqs: [question: string, answer: string][]
}

export const voiceAgents: LandingPageContent = {
  path: '/ai-voice-agents',
  name: 'AI Voice Agents',
  metaTitle: 'AI Voice Agents for Business | AI Receptionist',
  description:
    'Custom AI voice agents that answer calls, qualify callers, book appointments and hand off to your team. For US and international businesses. Book a free audit.',
  eyebrow: 'AI voice agent development',
  h1: 'AI voice agents that answer calls, book appointments and qualify leads',
  intro:
    'We design and build custom AI voice agents for businesses in the US and worldwide: an AI receptionist that picks up straight away, understands what callers need, takes action in your systems and hands over to a person when it matters.',
  example: {
    title: 'Example call',
    channel: 'Inbound call · AI receptionist',
    lines: [
      { from: 'agent', text: 'Thanks for calling Northside Dental, this is the virtual assistant. How can I help?' },
      { from: 'customer', text: 'Hi, I need to move my cleaning on Thursday to next week.' },
      { from: 'agent', text: 'No problem. I have Tuesday at 10:30 or Wednesday at 2:00. Which works better?' },
      { from: 'customer', text: 'Wednesday at 2, please.' },
      { from: 'system', text: 'Calendar updated · confirmation text sent · note added to patient record' },
    ],
  },
  features: {
    title: 'What your AI voice agent can do',
    subtitle: 'Every agent is built around your call flows, your information and the tools you already use.',
    items: [
      {
        title: 'Answer inbound calls',
        description:
          "Greets callers in your business's name and answers common questions from your own information, with no hold music and no missed calls after hours.",
      },
      {
        title: 'Book and reschedule appointments',
        description: 'Checks your real calendar, offers open slots, books or moves the appointment and sends the confirmation.',
      },
      {
        title: 'Qualify new leads',
        description: 'Asks your qualifying questions in a natural conversation and records the answers in your CRM.',
      },
      {
        title: 'Hand off to a person',
        description: 'Transfers the call to your team, or takes a detailed message, whenever a caller needs a human.',
      },
      {
        title: 'Follow up by phone',
        description:
          'Calls back missed enquiries and sends reminders, set up around consent rules such as the TCPA in the US.',
      },
      {
        title: 'Summaries for every call',
        description: 'Each call is logged with a transcript and a short summary in your CRM, inbox or dashboard.',
      },
    ],
  },
  steps: {
    title: 'How we build your voice agent',
    subtitle: 'From the first call flow to a live phone line, with you approving every step.',
    items: [
      { title: 'Map your calls', description: 'We go through the calls you get, what callers ask for and where they should end up.' },
      {
        title: 'Design the conversation',
        description: 'Greeting, questions, voice and the information the agent may use, written with you and approved by you.',
      },
      {
        title: 'Connect and test',
        description: 'We connect your phone number, calendar and CRM, then test real scenarios and edge cases before launch.',
      },
      {
        title: 'Launch and improve',
        description: 'Once live, we review transcripts with you and refine the agent as your needs change.',
      },
    ],
  },
  useCases: {
    title: 'Where AI voice agents help most',
    subtitle: 'Businesses where the phone is how customers reach you, and every missed call is a missed opportunity.',
    items: [
      { title: 'Clinics & med spas', description: 'Appointment requests, rescheduling, opening hours and new-patient questions.' },
      { title: 'Real estate', description: 'Property enquiries, buyer and renter qualification, and booking showings.' },
      { title: 'Home services', description: 'Job requests, service-area checks and routing urgent calls to the on-call team.' },
      { title: 'Professional services', description: 'New-client intake, call screening and consultation booking.' },
    ],
  },
  faqs: [
    [
      'Will callers know they are speaking to an AI?',
      'We recommend the agent says so at the start of the call, and in some places disclosure is required. You choose the greeting, and we set it up transparently.',
    ],
    [
      'Can it use my existing phone number?',
      'Usually, yes. Calls can be forwarded to the agent all the time, only after hours, or only when your team is busy.',
    ],
    [
      'What happens when the AI cannot help?',
      'It transfers the call to the right person or takes a detailed message, and your team gets the summary straight away.',
    ],
    [
      'Does it sound natural?',
      'Modern AI voices sound natural and respond quickly. You hear test calls and approve the voice and script before anything goes live.',
    ],
    [
      'Can the voice agent make outbound calls?',
      'Yes, for follow-ups and reminders. We design outbound calling around consent requirements such as the TCPA in the US; please confirm the specifics for your business with your legal adviser.',
    ],
    [
      'Which tools can it connect to?',
      'Your phone line, calendars such as Google Calendar or Outlook, and CRMs or databases with an API. We confirm the exact setup in your free audit.',
    ],
    [
      'How long does it take to launch?',
      'It depends on your call flows and integrations. After the free audit you receive a clear scope and timeline before any work begins.',
    ],
  ],
}

export const chatbots: LandingPageContent = {
  path: '/ai-chatbots',
  name: 'AI Chatbots',
  metaTitle: 'AI Chatbots for Business: Website & WhatsApp',
  description:
    'Custom AI chatbots for your website and WhatsApp that answer from your own information, capture and qualify leads, and book appointments. Book a free audit.',
  eyebrow: 'Custom AI chatbot development',
  h1: 'AI chatbots that answer customers, capture leads and book appointments',
  intro:
    'Not a generic chatbot widget. We build AI chatbots that know your business and connect to your tools, so they can actually get things done on your website, WhatsApp and other channels, for businesses in the US and worldwide.',
  example: {
    title: 'Example chat',
    channel: 'Website chat · AI assistant',
    lines: [
      { from: 'customer', text: 'Do you install EV chargers in Plano?' },
      { from: 'agent', text: 'Yes, Plano is in our service area. Is this for a house or a business?' },
      { from: 'customer', text: 'House. How soon could someone come out?' },
      { from: 'agent', text: 'I can book a free site visit. Does Friday morning or Monday afternoon suit you?' },
      { from: 'system', text: 'Lead qualified · visit booked · details sent to the CRM' },
    ],
  },
  features: {
    title: 'What your AI chatbot can do',
    subtitle: 'Built on your information and connected to your systems, with your team in control.',
    items: [
      {
        title: 'Answer from your own information',
        description:
          "Trained on your website, documents and FAQs, and set up to say when it doesn't know rather than guess.",
      },
      {
        title: 'Capture and qualify leads',
        description: 'Asks the right questions, collects contact details and sends qualified leads straight to your CRM.',
      },
      { title: 'Book appointments', description: 'Shows real availability from your calendar and books the visit, call or demo in the chat.' },
      {
        title: 'Website, WhatsApp and more',
        description: 'One assistant across your website chat, WhatsApp and other messaging channels your customers use.',
      },
      { title: 'Hand off to your team', description: 'Passes the conversation to a person, with full context, whenever it should.' },
      {
        title: 'See every conversation',
        description: 'Transcripts and the most common questions in one place, so you know what customers ask.',
      },
    ],
  },
  steps: {
    title: 'How we build your chatbot',
    subtitle: 'A focused build around your customers, with demos along the way.',
    items: [
      { title: 'Define the job', description: 'Which questions it answers, which leads it qualifies and what it should never do.' },
      {
        title: 'Load your knowledge',
        description: 'We prepare your website, documents and FAQs as the information the chatbot answers from.',
      },
      {
        title: 'Connect your tools',
        description: 'Calendar, CRM, WhatsApp and email, so conversations turn into bookings and records automatically.',
      },
      { title: 'Test, launch, improve', description: 'We test real conversations with you, go live, and refine it from the transcripts.' },
    ],
  },
  useCases: {
    title: 'Where AI chatbots help most',
    subtitle: 'Anywhere customers ask the same questions, or enquiries arrive faster than your team can reply.',
    items: [
      { title: 'Customer support', description: 'Instant answers to common questions on your website and WhatsApp, at any hour.' },
      { title: 'Lead qualification', description: 'Every website visitor who shows interest is asked the right questions and routed to sales.' },
      { title: 'Appointment-based businesses', description: 'Clinics, salons and consultants taking bookings straight from the chat.' },
      { title: 'E-commerce', description: 'Product questions, order status and returns, connected to your store data.' },
    ],
  },
  faqs: [
    [
      'How is this different from a chatbot builder?',
      'Builders give you a template. We design the chatbot around your business, connect it to your calendar, CRM and messaging channels, and test it with you before launch.',
    ],
    [
      'Will the chatbot make things up?',
      "It answers from the information you approve and is set up to say when it doesn't know, then offer to connect the customer with your team.",
    ],
    [
      'Which channels can it work on?',
      'Your website, WhatsApp and other messaging channels with an API. We recommend the right mix in your free audit.',
    ],
    [
      'Can my team take over a conversation?',
      'Yes. The chatbot hands off with the full conversation, so customers never have to repeat themselves.',
    ],
    [
      'What about our data?',
      'We use your own accounts wherever possible and only connect what the chatbot needs. See our Privacy Policy for how this website handles data.',
    ],
    [
      'Can it speak other languages?',
      'Modern AI models handle many languages well. We confirm what works for your customers during the audit.',
    ],
    [
      'How long does it take to launch?',
      'It depends on your channels and integrations. After the free audit you receive a clear scope and timeline before any work begins.',
    ],
  ],
}

export const realEstate: LandingPageContent = {
  path: '/real-estate-ai-automation',
  name: 'Real Estate AI Automation',
  metaTitle: 'Real Estate AI Automation for Agents & Brokers',
  description:
    'AI automation for real estate teams: instant lead response, AI follow-up, showing scheduling, and AI chatbots and voice agents connected to your CRM.',
  eyebrow: 'AI automation for real estate',
  h1: 'Real estate AI automation that responds to every lead and keeps follow-up moving',
  intro:
    'For agents, brokerages and property managers in the US and worldwide. We build AI systems that reply to new enquiries right away, qualify buyers and renters, book showings and keep your CRM up to date, so your team spends its time with clients, not on admin.',
  example: {
    title: 'Example lead follow-up',
    channel: 'New portal lead · text follow-up',
    lines: [
      { from: 'agent', text: 'Hi Maria, thanks for asking about 42 Oak Street! Are you looking to buy or rent?' },
      { from: 'customer', text: 'Buy. Is it still available? Could I see it this weekend?' },
      { from: 'agent', text: "It is. I can book you Saturday at 11:00 or Sunday at 2:00 with Jason, the listing agent." },
      { from: 'customer', text: 'Saturday at 11 works.' },
      { from: 'system', text: 'Showing booked · lead updated in the CRM · Jason notified' },
    ],
  },
  features: {
    title: 'What we automate for real estate teams',
    subtitle: 'The repetitive work between a new enquiry and a signed client, handled consistently, every time.',
    items: [
      {
        title: 'Instant lead response',
        description: 'New enquiries from your website, listing portals, ads and social get a personal reply right away.',
      },
      {
        title: 'Buyer and renter qualification',
        description: 'Budget, area, timeline and financing questions asked the same way for everyone, with answers saved to the CRM.',
      },
      { title: 'Showing scheduling', description: "Showings and viewings booked into your agents' real calendars, with reminders." },
      {
        title: 'Long-term follow-up',
        description: "Leads who aren't ready yet get timely, relevant follow-ups instead of being forgotten.",
      },
      {
        title: 'AI voice agent and chatbot',
        description: 'Property calls answered and website or WhatsApp questions handled by an assistant that knows your listings.',
      },
      {
        title: 'CRM kept up to date',
        description: 'Notes, stages and tasks updated automatically in the CRM your team already uses.',
      },
    ],
  },
  steps: {
    title: 'How we set it up',
    subtitle: 'Built around your lead sources, your CRM and the way your team works.',
    items: [
      { title: 'Map your lead flow', description: 'Where leads come from, who handles them and where they currently slip through.' },
      {
        title: 'Write the conversations',
        description: 'Replies and qualification questions in your voice, consistent for every lead, approved by you.',
      },
      {
        title: 'Connect your systems',
        description: 'Lead sources, CRM, calendars and messaging, connected so everything updates on its own.',
      },
      { title: 'Launch and refine', description: 'We go live together, review the conversations and keep improving.' },
    ],
  },
  useCases: {
    title: 'Built for every part of real estate',
    subtitle: 'Wherever enquiries need a fast reply and follow-up needs to be consistent.',
    items: [
      { title: 'Agents and teams', description: 'Fast responses to every buyer and seller lead, even while you are at a showing.' },
      { title: 'Brokerages', description: 'Consistent lead handling and routing across every agent in the office.' },
      { title: 'Property managers', description: 'Rental enquiries, viewing bookings and routine tenant questions handled automatically.' },
      { title: 'New developments', description: 'Enquiry handling and appointment booking for launches and sales centres.' },
    ],
  },
  faqs: [
    [
      'Which CRMs can you connect to?',
      'Most real estate CRMs with an API or email integration, as well as general CRMs such as HubSpot. We confirm your exact setup in the free audit.',
    ],
    [
      'Can it respond to leads from listing portals?',
      'Where a portal delivers leads to your email or CRM, the system can pick them up and respond automatically.',
    ],
    [
      'Will it replace my agents or ISAs?',
      'No. It handles the first response, qualification and scheduling, so your people spend their time on conversations that need them.',
    ],
    [
      'How do you handle fair housing?',
      'Qualification questions are written to be the same for every lead and to stay within fair housing guidelines, and you approve every script before launch.',
    ],
    [
      'Can it send text messages?',
      'Yes, where leads have given consent. We design messaging around rules such as the TCPA in the US; please confirm the specifics with your legal adviser.',
    ],
    [
      'Does it work for property management?',
      'Yes. Rental enquiries, viewing bookings and routine tenant questions can all be automated, with urgent issues routed to your team.',
    ],
    [
      'How long does setup take?',
      'It depends on your lead sources and CRM. After the free audit you receive a clear scope and timeline before any work begins.',
    ],
  ],
}

export const landingPages = [voiceAgents, chatbots, realEstate]
