import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import en from './en'
import zh from './zh'
import { LOCALE_CONFIG, STORAGE_KEYS } from '../config/site'

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      zh: { translation: zh },
    },
    fallbackLng: LOCALE_CONFIG.fallback,
    supportedLngs: [...LOCALE_CONFIG.supported],
    interpolation: { escapeValue: false },
    detection: {
      order: ['localStorage', 'navigator'],
      lookupLocalStorage: STORAGE_KEYS.locale,
      caches: ['localStorage'],
    },
  })

// 同步 <html lang>
function applyDocLang(lng: string) {
  if (typeof document === 'undefined') return
  const locale = lng === 'zh' ? 'zh' : 'en'
  document.documentElement.lang = LOCALE_CONFIG.htmlLanguage[locale]
}

i18n.on('languageChanged', applyDocLang)
applyDocLang(i18n.resolvedLanguage ?? LOCALE_CONFIG.fallback)

export default i18n
