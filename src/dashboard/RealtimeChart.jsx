import { motion } from 'framer-motion'
import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import GlassCard from '../common/GlassCard'
import { formatTime } from '../utils/format'

const lineDefs = [
  { key: 'temperature', color: '#ffb347', label: 'Temp' },
  { key: 'humidity', color: '#6fe3ff', label: 'Humidity' },
  { key: 'pressure', color: '#72f1b8', label: 'Pressure' },
  { key: 'light', color: '#ff7aa2', label: 'Light' },
]

export default function RealtimeChart({ data }) {
  const trimmed = data.slice(-60)

  return (
    <GlassCard className="px-4 py-4 sm:px-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-ink-500 dark:text-ink-300">
            Live Trend
          </p>
          <h2 className="mt-2 text-xl font-display text-ink-900 dark:text-ink-50">
            Last 60 seconds
          </h2>
        </div>
        <div className="flex flex-wrap items-center gap-2 text-xs text-ink-500 dark:text-ink-300">
          {lineDefs.map((line) => (
            <span key={line.key} className="flex items-center gap-2">
              <span
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: line.color }}
              />
              {line.label}
            </span>
          ))}
        </div>
      </div>
      <motion.div
        className="mt-6 h-64 w-full"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={trimmed} margin={{ left: 8, right: 18 }}>
            <XAxis
              dataKey="timestamp"
              tickFormatter={formatTime}
              stroke="rgba(148, 163, 184, 0.6)"
              tick={{ fontSize: 11 }}
            />
            <YAxis
              stroke="rgba(148, 163, 184, 0.4)"
              tick={{ fontSize: 11 }}
            />
            <Tooltip
              contentStyle={{
                background: 'rgba(15, 23, 42, 0.9)',
                border: '1px solid rgba(148, 163, 184, 0.2)',
                borderRadius: '12px',
                fontSize: '12px',
              }}
              labelFormatter={formatTime}
            />
            {lineDefs.map((line) => (
              <Line
                key={line.key}
                type="monotone"
                dataKey={line.key}
                stroke={line.color}
                strokeWidth={2}
                dot={false}
                isAnimationActive
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </motion.div>
    </GlassCard>
  )
}
