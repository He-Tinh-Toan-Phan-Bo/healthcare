import {
    getArticleBySlug,
    getArticles,
    getArticlesByCategory,
    getFeaturedArticles,
    type PublicArticle,
} from "@/api/articles"
import { ARTICLE_DEFAULTS } from "@/shared/constants"
import type { Article, ApiResponse, PaginatedResponse } from "@/shared/types"

function toArticle(item: PublicArticle): Article {
    return {
        id: item.id,
        title: item.title,
        description: item.description,
        image: item.image ?? "",
        category: item.category,
        readTime: item.readTime,
        publishedAt: item.publishedAt,
        slug: item.slug,
    }
}

export const articleService = {
    /**
     * Get all articles with pagination
     */
    async getAll(page = 1, limit = 10): Promise<PaginatedResponse<Article>> {
        const response = await getArticles({ page, limit })
        return {
            data: response.items.map(toArticle),
            pagination: {
                page: response.page,
                limit: response.limit,
                total: response.total,
                totalPages: Math.max(1, Math.ceil(response.total / response.limit)),
            },
        }
    },

    /**
     * Get article by slug
     */
    async getBySlug(slug: string): Promise<ApiResponse<Article>> {
        const article = await getArticleBySlug(slug)
        return {
            data: toArticle(article),
            success: true,
        }
    },

    /**
     * Get articles by category
     */
    async getByCategory(category: string): Promise<ApiResponse<Article[]>> {
        const response = await getArticlesByCategory(category)
        return {
            data: response.items.map(toArticle),
            success: true,
        }
    },

    /**
     * Get featured articles
     */
    async getFeatured(): Promise<ApiResponse<Article[]>> {
        const response = await getFeaturedArticles(ARTICLE_DEFAULTS.HOME_LIMIT)
        return {
            data: response.items.map(toArticle),
            success: true,
        }
    },
}
