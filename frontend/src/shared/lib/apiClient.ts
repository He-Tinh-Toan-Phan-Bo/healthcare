import axios, { AxiosError } from 'axios'
import { useAuthStore } from '@/store'

let baseURL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080'
if (baseURL.includes('127.0.0.1')) {
  baseURL = baseURL.replace('127.0.0.1', 'localhost')
}

export const apiClient = axios.create({
  baseURL,
})

apiClient.interceptors.request.use((config) => {
  if (typeof window === 'undefined') return config

  const token = useAuthStore.getState().token
  if (token) {
    config.headers = config.headers ?? {}
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

apiClient.interceptors.response.use(
  (res) => {
    // If it's the standardized response, extract .data
    if (res.data && typeof res.data === 'object' && 'data' in res.data) {
      return { ...res, data: res.data.data }
    }
    return res
  },
  (error: AxiosError) => {
    const status = error.response?.status
    if (status === 401 && typeof window !== 'undefined') {
      useAuthStore.getState().logout()
    }
    return Promise.reject(error)
  },
)


