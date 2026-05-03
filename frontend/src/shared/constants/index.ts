/**
 * Shared constants barrel file
 * All application-wide constants
 */

// Application constants

export const APP_NAME = "HealthCare"
export const APP_DESCRIPTION = "Đặt lịch khám tại các phòng khám uy tín nhanh chóng và tiện lợi"

// API Configuration
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080/api"
export const API_TIMEOUT = 30000

// Routes
export const ROUTES = {
    HOME: "/",
    CLINICS: "/clinics",
    CLINIC_DETAIL: (id: string) => `/clinic/${id}`,
    DOCTORS: "/doctors",
    PACKAGES: "/packages",
    BOOKING: "/booking",
    HEALTH_GUIDE: "/health-guide",
    ABOUT: "/about",
    LOGIN: "/login",
    REGISTER: "/register",
    ACCOUNT: "/account",
    ADMIN: {
        DASHBOARD: "/admin",
        CLINICS: "/admin/clinic",
        WEBSITE: "/admin/website",
    },
} as const

// Status
export const BOOKING_STATUS = {
    PENDING: "pending",
    CONFIRMED: "confirmed",
    COMPLETED: "completed",
    CANCELLED: "cancelled",
} as const

export const CLINIC_STATUS = {
    OPEN: "open",
    CLOSED: "closed",
} as const

// Pagination
export const DEFAULT_PAGE_SIZE = 10
export const DEFAULT_PAGE = 1

// Validation
export const PHONE_REGEX = /^\d{10,11}$/
export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// Package Categories
export const PACKAGE_CATEGORIES = {
    BASIC: "basic",
    COMPREHENSIVE: "comprehensive",
    PREMIUM: "premium",
} as const

// Service Categories
export const SERVICE_CATEGORIES = [
    "general",
    "specialty",
    "laboratory",
    "vaccination",
] as const

// Time Slots
export const TIME_SLOTS = [
    "08:00",
    "08:30",
    "09:00",
    "09:30",
    "10:00",
    "10:30",
    "11:00",
    "11:30",
    "13:00",
    "13:30",
    "14:00",
    "14:30",
    "15:00",
    "15:30",
    "16:00",
    "16:30",
    "17:00",
    "17:30",
] as const

// Articles
export const ARTICLE_DEFAULTS = {
    CATEGORY: "Cẩm nang",
    READ_TIME: "5 phút",
    HOME_LIMIT: 3,
    PAGE_LIMIT: 12,
    ALL_CATEGORY_LABEL: "Tất cả",
} as const

export const ARTICLE_QUERY_KEYS = {
    LIST: (params?: { page?: number; limit?: number; q?: string; category?: string }) =>
        ["articles", params ?? {}] as const,
    FEATURED: (limit = ARTICLE_DEFAULTS.HOME_LIMIT) => ["articles", "featured", limit] as const,
    CATEGORIES: ["articles", "categories"] as const,
    BY_SLUG: (slug: string) => ["articles", "slug", slug] as const,
    BY_CATEGORY: (category: string, limit?: number) =>
        ["articles", "category", category, limit ?? null] as const,
    ADMIN: ["admin", "articles"] as const,
} as const
