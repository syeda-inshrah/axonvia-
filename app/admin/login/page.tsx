import { LoginForm } from '@/components/admin/LoginForm'
import { Logo } from '@/components/ui/Logo'
import { AmbientBackground } from '@/components/motion/AmbientBackground'
import { NeuralCore } from '@/components/motion/NeuralCore'
import { ScrollReveals } from '@/components/motion/ScrollReveals'

export default function AdminLoginPage() {
  return (
    <main className="relative isolate flex min-h-screen items-center justify-center overflow-hidden px-5 py-16">
      <AmbientBackground />
      <div aria-hidden="true" className="absolute left-1/2 top-1/2 -z-10 aspect-square w-[min(120vw,900px)] -translate-x-1/2 -translate-y-1/2 opacity-70">
        <NeuralCore />
      </div>
      <div
        data-reveal
        className="relative w-full max-w-sm rounded-[2rem] border border-white/80 bg-white/80 p-8 shadow-[var(--shadow-raised)] backdrop-blur-xl"
      >
        <div className="mb-8 flex items-center gap-2.5 font-semibold text-[var(--text-primary)]">
          <Logo className="h-8 w-8" />
          Axonvia <span className="text-sm font-normal text-[var(--text-muted)]">Admin</span>
        </div>
        <h1 className="text-xl font-semibold text-[var(--text-primary)]">Sign in</h1>
        <p className="mb-6 mt-1 text-sm text-[var(--text-secondary)]">For Axonvia team members only.</p>
        <LoginForm />
      </div>
      <ScrollReveals />
    </main>
  )
}
