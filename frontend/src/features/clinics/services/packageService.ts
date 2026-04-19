import { apiClient } from "@/shared/lib/client"
import type { HealthPackage, ApiResponse } from "@/shared/types"

export const packageService = {
    /**
     * Get all health packages
     */
    async getAll(): Promise<ApiResponse<HealthPackage[]>> {
        const response = await apiClient.get<ApiResponse<HealthPackage[]>>("/v1/packages")
        return response
    },

    /**
     * Get package by ID
     */
    async getById(id: string): Promise<ApiResponse<HealthPackage>> {
        const response = await apiClient.get<ApiResponse<HealthPackage>>(`/v1/packages/${id}`)
        return response
    },

    /**
     * Get packages by category
     */
    async getByCategory(category: string): Promise<ApiResponse<HealthPackage[]>> {
        const response = await apiClient.get<ApiResponse<HealthPackage[]>>(`/v1/packages/category/${category}`)
        return response
    },
}
