import { motion } from 'framer-motion'
import useUiStore from '../store/useUiStore'

export default function DashboardLayout({ children }) {
  const { theme, toggleTheme } = useUiStore()

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="pointer-events-none absolute inset-0 opacity-40 grid-sheen" />
      <div className="relative mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 pb-14 pt-10 sm:px-6 lg:px-10">
        <header className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <span className="chip">Live IoT</span>
            <h1 className="mt-3 text-3xl font-display text-ink-900 dark:text-ink-50 sm:text-4xl">
              Sentinel Ops Dashboard
            </h1>
            <p className="mt-2 max-w-xl text-sm text-ink-600 dark:text-ink-200">
              Real-time telemetry streamed every second from the IoT gateway.
            </p>
          </div>
          <motion.button
            type="button"
            whileTap={{ scale: 0.97 }}
            className="input-shell gap-2 px-4"
            onClick={toggleTheme}
          >
            <span className="text-xs uppercase tracking-[0.2em]">
              {theme === 'dark' ? 'Dark' : 'Light'} Mode
            </span>
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/10 dark:bg-white/10">
              {theme === 'dark' ? (
                <svg
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  className="h-4 w-4 text-signal-cool"
                >
                  <path
                    fill="currentColor"
                    d="M12 4.5a1 1 0 0 1 1-1h.5a1 1 0 0 1 0 2H13a1 1 0 0 1-1-1Zm-5.2 2.3a1 1 0 0 1 1.4 0l.4.4a1 1 0 1 1-1.4 1.4l-.4-.4a1 1 0 0 1 0-1.4ZM6.5 12a1 1 0 0 1 1-1h.5a1 1 0 1 1 0 2H7.5a1 1 0 0 1-1-1Zm5.5 5.5a1 1 0 0 1 1 1v.5a1 1 0 1 1-2 0V19a1 1 0 0 1 1-1Zm5.8-1.7a1 1 0 0 1 1.4 0l.4.4a1 1 0 1 1-1.4 1.4l-.4-.4a1 1 0 0 1 0-1.4ZM17.5 12a1 1 0 0 1 1-1h.5a1 1 0 1 1 0 2H18.5a1 1 0 0 1-1-1Zm-.3-6.5a1 1 0 0 1 0 1.4l-.4.4a1 1 0 1 1-1.4-1.4l.4-.4a1 1 0 0 1 1.4 0Z"
                  />
                  <circle cx="12" cy="12" r="4" fill="currentColor" />
                </svg>
              ) : (
                <svg
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  className="h-4 w-4 text-accent-500"
                >
                  <path
                    fill="currentColor"
                    d="M12.8 3.5a1 1 0 0 1 .8 1.1 7.5 7.5 0 1 0 6.1 10.5 1 1 0 0 1 1.5-1.2A9.5 9.5 0 1 1 11.7 2a1 1 0 0 1 1.1.8Z"
                  />
                </svg>
              )}
            </span>
          </motion.button>
        </header>
        {children}
      </div>
    </div>
  )
}
