'use client'

import { useEffect, useRef } from 'react'
import { gsap } from '@/lib/gsap'

type Point = { sx: number; sy: number; sz: number; tx: number; ty: number; tz: number }
type Signal = { edge: number; t: number; speed: number }

const BLUE = [45, 91, 255]
const VIOLET = [122, 77, 255]

function mix(a: number[], b: number[], t: number) {
  return a.map((v, i) => Math.round(v + (b[i] - v) * t))
}

/** Evenly spread points on a unit sphere (Fibonacci lattice), each with a scattered start for the assembly. */
function buildPoints(count: number): Point[] {
  const golden = Math.PI * (3 - Math.sqrt(5))
  return Array.from({ length: count }, (_, i) => {
    const y = 1 - (i / (count - 1)) * 2
    const r = Math.sqrt(1 - y * y)
    const theta = golden * i
    return {
      tx: Math.cos(theta) * r,
      ty: y,
      tz: Math.sin(theta) * r,
      sx: (Math.random() - 0.5) * 6,
      sy: (Math.random() - 0.5) * 4,
      sz: (Math.random() - 0.5) * 6,
    }
  })
}

/** Links each point to its nearest neighbours, once per pair. */
function buildEdges(points: Point[], perPoint: number): [number, number][] {
  const seen = new Set<string>()
  const edges: [number, number][] = []
  points.forEach((p, i) => {
    points
      .map((q, j) => ({ j, d: (p.tx - q.tx) ** 2 + (p.ty - q.ty) ** 2 + (p.tz - q.tz) ** 2 }))
      .filter(({ j }) => j !== i)
      .sort((a, b) => a.d - b.d)
      .slice(0, perPoint)
      .forEach(({ j }) => {
        const key = i < j ? `${i}-${j}` : `${j}-${i}`
        if (!seen.has(key)) {
          seen.add(key)
          edges.push([i, j])
        }
      })
  })
  return edges
}

/**
 * The hero's 3D "neural core": a sphere of linked nodes with signals travelling between them, drawn on a 2D
 * canvas with perspective projection (no 3D library). It assembles from scattered points on load, turns
 * slowly, and leans toward the pointer. Rendering pauses off screen and in background tabs; reduced-motion
 * visitors get one still, assembled frame.
 */
