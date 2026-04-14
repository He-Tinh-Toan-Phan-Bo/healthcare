/**
 * Shared module exports
 * Import shared resources from this barrel file
 * 
 * Usage:
 * import { Button, Input } from '@/shared/ui'
 * import { useFetch, useAsync } from '@/shared/hooks'
 * import { cn } from '@/shared/utils'
 * import { API_BASE_URL } from '@/shared/constants'
 * import type { Clinic, Booking } from '@/shared/types'
 */

// Re-export all shared modules
export * from './hooks'
export * from './types'
export * from './constants'
export * from './utils'
export * from './lib'
export * from './provider'
