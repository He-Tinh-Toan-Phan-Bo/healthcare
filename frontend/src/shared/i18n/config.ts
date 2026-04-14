import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

import vi from './locales/vi.json'
import en from './locales/en.json'

const DEFAULT_LANGUAGE = process.env.NEXT_PUBLIC_DEFAULT_LANGUAGE || 'vi'

export const resources = {
    vi: { translation: vi },
    en: { translation: en },
} as const

i18n.use(initReactI18next).init({
    resources,
    lng: DEFAULT_LANGUAGE,
    fallbackLng: 'vi',
    interpolation: {
        escapeValue: false,
    },
    react: {
        useSuspense: false,
    },
})

export default i18n
