import axios, { AxiosError, AxiosInstance } from 'axios'
import { useAuthStore } from '@/store'

const getBaseURL = (envVar: string, defaultPort: string) => {
  let url = process.env[envVar] || `http://localhost:${defaultPort}`
  return url.replace('127.0.0.1', 'localhost')
}

const apiBaseURL = getBaseURL('NEXT_PUBLIC_API_BASE_URL', '8080')
const authBaseURL = getBaseURL('NEXT_PUBLIC_AUTH_BASE_URL', '3001')
const adminBaseURL = getBaseURL('NEXT_PUBLIC_ADMIN_BASE_URL', '3002')

const setupInterceptors = (instance: AxiosInstance) => {
  instance.interceptors.request.use((config) => {
    if (typeof window === 'undefined') return config

    const token = useAuthStore.getState().token
    if (token) {
      config.headers = config.headers ?? {}
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  })

  instance.interceptors.response.use(
    (res) => {
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
  return instance
}

export const apiClient = setupInterceptors(axios.create({ baseURL: apiBaseURL }))
export const authClient = setupInterceptors(axios.create({ baseURL: authBaseURL }))
export const adminClient = setupInterceptors(axios.create({ baseURL: adminBaseURL }))


