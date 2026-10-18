/**
 * 中英双语字符串的通用类型。
 * 组件里用 pickLocale(text, locale) 取出当前语言的值。
 */
export type LocaleText = { zh: string; en: string }

/** 轮播词条可单独设置停留时长和反向撤回效果。 */
export type TextRotateItem = LocaleText & {
  durationMs?: number
  reverseOnExit?: boolean
}

export function pickLocale(text: LocaleText, locale: 'zh' | 'en'): string {
  return text[locale] ?? text.en ?? text.zh ?? ''
}
