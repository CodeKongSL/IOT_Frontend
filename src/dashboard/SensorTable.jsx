import { AnimatePresence, motion } from 'framer-motion'
import GlassCard from '../common/GlassCard'
import { formatTimestamp } from '../utils/format'

export default function SensorTable({ data }) {
  const rows = data.slice(-12).reverse()

  return (
    <GlassCard className="overflow-hidden">
      <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-ink-500 dark:text-ink-300">
            Sensor Table
          </p>
          <h2 className="mt-2 text-lg font-display text-ink-900 dark:text-ink-50">
            Live telemetry feed
          </h2>
        </div>
        <span className="text-xs text-ink-500 dark:text-ink-300">
          Last {rows.length} updates
        </span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-white/40 text-xs uppercase tracking-[0.3em] text-ink-500 dark:bg-white/5 dark:text-ink-300">
            <tr>
              <th className="px-5 py-3">Timestamp</th>
              <th className="px-5 py-3">Temperature</th>
              <th className="px-5 py-3">Humidity</th>
              <th className="px-5 py-3">Pressure</th>
              <th className="px-5 py-3">Light</th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence initial={false}>
              {rows.map((row) => (
                <motion.tr
                  key={row.timestamp}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="border-b border-ink-200/50 text-ink-900 dark:border-white/5 dark:text-ink-100"
                >
                  <td className="px-5 py-3 text-xs text-ink-500 dark:text-ink-300">
                    {formatTimestamp(row.timestamp)}
                  </td>
                  <td className="px-5 py-3">{row.temperature.toFixed(1)} C</td>
                  <td className="px-5 py-3">{row.humidity.toFixed(1)} %</td>
                  <td className="px-5 py-3">{row.pressure.toFixed(1)} hPa</td>
                  <td className="px-5 py-3">{row.light.toFixed(1)} lx</td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>
    </GlassCard>
  )
}
