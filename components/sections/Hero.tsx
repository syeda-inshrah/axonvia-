'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { CalEmbed } from '@/components/CalEmbed'
import { GradientBlob } from '@/components/ui/GradientBlob'
import { fadeUp, staggerContainer } from '@/lib/animations'

const NODES = [
  { x: 60, y: 60 },
  { x: 220, y: 30 },
  { x: 380, y: 70 },
  { x: 140, y: 150 },
  { x: 320, y: 160 },
  { x: 220, y: 220 },
]
const EDGES: [number, number][] = [
  [0, 1],
  [1, 2],
  [0, 3],
  [1, 4],
  [3, 5],
  [4, 5],
  [1, 3],
]

function HeroNetworkVisual() {
  return (
    <svg viewBox="0 0 440 260" className="relative z-10 mt-12 w-full max-w-md opacity-70" aria-hidden="true">
      {EDGES.map(([from, to], i) => (
        <motion.line
          key={i}
          x1={NODES[from].x}
          y1={NODES[from].y}
          x2={NODES[to].x}
          y2={NODES[to].y}
          stroke="var(--accent-cyan)"
          strokeWidth={1}
          strokeDasharray="4 4"
          animate={{ strokeDashoffset: [0, -16] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear', delay: i * 0.2 }}
        />
      ))}
      {NODES.map((node, i) => (
        <motion.circle
          key={i}
          cx={node.x}
          cy={node.y}
          r={6}
          fill="var(--accent-cyan)"
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 2.5, repeat: Infinity, delay: i * 0.3 }}
        />
      ))}
    </svg>
  )
}

export function Hero() {
  return (
    <section className="relative min-h-[90vh] flex flex-col items-center justify-center overflow-hidden px-5 pt-24 grid-texture">
      <GradientBlob color="cyan" className="w-[480px] h-[480px] -top-20 -right-20" />
      <GradientBlob color="purple" className="w-[480px] h-[480px] bottom-0 -left-20" />

      <motion.div
        initial="hidden"
        animate="visible"
        variants={staggerContainer(0.15)}
        className="relative z-10 max-w-3xl text-center"
      >
        <motion.div variants={fadeUp}>
          <Badge>✦ AI Automation Agency</Badge>
        </motion.div>

        <motion.h1
          variants={fadeUp}
          className="mt-6 text-4xl md:text-7xl font-semibold leading-tight text-[var(--text-primary)]"
        >
          We Build{' '}
          <span className="bg-[image:var(--accent-gradient)] bg-clip-text text-transparent">AI Agents</span> That Run
          Your Business
        </motion.h1>

        <motion.p variants={fadeUp} className="mt-6 text-lg md:text-xl text-[var(--text-secondary)] max-w-xl mx-auto">
          Axonvia designs, builds, and deploys intelligent automation systems — from lead generation to customer
          operations — so your business runs on autopilot, not overtime.
        </motion.p>

        <motion.div
          variants={fadeUp}
          className="mt-8 flex flex-col min-[480px]:flex-row min-[480px]:flex-wrap items-center justify-center gap-4"
        >
          <CalEmbed size="large" className="w-full min-[480px]:w-auto">
            Book a Free Strategy Call
          </CalEmbed>
          <Button href="#projects" variant="secondary" size="large" className="w-full min-[480px]:w-auto">
            See Our Work
          </Button>
        </motion.div>

        <motion.p variants={fadeUp} className="mt-10 text-xs text-[var(--text-muted)]">
          Trusted by businesses automating sales, operations &amp; support
        </motion.p>
      </motion.div>

      <HeroNetworkVisual />
    </section>
  )
}
