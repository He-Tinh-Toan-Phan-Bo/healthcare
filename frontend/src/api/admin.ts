import { apiClient } from '@/shared/lib/apiClient'

export type AdminRole = 'PATIENT' | 'DOCTOR' | 'ADMIN'

export type AdminUser = {
    id: string
    name: string
    email: string
    phone?: string | null
    role: AdminRole
    isActive: boolean
}

export type AdminClinic = {
    id: string
    name: string
    description?: string | null
    address: string
    phone?: string | null
    email?: string | null
    website?: string | null
    image?: string | null
    openingHours?: string | null
    isOpen: boolean
    rating: string
    reviewCount: number
}

export type AdminDoctor = {
    id: string
    name: string
    experience: number
    avatar?: string | null
    bio?: string | null
    isAvailable: boolean
    clinic: { id: string; name: string }
    specialty: { id: string; name: string }
    user?: { id: string; email: string } | null
}

export type AdminArticle = {
    id: string
    title: string
    description: string
    image?: string | null
    category: string
    readTime: string
    slug: string
    publishedAt: string
    updatedAt: string
}

export async function getAdminUsers(role?: AdminRole) {
    const res = await apiClient.get<{ items: AdminUser[] }>('/v1/admin/users', {
        params: role ? { role } : undefined,
    })
    return res.data
}

export async function createAdminUser(input: {
    name: string
    email: string
    phone?: string
    password: string
    role: 'DOCTOR'
}) {
    const res = await apiClient.post<AdminUser>('/v1/admin/users', input)
    return res.data
}

export async function updateAdminUser(id: string, input: Partial<{
    name: string
    email: string
    phone: string
    password: string
    role: AdminRole
    isActive: boolean
}>) {
    const res = await apiClient.patch<AdminUser>(`/v1/admin/users/${id}`, input)
    return res.data
}

export async function deleteAdminUser(id: string) {
    const res = await apiClient.delete<{ id: string }>(`/v1/admin/users/${id}`)
    return res.data
}

export async function getAdminClinics() {
    const res = await apiClient.get<{ items: AdminClinic[] }>('/v1/admin/clinics')
    return res.data
}

export async function createAdminClinic(input: {
    name: string
    address: string
    description?: string
    phone?: string
    email?: string
    website?: string
    image?: string
    openingHours?: string
    isOpen?: boolean
}) {
    const res = await apiClient.post<AdminClinic>('/v1/admin/clinics', input)
    return res.data
}

export async function updateAdminClinic(id: string, input: Partial<{
    name: string
    address: string
    description: string
    phone: string
    email: string
    website: string
    image: string
    openingHours: string
    isOpen: boolean
}>) {
    const res = await apiClient.patch<AdminClinic>(`/v1/admin/clinics/${id}`, input)
    return res.data
}

export async function deleteAdminClinic(id: string) {
    const res = await apiClient.delete<{ id: string }>(`/v1/admin/clinics/${id}`)
    return res.data
}

export async function getAdminDoctors() {
    const res = await apiClient.get<{ items: AdminDoctor[] }>('/v1/admin/doctors')
    return res.data
}

export async function createAdminDoctor(input: {
    clinicId: string
    specialtyId: string
    userId?: string
    name: string
    experience?: number
    avatar?: string
    bio?: string
    isAvailable?: boolean
}) {
    const res = await apiClient.post<AdminDoctor>('/v1/admin/doctors', input)
    return res.data
}

export async function updateAdminDoctor(id: string, input: Partial<{
    clinicId: string
    specialtyId: string
    userId: string
    name: string
    experience: number
    avatar: string
    bio: string
    isAvailable: boolean
}>) {
    const res = await apiClient.patch<AdminDoctor>(`/v1/admin/doctors/${id}`, input)
    return res.data
}

export async function deleteAdminDoctor(id: string) {
    const res = await apiClient.delete<{ id: string }>(`/v1/admin/doctors/${id}`)
    return res.data
}

export async function getAdminArticles() {
    const res = await apiClient.get<{ items: AdminArticle[] }>('/v1/admin/articles')
    return res.data
}

export async function createAdminArticle(input: {
    title: string
    description: string
    category?: string
    readTime?: string
    image?: string
    slug?: string
}) {
    const res = await apiClient.post<AdminArticle>('/v1/admin/articles', input)
    return res.data
}

export async function updateAdminArticle(id: string, input: Partial<{
    title: string
    description: string
    category: string
    readTime: string
    image: string
    slug: string
}>) {
    const res = await apiClient.patch<AdminArticle>(`/v1/admin/articles/${id}`, input)
    return res.data
}

export async function deleteAdminArticle(id: string) {
    const res = await apiClient.delete<{ id: string }>(`/v1/admin/articles/${id}`)
    return res.data
}
