import { useEffect, useId, useMemo, useState } from 'react'
import { motion, useMotionValue, useMotionValueEvent, useSpring } from 'framer-motion'
import GlassCard from '../common/GlassCard'

const GAUGE_START = -140
const GAUGE_END = 140
const GAUGE_SWEEP = GAUGE_END - GAUGE_START
const ARC_GAP = 0
const CENTER_X = 110
const CENTER_Y = 110
const ARC_RADIUS = 62
const POINTER_RADIUS = 54

const clampValue = (value, min, max) => Math.min(Math.max(value, min), max)

const polarToCartesian = (cx, cy, radius, angle) => {
  const radians = ((angle - 90) * Math.PI) / 180
  return {
    x: cx + radius * Math.cos(radians),
    y: cy + radius * Math.sin(radians),
  }
}

const describeArc = (cx, cy, radius, startAngle, endAngle) => {
  const start = polarToCartesian(cx, cy, radius, endAngle)
  const end = polarToCartesian(cx, cy, radius, startAngle)
  const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1'

  return `M ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArcFlag} 0 ${end.x} ${end.y}`
}

export default function GaugeCard({
  title,
  value,
  min,
  max,
  zones,
  accent,
}) {
  const [displayValue, setDisplayValue] = useState(value)
  const glowId = useId()

  const motionValue = useMotionValue(value)
  const springValue = useSpring(motionValue, { stiffness: 90, damping: 16, mass: 1.1 })

  useEffect(() => {
    motionValue.set(value)
  }, [motionValue, value])

  useMotionValueEvent(springValue, 'change', (latest) => {
    setDisplayValue(latest)
  })

  const clampedValue = useMemo(() => {
    return clampValue(displayValue, min, max)
  }, [displayValue, min, max])

  const ratio = useMemo(() => {
    const normalized = (clampedValue - min) / (max - min)
    return clampValue(normalized, 0, 1)
  }, [clampedValue, min, max])

  const segments = useMemo(() => {
    return zones.map((zone) => {
      const startRatio = (zone.from - min) / (max - min)
      const endRatio = (zone.to - min) / (max - min)
      const startAngle = GAUGE_START + GAUGE_SWEEP * startRatio + ARC_GAP
      const endAngle = GAUGE_START + GAUGE_SWEEP * endRatio - ARC_GAP
      return {
        color: zone.color,
        path: describeArc(CENTER_X, CENTER_Y, ARC_RADIUS, startAngle, endAngle),
      }
    })
  }, [zones, min, max])

  const progressPath = useMemo(() => {
    return describeArc(CENTER_X, CENTER_Y, ARC_RADIUS, GAUGE_START, GAUGE_END)
  }, [])

  const pointerAngle = useMemo(() => {
    return GAUGE_END - GAUGE_SWEEP * ratio
  }, [ratio])

  const pointerTip = useMemo(() => {
    return polarToCartesian(CENTER_X, CENTER_Y, POINTER_RADIUS, pointerAngle)
  }, [pointerAngle])

  return (
    <GlassCard className="group relative overflow-hidden px-5 py-5 shadow-[0_18px_50px_-32px_rgba(15,23,42,0.8)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_26px_65px_-28px_rgba(56,189,248,0.35)]">
      <motion.div
        aria-hidden="true"
        className="absolute -inset-10 rounded-[36px] opacity-20 blur-3xl"
        style={{ background: accent }}
        animate={{ opacity: [0.18, 0.32, 0.18] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
      />
      <div className="relative flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-ink-400 dark:text-ink-300">
              {title}
            </p>
            <p className="mt-1 text-sm text-ink-600 dark:text-ink-200">
              Real-time sensor
            </p>
          </div>
          <span className="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-[0.6rem] uppercase tracking-[0.28em] text-ink-100">
            Live
          </span>
        </div>

        <div className="relative flex items-center justify-center">
          <svg
            viewBox="0 0 220 220"
            className="h-44 w-full"
            role="img"
            aria-label={`${title} gauge`}
          >
            <defs>
              <filter id={glowId} x="-60%" y="-60%" width="220%" height="220%">
                <feGaussianBlur stdDeviation="6" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              <radialGradient id={`${glowId}-face`} cx="50%" cy="45%" r="55%">
                <stop offset="0%" stopColor="#1b1b1f" />
                <stop offset="55%" stopColor="#141417" />
                <stop offset="100%" stopColor="#0b0b0d" />
              </radialGradient>
              <linearGradient id={`${glowId}-ring`} x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#f5f5f4" />
                <stop offset="45%" stopColor="#a8a29e" />
                <stop offset="100%" stopColor="#f5f5f4" />
              </linearGradient>
            </defs>

            <circle cx={CENTER_X} cy={CENTER_Y} r="80" fill={`url(#${glowId}-face)`} />

            {segments.map((segment, index) => (
              <path
                key={`${title}-segment-${index}`}
                d={segment.path}
                stroke={segment.color}
                strokeWidth="12"
                fill="none"
                strokeLinecap="round"
                opacity="0.7"
              />
            ))}

            <motion.line
              x1={CENTER_X}
              y1={CENTER_Y}
              x2={pointerTip.x}
              y2={pointerTip.y}
              stroke="rgba(248, 250, 252, 0.95)"
              strokeWidth="4"
              strokeLinecap="round"
              filter={`url(#${glowId})`}
              animate={{ x2: pointerTip.x, y2: pointerTip.y }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
            />
            <circle cx={CENTER_X} cy={CENTER_Y} r="18" fill="#0c0c0f" stroke="rgba(255,255,255,0.25)" strokeWidth="2" />
            <circle cx={CENTER_X} cy={CENTER_Y} r="8" fill="rgba(248, 250, 252, 0.95)" />
          </svg>
        </div>

        <div className="flex items-center justify-between text-xs text-ink-500 dark:text-ink-300">
          <span>{min}</span>
          <span className="uppercase tracking-[0.3em] text-ink-400">Range</span>
          <span>{max}</span>
        </div>
      </div>
    </GlassCard>
  )
}
