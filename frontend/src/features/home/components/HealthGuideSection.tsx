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
import { HOME_TEXTS } from "@/shared/constants/home"
import { useLanguage } from "@/shared/provider/LanguageProvider"
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/shared/ui/carousel"

const homeArticleSkeletonIds = ["article-skeleton-1", "article-skeleton-2", "article-skeleton-3"]

function formatPublishedDate(value: string) {
    const date = new Date(value)
    if (Number.isNaN(date.getTime())) {
        return value
    }
    return date.toLocaleDateString("vi-VN")
}

export function HealthGuideSection() {
    const { t } = useLanguage()
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
                        <h2 className="mb-3 text-2xl font-bold text-balance sm:text-3xl md:mb-4">{t(HOME_TEXTS.ARTICLES.TITLE.vi, HOME_TEXTS.ARTICLES.TITLE.en)}</h2>
                        <p className="text-sm text-muted-foreground text-pretty sm:text-base">
                            {t(HOME_TEXTS.ARTICLES.DESC.vi, HOME_TEXTS.ARTICLES.DESC.en)}
                        </p>
                    </div>
                    <Link href={ROUTES.HEALTH_GUIDE}>
                        <Button variant="outline" className="gap-2 bg-transparent border-primary/20 text-primary hover:bg-primary/5 transition-colors">
                            {t(HOME_TEXTS.ARTICLES.VIEW_ALL.vi, HOME_TEXTS.ARTICLES.VIEW_ALL.en)}
                            <ArrowRight className="h-4 w-4" />
                        </Button>
                    </Link>
                </div>

                <Carousel
                    opts={{
                        align: "start",
                        loop: false,
                    }}
                    className="w-full"
                >
                    <CarouselContent className="-ml-4">
                        {featuredArticlesQuery.isLoading
                            ? homeArticleSkeletonIds.map((skeletonId) => (
                                <CarouselItem key={skeletonId} className="pl-4 md:basis-1/2 lg:basis-1/3">
                                    <Card className="h-full overflow-hidden">
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
                                </CarouselItem>
                            ))
                            : articles.map((article) => (
                                <CarouselItem key={article.id} className="pl-4 md:basis-1/2 lg:basis-1/3">
                                    <Link href={`${ROUTES.HEALTH_GUIDE}/${article.slug}`} className="h-full block">
                                        <Card className="h-full flex flex-col p-0 gap-0 overflow-hidden transition-shadow shadow-sm hover:shadow-lg group">
                                            <div className="relative h-48 w-full bg-muted overflow-hidden flex-none">
                                                <Image
                                                    src={article.image || "/abstract-healthcare.png?height=240&width=480&query=health guide article"}
                                                    alt={article.title}
                                                    fill
                                                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                                                />
                                            </div>
                                            <CardHeader className="pt-5 pb-3 flex-1">
                                                <Badge variant="secondary" className="mb-2 w-fit">
                                                    {article.category}
                                                </Badge>
                                                <CardTitle className="text-lg leading-tight group-hover:text-primary transition-colors">{article.title}</CardTitle>
                                                <CardDescription className="line-clamp-2 mt-2">{article.description}</CardDescription>
                                            </CardHeader>
                                            <CardContent className="pb-5 pt-0 flex-none">
                                                <p className="text-sm text-muted-foreground">
                                                    {article.readTime} • {formatPublishedDate(article.publishedAt)}
                                                </p>
                                            </CardContent>
                                        </Card>
                                    </Link>
                                </CarouselItem>
                            ))}
                    </CarouselContent>
                    {(articles.length > 3 || featuredArticlesQuery.isLoading) && (
                        <>
                            <CarouselPrevious className="hidden md:flex -left-6 lg:-left-12 bg-white shadow-xl hover:bg-primary hover:text-white border-primary/10 disabled:hidden" />
                            <CarouselNext className="hidden md:flex -right-6 lg:-right-12 bg-white shadow-xl hover:bg-primary hover:text-white border-primary/10 disabled:hidden" />
                        </>
                    )}
                </Carousel>

                {!featuredArticlesQuery.isLoading && articles.length === 0 ? (
                    <p className="mt-4 text-sm text-muted-foreground">
                        {t(HOME_TEXTS.ARTICLES.EMPTY.vi, HOME_TEXTS.ARTICLES.EMPTY.en)}
                    </p>
                ) : null}
            </div>
        </section>
    )
}
