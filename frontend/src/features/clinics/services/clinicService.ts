import { apiClient } from "@/shared/lib/client"
import type { Clinic, ApiResponse, PaginatedResponse, SearchFilters } from "@/shared/types"
import { MOCK_CLINICS } from "@/shared/constants/mockData"

export const clinicService = {
    /**
     * Get all clinics with optional filters
     */
    async getAll(filters?: SearchFilters): Promise<PaginatedResponse<Clinic>> {
        try {
            const response = await apiClient.get<PaginatedResponse<Clinic>>("/clinics", {
                params: filters as any,
            })
            return response
        } catch (error) {
            // Fallback to mock data during development
            console.warn("API call failed, using mock data:", error)
            return {
                data: MOCK_CLINICS,
                pagination: {
                    page: 1,
                    limit: 10,
                    total: MOCK_CLINICS.length,
                    totalPages: 1,
                },
            }
        }
    },

    /**
     * Get clinic by ID
     */
    async getById(id: string): Promise<ApiResponse<Clinic>> {
        try {
            const response = await apiClient.get<ApiResponse<Clinic>>(`/clinics/${id}`)
            return response
        } catch (error) {
            // Fallback to mock data
            const clinic = MOCK_CLINICS.find((c) => c.id === id)
            if (!clinic) {
                throw new Error("Clinic not found")
            }
            return {
                data: clinic,
                success: true,
            }
        }
    },

    /**
     * Search clinics by query
     */
    async search(query: string): Promise<ApiResponse<Clinic[]>> {
        try {
            const response = await apiClient.get<ApiResponse<Clinic[]>>("/clinics/search", {
                params: { q: query },
            })
            return response
        } catch (error) {
            // Fallback to mock data
            const filtered = MOCK_CLINICS.filter(
                (clinic) =>
                    clinic.name.toLowerCase().includes(query.toLowerCase()) ||
                    clinic.description?.toLowerCase().includes(query.toLowerCase())
            )
            return {
                data: filtered,
                success: true,
            }
        }
    },

    /**
     * Get featured clinics
     */
    async getFeatured(): Promise<ApiResponse<Clinic[]>> {
        try {
            const response = await apiClient.get<ApiResponse<Clinic[]>>("/clinics/featured")
            return response
        } catch (error) {
            // Fallback to mock data - return top rated clinics
            const featured = MOCK_CLINICS.sort((a, b) => b.rating - a.rating).slice(0, 3)
            return {
                data: featured,
                success: true,
            }
        }
    },

    /**
     * Get clinics by specialty
     */
    async getBySpecialty(specialty: string): Promise<ApiResponse<Clinic[]>> {
        try {
            const response = await apiClient.get<ApiResponse<Clinic[]>>(`/clinics/specialty/${specialty}`)
            return response
        } catch (error) {
            const filtered = MOCK_CLINICS.filter((clinic) =>
                clinic.specialties?.includes(specialty)
            )
            return {
                data: filtered,
                success: true,
            }
        }
    },
}
