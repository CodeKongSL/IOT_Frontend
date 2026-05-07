import { motion } from 'framer-motion'
import GlassCard from '../common/GlassCard'

export default function FilterBar({ filters, onChange, status }) {
  const update = (key) => (event) => {
    onChange({ [key]: event.target.value })
  }

  return (
    <GlassCard className="px-5 py-4">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-ink-500 dark:text-ink-300">
            Filters
          </p>
          <h2 className="mt-2 text-lg font-display text-ink-900 dark:text-ink-50">
            Live search and ranges
          </h2>
        </div>
        <div className="flex items-center gap-2 text-xs text-ink-500 dark:text-ink-300">
          <span className="h-2 w-2 animate-pulse rounded-full bg-accent-500" />
          {status}
        </div>
      </div>
      <motion.div
        className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-4"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <label className="input-shell">
          <span className="text-[0.65rem] uppercase tracking-[0.3em] text-ink-300">
            Temp Min
          </span>
          <input
            type="number"
            value={filters.tempMin}
            onChange={update('tempMin')}
            className="w-full bg-transparent text-right outline-none"
            placeholder="-"
          />
        </label>
        <label className="input-shell">
          <span className="text-[0.65rem] uppercase tracking-[0.3em] text-ink-300">
            Temp Max
          </span>
          <input
            type="number"
            value={filters.tempMax}
            onChange={update('tempMax')}
            className="w-full bg-transparent text-right outline-none"
            placeholder="-"
          />
        </label>
        <label className="input-shell">
          <span className="text-[0.65rem] uppercase tracking-[0.3em] text-ink-300">
            Humidity Min
          </span>
          <input
            type="number"
            value={filters.humidityMin}
            onChange={update('humidityMin')}
            className="w-full bg-transparent text-right outline-none"
            placeholder="-"
          />
        </label>
        <label className="input-shell">
          <span className="text-[0.65rem] uppercase tracking-[0.3em] text-ink-300">
            Humidity Max
          </span>
          <input
            type="number"
            value={filters.humidityMax}
            onChange={update('humidityMax')}
            className="w-full bg-transparent text-right outline-none"
            placeholder="-"
          />
        </label>
        <label className="input-shell">
          <span className="text-[0.65rem] uppercase tracking-[0.3em] text-ink-300">
            Time Window
          </span>
          <input
            type="number"
            value={filters.timeWindow}
            onChange={update('timeWindow')}
            className="w-full bg-transparent text-right outline-none"
            placeholder="60"
          />
          <span className="text-[0.65rem] text-ink-300">sec</span>
        </label>
        <label className="input-shell md:col-span-2">
          <span className="text-[0.65rem] uppercase tracking-[0.3em] text-ink-300">
            Search
          </span>
          <input
            type="text"
            value={filters.search}
            onChange={update('search')}
            className="w-full bg-transparent outline-none"
            placeholder="Timestamp or value"
          />
        </label>
      </motion.div>
    </GlassCard>
  )
}
