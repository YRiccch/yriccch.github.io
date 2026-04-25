import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import type { LocaleText } from '../data/types'
import { pickLocale } from '../data/types'
import { currentLocale } from '../i18n'

/**
 * 一站式 locale 钩子：
 *   - 通过 useTranslation() 订阅 i18n 切换（让组件在切换时重渲染）
 *   - 返回当前 locale（'zh' | 'en'）
 *   - 返回 L(text) helper：把 LocaleText 解析成当前语言的字符串
 *
 * 替代散落在各组件里的"useTranslation() + currentLocale() + pickLocale" 三步舞。
 */
export function useLocale() {
  useTranslation() // 订阅语言切换；t / i18n 没用到也无妨
  const locale = currentLocale()

  const L = useCallback(
    (text: LocaleText): string => pickLocale(text, locale),
    [locale],
  )

  return { locale, L }
}
