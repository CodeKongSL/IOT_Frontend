import { useMemo, useState } from 'react'
import LiveReadingCard from './LiveReadingCard'
import FilterPanel from './FilterPanel'
import HistoryTable from './HistoryTable'
import useToastStore from '../store/useToastStore'
import { useQuery } from '@tanstack/react-query'
import { getHistoryByCategory, searchReadings } from '../services/api'

const DEFAULT_FILTERS = {
  readingName: '',
  minValue: '',
  maxValue: '',
  startTime: '',
  endTime: '',
  rangeLow: 10,
  rangeHigh: 90,
}

const normalizeSearchParams = (category, filters) => ({
  category,
  reading_name: filters.readingName || undefined,
  minValue: filters.minValue || undefined,
  maxValue: filters.maxValue || undefined,
  startTime: filters.startTime ? new Date(filters.startTime).toISOString() : undefined,
  endTime: filters.endTime ? new Date(filters.endTime).toISOString() : undefined,
})

const normalizeRecord = (payload) => ({
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

export default function CategoryWorkspace({
  category,
  liveReadings,
  wsStatus,
  onReconnect,
}) {
  const [filters, setFilters] = useState(DEFAULT_FILTERS)
  const [appliedFilters, setAppliedFilters] = useState(DEFAULT_FILTERS)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(50)
  const { addToast } = useToastStore()

  const hasFilters = useMemo(() => {
    return ['readingName', 'minValue', 'maxValue', 'startTime', 'endTime'].some(
      (key) => appliedFilters[key] !== '' && appliedFilters[key] !== null
    )
  }, [appliedFilters])

  const historyQuery = useQuery({
    queryKey: ['history', category, page, pageSize],
    queryFn: () => getHistoryByCategory(category, page, pageSize),
    enabled: !hasFilters,
  })

  const searchQuery = useQuery({
    queryKey: ['search', category, appliedFilters],
    queryFn: () => searchReadings(normalizeSearchParams(category, appliedFilters)),
    enabled: hasFilters,
  })

  const rawRecords = hasFilters
    ? searchQuery.data?.records ?? searchQuery.data ?? []
    : historyQuery.data?.records ?? historyQuery.data ?? []
  const records = Array.isArray(rawRecords) ? rawRecords.map(normalizeRecord) : []

  const totalRecords = hasFilters
    ? searchQuery.data?.total ?? records.length
    : historyQuery.data?.total ?? records.length

  const liveItems = liveReadings.slice(0, 50)

  const handleApply = () => {
    const nextFilters = {
      ...filters,
      minValue: filters.minValue || filters.rangeLow,
      maxValue: filters.maxValue || filters.rangeHigh,
    }
    setAppliedFilters(nextFilters)
    setPage(1)
    addToast({
      title: 'Filters applied',
      message: `Querying ${category} telemetry`,
      tone: 'info',
    })
  }

  const handleReset = () => {
    setFilters(DEFAULT_FILTERS)
    setAppliedFilters(DEFAULT_FILTERS)
    setPage(1)
  }

  return (
    <section className="flex flex-col gap-6">
      {(wsStatus === 'error' || wsStatus === 'closed') && (
        <div className="glass-panel flex flex-wrap items-center justify-between gap-4 border-rose-500/40 bg-rose-500/10 px-4 py-3 text-sm text-ink-100">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-rose-200">
              WebSocket Disconnected
            </p>
            <p className="mt-1 text-ink-100">
              Live readings are paused. Reconnect to resume streaming.
            </p>
          </div>
          <button type="button" className="btn-primary" onClick={onReconnect}>
            Reconnect
          </button>
        </div>
      )}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3 xl:grid-cols-5">
        {liveItems.length === 0 ? (
          <div className="glass-panel flex min-h-[160px] items-center justify-center text-sm text-ink-200 md:col-span-3 xl:col-span-5">
            Awaiting live WebSocket readings.
          </div>
        ) : (
          liveItems.map((reading, index) => (
            <LiveReadingCard key={reading.id} reading={reading} index={index} />
          ))
        )}
      </div>

      <FilterPanel
        filters={filters}
        onChange={(next) => setFilters((prev) => ({ ...prev, ...next }))}
        onApply={handleApply}
        onReset={handleReset}
        onExport={() =>
          addToast({
            title: 'Export queued',
            message: 'Export request queued for this category.',
            tone: 'info',
          })
        }
      />

      <HistoryTable
        data={records}
        isLoading={historyQuery.isLoading || searchQuery.isLoading}
        isError={historyQuery.isError || searchQuery.isError}
        page={page}
        pageSize={pageSize}
        total={totalRecords}
        onPageChange={setPage}
        onPageSizeChange={(size) => {
          setPageSize(size)
          setPage(1)
        }}
        onJumpToPage={(value) => setPage(Math.min(Math.max(value, 1), 1000))}
      />
    </section>
  )
}
