// Environment configuration
export const env = {
    // API
    apiBaseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080/api",
    apiTimeout: Number.parseInt(process.env.NEXT_PUBLIC_API_TIMEOUT || "30000"),

    // App
    appName: process.env.NEXT_PUBLIC_APP_NAME || "HealthCare",
    appUrl: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",

    // Features
    enableAnalytics: process.env.NEXT_PUBLIC_ENABLE_ANALYTICS === "true",
    enableAuth: process.env.NEXT_PUBLIC_ENABLE_AUTH === "true",

    // Environment
    isDevelopment: process.env.NODE_ENV === "development",
    isProduction: process.env.NODE_ENV === "production",
    isTest: process.env.NODE_ENV === "test",
} as const

// Validate required environment variables
export function validateEnv() {
    const required = ["NEXT_PUBLIC_API_BASE_URL"]

    const missing = required.filter((key) => !process.env[key])

    if (missing.length > 0 && env.isProduction) {
        console.warn(`⚠️  Missing environment variables: ${missing.join(", ")}`)
    }
}
