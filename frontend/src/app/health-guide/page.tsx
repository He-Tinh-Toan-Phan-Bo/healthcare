"use client"

import { Header } from "@/components/Header"
import { Footer } from "@/components/Footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/ui/card"
import { Badge } from "@/shared/ui/badge"
import { Clock } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useMemo, useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { getArticleCategories, getArticles } from "@/api/articles"
import { ARTICLE_DEFAULTS, ARTICLE_QUERY_KEYS, ROUTES } from "@/shared/constants"

const healthGuideSkeletonIds = [
  "health-guide-skeleton-1",
  "health-guide-skeleton-2",
  "health-guide-skeleton-3",
  "health-guide-skeleton-4",
  "health-guide-skeleton-5",
  "health-guide-skeleton-6",
]

function formatPublishedDate(value: string) {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) {
    return value
  }
  return date.toLocaleDateString("vi-VN")
}

export default function HealthGuidePage() {
  const [activeCategory, setActiveCategory] = useState<string>(ARTICLE_DEFAULTS.ALL_CATEGORY_LABEL)
  const categoryFilter =
    activeCategory === ARTICLE_DEFAULTS.ALL_CATEGORY_LABEL ? undefined : activeCategory

  const categoriesQuery = useQuery({
    queryKey: ARTICLE_QUERY_KEYS.CATEGORIES,
    queryFn: getArticleCategories,
  })

  const articlesQuery = useQuery({
    queryKey: ARTICLE_QUERY_KEYS.LIST({
      category: categoryFilter,
      page: 1,
      limit: ARTICLE_DEFAULTS.PAGE_LIMIT,
    }),
    queryFn: () =>
      getArticles({
        category: categoryFilter,
        page: 1,
        limit: ARTICLE_DEFAULTS.PAGE_LIMIT,
      }),
  })

  const categories = useMemo(
    () => [ARTICLE_DEFAULTS.ALL_CATEGORY_LABEL, ...(categoriesQuery.data?.items ?? [])],
    [categoriesQuery.data?.items],
  )

  const articles = articlesQuery.data?.items ?? []

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1 py-12">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h1 className="mb-2 text-3xl font-bold">Cẩm Nang Sức Khỏe</h1>
            <p className="text-muted-foreground">Kiến thức và lời khuyên hữu ích về chăm sóc sức khỏe</p>
          </div>

          {/* Categories */}
          <div className="mb-8 flex flex-wrap gap-2">
            {categories.map((category) => (
              <Badge
                key={category}
                variant={activeCategory === category ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => setActiveCategory(category)}
              >
                {category}
              </Badge>
            ))}
          </div>

          {/* Articles Grid */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {articlesQuery.isLoading
              ? healthGuideSkeletonIds.map((skeletonId) => (
                <Card key={skeletonId} className="h-full overflow-hidden">
                  <div className="h-48 animate-pulse bg-muted" />
                  <CardHeader>
                    <div className="mb-2 h-5 w-24 animate-pulse rounded bg-muted" />
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
                  <Card className="h-full transition-shadow hover:shadow-lg">
                    <div className="relative h-48 w-full overflow-hidden rounded-t-lg">
                      <Image
                        src={article.image || `/abstract-healthcare.png?height=200&width=400&query=healthcare ${article.category}`}
                        alt={article.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <CardHeader>
                      <Badge variant="secondary" className="mb-2 w-fit">
                        {article.category}
                      </Badge>
                      <CardTitle className="line-clamp-2">{article.title}</CardTitle>
                      <CardDescription className="line-clamp-2">{article.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          <span>{article.readTime}</span>
                        </div>
                        <span>{formatPublishedDate(article.publishedAt)}</span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
          </div>

          {!articlesQuery.isLoading && articles.length === 0 ? (
            <p className="mt-8 text-sm text-muted-foreground">
              Chưa có bài viết nào trong chuyên mục này.
            </p>
          ) : null}
        </div>
      </main>

      <Footer />
    </div>
  )
}
