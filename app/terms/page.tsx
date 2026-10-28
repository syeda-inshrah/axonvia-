import type { Metadata } from 'next'
import { ContactEmail, LegalDocument } from '@/components/layout/LegalDocument'

const description = 'The terms for using the Axonvia website and its AI assistant.'

export const metadata: Metadata = {
  title: 'Terms of Service',
  description,
  alternates: { canonical: '/terms' },
  openGraph: { title: 'Terms of Service | Axonvia', description, url: '/terms' },
}

export default function TermsPage() {
  return (
    <LegalDocument title="Terms of Service" updated="28 October 2026">
      <p>
        These terms apply to your use of the Axonvia website, including its contact form, newsletter and AI
        assistant. By using the site you agree to them. Questions: <ContactEmail />.
      </p>

      <h2>Client work</h2>
      <p>
        The information on this site describes our services in general terms and is not an offer. Any project we take
        on is set out in a written proposal or agreement covering scope, timeline, fees and ownership of the work, and
        that document governs the engagement.
      </p>

      <h2>The AI assistant</h2>
      <p>
        The assistant gives automated answers about Axonvia and may occasionally be wrong or incomplete. It is not
        professional, legal or financial advice, and nothing it says is a commitment from us. For anything that
        matters, confirm with us directly.
      </p>

      <h2>Acceptable use</h2>
      <ul>
        <li>Don&rsquo;t send spam or misleading information through the forms or the assistant.</li>
        <li>Don&rsquo;t try to break, overload or gain unauthorised access to the site or its systems.</li>
        <li>Don&rsquo;t use the assistant to generate content unrelated to enquiring about our services.</li>
      </ul>

      <h2>Intellectual property</h2>
      <p>
        The site&rsquo;s text, design and graphics belong to Axonvia. Names and logos of third-party tools mentioned on
        the site belong to their owners and are used only to describe what we work with.
      </p>

      <h2>Links to other sites</h2>
      <p>Links to other websites, including our social profiles, are provided for convenience; we don&rsquo;t control them.</p>

      <h2>No warranty</h2>
      <p>
        We work to keep the site accurate and available, but it is provided as it is, without guarantees that it will
        always be error-free or uninterrupted. To the extent the law allows, we are not liable for losses arising from
        use of the website itself.
      </p>

      <h2>Changes</h2>
      <p>We may update these terms; the date at the top shows the current version.</p>
    </LegalDocument>
  )
}
