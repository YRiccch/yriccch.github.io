import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import en from './en'
import zh from './zh'

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      zh: { translation: zh },
    },
    fallbackLng: 'en',
    supportedLngs: ['en', 'zh'],
    interpolation: { escapeValue: false },
    detection: {
      order: ['localStorage', 'navigator'],
      lookupLocalStorage: 'blog-locale',
      caches: ['localStorage'],
    },
  })

// 同步 <html lang>
function applyDocLang(lng: string) {
  if (typeof document === 'undefined') return
  document.documentElement.lang = lng === 'zh' ? 'zh-CN' : 'en'
}

i18n.on('languageChanged', applyDocLang)
applyDocLang(i18n.resolvedLanguage ?? 'en')

/**
 * 小工具：拿到"当前 locale"这个规整的字面量（'zh' | 'en'）
 * 供 pickLocale(LocaleText, currentLocale()) 用
 */
export function currentLocale(): 'zh' | 'en' {
  return i18n.resolvedLanguage === 'zh' ? 'zh' : 'en'
}

export default i18n
