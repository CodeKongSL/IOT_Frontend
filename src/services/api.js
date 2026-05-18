import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:8080',
  timeout: 8000,
})

export const getData = async () => {
  const { data } = await api.get('/api/data')
  return data?.data ?? data ?? null
}

export const getHistory = async () => {
  const { data } = await api.get('/api/history')
  return data?.data ?? data ?? []
}

export const getHistoryByCategory = async (category, page = 1, limit = 50) => {
  const { data } = await api.get(`/api/history/${category}`, {
    params: { page, limit },
  })
  return data?.data ?? data ?? []
}

export const searchData = async (params) => {
  const { data } = await api.get('/api/search', { params })
  return data?.data ?? data ?? []
}

export const searchReadings = async (params) => {
  const { data } = await api.get('/api/search', { params })
  return data?.data ?? data ?? []
}

export const getStats = async () => {
  const { data } = await api.get('/api/stats')
  return data?.data ?? data ?? null
}

export const getLiveReadings = async (limit = 1000) => {
  const { data } = await api.get('/api/live', { params: { limit } })
  return data?.data ?? data ?? []
}

export default api
