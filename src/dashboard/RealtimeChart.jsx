import { useEffect, useRef } from 'react'
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

// Inject CSS for line animations
const injectAnimationStyles = () => {
  if (typeof document !== 'undefined' && !document.getElementById('chart-animations')) {
    const style = document.createElement('style')
    style.id = 'chart-animations'
    style.textContent = `
      @keyframes lineFlow {
        0% {
          filter: brightness(0.8);
          stroke-width: 2.5px;
        }
        50% {
          filter: brightness(1.1);
          stroke-width: 3px;
        }
        100% {
          filter: brightness(0.9);
          stroke-width: 2.5px;
        }
      }
      
      @keyframes dashFlow {
        0% {
          stroke-dashoffset: 1000;
        }
        100% {
          stroke-dashoffset: 0;
        }
      }
      
      .animated-line {
        animation: lineFlow 1.5s ease-in-out infinite, dashFlow 2s linear infinite !important;
        filter: drop-shadow(0 0 4px currentColor);
      }
    `
    document.head.appendChild(style)
  }
}

const lineDefs = [
  { key: 'temperature', color: '#ffb347', label: 'Temp' },
  { key: 'humidity', color: '#6fe3ff', label: 'Humidity' },
  { key: 'pressure', color: '#72f1b8', label: 'Pressure' },
  { key: 'light', color: '#ff7aa2', label: 'Light' },
]

export default function RealtimeChart({ data }) {
  const trimmed = data.slice(-60)
  const yDomain = getVisibleDomain(trimmed)
  const chartRef = useRef(null)

  // Initialize animation styles on mount
  useEffect(() => {
    injectAnimationStyles()
  }, [])

  // Add smooth flowing animation to the chart lines
  useEffect(() => {
    const svg = chartRef.current?.querySelector('svg')
    if (!svg) return

    // Find all line paths and apply animation
    const paths = svg.querySelectorAll('path[class*="recharts-line"]')
    paths.forEach((path) => {
      const pathLength = path.getTotalLength?.() || 0
      if (pathLength > 0) {
        // Set up stroke dash animation
        path.style.strokeDasharray = pathLength
        path.classList.add('animated-line')
      }
    })
  }, [trimmed])

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
        ref={chartRef}
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
              domain={yDomain}
              tickFormatter={formatYAxisValue}
            />
            <Tooltip
              contentStyle={{
                background: 'rgba(15, 23, 42, 0.9)',
                border: '1px solid rgba(148, 163, 184, 0.2)',
                borderRadius: '12px',
                fontSize: '12px',
              }}
              labelFormatter={formatTime}
              formatter={(value) => value.toFixed(1)}
            />
            {lineDefs.map((line) => (
              <Line
                key={line.key}
                type="monotone"
                dataKey={line.key}
                stroke={line.color}
                strokeWidth={2.5}
                dot={false}
                isAnimationActive={false}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </motion.div>
    </GlassCard>
  )
}

function formatYAxisValue(value) {
  // Format large numbers to be more readable
  if (value >= 1000) {
    return (value / 1000).toFixed(0) + 'k'
  }
  return value.toFixed(0)
}

function getVisibleDomain(data) {
  if (!data || data.length === 0) {
    return ['auto', 'auto']
  }

  let min = Number.POSITIVE_INFINITY
  let max = Number.NEGATIVE_INFINITY

  for (const entry of data) {
    for (const { key } of lineDefs) {
      const value = entry?.[key]
      if (typeof value !== 'number' || Number.isNaN(value)) {
        continue
      }

      if (value < min) min = value
      if (value > max) max = value
    }
  }

  if (!Number.isFinite(min) || !Number.isFinite(max)) {
    return ['auto', 'auto']
  }

  const range = max - min
  const baseline = Math.max(Math.abs(max), Math.abs(min), 1)
  const padding = Math.max(range * 0.12, baseline * 0.006)

  return [min - padding, max + padding]
}
