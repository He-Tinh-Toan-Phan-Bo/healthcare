import { API_BASE_URL, API_TIMEOUT } from "@/shared/constants"

export class ApiError extends Error {
    constructor(
        public status: number,
        message: string,
        public data?: any
    ) {
        super(message)
        this.name = "ApiError"
    }
}

export interface RequestConfig extends RequestInit {
    timeout?: number
    params?: Record<string, string | number | boolean>
}

class ApiClient {
    private readonly baseURL: string

    constructor(baseURL: string) {
        this.baseURL = baseURL
    }

    private async request<T>(endpoint: string, config: RequestConfig = {}): Promise<T> {
        const { timeout = API_TIMEOUT, params, ...fetchConfig } = config

        // Build URL with query parameters
        let url = `${this.baseURL}${endpoint}`
        if (params) {
            const searchParams = new URLSearchParams()
            Object.entries(params).forEach(([key, value]) => {
                searchParams.append(key, String(value))
            })
            url += `?${searchParams.toString()}`
        }

        // Setup timeout
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), timeout)

        try {
            const response = await fetch(url, {
                ...fetchConfig,
                signal: controller.signal,
                headers: {
                    "Content-Type": "application/json",
                    ...fetchConfig.headers,
                },
            })

            clearTimeout(timeoutId)

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}))
                throw new ApiError(response.status, errorData.message || "API request failed", errorData)
            }

            return await response.json()
        } catch (error) {
            if (error instanceof ApiError) {
                throw error
            }
            if (error instanceof Error) {
                if (error.name === "AbortError") {
                    throw new ApiError(408, "Request timeout")
                }
                throw new ApiError(500, error.message)
            }
            throw new ApiError(500, "Unknown error occurred")
        }
    }

    async get<T>(endpoint: string, config?: RequestConfig): Promise<T> {
        return this.request<T>(endpoint, { ...config, method: "GET" })
    }

    async post<T>(endpoint: string, data?: any, config?: RequestConfig): Promise<T> {
        return this.request<T>(endpoint, {
            ...config,
            method: "POST",
            body: JSON.stringify(data),
        })
    }

    async put<T>(endpoint: string, data?: any, config?: RequestConfig): Promise<T> {
        return this.request<T>(endpoint, {
            ...config,
            method: "PUT",
            body: JSON.stringify(data),
        })
    }

    async patch<T>(endpoint: string, data?: any, config?: RequestConfig): Promise<T> {
        return this.request<T>(endpoint, {
            ...config,
            method: "PATCH",
            body: JSON.stringify(data),
        })
    }

    async delete<T>(endpoint: string, config?: RequestConfig): Promise<T> {
        return this.request<T>(endpoint, { ...config, method: "DELETE" })
    }
}

export const apiClient = new ApiClient(API_BASE_URL)
