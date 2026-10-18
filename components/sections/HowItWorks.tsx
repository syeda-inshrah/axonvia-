'use client'

import { Fragment, useRef } from 'react'
import { motion, useInView } from 'motion/react'
import { Brain, Wrench, GitBranch, UserCheck, Search, PenTool, Code, Rocket } from 'lucide-react'
import { GlassCard } from '@/components/ui/GlassCard'
import { fadeUp, staggerContainer } from '@/lib/animations'
import { useScrollFill } from '@/lib/useScrollFill'
import { usePrefersReducedMotion } from '@/lib/usePrefersReducedMotion'

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

// One light pulse travels node → connector → node, left to right, then the loop restarts.
const PULSE_STEP = 0.7
const PULSE_CYCLE = flowNodes.length * PULSE_STEP + 1.4

function FlowConnector({ index, pulsing }: { index: number; pulsing: boolean }) {
  const transition = {
    duration: PULSE_STEP,
    delay: index * PULSE_STEP + PULSE_STEP / 2,
    repeat: Infinity,
    repeatDelay: PULSE_CYCLE - PULSE_STEP,
    ease: 'easeInOut' as const,
  }
  const dotClasses =
    'absolute h-2 w-2 rounded-full bg-[var(--accent-cyan)] shadow-[0_0_10px_var(--accent-cyan)]'

  return (
    <li
      aria-hidden="true"
      data-flow-connector
      className="relative h-8 w-px self-center md:h-px md:w-auto md:min-w-4 md:flex-1 bg-[linear-gradient(to_bottom,var(--accent-cyan),var(--accent-purple))] md:bg-[image:var(--accent-gradient)] opacity-80 shadow-[0_0_8px_var(--glow)]"
    >
      {pulsing && (
        <>
          <motion.span
            className={`${dotClasses} hidden md:block top-1/2 -mt-1 -ml-1`}
            initial={{ left: '0%', opacity: 0 }}
            animate={{ left: ['0%', '100%'], opacity: [0, 1, 0] }}
            transition={transition}
          />
          <motion.span
            className={`${dotClasses} md:hidden left-1/2 -ml-1 -mt-1`}
            initial={{ top: '0%', opacity: 0 }}
            animate={{ top: ['0%', '100%'], opacity: [0, 1, 0] }}
            transition={transition}
          />
        </>
      )}
    </li>
  )
}

function AgentFlow() {
  const ref = useRef<HTMLOListElement>(null)
  const inView = useInView(ref, { amount: 0.4 })
  const reduced = usePrefersReducedMotion()
  const pulsing = inView && !reduced

  return (
    <motion.ol
      ref={ref}
      aria-label="How an AI agent works"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      variants={staggerContainer(0.12)}
      className="flex flex-col md:flex-row items-center md:items-stretch justify-center"
    >
      {flowNodes.map((node, i) => (
        <Fragment key={node.label}>
          {i > 0 && <FlowConnector index={i - 1} pulsing={pulsing} />}
          <motion.li variants={fadeUp} className="relative w-44 md:w-28">
            <GlassCard glow={false} className="flex h-full flex-col items-center gap-2 p-4! text-center">
              <node.icon aria-hidden="true" className="h-6 w-6 text-[var(--accent-cyan)]" />
              <span data-flow-node className="text-xs text-[var(--text-secondary)]">
                {node.label}
              </span>
            </GlassCard>
            {pulsing && (
              <motion.span
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 rounded-2xl border border-[var(--accent-cyan)] shadow-[0_0_24px_var(--glow)]"
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 1, 0] }}
                transition={{
                  duration: PULSE_STEP,
                  delay: i * PULSE_STEP,
                  repeat: Infinity,
                  repeatDelay: PULSE_CYCLE - PULSE_STEP,
                }}
              />
            )}
          </motion.li>
        </Fragment>
      ))}
    </motion.ol>
  )
}

function StepsTimeline() {
  const ref = useRef<HTMLDivElement>(null)
  const fill = useScrollFill(ref)
  const scrollLinked = fill !== 1
  const fillClasses = 'h-full w-full bg-[image:var(--accent-gradient)]'

  return (
    <div ref={ref} className="relative mt-20 max-w-[1320px] mx-auto">
      {/* Track runs between the first and last number circles: vertical on mobile, horizontal from md. */}
      <div
        aria-hidden="true"
        className="absolute left-6 top-6 bottom-6 w-px md:left-[calc(12.5%-12px)] md:right-[calc(12.5%-12px)] md:bottom-auto md:h-px md:w-auto bg-[var(--border-glass)]"
      >
        <motion.div
          data-timeline-fill="horizontal"
          data-scroll-linked={scrollLinked}
          className={`${fillClasses} hidden md:block origin-left`}
          style={{ scaleX: fill }}
        />
        <motion.div
          data-timeline-fill="vertical"
          data-scroll-linked={scrollLinked}
          className={`${fillClasses} md:hidden origin-top`}
          style={{ scaleY: fill }}
        />
      </div>

      <motion.ol
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={staggerContainer(0.1)}
        className="relative grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-8"
      >
        {timelineSteps.map((step) => (
          <motion.li key={step.number} variants={fadeUp} className="flex gap-5 md:flex-col md:items-center md:text-center">
            <div className="relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-[var(--border-glow)] bg-[var(--bg-primary)] text-[var(--text-primary)] font-semibold">
              {step.number}
            </div>
            <div>
              <step.icon aria-hidden="true" className="h-6 w-6 text-[var(--accent-cyan)] md:mx-auto md:mt-4" />
              <h3 className="mt-3 text-lg font-semibold text-[var(--text-primary)]">{step.title}</h3>
              <p className="mt-2 text-[var(--text-secondary)] text-sm">{step.description}</p>
            </div>
          </motion.li>
        ))}
      </motion.ol>
    </div>
  )
}

export function HowItWorks() {
  return (
    <section id="how-it-works" className="px-5 md:px-10 py-24">
      <div className="grid grid-cols-1 xl:grid-cols-[40%_1fr] gap-10 max-w-[1320px] mx-auto items-center">
        <div>
          <h2 className="text-3xl md:text-4xl font-semibold text-[var(--text-primary)]">
            What Makes It <span className="italic">Agentic</span>?
          </h2>
          <p className="mt-4 text-[var(--text-secondary)] text-lg">
            Unlike a simple chatbot, our AI agents can reason, make decisions, take multi-step actions, and hand off
            to a human when needed — operating like a digital team member, not just a script.
          </p>
        </div>

        <AgentFlow />
      </div>

      <StepsTimeline />
    </section>
  )
}
