"use client"

import { Loader2 } from "lucide-react"

interface LoadingStateProps {
    isLoading: boolean
    error?: Error | null
    children: React.ReactNode
    loadingComponent?: React.ReactNode
    errorComponent?: React.ReactNode
}

export function LoadingState({
    isLoading,
    error,
    children,
    loadingComponent,
    errorComponent,
}: LoadingStateProps) {
    if (isLoading) {
        return (
            loadingComponent || (
                <div className="flex min-h-[400px] items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
            )
        )
    }

    if (error) {
        return (
            errorComponent || (
                <div className="flex min-h-[400px] items-center justify-center">
                    <div className="text-center">
                        <p className="text-lg font-semibold text-destructive">Đã xảy ra lỗi</p>
                        <p className="text-sm text-muted-foreground">{error.message}</p>
                    </div>
                </div>
            )
        )
    }

    return <>{children}</>
}
