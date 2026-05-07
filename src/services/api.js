import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:8080/api',
  timeout: 8000,
})

export const getData = async () => {
  const { data } = await api.get('/data')
  return data?.data ?? null
}

export const getHistory = async () => {
  const { data } = await api.get('/history')
  return data?.data ?? []
}

export const searchData = async (params) => {
  const { data } = await api.get('/search', { params })
  return data?.data ?? []
}

export default api
