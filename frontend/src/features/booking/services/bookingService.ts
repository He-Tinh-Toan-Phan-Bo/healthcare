import { apiClient } from "@/shared/lib/client"
import type { Booking, ApiResponse, PaginatedResponse } from "@/shared/types"

export const bookingService = {
    /**
     * Create a new booking
     */
    async create(bookingData: Omit<Booking, "id" | "status">): Promise<ApiResponse<Booking>> {
        try {
            const response = await apiClient.post<ApiResponse<Booking>>("/bookings", bookingData)
            return response
        } catch (error) {
            console.error("Failed to create booking:", error)
            throw error
        }
    },

    /**
     * Get user's bookings
     */
    async getUserBookings(userId: string): Promise<PaginatedResponse<Booking>> {
        try {
            const response = await apiClient.get<PaginatedResponse<Booking>>(`/bookings/user/${userId}`)
            return response
        } catch (error) {
            console.error("Failed to get user bookings:", error)
            throw error
        }
    },

    /**
     * Get booking by ID
     */
    async getById(id: string): Promise<ApiResponse<Booking>> {
        try {
            const response = await apiClient.get<ApiResponse<Booking>>(`/bookings/${id}`)
            return response
        } catch (error) {
            console.error("Failed to get booking:", error)
            throw error
        }
    },

    /**
     * Update booking status
     */
    async updateStatus(id: string, status: Booking["status"]): Promise<ApiResponse<Booking>> {
        try {
            const response = await apiClient.patch<ApiResponse<Booking>>(`/bookings/${id}/status`, { status })
            return response
        } catch (error) {
            console.error("Failed to update booking status:", error)
            throw error
        }
    },

    /**
     * Cancel booking
     */
    async cancel(id: string): Promise<ApiResponse<Booking>> {
        try {
            const response = await apiClient.patch<ApiResponse<Booking>>(`/bookings/${id}/cancel`)
            return response
        } catch (error) {
            console.error("Failed to cancel booking:", error)
            throw error
        }
    },

    /**
     * Get available time slots for a clinic on a specific date
     */
    async getAvailableSlots(clinicId: string, date: string): Promise<ApiResponse<string[]>> {
        try {
            const response = await apiClient.get<ApiResponse<string[]>>(`/bookings/available-slots`, {
                params: { clinicId, date },
            })
            return response
        } catch (error) {
            console.error("Failed to get available slots:", error)
            throw error
        }
    },
}
