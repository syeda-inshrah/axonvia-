import { Briefcase, Building2, HeartPulse, Megaphone, ShoppingBag, Wrench, type LucideIcon } from 'lucide-react'
import { Section } from '@/components/ui/SectionHeader'

const industries: { label: string; Icon: LucideIcon }[] = [
  { label: 'Clinics & Med Spas', Icon: HeartPulse },
  { label: 'Real Estate', Icon: Building2 },
  { label: 'Coaches & Consultants', Icon: Briefcase },
  { label: 'Agencies', Icon: Megaphone },
  { label: 'E-commerce', Icon: ShoppingBag },
  { label: 'Home Services', Icon: Wrench },
]

export function WhoWeHelp() {
  return (
    <Section labelledBy="who-title">
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-center lg:gap-10">
        <div data-reveal className="lg:col-span-5">
          <h2
            id="who-title"
            className="text-[clamp(2.2rem,4.6vw,3.75rem)] leading-[1.02] font-semibold tracking-[-0.035em] text-[var(--text-primary)]"
          >
            Built for growing service businesses
          </h2>
          <p className="mt-5 max-w-[30rem] text-lg text-[var(--text-secondary)]">
            If your team spends hours on repetitive tasks or leads slip through the cracks, we can help.
          </p>
        </div>
        <ul data-reveal className="grid grid-cols-1 gap-3 min-[420px]:grid-cols-2 lg:col-span-6 lg:col-start-7">
          {industries.map(({ label, Icon }) => (
            <li
              key={label}
              className="flex items-center gap-3 rounded-2xl border border-[var(--rule)] bg-[var(--glass)] px-5 py-4 font-medium text-[var(--text-primary)] shadow-[var(--shadow-card)] backdrop-blur-md"
            >
              <Icon aria-hidden="true" className="h-5 w-5 shrink-0 text-[var(--accent-cyan)]" strokeWidth={1.75} />
              {label}
            </li>
          ))}
        </ul>
      </div>
    </Section>
  )
}
