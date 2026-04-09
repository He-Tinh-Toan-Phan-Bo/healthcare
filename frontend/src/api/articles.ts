import { apiClient } from '@/shared/lib/apiClient'

export type PublicArticle = {
    id: string
    title: string
    description: string
    image?: string | null
    category: string
    readTime: string
    slug: string
    publishedAt: string
}

type ArticlesListResponse = {
    items: PublicArticle[]
    page: number
    limit: number
    total: number
}

export async function getArticles(params?: {
    q?: string
    category?: string
    page?: number
    limit?: number
}) {
    const res = await apiClient.get<ArticlesListResponse>('/v1/articles', { params })
    return res.data
}

export async function getFeaturedArticles(limit?: number) {
    const res = await apiClient.get<{ items: PublicArticle[] }>('/v1/articles/featured', {
        params: limit ? { limit } : undefined,
    })
    return res.data
}

export async function getArticlesByCategory(category: string, limit?: number) {
    const res = await apiClient.get<{ items: PublicArticle[] }>(`/v1/articles/category/${encodeURIComponent(category)}`, {
        params: limit ? { limit } : undefined,
    })
    return res.data
}

export async function getArticleBySlug(slug: string) {
    const res = await apiClient.get<PublicArticle>(`/v1/articles/${slug}`)
    return res.data
}

export async function getArticleCategories() {
    const res = await apiClient.get<{ items: string[] }>('/v1/articles/categories')
    return res.data
}
