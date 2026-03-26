import { apiClient } from '@/shared/lib/apiClient'
import type { Clinic } from '@/shared/types'

type ClinicsListResponse = {
  items: Array<
    Omit<Clinic, 'rating' | 'image' | 'openingHours'> & {
      rating: string
      image?: string | null
      openingHours?: string | null
      website?: string | null
      description?: string | null
      phone?: string | null
      email?: string | null
    }
  >
  page: number
  limit: number
  total: number
}

export async function getClinics(params?: { q?: string; page?: number; limit?: number }) {
  const res = await apiClient.get<ClinicsListResponse>('/v1/clinics', { params })
  const data = res.data as any
  
  // The interceptor might have already extracted the data
  const items = data.items || []
  
  return {
    ...data,
    items: items.map((c: any) => ({
      ...c,
      rating: Number(c.rating || 0),
      numReviews: c.reviewCount || 0,
      image: c.image ?? '',
      openingHours: c.openingHours ?? '',
    })),
  }
}


export async function getClinicById(id: string) {
  const res = await apiClient.get<any>(`/v1/clinics/${id}`)
  const c = res.data
  return {
    ...c,
    rating: Number(c.rating),
    image: c.image ?? '',
    openingHours: c.openingHours ?? '',
  } as Clinic & {
    doctors?: Array<{
      id: string
      name: string
      avatar?: string | null
      experience: number
      isAvailable: boolean
      specialty: { id: string; name: string }
    }>
  }
}

