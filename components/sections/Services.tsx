'use client'

import { motion } from 'motion/react'
import { Bot, Workflow, Layers, MessageCircle, Database, Compass } from 'lucide-react'
import { GlassCard } from '@/components/ui/GlassCard'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { rise, staggerContainer } from '@/lib/animations'

const services = [
  {
    icon: Bot,
    title: 'AI Agent Development',
    description:
      'Custom AI agents that handle lead qualification, customer queries, scheduling, and more — trained on your business logic.',
    accent: 'cyan' as const,
  },
  {
    icon: Workflow,
    title: 'Workflow Automation',
    description:
      'End-to-end automation of repetitive operations — from data entry to multi-step approval chains.',
    accent: 'purple' as const,
  },
  {
    icon: Layers,
    title: 'AI-Powered Products',
    description: 'Full web applications with AI at the core, built and shipped from MVP to production.',
    accent: 'cyan' as const,
  },
  {
    icon: MessageCircle,
    title: 'Conversational AI & Chatbots',
    description:
      'Intelligent chat and voice interfaces integrated into WhatsApp, websites, and internal tools.',
    accent: 'purple' as const,
  },
  {
    icon: Database,
    title: 'Data & Integration',
    description: 'Connecting your tools, CRMs, and databases into one automated pipeline.',
    accent: 'cyan' as const,
  },
  {
    icon: Compass,
    title: 'AI Strategy & Consulting',
    description: 'Helping teams identify where AI delivers real ROI before a single line of code is written.',
    accent: 'purple' as const,
  },
]

export function Services() {
  return (
    <section id="services" className="px-5 md:px-10 py-24 section-alt">
      <SectionHeader
        eyebrow="What We Do"
        title="AI Systems Built Around Your Business"
        subtitle="From a single automated workflow to a full agentic system — we build what actually moves the needle."
      />

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={staggerContainer(0.08)}
        className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-[1320px] mx-auto"
      >
        {services.map((service) => (
          <motion.div key={service.title} variants={rise}>
            <GlassCard accent={service.accent} className="h-full">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--accent-cyan)]/10">
                <service.icon className="h-6 w-6 text-[var(--accent-cyan)]" />
              </div>
              <h3 className="mt-5 text-xl font-semibold text-[var(--text-primary)]">{service.title}</h3>
              <p className="mt-2 text-[var(--text-secondary)]">{service.description}</p>
            </GlassCard>
          </motion.div>
        ))}
      </motion.div>
    </section>
  )
}
