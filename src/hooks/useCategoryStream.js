import { useEffect, useMemo, useState } from 'react'
import { useWebSocket } from './useWebSocket'

const MAX_READINGS = 80

const normalizeReading = (payload) => {
  const valueNumber = Number(payload.value)
  return {
    id: payload.id ?? `${payload.reading_name ?? payload.name ?? 'reading'}-${payload.timestamp}`,
    category: payload.category ?? 'unknown',
    subcategory: payload.subcategory ?? '--',
    reading_name: payload.reading_name ?? payload.name ?? 'Unknown',
    value: Number.isFinite(valueNumber) ? valueNumber : null,
    unit: payload.unit ?? '--',
    timestamp: payload.timestamp ?? new Date().toISOString(),
    source_plc: payload.source_plc ?? payload.plc ?? '--',
    status: (payload.status ?? 'ok').toLowerCase(),
  }
}

export default function useCategoryStream(category) {
  const { status, lastMessage, error, reconnect } = useWebSocket(
    'ws://localhost:8080/ws'
  )
  const [readings, setReadings] = useState([])

  useEffect(() => {
    if (!lastMessage) return
    try {
      const parsed = JSON.parse(lastMessage)
      const payloadCategory = parsed?.category
      const list = Array.isArray(parsed?.readings) ? parsed.readings : []
      if (!payloadCategory || payloadCategory !== category || list.length === 0) {
        return
      }
      const normalized = list.map(normalizeReading)
      setReadings((prev) => [...normalized, ...prev].slice(0, MAX_READINGS))
    } catch {
      // Ignore malformed messages
    }
  }, [category, lastMessage])

  useEffect(() => {
    setReadings([])
  }, [category])

  const latestUpdate = useMemo(() => {
    if (readings.length === 0) return null
    return readings[0]?.timestamp ?? null
  }, [readings])

  return { readings, status, error, reconnect, latestUpdate }
}
