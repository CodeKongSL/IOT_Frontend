import GlassCard from '../common/GlassCard'
import { ResponsiveContainer, AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell } from 'recharts'

const chartColors = ['#2a94ff', '#72f1b8', '#ffb347', '#ff5a67', '#7c89ad']

const formatCount = (value) => (Number.isFinite(value) ? value : '--')

export default function OverviewPanel({ stats, isLoading }) {
  const kpis = [
    { label: 'Records/sec', value: stats?.recordsPerSec },
    { label: 'Queue size', value: stats?.queueSize },
    { label: 'Dropped records', value: stats?.droppedRecords },
    { label: 'Total stored', value: stats?.totalStored },
  ]

  const categoryCounts = normalizeCategoryCounts(stats?.countsByCategory)
  const activityData = normalizeSeries(stats?.activitySeries, 12)
  const alarmSeries = normalizeSeries(stats?.alarmSeries, 12)

  return (
    <section className="grid grid-cols-1 gap-4 lg:grid-cols-[1.3fr_1fr]">
      <GlassCard className="px-5 py-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-ink-300">
              Overview
            </p>
            <h3 className="mt-2 text-lg font-display text-ink-50">
              Operations analytics
            </h3>
          </div>
          <span className="text-xs text-ink-200">Realtime KPI stream</span>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {kpis.map((kpi) => (
            <div key={kpi.label} className="kpi-card">
              <p className="text-[0.65rem] uppercase tracking-[0.3em] text-ink-300">
                {kpi.label}
              </p>
              <p className="mt-3 text-2xl font-display text-ink-50">
                {isLoading ? '...' : formatCount(kpi.value)}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
          <div className="h-56">
            <p className="text-xs uppercase tracking-[0.3em] text-ink-300">Live activity</p>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={activityData}>
                <XAxis dataKey="label" stroke="rgba(148,163,184,0.5)" />
                <YAxis stroke="rgba(148,163,184,0.4)" />
                <Tooltip
                  contentStyle={{
                    background: 'rgba(15, 23, 42, 0.9)',
                    border: '1px solid rgba(148, 163, 184, 0.2)',
                    borderRadius: '12px',
                    fontSize: '12px',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#2a94ff"
                  fill="url(#activityGradient)"
                />
                <defs>
                  <linearGradient id="activityGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#2a94ff" stopOpacity={0.6} />
                    <stop offset="100%" stopColor="#2a94ff" stopOpacity={0} />
                  </linearGradient>
                </defs>
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="h-56">
            <p className="text-xs uppercase tracking-[0.3em] text-ink-300">Recent alarms</p>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={alarmSeries}>
                <XAxis dataKey="label" stroke="rgba(148,163,184,0.5)" />
                <YAxis stroke="rgba(148,163,184,0.4)" />
                <Tooltip
                  contentStyle={{
                    background: 'rgba(15, 23, 42, 0.9)',
                    border: '1px solid rgba(148, 163, 184, 0.2)',
                    borderRadius: '12px',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="value" fill="#ff5a67" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </GlassCard>

      <GlassCard className="px-5 py-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-ink-300">
              Distribution
            </p>
            <h3 className="mt-2 text-lg font-display text-ink-50">
              Category load mix
            </h3>
          </div>
        </div>
        <div className="mt-5 h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={categoryCounts}
                dataKey="value"
                nameKey="name"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={2}
              >
                {categoryCounts.map((entry, index) => (
                  <Cell key={entry.name} fill={chartColors[index % chartColors.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  background: 'rgba(15, 23, 42, 0.9)',
                  border: '1px solid rgba(148, 163, 184, 0.2)',
                  borderRadius: '12px',
                  fontSize: '12px',
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-2 text-xs text-ink-200">
          {categoryCounts.map((entry, index) => (
            <div key={entry.name} className="flex items-center gap-2">
              <span
                className="h-2 w-2 rounded-full"
                style={{ background: chartColors[index % chartColors.length] }}
              />
              {entry.name}: {entry.value}
            </div>
          ))}
        </div>
      </GlassCard>
    </section>
  )
}

const normalizeCategoryCounts = (input) => {
  if (!input || typeof input !== 'object') {
    return [{ name: 'No data', value: 1 }]
  }
  return Object.entries(input).map(([name, value]) => ({
    name,
    value: Number.isFinite(Number(value)) ? Number(value) : 0,
  }))
}

const normalizeSeries = (input, fallbackCount) => {
  if (Array.isArray(input) && input.length > 0) {
    return input.map((entry, index) => ({
      label: entry.label ?? `T-${index}`,
      value: Number(entry.value) || 0,
    }))
  }

  return Array.from({ length: fallbackCount }, (_, index) => ({
    label: `T-${fallbackCount - index}`,
    value: 0,
  }))
}
