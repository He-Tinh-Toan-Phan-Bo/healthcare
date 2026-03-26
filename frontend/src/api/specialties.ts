import { apiClient } from '@/shared/lib/apiClient'

export type Specialty = {
  id: string
  name: string
  description?: string | null
}

export async function getSpecialties() {
  const res = await apiClient.get<{ items: Specialty[] }>('/v1/specialties')
  return res.data.items
}

