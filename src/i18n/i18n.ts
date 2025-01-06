import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import en from './translations/en.json';
import nl from './translations/nl.json';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      nl: { translation: nl }
    },
    fallbackLng: 'nl',
    detection: {
      order: ['cookie', 'localstorage', 'navigator', 'htmlTag', 'path', 'subdomain'],
      caches: ['localStorage', 'cookie'],
      lookupLocalStorage: 'i18nextLng',
      lookupCookie: 'i18next',
      lookupFromPathIndex: 0,
      lookupFromSubdomainIndex: 0
    },
    supportedLngs: ['en', 'nl'],
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;