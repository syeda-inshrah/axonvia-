'use client'

import { Fragment } from 'react'
import { motion, useScroll, useTransform, type Variants } from 'motion/react'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { CalEmbed } from '@/components/CalEmbed'
import { GradientBlob } from '@/components/ui/GradientBlob'
import { EASE_OUT, fadeUp, staggerContainer } from '@/lib/animations'
import { usePrefersReducedMotion } from '@/lib/usePrefersReducedMotion'

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
  // Loops forever, so it's held static (not just slowed) for visitors who prefer reduced motion.
  const animated = !usePrefersReducedMotion()

  return (
    <svg
      key={String(animated)}
      viewBox="0 0 440 260"
      className="relative z-10 mt-12 w-full max-w-md opacity-70"
      aria-hidden="true"
      data-animated={animated}
    >
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
          animate={animated ? { strokeDashoffset: [0, -16] } : undefined}
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
          opacity={animated ? undefined : 0.8}
          animate={animated ? { opacity: [0.4, 1, 0.4] } : undefined}
          transition={{ duration: 2.5, repeat: Infinity, delay: i * 0.3 }}
        />
      ))}
    </svg>
  )
}

// Headline tokens, revealed one by one. "AI Automation" stays one token so its gradient spans both words.
const HEADLINE: { text: string; gradient?: boolean }[] = [
  { text: 'AI Automation', gradient: true },
  { text: '&' },
  { text: 'Intelligent' },
  { text: 'Solutions' },
  { text: 'for' },
  { text: 'Modern' },
  { text: 'Businesses' },
]

function wordReveal(reduced: boolean): Variants {
  // Blur is the one non-transform effect on the page: a single short run, and skipped for reduced motion.
  return {
    hidden: { opacity: 0, y: '0.45em', filter: reduced ? 'blur(0px)' : 'blur(12px)' },
    visible: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.9, ease: EASE_OUT } },
  }
}

export function Hero() {
  const reduced = usePrefersReducedMotion()
  const { scrollY } = useScroll()
  // Blobs drift down 240px over the first 800px of scroll, so they move slower than the content.
  const blobY = useTransform(scrollY, [0, 800], [0, 240])

  return (
    <section className="relative min-h-[90vh] flex flex-col items-center justify-center overflow-hidden px-5 pt-24 grid-texture">
      <motion.div
        aria-hidden="true"
        data-parallax={!reduced}
        className="pointer-events-none absolute inset-0"
        style={{ y: reduced ? 0 : blobY }}
      >
        <GradientBlob color="cyan" className="w-[480px] h-[480px] -top-20 -right-20" />
        <GradientBlob color="purple" className="w-[480px] h-[480px] bottom-0 -left-20" />
      </motion.div>

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
          variants={staggerContainer(0.08)}
          className="mt-6 text-4xl md:text-7xl font-semibold leading-tight text-[var(--text-primary)]"
        >
          {HEADLINE.map((word, index) => (
            <Fragment key={word.text}>
              {index > 0 && ' '}
              <motion.span
                data-word
                variants={wordReveal(reduced)}
                className={`inline-block ${
                  word.gradient ? 'bg-[image:var(--accent-gradient)] bg-clip-text text-transparent' : ''
                }`}
              >
                {word.text}
              </motion.span>
            </Fragment>
          ))}
        </motion.h1>

        <motion.p variants={fadeUp} className="mt-6 text-lg md:text-xl text-[var(--text-secondary)] max-w-xl mx-auto">
          Axonvia designs and builds AI automation, agentic AI systems, custom AI-powered applications, and business
          workflow automation — shaped around how your business actually works.
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
      </motion.div>

      <HeroNetworkVisual />
    </section>
  )
}
