import { SimplePage } from '@/components/layout/SimplePage'
import { Button } from '@/components/ui/Button'

export default function NotFound() {
  return (
    <SimplePage>
      <div className="text-center">
        <span className="font-mono text-sm text-[var(--accent-cyan)]">404</span>
        <h1 className="mt-4 text-4xl md:text-5xl font-semibold text-[var(--text-primary)]">Page not found</h1>
        <p className="mt-4 text-lg text-[var(--text-secondary)]">
          The page you&apos;re looking for doesn&apos;t exist or has moved.
        </p>
        <Button href="/" className="mt-8">
          Back to home
        </Button>
      </div>
    </SimplePage>
  )
}
