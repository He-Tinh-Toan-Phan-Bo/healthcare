import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios'
import { API_BASE_URL, API_TIMEOUT } from '@/shared/constants'

/**
 * API Error class for handling HTTP errors
 */
export class ApiError extends Error {
    constructor(
        public status: number,
        message: string,
        public code?: string,
        public details?: unknown
    ) {
        super(message)
        this.name = 'ApiError'
    }
}

/**
 * Normalized API error response
 */
export interface ApiErrorResponse {
    code: string
    message: string
    details?: unknown
}

/**
 * Create Axios instance with default configuration
 */
const createApiInstance = (): AxiosInstance => {
    const instance = axios.create({
        baseURL: API_BASE_URL,
        timeout: API_TIMEOUT,
        headers: {
            'Content-Type': 'application/json',
        },
    })

    // Request interceptor - attach auth token
    instance.interceptors.request.use(
        (config: InternalAxiosRequestConfig) => {
            // Get token from cookies/session (not localStorage for security)
            // This will be implemented with auth context
            const token = typeof window !== 'undefined'
                ? document.cookie.split('; ').find(row => row.startsWith('token='))?.split('=')[1]
                : null

            if (token) {
                config.headers.Authorization = `Bearer ${token}`
            }

            return config
        },
        (error) => Promise.reject(error)
    )

    // Response interceptor - normalize errors
    instance.interceptors.response.use(
        (response) => response,
        (error: AxiosError<ApiErrorResponse>) => {
            if (error.response) {
                const { status, data } = error.response
                const message = data?.message || error.message || 'An error occurred'
                const code = data?.code || `HTTP_${status}`

                // Handle specific status codes
                if (status === 401) {
                    // Unauthorized - clear auth and redirect
                    if (typeof window !== 'undefined') {
                        window.dispatchEvent(new CustomEvent('auth:unauthorized'))
                    }
                }

                throw new ApiError(status, message, code, data?.details)
            }

            if (error.request) {
                // Network error
                throw new ApiError(0, 'Network error. Please check your connection.', 'NETWORK_ERROR')
            }

            throw new ApiError(500, error.message, 'UNKNOWN_ERROR')
        }
    )

    return instance
}

/**
 * Base API instance
 * Use this for all HTTP requests
 */
export const baseApi = createApiInstance()

/**
 * Typed GET request
 */
export async function apiGet<T>(url: string, params?: Record<string, unknown>): Promise<T> {
    const response = await baseApi.get<T>(url, { params })
    return response.data
}

/**
 * Typed POST request
 */
export async function apiPost<T>(url: string, data?: unknown): Promise<T> {
    const response = await baseApi.post<T>(url, data)
    return response.data
}

/**
 * Typed PUT request
 */
export async function apiPut<T>(url: string, data?: unknown): Promise<T> {
    const response = await baseApi.put<T>(url, data)
    return response.data
}

/**
 * Typed PATCH request
 */
export async function apiPatch<T>(url: string, data?: unknown): Promise<T> {
    const response = await baseApi.patch<T>(url, data)
    return response.data
}

/**
 * Typed DELETE request
 */
export async function apiDelete<T>(url: string): Promise<T> {
    const response = await baseApi.delete<T>(url)
    return response.data
}
