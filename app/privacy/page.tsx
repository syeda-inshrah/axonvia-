import type { Metadata } from 'next'
import { ContactEmail, LegalDocument } from '@/components/layout/LegalDocument'
import { siteConfig } from '@/lib/site'

const description = 'What information Axonvia collects through this website, why, and who processes it.'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description,
  alternates: { canonical: '/privacy' },
  openGraph: { title: 'Privacy Policy | Axonvia', description, url: '/privacy' },
}

// Written from what the site actually does: keep it in step with the code when forms, providers or cookies change.
export default function PrivacyPage() {
  return (
    <LegalDocument title="Privacy Policy" updated="28 October 2026">
      <p>
        Axonvia (&ldquo;we&rdquo;, &ldquo;us&rdquo;) is an AI automation agency based in {siteConfig.location}. This
        policy explains what information we collect through {siteConfig.url.replace('https://', '')}, why we collect it
        and who processes it on our behalf. Questions or requests: <ContactEmail />.
      </p>

      <h2>What we collect</h2>
      <ul>
        <li>
          <strong>Contact form:</strong> your name, email address, company (optional), what you&rsquo;d like to
          automate and your message.
        </li>
        <li>
          <strong>Newsletter:</strong> your email address, if you subscribe.
        </li>
        <li>
          <strong>AI assistant:</strong> the messages you type into the chat on this site.
        </li>
        <li>
          <strong>Technical data:</strong> your IP address, used briefly to limit repeated submissions and block spam,
          and the standard request logs our hosting provider keeps.
        </li>
      </ul>

      <h2>How we use it</h2>
      <p>
        We use your details to reply to your enquiry, arrange a call, prepare proposals and, if you subscribed, send
        our newsletter. We do not sell your information or use it for advertising.
      </p>

      <h2>The AI assistant</h2>
      <p>
        Chat messages are sent to Google Gemini to generate the assistant&rsquo;s replies and are handled under
        Google&rsquo;s terms for that service. We do not store chat conversations. Please don&rsquo;t share passwords,
        payment details or other sensitive information in the chat.
      </p>

      <h2>Who processes your information</h2>
      <ul>
        <li>
          <strong>Vercel</strong> hosts the website.
        </li>
        <li>
          <strong>Neon</strong> hosts the database where contact form enquiries and newsletter subscriptions are kept.
        </li>
        <li>
          <strong>Resend</strong> delivers our emails, such as enquiry confirmations and the newsletter.
        </li>
        <li>
          <strong>Google Gemini</strong> generates the AI assistant&rsquo;s replies.
        </li>
      </ul>
      <p>These providers may process information in countries other than yours.</p>

      <h2>Cookies</h2>
      <p>
        This site uses no analytics or advertising cookies. The only cookies are the ones needed to keep our own team
        signed in to the site&rsquo;s admin area.
      </p>

      <h2>How long we keep it</h2>
      <p>
        We keep enquiries for as long as we need them to respond and to manage any work that follows, and newsletter
        subscriptions until you unsubscribe. Every newsletter email has an unsubscribe link.
      </p>

      <h2>Your choices</h2>
      <p>
        You can ask us at any time for a copy of the information we hold about you, or to correct or delete it. Email{' '}
        <ContactEmail /> and we&rsquo;ll respond promptly.
      </p>

      <h2>Changes</h2>
      <p>If we change how we handle information, we&rsquo;ll update this page and the date at the top.</p>
    </LegalDocument>
  )
}
