import { useMemo } from 'react'
import FilterBar from '../components/FilterBar'
import LiveCards from '../dashboard/LiveCards'
import RealtimeChart from '../dashboard/RealtimeChart'
import SensorTable from '../dashboard/SensorTable'
import useSensorData from '../hooks/useSensorData'

export default function Dashboard() {
  const {
    data,
    filteredData,
    latest,
    status,
    filters,
    setFilters,
  } = useSensorData()

  const connectionLabel = useMemo(() => {
    if (status === 'open') return 'Connected'
    if (status === 'connecting') return 'Connecting'
    if (status === 'error') return 'Error'
    return 'Offline'
  }, [status])

  return (
    <div className="flex flex-col gap-6">
      <FilterBar
        filters={filters}
        onChange={setFilters}
        status={connectionLabel}
      />
      <LiveCards latest={latest} status={connectionLabel} />
      <RealtimeChart data={filteredData} />
      <SensorTable data={filteredData} />
    </div>
  )
}
