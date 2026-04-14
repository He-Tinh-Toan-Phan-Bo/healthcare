import { apiClient } from "@/shared/lib/client"
import type { HealthPackage, ApiResponse } from "@/shared/types"
import { MOCK_PACKAGES } from "@/shared/constants/mockData"

export const packageService = {
    /**
     * Get all health packages
     */
    async getAll(): Promise<ApiResponse<HealthPackage[]>> {
        try {
            const response = await apiClient.get<ApiResponse<HealthPackage[]>>("/packages")
            return response
        } catch (error) {
            // Fallback to mock data
            console.warn("API call failed, using mock data:", error)
            return {
                data: MOCK_PACKAGES,
                success: true,
            }
        }
    },

    /**
     * Get package by ID
     */
    async getById(id: string): Promise<ApiResponse<HealthPackage>> {
        try {
            const response = await apiClient.get<ApiResponse<HealthPackage>>(`/packages/${id}`)
            return response
        } catch (error) {
            const pkg = MOCK_PACKAGES.find((p) => p.id === id)
            if (!pkg) {
                throw new Error("Package not found")
            }
            return {
                data: pkg,
                success: true,
            }
        }
    },

    /**
     * Get packages by category
     */
    async getByCategory(category: string): Promise<ApiResponse<HealthPackage[]>> {
        try {
            const response = await apiClient.get<ApiResponse<HealthPackage[]>>(`/packages/category/${category}`)
            return response
        } catch (error) {
            const filtered = MOCK_PACKAGES.filter((pkg) => pkg.category === category)
            return {
                data: filtered,
                success: true,
            }
        }
    },
}
