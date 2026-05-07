import { useEffect, useMemo, useState } from 'react'
import { getHistory, searchData } from '../services/api'
import { useWebSocket } from './useWebSocket'

const DEFAULT_FILTERS = {
  tempMin: '',
  tempMax: '',
  humidityMin: '',
  humidityMax: '',
  timeWindow: 60,
  search: '',
}

const MAX_POINTS = 120

const normalizeRecord = (payload) => {
  const timestamp = payload.timestamp
    ? new Date(payload.timestamp).toISOString()
    : new Date().toISOString()

  const toNumber = (value) => {
    const parsed = Number(value)
    return Number.isFinite(parsed) ? parsed : 0
  }

  return {
    timestamp,
    temperature: toNumber(payload.temperature ?? payload.temp ?? payload.t),
    humidity: toNumber(payload.humidity ?? payload.h),
    pressure: toNumber(payload.pressure ?? payload.p),
    light: toNumber(payload.light ?? payload.l),
  }
}

export default function useSensorData() {
  const [data, setData] = useState([])
  const [filters, setFilters] = useState(DEFAULT_FILTERS)
  const { status, lastMessage } = useWebSocket('ws://localhost:8080/ws')
  const [remoteData, setRemoteData] = useState(null)

  useEffect(() => {
    let mounted = true
    getHistory()
      .then((response) => {
        if (!mounted) return
        if (Array.isArray(response)) {
          const normalized = response.map(normalizeRecord)
          setData(normalized.slice(-MAX_POINTS))
        }
      })
      .catch(() => null)

    return () => {
      mounted = false
    }
  }, [])

  useEffect(() => {
    if (!lastMessage) return
    try {
      const parsed = JSON.parse(lastMessage)
      const next = Array.isArray(parsed) ? parsed[0] : parsed
      if (!next) return
      const normalized = normalizeRecord(next)
      setData((prev) => [...prev, normalized].slice(-MAX_POINTS))
    } catch {
      // Ignore malformed messages
    }
  }, [lastMessage])

  useEffect(() => {
    const hasRange =
      filters.tempMin !== '' ||
      filters.tempMax !== '' ||
      filters.humidityMin !== '' ||
      filters.humidityMax !== ''
    const hasSearch = filters.search.trim().length > 0

    if (!hasRange && !hasSearch) {
      setRemoteData(null)
      return
    }

    const timeWindow = Number(filters.timeWindow)
    const endTime = new Date()
    const startTime =
      Number.isFinite(timeWindow) && timeWindow > 0
        ? new Date(endTime.getTime() - timeWindow * 1000)
        : null

    const params = {
      minTemp: filters.tempMin || undefined,
      maxTemp: filters.tempMax || undefined,
      minHumidity: filters.humidityMin || undefined,
      maxHumidity: filters.humidityMax || undefined,
      startTime: startTime ? startTime.toISOString() : undefined,
      endTime: endTime.toISOString(),
    }

    searchData(params)
      .then((response) => {
        if (Array.isArray(response)) {
          setRemoteData(response.map(normalizeRecord))
        }
      })
      .catch(() => null)
  }, [filters])

  const filteredData = useMemo(() => {
    const source = remoteData ?? data
    const searchValue = filters.search.trim().toLowerCase()
    const timeWindow = Number(filters.timeWindow)
    const now = Date.now()
    const windowMs = Number.isFinite(timeWindow) && timeWindow > 0
      ? timeWindow * 1000
      : null

    return source.filter((item) => {
      const time = new Date(item.timestamp).getTime()
      if (windowMs && time < now - windowMs) return false
      if (filters.tempMin !== '' && item.temperature < Number(filters.tempMin)) {
        return false
      }
      if (filters.tempMax !== '' && item.temperature > Number(filters.tempMax)) {
        return false
      }
      if (
        filters.humidityMin !== '' &&
        item.humidity < Number(filters.humidityMin)
      ) {
        return false
      }
      if (
        filters.humidityMax !== '' &&
        item.humidity > Number(filters.humidityMax)
      ) {
        return false
      }
      if (searchValue) {
        const haystack = `${item.timestamp} ${item.temperature} ${item.humidity} ${item.pressure} ${item.light}`.toLowerCase()
        if (!haystack.includes(searchValue)) return false
      }
      return true
    })
  }, [data, filters, remoteData])

  const latest = data[data.length - 1]

  return {
    data,
    filteredData,
    latest,
    status,
    filters,
    setFilters: (next) => setFilters((prev) => ({ ...prev, ...next })),
  }
}
