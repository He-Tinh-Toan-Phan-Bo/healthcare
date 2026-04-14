import { apiClient } from "@/shared/lib/client"
import type { Article, ApiResponse, PaginatedResponse } from "@/shared/types"
import { MOCK_ARTICLES } from "@/shared/constants/mockData"

export const articleService = {
    /**
     * Get all articles with pagination
     */
    async getAll(page = 1, limit = 10): Promise<PaginatedResponse<Article>> {
        try {
            const response = await apiClient.get<PaginatedResponse<Article>>("/articles", {
                params: { page, limit },
            })
            return response
        } catch (error) {
            // Fallback to mock data
            return {
                data: MOCK_ARTICLES,
                pagination: {
                    page: 1,
                    limit: 10,
                    total: MOCK_ARTICLES.length,
                    totalPages: 1,
                },
            }
        }
    },

    /**
     * Get article by slug
     */
    async getBySlug(slug: string): Promise<ApiResponse<Article>> {
        try {
            const response = await apiClient.get<ApiResponse<Article>>(`/articles/${slug}`)
            return response
        } catch (error) {
            const article = MOCK_ARTICLES.find((a) => a.slug === slug)
            if (!article) {
                throw new Error("Article not found")
            }
            return {
                data: article,
                success: true,
            }
        }
    },

    /**
     * Get articles by category
     */
    async getByCategory(category: string): Promise<ApiResponse<Article[]>> {
        try {
            const response = await apiClient.get<ApiResponse<Article[]>>(`/articles/category/${category}`)
            return response
        } catch (error) {
            const filtered = MOCK_ARTICLES.filter((article) => article.category === category)
            return {
                data: filtered,
                success: true,
            }
        }
    },

    /**
     * Get featured articles
     */
    async getFeatured(): Promise<ApiResponse<Article[]>> {
        try {
            const response = await apiClient.get<ApiResponse<Article[]>>("/articles/featured")
            return response
        } catch (error) {
            return {
                data: MOCK_ARTICLES.slice(0, 3),
                success: true,
            }
        }
    },
}
