import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import type { LocaleText } from '../data/types'
import { pickLocale } from '../data/types'

/**
 * 一站式 locale 钩子：
 *   - 通过 useTranslation() 订阅 i18n 切换（让组件在切换时重渲染）
 *   - 返回当前 locale（'zh' | 'en'）
 *   - 返回 L(text) helper：把 LocaleText 解析成当前语言的字符串
 *
 * 替代散落在各组件里的语言判断和 pickLocale 调用。
 */
export function useLocale() {
  const { i18n } = useTranslation()
  const locale = i18n.resolvedLanguage === 'zh' ? 'zh' : 'en'

  const L = useCallback(
    (text: LocaleText): string => pickLocale(text, locale),
    [locale],
  )

  return { locale, L }
}
