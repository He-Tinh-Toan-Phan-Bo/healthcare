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
