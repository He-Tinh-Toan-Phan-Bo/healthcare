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
import { useLanguage } from "@/shared/provider/LanguageProvider"
import { HOME_TEXTS } from "@/shared/constants/home"

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
  const { t } = useLanguage()
  const allCategoryLabel = t(HOME_TEXTS.PAGES.HEALTH_GUIDE.ALL_CATEGORY.vi, HOME_TEXTS.PAGES.HEALTH_GUIDE.ALL_CATEGORY.en)

  const [activeCategory, setActiveCategory] = useState<string>("ALL")
  const categoryFilter =
    activeCategory === "ALL" ? undefined : activeCategory

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
    () => [{ id: "ALL", name: allCategoryLabel }, ...(categoriesQuery.data?.items || []).map(c => ({ id: c, name: c }))],
    [categoriesQuery.data?.items, allCategoryLabel],
  )

  const articles = articlesQuery.data?.items ?? []

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1 py-12">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h1 className="mb-2 text-3xl font-bold">{t(HOME_TEXTS.ARTICLES.TITLE.vi, HOME_TEXTS.ARTICLES.TITLE.en)}</h1>
            <p className="text-muted-foreground">{t(HOME_TEXTS.ARTICLES.DESC.vi, HOME_TEXTS.ARTICLES.DESC.en)}</p>
          </div>

          {/* Categories */}
          <div className="mb-8 flex flex-wrap gap-2">
            {categories.map((category) => (
              <Badge
                key={category.id}
                variant={activeCategory === category.id ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => setActiveCategory(category.id)}
              >
                {category.name}
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
                  <Card className="h-full flex flex-col p-0 gap-0 overflow-hidden transition-shadow shadow-sm hover:shadow-lg group">
                    <div className="relative h-48 w-full bg-muted overflow-hidden flex-none">
                      <Image
                        src={article.image || `/abstract-healthcare.png?height=200&width=400&query=healthcare ${article.category}`}
                        alt={article.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                    <CardHeader className="pt-5 pb-3 flex-1">
                      <Badge variant="secondary" className="mb-2 w-fit">
                        {article.category}
                      </Badge>
                      <CardTitle className="line-clamp-2 leading-tight group-hover:text-primary transition-colors">{article.title}</CardTitle>
                      <CardDescription className="line-clamp-2 mt-1">{article.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="pb-5 pt-0 flex-none">
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
              {t(HOME_TEXTS.PAGES.HEALTH_GUIDE.EMPTY.vi, HOME_TEXTS.PAGES.HEALTH_GUIDE.EMPTY.en)}
            </p>
          ) : null}
        </div>
      </main>

      <Footer />
    </div>
  )
}
