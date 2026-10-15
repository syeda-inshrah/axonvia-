'use client'

import { motion } from 'framer-motion'
import { Brain, Wrench, GitBranch, UserCheck, Search, PenTool, Code, Rocket } from 'lucide-react'
import { GlassCard } from '@/components/ui/GlassCard'
import { fadeUp, staggerContainer } from '@/lib/animations'

const flowNodes = [
  { icon: Search, label: 'Input (query/trigger)' },
  { icon: Brain, label: 'Agent reasons' },
  { icon: Wrench, label: 'Agent takes action' },
  { icon: GitBranch, label: 'Decision: resolve or escalate' },
  { icon: UserCheck, label: 'Output / human handoff' },
]

const timelineSteps = [
  { icon: Search, number: '01', title: 'Discover', description: 'We map your workflows and identify automation opportunities.' },
  { icon: PenTool, number: '02', title: 'Design', description: 'We architect the agent system — logic, tools, integrations.' },
  { icon: Code, number: '03', title: 'Build & Test', description: 'We develop and rigorously test before anything goes live.' },
  { icon: Rocket, number: '04', title: 'Deploy & Optimize', description: 'We launch, monitor, and continuously improve performance.' },
]

export function HowItWorks() {
  return (
    <section id="how-it-works" className="px-5 md:px-10 py-24">
      <div className="grid grid-cols-1 lg:grid-cols-[40%_60%] gap-10 max-w-[1320px] mx-auto items-center">
        <div>
          <h2 className="text-3xl md:text-4xl font-semibold text-[var(--text-primary)]">
            What Makes It <span className="italic">Agentic</span>?
          </h2>
          <p className="mt-4 text-[var(--text-secondary)] text-lg">
            Unlike a simple chatbot, our AI agents can reason, make decisions, take multi-step actions, and hand off
            to a human when needed — operating like a digital team member, not just a script.
          </p>
        </div>

        <div className="flex flex-wrap gap-4 justify-center">
          {flowNodes.map((node) => (
            <GlassCard key={node.label} className="flex flex-col items-center gap-2 w-36 text-center">
              <node.icon className="h-6 w-6 text-[var(--accent-cyan)]" />
              <span className="text-sm text-[var(--text-secondary)]">{node.label}</span>
            </GlassCard>
          ))}
        </div>
      </div>

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={staggerContainer(0.1)}
        className="mt-20 grid grid-cols-1 md:grid-cols-4 gap-8 max-w-[1320px] mx-auto"
      >
        {timelineSteps.map((step) => (
          <motion.div key={step.number} variants={fadeUp} className="text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-[var(--border-glass)] text-[var(--text-primary)] font-semibold">
              {step.number}
            </div>
            <step.icon className="mx-auto mt-4 h-6 w-6 text-[var(--accent-cyan)]" />
            <h3 className="mt-3 text-lg font-semibold text-[var(--text-primary)]">{step.title}</h3>
            <p className="mt-2 text-[var(--text-secondary)] text-sm">{step.description}</p>
          </motion.div>
        ))}
      </motion.div>
    </section>
  )
}
