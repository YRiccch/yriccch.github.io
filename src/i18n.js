import { createI18n } from 'vue-i18n'
import en from './languages/en.json'
import zh from './languages/zh.json'

const i18n = createI18n({
  legacy: false, // use Composition API
  language: 'en', // default locale
  fallbackLocale: 'en',
  messages: {
    en,
    zh
  }
})

export default i18n
