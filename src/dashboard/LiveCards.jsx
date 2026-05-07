import { motion } from 'framer-motion'
import AnimatedValue from '../common/AnimatedValue'
import GlassCard from '../common/GlassCard'

const cards = [
  {
    key: 'temperature',
    label: 'Temperature',
    unit: 'C',
    accent: 'text-signal-warm',
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5">
        <path
          fill="currentColor"
          d="M14 14.8V6a2 2 0 1 0-4 0v8.8a3 3 0 1 0 4 0ZM9 6a3 3 0 1 1 6 0v8.3a4 4 0 1 1-6 0V6Z"
        />
      </svg>
    ),
  },
  {
    key: 'humidity',
    label: 'Humidity',
    unit: '%',
    accent: 'text-signal-cool',
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5">
        <path
          fill="currentColor"
          d="M12 3c3.6 4.6 6 7.4 6 10a6 6 0 1 1-12 0c0-2.6 2.4-5.4 6-10Z"
        />
      </svg>
    ),
  },
  {
    key: 'pressure',
    label: 'Pressure',
    unit: 'hPa',
    accent: 'text-signal-mint',
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5">
        <path
          fill="currentColor"
          d="M12 4a8 8 0 1 0 8 8h-2a6 6 0 1 1-6-6V4Z"
        />
      </svg>
    ),
  },
  {
    key: 'light',
    label: 'Light',
    unit: 'lx',
    accent: 'text-signal-rose',
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5">
        <path
          fill="currentColor"
          d="M12 3a1 1 0 0 1 1 1v2a1 1 0 1 1-2 0V4a1 1 0 0 1 1-1Zm0 14a4 4 0 1 0-4-4 4 4 0 0 0 4 4Zm-8-4a1 1 0 0 1-1 1H1a1 1 0 1 1 0-2h2a1 1 0 0 1 1 1Zm19 1h-2a1 1 0 1 1 0-2h2a1 1 0 1 1 0 2ZM5.2 6.6a1 1 0 0 1 1.4 0l1.4 1.4a1 1 0 1 1-1.4 1.4L5.2 8a1 1 0 0 1 0-1.4Zm11.2 8.8a1 1 0 0 1 1.4 0l1.4 1.4a1 1 0 1 1-1.4 1.4l-1.4-1.4a1 1 0 0 1 0-1.4Z"
        />
      </svg>
    ),
  },
]

export default function LiveCards({ latest, status }) {
  return (
    <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card, index) => {
        const raw = latest?.[card.key]
        const value = Number.isFinite(raw) ? raw : '--'
        return (
          <motion.div
            key={card.key}
            className="metric-card"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <div className="flex items-center justify-between">
              <span className={`inline-flex items-center gap-2 ${card.accent}`}>
                {card.icon}
                <span className="text-xs uppercase tracking-[0.3em]">
                  {card.label}
                </span>
              </span>
              <span className="text-xs text-ink-500 dark:text-ink-300">
                {status}
              </span>
            </div>
            <div className="mt-4 flex items-end gap-2">
              <AnimatedValue
                value={value === '--' ? '--' : value.toFixed(1)}
                className="text-3xl font-display text-ink-900 dark:text-ink-50"
              />
              <span className="text-sm text-ink-500 dark:text-ink-300">
                {card.unit}
              </span>
            </div>
          </motion.div>
        )
      })}
    </section>
  )
}
