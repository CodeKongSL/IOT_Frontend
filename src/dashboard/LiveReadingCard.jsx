import { motion } from 'framer-motion'
import StatusPill from '../components/StatusPill'
import { formatTimestamp } from '../utils/format'

const statusTone = {
  ok: 'ok',
  warn: 'warn',
  alarm: 'alarm',
}

export default function LiveReadingCard({ reading, index }) {
  const tone = statusTone[reading.status] ?? 'ok'

  return (
    <motion.div
      className={`live-card live-card-${tone}`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.03 }}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-ink-300">
            {reading.reading_name}
          </p>
          <p className="mt-2 text-2xl font-display text-ink-50">
            {reading.value ?? '--'}
            <span className="ml-2 text-sm text-ink-300">{reading.unit}</span>
          </p>
        </div>
        <StatusPill label={reading.status.toUpperCase()} tone={tone} />
      </div>
      <div className="mt-4 grid grid-cols-2 gap-2 text-xs text-ink-300">
        <div>
          <span className="block text-[0.6rem] uppercase tracking-[0.3em]">
            PLC
          </span>
          <span className="text-ink-50">{reading.source_plc}</span>
        </div>
        <div>
          <span className="block text-[0.6rem] uppercase tracking-[0.3em]">
            Timestamp
          </span>
          <span className="text-ink-50">{formatTimestamp(reading.timestamp)}</span>
        </div>
      </div>
    </motion.div>
  )
}
