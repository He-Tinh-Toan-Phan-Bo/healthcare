import { Card, CardContent } from "@/shared/ui/card"
import { Skeleton } from "@/shared/ui/skeleton"

export function ClinicCardSkeleton() {
    return (
        <Card>
            <Skeleton className="h-48 w-full rounded-t-lg" />
            <CardContent className="space-y-3 pt-6">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
            </CardContent>
        </Card>
    )
}

export function PackageCardSkeleton() {
    return (
        <Card>
            <CardContent className="space-y-4 pt-6">
                <Skeleton className="h-8 w-2/3" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-10 w-full" />
            </CardContent>
        </Card>
    )
}

export function ArticleCardSkeleton() {
    return (
        <Card>
            <Skeleton className="h-48 w-full rounded-t-lg" />
            <CardContent className="space-y-3 pt-6">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-4 w-3/4" />
            </CardContent>
        </Card>
    )
}
