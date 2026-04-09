/**
 * Shared types barrel file
 * All application-wide type definitions
 */

// Core types for the application

export interface Clinic {
    id: string
    name: string
    description?: string
    address: string
    phone?: string
    email?: string
    rating: number
    reviewCount: number
    numReviews?: number
    image: string
    isOpen: boolean

    openingHours: string
    specialties?: string[]
    services?: string[]
}

export interface HealthPackage {
    id: string
    name: string
    description: string
    price: number
    currency: string
    features: string[]
    isPopular?: boolean
    category: "basic" | "comprehensive" | "premium"
}

export interface Service {
    id: string
    name: string
    description: string
    icon: string
    category: string
}

export interface Article {
    id: string
    title: string
    description: string
    image: string
    category: string
    readTime: string
    publishedAt: string
    slug: string
}

export interface Booking {
    id: string
    clinicId: string
    packageId?: string
    serviceId?: string
    date: Date
    time: string
    status: "pending" | "confirmed" | "completed" | "cancelled"
    patientInfo: PatientInfo
}

export interface PatientInfo {
    name: string
    email: string
    phone: string
    dateOfBirth?: string
    gender?: "male" | "female" | "other"
    notes?: string
}

export interface User {
    id: string
    name: string
    email: string
    phone?: string
    avatar?: string
    role: "patient" | "doctor" | "admin" | "PATIENT" | "DOCTOR" | "ADMIN" | "SUPER_ADMIN"
}

export interface ApiResponse<T> {
    data: T
    message?: string
    success: boolean
    error?: string
}

export interface PaginatedResponse<T> {
    data: T[]
    pagination: {
        page: number
        limit: number
        total: number
        totalPages: number
    }
}

// Search and Filter types
export interface SearchFilters {
    query?: string
    category?: string
    location?: string
    rating?: number
    isOpen?: boolean
}

export interface SortOptions {
    field: string
    order: "asc" | "desc"
}

export interface Doctor {
    id: string
    name: string
    avatar?: string
    experience: number
    isAvailable: boolean
    specialty: { id: string; name: string }
    rating: number
    reviewCount: number
    image?: string
}

