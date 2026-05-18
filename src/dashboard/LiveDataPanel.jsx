import GlassCard from '../common/GlassCard'
import StatusPill from '../components/StatusPill'
import { formatDateTime } from '../utils/format'

const statusTone = {
  ok: 'ok',
  warn: 'warn',
  alarm: 'alarm',
}

export default function LiveDataPanel({ data, isLoading }) {
  return (
    <GlassCard className="px-5 py-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-ink-300">
            Live Data Panel
          </p>
          <h3 className="mt-2 text-lg font-display text-ink-50">
            Real-time activity feed
          </h3>
        </div>
        <span className="text-xs text-ink-200">Last 60 seconds</span>
      </div>

      <div className="mt-4 h-72 space-y-2 overflow-auto pr-2">
        {isLoading ? (
          <div className="skeleton h-8 w-full" />
        ) : data.length === 0 ? (
          <p className="text-sm text-ink-200">No recent activity.</p>
        ) : (
          data.map((entry) => (
            <div
              key={`${entry.id}-${entry.timestamp}`}
              className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3"
            >
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-ink-300">
                  {entry.category} · {entry.reading_name}
                </p>
                <p className="mt-1 text-sm text-ink-50">
                  {entry.value} {entry.unit} • {entry.source_plc}
                </p>
              </div>
              <div className="text-right">
                <StatusPill label={entry.status.toUpperCase()} tone={statusTone[entry.status]} />
                <p className="mt-2 text-xs text-ink-300">
                  {formatDateTime(entry.timestamp)}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </GlassCard>
  )
}
