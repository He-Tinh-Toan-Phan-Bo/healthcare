'use client'

import { useTranslation } from 'react-i18next'
import '@/shared/i18n/config'

/**
 * Custom hook for i18n
 * Wrapper around react-i18next's useTranslation
 */
export function useI18n() {
    const { t, i18n } = useTranslation()

    const changeLanguage = (lang: 'vi' | 'en') => {
        i18n.changeLanguage(lang)
    }

    const currentLanguage = i18n.language as 'vi' | 'en'

    return {
        t,
        i18n,
        changeLanguage,
        currentLanguage,
    }
}
