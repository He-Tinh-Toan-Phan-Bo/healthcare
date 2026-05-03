"use client"

import { useState, useEffect } from "react"

interface UseFetchOptions {
    immediate?: boolean
}

export function useFetch<T>(
    fetchFunction: () => Promise<T>,
    options: UseFetchOptions = { immediate: true }
) {
    const [data, setData] = useState<T | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<Error | null>(null)

    const fetch = async () => {
        setIsLoading(true)
        setError(null)

        try {
            const result = await fetchFunction()
            setData(result)
            return result
        } catch (err) {
            const error = err instanceof Error ? err : new Error("Failed to fetch")
            setError(error)
            throw error
        } finally {
            setIsLoading(false)
        }
    }

    const refetch = () => fetch()

    useEffect(() => {
        if (options.immediate) {
            fetch()
        }
    }, [])

    return { data, isLoading, error, refetch }
}
