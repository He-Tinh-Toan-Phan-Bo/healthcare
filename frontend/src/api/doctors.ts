import { apiClient } from '@/shared/lib/apiClient'
import type { Doctor } from '@/shared/types'

type DoctorsListResponse = {
  items: Doctor[]
  page: number
  limit: number
  total: number
}

export async function getDoctors(params?: { q?: string; page?: number; limit?: number }) {
  const res = await apiClient.get<DoctorsListResponse>('/v1/doctors', { params })
  return res.data
}
