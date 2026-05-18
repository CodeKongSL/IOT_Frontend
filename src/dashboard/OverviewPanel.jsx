import GlassCard from '../common/GlassCard'
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts'

export default function OverviewPanel({ liveFeed, categories }) {
  const chartCategories = categories?.length
    ? categories
    : ['environmental', 'electrical', 'machine', 'plc_control', 'process']
  const categoryCharts = buildCategoryCharts(liveFeed, chartCategories)

  return (
    <section className="grid grid-cols-1 gap-4">
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
        </div>
        <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3">
          {categoryCharts.map((chart) => (
            <div key={chart.category} className="kpi-card">
              <div className="flex items-center justify-between">
                <p className="text-xs uppercase tracking-[0.3em] text-ink-300">
                  {chart.label}
                </p>
                <span className="text-xs text-ink-200">Top 5 readings</span>
              </div>
              <div className="mt-3 h-44">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chart.data}>
                    <XAxis
                      dataKey="name"
                      tick={{ fontSize: 10 }}
                      stroke="rgba(148,163,184,0.4)"
                    />
                    <YAxis
                      tick={{ fontSize: 10 }}
                      stroke="rgba(148,163,184,0.3)"
                    />
                    <Tooltip
                      contentStyle={{
                        background: 'rgba(15, 23, 42, 0.9)',
                        border: '1px solid rgba(148, 163, 184, 0.2)',
                        borderRadius: '12px',
                        fontSize: '12px',
                      }}
                    />
                    <Bar
                      dataKey="value"
                      fill={chart.color}
                      radius={[8, 8, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          ))}
        </div>
      </GlassCard>
    </section>
  )
}

const buildCategoryCharts = (liveFeed, categories) => {
  const palette = ['#2a94ff', '#72f1b8', '#ffb347', '#ff5a67', '#7c89ad']
  const safeFeed = Array.isArray(liveFeed) ? liveFeed : []

  return categories.map((category, index) => {
    const entries = safeFeed
      .filter((entry) => entry.category === category)
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(0, 5)
      .map((entry) => ({
        name: entry.reading_name?.slice(0, 6) ?? 'reading',
        value: Number.isFinite(Number(entry.value)) ? Number(entry.value) : 0,
      }))

    const fallback = Array.from({ length: 5 }, (_, idx) => ({
      name: `R-${idx + 1}`,
      value: 0,
    }))

    return {
      category,
      label: category.replace(/_/g, ' '),
      data: entries.length > 0 ? entries : fallback,
      color: palette[index % palette.length],
    }
  })
}
