"use client"

import { useState } from "react"

interface UseAsyncOptions<T> {
    onSuccess?: (data: T) => void
    onError?: (error: Error) => void
}

export function useAsync<T>(
    asyncFunction: (...args: any[]) => Promise<T>,
    options?: UseAsyncOptions<T>
) {
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<Error | null>(null)
    const [data, setData] = useState<T | null>(null)

    const execute = async (...args: any[]) => {
        setIsLoading(true)
        setError(null)

        try {
            const result = await asyncFunction(...args)
            setData(result)
            options?.onSuccess?.(result)
            return result
        } catch (err) {
            const error = err instanceof Error ? err : new Error("Unknown error")
            setError(error)
            options?.onError?.(error)
            throw error
        } finally {
            setIsLoading(false)
        }
    }

    const reset = () => {
        setIsLoading(false)
        setError(null)
        setData(null)
    }

    return { execute, isLoading, error, data, reset }
}
