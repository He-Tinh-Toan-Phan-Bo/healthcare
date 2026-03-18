import axios, { AxiosError } from 'axios'
import { useAuthStore } from '@/store'

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
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
  (res) => res,
  (error: AxiosError) => {
    const status = error.response?.status
    if (status === 401 && typeof window !== 'undefined') {
      useAuthStore.getState().logout()
    }
    return Promise.reject(error)
  },
)

