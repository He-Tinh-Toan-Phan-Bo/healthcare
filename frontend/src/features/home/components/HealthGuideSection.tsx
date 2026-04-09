"use client"

import { Button } from "@/shared/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/ui/card"
import { Badge } from "@/shared/ui/badge"
import { ArrowRight } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useQuery } from "@tanstack/react-query"
import { getFeaturedArticles } from "@/api/articles"
import { ARTICLE_DEFAULTS, ARTICLE_QUERY_KEYS, ROUTES } from "@/shared/constants"

const homeArticleSkeletonIds = ["article-skeleton-1", "article-skeleton-2", "article-skeleton-3"]

function formatPublishedDate(value: string) {
    const date = new Date(value)
    if (Number.isNaN(date.getTime())) {
        return value
    }
    return date.toLocaleDateString("vi-VN")
}

export function HealthGuideSection() {
    const featuredArticlesQuery = useQuery({
        queryKey: ARTICLE_QUERY_KEYS.FEATURED(ARTICLE_DEFAULTS.HOME_LIMIT),
        queryFn: () => getFeaturedArticles(ARTICLE_DEFAULTS.HOME_LIMIT),
    })

    const articles = featuredArticlesQuery.data?.items ?? []

    return (
        <section id="guidebook" className="py-12 md:py-16">
            <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between md:mb-12">
                    <div>
                        <h2 className="mb-3 text-2xl font-bold text-balance sm:text-3xl md:mb-4">Cẩm Nang Sức Khỏe</h2>
                        <p className="text-sm text-muted-foreground text-pretty sm:text-base">
                            Kiến thức và lời khuyên sức khỏe từ các chuyên gia y tế
                        </p>
                    </div>
                    <Link href={ROUTES.HEALTH_GUIDE}>
                        <Button variant="outline" className="gap-2 bg-transparent">
                            Xem Tất Cả
                            <ArrowRight className="h-4 w-4" />
                        </Button>
                    </Link>
                </div>

                <div className="grid gap-6 md:grid-cols-3">
                    {featuredArticlesQuery.isLoading
                        ? homeArticleSkeletonIds.map((skeletonId) => (
                            <Card key={skeletonId} className="overflow-hidden">
                                <div className="h-48 animate-pulse bg-muted" />
                                <CardHeader>
                                    <div className="mb-2 h-5 w-20 animate-pulse rounded bg-muted" />
                                    <div className="h-6 w-full animate-pulse rounded bg-muted" />
                                    <div className="h-4 w-4/5 animate-pulse rounded bg-muted" />
                                </CardHeader>
                                <CardContent>
                                    <div className="h-4 w-1/2 animate-pulse rounded bg-muted" />
                                </CardContent>
                            </Card>
                        ))
                        : articles.map((article) => (
                            <Link key={article.id} href={`${ROUTES.HEALTH_GUIDE}/${article.slug}`}>
                                <Card className="transition-shadow hover:shadow-lg">
                                    <div className="relative h-48 w-full overflow-hidden rounded-t-lg">
                                        <Image
                                            src={article.image || "/abstract-healthcare.png?height=240&width=480&query=health guide article"}
                                            alt={article.title}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                    <CardHeader>
                                        <Badge variant="secondary" className="mb-2 w-fit">
                                            {article.category}
                                        </Badge>
                                        <CardTitle className="text-lg">{article.title}</CardTitle>
                                        <CardDescription>{article.description}</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-sm text-muted-foreground">
                                            {article.readTime} • {formatPublishedDate(article.publishedAt)}
                                        </p>
                                    </CardContent>
                                </Card>
                            </Link>
                        ))}
                </div>

                {!featuredArticlesQuery.isLoading && articles.length === 0 ? (
                    <p className="mt-4 text-sm text-muted-foreground">
                        Chưa có bài cẩm nang nào được đăng.
                    </p>
                ) : null}
            </div>
        </section>
    )
}
