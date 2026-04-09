import { apiClient } from '@/shared/lib/apiClient'

export type DoctorBookingStatus = 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED'

export type DoctorBookingItem = {
    id: string
    status: DoctorBookingStatus
    bookingDate: string
    bookingTime: string
    patientName: string
    patientEmail: string
    patientPhone: string
    notes?: string | null
    clinic: { id: string; name: string; address: string }
    createdAt: string
}

export type DoctorWorkingHour = {
    dayOfWeek: number
    startTime: string
    endTime: string
}

export type DoctorServicePrice = {
    name: string
    price: number
    currency: string
}

export async function getDoctorBookings(params?: {
    status?: DoctorBookingStatus
    date?: string
}) {
    const res = await apiClient.get<{ items: DoctorBookingItem[] }>('/v1/doctor-admin/bookings', {
        params,
    })
    return res.data
}

export async function patchDoctorBookingStatus(
    id: string,
    input: { status: Exclude<DoctorBookingStatus, 'PENDING'>; cancellationReason?: string },
) {
    const res = await apiClient.patch(`/v1/doctor-admin/bookings/${id}/status`, input)
    return res.data
}

export async function getDoctorSettings() {
    const res = await apiClient.get<{
        doctor: { id: string; name: string; clinicId: string }
        settings: {
            slotDurationMinutes: number
            workingHours: DoctorWorkingHour[]
            services: DoctorServicePrice[]
        }
    }>('/v1/doctor-admin/settings')
    return res.data
}

export async function putDoctorSchedule(input: {
    slotDurationMinutes: number
    workingHours: DoctorWorkingHour[]
}) {
    const res = await apiClient.put('/v1/doctor-admin/settings/schedule', input)
    return res.data
}

export async function putDoctorServices(input: {
    services: Array<{ name: string; price: number; currency?: string }>
}) {
    const res = await apiClient.put('/v1/doctor-admin/settings/services', input)
    return res.data
}
