import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import GaugeCard from '../components/GaugeCard'
import GlassCard from '../common/GlassCard'

const clampValue = (value, min, max) => Math.min(Math.max(value, min), max)

const createInitialValue = (min, max, baseline) => {
  const spread = (max - min) * 0.1
  return clampValue(baseline + (Math.random() - 0.5) * spread, min, max)
}

const coerceNumber = (value) => (Number.isFinite(value) ? value : null)

export default function RealtimeGauges({ status, latest }) {
  const [values, setValues] = useState(() => ({
    temperature: createInitialValue(0, 50, 22),
    humidity: createInitialValue(0, 100, 48),
    pressure: createInitialValue(900, 1100, 1012),
    light: createInitialValue(0, 1000, 420),
  }))

  useEffect(() => {
    if (!latest) return
    const next = {
      temperature: coerceNumber(latest.temperature),
      humidity: coerceNumber(latest.humidity),
      pressure: coerceNumber(latest.pressure),
      light: coerceNumber(latest.light),
    }

    setValues((prev) => ({
      temperature: next.temperature ?? prev.temperature,
      humidity: next.humidity ?? prev.humidity,
      pressure: next.pressure ?? prev.pressure,
      light: next.light ?? prev.light,
    }))
  }, [latest])

  const gaugeData = useMemo(
    () => [
      {
        key: 'temperature',
        title: 'Temperature',
        min: 0,
        max: 50,
        accent: 'linear-gradient(135deg, rgba(248,113,113,0.45), rgba(59,130,246,0.2))',
        zones: [
          { from: 0, to: 15, color: 'rgba(239, 68, 68, 0.9)' },
          { from: 16, to: 30, color: 'rgba(34, 197, 94, 0.9)' },
          { from: 31, to: 50, color: 'rgba(248, 250, 252, 0.8)' },
        ],
      },
      {
        key: 'humidity',
        title: 'Humidity',
        min: 0,
        max: 100,
        accent: 'linear-gradient(135deg, rgba(59,130,246,0.4), rgba(168,85,247,0.35))',
        zones: [
          { from: 0, to: 30, color: 'rgba(239, 68, 68, 0.9)' },
          { from: 31, to: 60, color: 'rgba(34, 197, 94, 0.9)' },
          { from: 61, to: 100, color: 'rgba(248, 250, 252, 0.8)' },
        ],
      },
      {
        key: 'pressure',
        title: 'Pressure',
        min: 900,
        max: 1100,
        accent: 'linear-gradient(135deg, rgba(56,189,248,0.4), rgba(16,185,129,0.25))',
        zones: [
          { from: 900, to: 980, color: 'rgba(239, 68, 68, 0.9)' },
          { from: 981, to: 1030, color: 'rgba(34, 197, 94, 0.9)' },
          { from: 1031, to: 1100, color: 'rgba(248, 250, 252, 0.8)' },
        ],
      },
      {
        key: 'light',
        title: 'Light',
        min: 0,
        max: 1000,
        accent: 'linear-gradient(135deg, rgba(250,204,21,0.45), rgba(59,130,246,0.25))',
        zones: [
          { from: 0, to: 200, color: 'rgba(239, 68, 68, 0.9)' },
          { from: 201, to: 500, color: 'rgba(34, 197, 94, 0.9)' },
          { from: 501, to: 1000, color: 'rgba(248, 250, 252, 0.8)' },
        ],
      },
    ],
    []
  )

  return (
    <GlassCard className="px-5 py-5">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-ink-400 dark:text-ink-300">
            Real-time sensors
          </p>
          <h2 className="mt-2 text-xl font-display text-ink-900 dark:text-ink-50">
            Premium live gauge array
          </h2>
        </div>
        <div className="flex items-center gap-2 text-xs text-ink-500 dark:text-ink-300">
          <span className="h-2 w-2 animate-pulse rounded-full bg-accent-500" />
          {status}
        </div>
      </div>

      <motion.div
        className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
      >
        {gaugeData.map((metric, index) => (
          <motion.div
            key={metric.key}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.08, duration: 0.35 }}
          >
            <GaugeCard
              title={metric.title}
              value={values[metric.key]}
              min={metric.min}
              max={metric.max}
              zones={metric.zones}
              accent={metric.accent}
            />
          </motion.div>
        ))}
      </motion.div>
    </GlassCard>
  )
}