export function NeuralCore({ className = '' }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return

    const reduced =
      typeof window.matchMedia === 'function' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const small = window.innerWidth < 768
    // Phones get one still, assembled frame: a continuous canvas loop costs too much main-thread time on a
    // phone CPU (and the sphere sits faintly behind the text there anyway).
    const still = reduced || small
    const points = buildPoints(small ? 130 : 230)
    const edges = buildEdges(points, 3)
    const signals: Signal[] = Array.from({ length: small ? 10 : 22 }, () => ({
      edge: Math.floor(Math.random() * edges.length),
      t: Math.random(),
      speed: 0.006 + Math.random() * 0.01,
    }))

    const state = { assemble: still ? 1 : 0, spin: 0.6, tiltX: -0.25, tiltY: 0, targetX: -0.25, targetY: 0 }
    let width = 0
    let height = 0
    let frame = 0
    let visible = true

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      width = canvas!.clientWidth
      height = canvas!.clientHeight
      canvas!.width = Math.round(width * dpr)
      canvas!.height = Math.round(height * dpr)
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    function project(p: Point) {
      const a = state.assemble
      let x = p.sx + (p.tx - p.sx) * a
      let y = p.sy + (p.ty - p.sy) * a
      let z = p.sz + (p.tz - p.sz) * a
      // Rotate around Y (spin + pointer), then X (pointer).
      const ry = state.spin + state.tiltY
      const cosY = Math.cos(ry)
      const sinY = Math.sin(ry)
      ;[x, z] = [x * cosY - z * sinY, x * sinY + z * cosY]
      const cosX = Math.cos(state.tiltX)
      const sinX = Math.sin(state.tiltX)
      ;[y, z] = [y * cosX - z * sinX, y * sinX + z * cosX]
      const radius = Math.min(width, height) * 0.38
      // Clamp the depth so a scattered point swinging behind the camera can't flip or blow up the scale.
      const perspective = 3.2 / Math.max(0.8, 3.2 + z)
      return { x: width / 2 + x * radius * perspective, y: height / 2 + y * radius * perspective, depth: (1 - z) / 2, s: perspective }
    }

    function draw() {
      ctx!.clearRect(0, 0, width, height)
      const projected = points.map(project)

      ctx!.lineWidth = 1
      for (const [i, j] of edges) {
        const a = projected[i]
        const b = projected[j]
        const depth = (a.depth + b.depth) / 2
        const [r, g, bl] = mix(BLUE, VIOLET, (points[i].ty + 1) / 2)
        ctx!.strokeStyle = `rgba(${r},${g},${bl},${0.05 + depth * 0.22 * state.assemble})`
        ctx!.beginPath()
        ctx!.moveTo(a.x, a.y)
        ctx!.lineTo(b.x, b.y)
        ctx!.stroke()
      }

      projected.forEach((p, i) => {
        const [r, g, b] = mix(BLUE, VIOLET, (points[i].ty + 1) / 2)
        ctx!.fillStyle = `rgba(${r},${g},${b},${Math.min(1, 0.25 + Math.max(0, p.depth) * 0.75)})`
        ctx!.beginPath()
        ctx!.arc(p.x, p.y, Math.max(0.3, (0.8 + Math.max(0, p.depth) * 1.8) * p.s), 0, Math.PI * 2)
        ctx!.fill()
      })

      // Signals: bright pulses travelling along links, the agents passing work to each other.
      if (state.assemble > 0.95) {
        for (const signal of signals) {
          const [i, j] = edges[signal.edge]
          const a = projected[i]
          const b = projected[j]
          const x = a.x + (b.x - a.x) * signal.t
          const y = a.y + (b.y - a.y) * signal.t
          const glow = ctx!.createRadialGradient(x, y, 0, x, y, 7)
          glow.addColorStop(0, 'rgba(255,255,255,0.95)')
          glow.addColorStop(0.35, 'rgba(90,120,255,0.55)')
          glow.addColorStop(1, 'rgba(90,120,255,0)')
          ctx!.fillStyle = glow
          ctx!.beginPath()
          ctx!.arc(x, y, 7, 0, Math.PI * 2)
          ctx!.fill()
        }
      }
    }

    function tick() {
      frame = 0
      if (!visible || document.hidden) return
      state.spin += 0.0022
      state.tiltX += (state.targetX - state.tiltX) * 0.05
      state.tiltY += (state.targetY - state.tiltY) * 0.05
      for (const signal of signals) {
        signal.t += signal.speed
        if (signal.t > 1) {
          signal.t = 0
          signal.edge = Math.floor(Math.random() * edges.length)
        }
      }
      draw()
      frame = requestAnimationFrame(tick)
    }

    function start() {
      if (!frame && !reduced) frame = requestAnimationFrame(tick)
    }

    resize()
    draw()
    const resizeObserver = new ResizeObserver(() => {
      resize()
      draw()
    })
    resizeObserver.observe(canvas)

    if (still) {
      return () => resizeObserver.disconnect()
    }

    const assembly = gsap.to(state, { assemble: 1, duration: 2.6, delay: 0.2, ease: 'expo.out' })
    const onPointer = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse') return
      state.targetY = (event.clientX / window.innerWidth - 0.5) * 0.9
      state.targetX = -0.25 + (event.clientY / window.innerHeight - 0.5) * 0.6
    }
    const onVisibility = () => start()
    const inView = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      start()
    })
    inView.observe(canvas)
    window.addEventListener('pointermove', onPointer, { passive: true })
    document.addEventListener('visibilitychange', onVisibility)
    start()

    return () => {
      assembly.kill()
      cancelAnimationFrame(frame)
      resizeObserver.disconnect()
      inView.disconnect()
      window.removeEventListener('pointermove', onPointer)
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [])

  return <canvas ref={canvasRef} aria-hidden="true" data-neural-core className={`block h-full w-full ${className}`} />
}
