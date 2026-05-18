import { useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import TopNav from '../components/TopNav'
import CategoryTabs from '../components/CategoryTabs'
import OverviewPanel from '../dashboard/OverviewPanel'
import CategoryWorkspace from '../dashboard/CategoryWorkspace'
import LiveDataPanel from '../dashboard/LiveDataPanel'
import Modal from '../components/Modal'
import ToastStack from '../components/ToastStack'
import useCategoryStream from '../hooks/useCategoryStream'
import { getLiveReadings, getStats } from '../services/api'

const CATEGORIES = [
  'environmental',
  'electrical',
  'machine',
  'plc_control',
  'process',
  'production',
  'safety',
  'inventory',
  'utility',
  'logistics',
]

const normalizeReading = (payload) => ({
  id: payload.id ?? `${payload.reading_name ?? 'reading'}-${payload.timestamp}`,
  category: payload.category ?? 'unknown',
  subcategory: payload.subcategory ?? '--',
  reading_name: payload.reading_name ?? payload.name ?? 'Unknown',
  value: Number.isFinite(Number(payload.value)) ? Number(payload.value) : '--',
  unit: payload.unit ?? '--',
  timestamp: payload.timestamp ?? new Date().toISOString(),
  source_plc: payload.source_plc ?? payload.plc ?? '--',
  status: (payload.status ?? 'ok').toLowerCase(),
})

export default function Dashboard() {
  const [activeCategory, setActiveCategory] = useState(CATEGORIES[0])
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false)
  const {
    readings: liveReadings,
    status: wsStatus,
    reconnect: reconnectWs,
  } = useCategoryStream(activeCategory)

  const statsQuery = useQuery({
    queryKey: ['stats'],
    queryFn: getStats,
    refetchInterval: 8000,
  })

  const liveQuery = useQuery({
    queryKey: ['live-feed'],
    queryFn: () => getLiveReadings(1000),
    refetchInterval: 4000,
  })

  const liveFeed = useMemo(() => {
    const now = Date.now()
    const source = Array.isArray(liveQuery.data) ? liveQuery.data : []
    return source
      .map(normalizeReading)
      .filter((entry) => {
        const timestamp = new Date(entry.timestamp).getTime()
        return timestamp > now - 60000
      })
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
  }, [liveQuery.data])

  return (
    <div className="flex flex-col">
      <TopNav
        apiStatus={statsQuery.isError ? 'error' : statsQuery.isLoading ? 'loading' : 'ok'}
        wsStatus={wsStatus}
        liveCount={liveFeed.length}
        onSearch={() => setIsSearchOpen(true)}
        onOpenNotifications={() => setIsNotificationsOpen(true)}
      />

      <main className="mx-auto flex w-full max-w-[1400px] flex-col gap-6 px-5 pb-12 pt-8 sm:px-6 lg:px-8">
        <OverviewPanel stats={statsQuery.data} isLoading={statsQuery.isLoading} />

        <section className="glass-panel px-5 py-5">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-ink-300">
                Category Control
              </p>
              <h2 className="mt-2 text-xl font-display text-ink-50">
                Live SCADA workspaces
              </h2>
            </div>
          </div>
          <div className="mt-4">
            <CategoryTabs
              categories={CATEGORIES}
              activeCategory={activeCategory}
              onChange={setActiveCategory}
            />
          </div>
        </section>

        <CategoryWorkspace
          category={activeCategory}
          liveReadings={liveReadings}
          wsStatus={wsStatus}
          onReconnect={reconnectWs}
        />

        <LiveDataPanel data={liveFeed} isLoading={liveQuery.isLoading} />
      </main>

      <Modal
        isOpen={isSearchOpen}
        title="Global Search"
        onClose={() => setIsSearchOpen(false)}
      >
        Use the category filter panel to apply precision search criteria against the
        industrial telemetry archive.
      </Modal>

      <Modal
        isOpen={isNotificationsOpen}
        title="Notifications"
        onClose={() => setIsNotificationsOpen(false)}
      >
        All critical alarms and system updates will appear here once enabled.
      </Modal>

      <ToastStack />
    </div>
  )
}
