/**
 * 中英双语字符串的通用类型。
 * 组件里用 pickLocale(text, locale) 取出当前语言的值。
 */
export type LocaleText = { zh: string; en: string }

export function pickLocale(text: LocaleText, locale: 'zh' | 'en'): string {
  return text[locale] ?? text.en ?? text.zh ?? ''
}
