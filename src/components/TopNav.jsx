import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import useUiStore from '../store/useUiStore'
import StatusPill from './StatusPill'

const formatTime = (value) =>
  value.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })

export default function TopNav({
  apiStatus,
  wsStatus,
  liveCount,
  onSearch,
  onOpenNotifications,
}) {
  const { theme, toggleTheme } = useUiStore()
  const [time, setTime] = useState(() => new Date())

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  const wsLabel = useMemo(() => {
    if (wsStatus === 'open') return 'Connected'
    if (wsStatus === 'connecting') return 'Connecting'
    if (wsStatus === 'error') return 'Error'
    if (wsStatus === 'closed') return 'Reconnecting'
    return 'Idle'
  }, [wsStatus])

  const apiLabel = useMemo(() => {
    if (apiStatus === 'loading') return 'Syncing'
    if (apiStatus === 'error') return 'Offline'
    return 'Online'
  }, [apiStatus])

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-ink-900/70 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-[1400px] flex-wrap items-center justify-between gap-4 px-5 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/15 bg-white/5">
            <span className="text-lg font-semibold text-signal-cool">IM</span>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-ink-300">
              Industrial Monitoring Center
            </p>
            <p className="mt-1 text-sm text-ink-100">
              {formatTime(time)}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <StatusPill label={apiLabel} tone={apiStatus === 'error' ? 'alarm' : 'ok'} />
          <StatusPill
            label={`WS ${wsLabel}`}
            tone={wsStatus === 'error' ? 'alarm' : wsStatus === 'open' ? 'ok' : 'warn'}
          />
          <div className="hidden items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-ink-200 sm:flex">
            <span className="h-2 w-2 animate-pulse rounded-full bg-signal-mint" />
            Live Records: {liveCount}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <motion.button
            type="button"
            whileTap={{ scale: 0.96 }}
            className="icon-button"
            onClick={onSearch}
            aria-label="Global search"
          >
            <IconSearch />
          </motion.button>
          <motion.button
            type="button"
            whileTap={{ scale: 0.96 }}
            className="icon-button"
            onClick={toggleTheme}
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <IconMoon /> : <IconSun />}
          </motion.button>
          <motion.button
            type="button"
            whileTap={{ scale: 0.96 }}
            className="icon-button"
            onClick={onOpenNotifications}
            aria-label="Notifications"
          >
            <IconBell />
          </motion.button>
        </div>
      </div>
    </header>
  )
}

function IconSearch() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
      <path
        fill="currentColor"
        d="M10.5 3a7.5 7.5 0 0 1 5.91 12.1l3.74 3.74-1.41 1.41-3.74-3.74A7.5 7.5 0 1 1 10.5 3Zm0 2a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11Z"
      />
    </svg>
  )
}

function IconMoon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
      <path
        fill="currentColor"
        d="M12.8 3.5a1 1 0 0 1 .8 1.1 7.5 7.5 0 1 0 6.1 10.5 1 1 0 0 1 1.5-1.2A9.5 9.5 0 1 1 11.7 2a1 1 0 0 1 1.1.8Z"
      />
    </svg>
  )
}

function IconSun() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
      <path
        fill="currentColor"
        d="M12 4.5a1 1 0 0 1 1-1h.5a1 1 0 0 1 0 2H13a1 1 0 0 1-1-1Zm-5.2 2.3a1 1 0 0 1 1.4 0l.4.4a1 1 0 1 1-1.4 1.4l-.4-.4a1 1 0 0 1 0-1.4ZM6.5 12a1 1 0 0 1 1-1h.5a1 1 0 1 1 0 2H7.5a1 1 0 0 1-1-1Zm5.5 5.5a1 1 0 0 1 1 1v.5a1 1 0 1 1-2 0V19a1 1 0 0 1 1-1Zm5.8-1.7a1 1 0 0 1 1.4 0l.4.4a1 1 0 1 1-1.4 1.4l-.4-.4a1 1 0 0 1 0-1.4ZM17.5 12a1 1 0 0 1 1-1h.5a1 1 0 1 1 0 2H18.5a1 1 0 0 1-1-1Zm-.3-6.5a1 1 0 0 1 0 1.4l-.4.4a1 1 0 1 1-1.4-1.4l.4-.4a1 1 0 0 1 1.4 0Z"
      />
      <circle cx="12" cy="12" r="4" fill="currentColor" />
    </svg>
  )
}

function IconBell() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
      <path
        fill="currentColor"
        d="M12 3a5 5 0 0 1 5 5v3.8l1.6 2.6a1 1 0 0 1-.85 1.5H6.25a1 1 0 0 1-.85-1.5L7 11.8V8a5 5 0 0 1 5-5Zm0 18a2.5 2.5 0 0 1-2.35-1.6h4.7A2.5 2.5 0 0 1 12 21Z"
      />
    </svg>
  )
}
