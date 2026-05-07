import { useMemo } from 'react'
import RealtimeGauges from '../dashboard/RealtimeGauges'
import LiveCards from '../dashboard/LiveCards'
import RealtimeChart from '../dashboard/RealtimeChart'
import SensorTable from '../dashboard/SensorTable'
import useSensorData from '../hooks/useSensorData'

export default function Dashboard() {
  const { filteredData, latest, status } = useSensorData()

  const connectionLabel = useMemo(() => {
    if (status === 'open') return 'Connected'
    if (status === 'connecting') return 'Connecting'
    if (status === 'error') return 'Error'
    return 'Offline'
  }, [status])

  return (
    <div className="flex flex-col gap-6">
      <RealtimeGauges status={connectionLabel} latest={latest} />
      <LiveCards latest={latest} status={connectionLabel} />
      <RealtimeChart data={filteredData} />
      <SensorTable data={filteredData} />
    </div>
  )
}
