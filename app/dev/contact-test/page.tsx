import { ContactForm } from '@/components/ContactForm'
import { NewsletterForm } from '@/components/NewsletterForm'

export default function ContactTestPage() {
  return (
    <main style={{ padding: 40 }}>
      <h1>Dev test harness — remove once the real marketing page is built</h1>
      <section>
        <h2>Contact form</h2>
        <ContactForm />
      </section>
      <section>
        <h2>Newsletter</h2>
        <NewsletterForm />
      </section>
    </main>
  )
}
