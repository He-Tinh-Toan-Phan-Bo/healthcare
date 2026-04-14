import type { Config } from 'jest'
import nextJest from 'next/jest'

const createJestConfig = nextJest({
    // Provide the path to your Next.js app to load next.config.js and .env files
    dir: './',
})

const config: Config = {
    coverageProvider: 'v8',
    testEnvironment: 'jsdom',
    setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],

    // Module name mapper for path aliases
    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/src/$1',
        '^@/shared/(.*)$': '<rootDir>/src/shared/$1',
        '^@/features/(.*)$': '<rootDir>/src/features/$1',
        '^@/components/(.*)$': '<rootDir>/src/components/$1',
        '^@/store/(.*)$': '<rootDir>/src/store/$1',
    },

    // Test file patterns
    testMatch: [
        '<rootDir>/src/**/__tests__/**/*.[jt]s?(x)',
        '<rootDir>/src/**/*.(test|spec).[jt]s?(x)',
    ],

    // Coverage configuration
    collectCoverageFrom: [
        'src/**/*.{js,jsx,ts,tsx}',
        '!src/**/*.d.ts',
        '!src/**/index.ts',
        '!src/app/**/*',
    ],

    // Coverage thresholds
    coverageThreshold: {
        global: {
            branches: 70,
            functions: 70,
            lines: 70,
            statements: 70,
        },
    },

    // Transform patterns
    transformIgnorePatterns: [
        '/node_modules/',
        '^.+\\.module\\.(css|sass|scss)$',
    ],
}

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config
export default createJestConfig(config)
