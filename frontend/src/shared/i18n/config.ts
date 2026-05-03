import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// VI locales
import vi_home from './locales/vi/home';
import vi_common from './locales/vi/common';
import vi_clinics from './locales/vi/clinics';
import vi_packages from './locales/vi/packages';
import vi_doctors from './locales/vi/doctors';
import vi_articles from './locales/vi/articles';
import vi_nav from './locales/vi/nav';

// EN locales
import en_home from './locales/en/home';
import en_common from './locales/en/common';
import en_clinics from './locales/en/clinics';
import en_packages from './locales/en/packages';
import en_doctors from './locales/en/doctors';
import en_articles from './locales/en/articles';
import en_nav from './locales/en/nav';

const DEFAULT_LANGUAGE = process.env.NEXT_PUBLIC_DEFAULT_LANGUAGE || 'vi';

export const resources = {
  vi: {
    home: vi_home,
    common: vi_common,
    clinics: vi_clinics,
    packages: vi_packages,
    doctors: vi_doctors,
    articles: vi_articles,
    nav: vi_nav,
  },
  en: {
    home: en_home,
    common: en_common,
    clinics: en_clinics,
    packages: en_packages,
    doctors: en_doctors,
    articles: en_articles,
    nav: en_nav,
  },
} as const;

const isClient = typeof window !== 'undefined';

if (!i18n.isInitialized) {
  i18n.use(initReactI18next);
  
  if (isClient) {
    i18n.use(LanguageDetector);
  }

  i18n.init({
    resources,
    lng: DEFAULT_LANGUAGE,
    fallbackLng: 'vi',
    ns: ['common', 'home', 'clinics', 'packages', 'doctors', 'articles', 'nav'],
    defaultNS: 'common',
    interpolation: {
      escapeValue: false,
    },
    detection: isClient
      ? {
          order: ['localStorage', 'navigator', 'htmlTag'],
          caches: ['localStorage'],
          lookupLocalStorage: 'i18nextLng',
        }
      : undefined,
    react: {
      useSuspense: false,
    },
  });
}

export default i18n;
