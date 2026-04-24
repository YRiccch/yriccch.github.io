import type { LocaleText } from './types'

/**
 * About 段正文。方括号里的 id 对应 mediaKeywords.ts 里的关键词，
 * 会被渲染为 <MediaBetweenText /> —— 鼠标悬停可浮出图片。
 *
 * 规则：
 *   - [id] 必须在 mediaKeywords.ts 里有同 id 的条目
 *   - **文字** 会渲染成 <b> 强调
 *   - 想加 / 删关键词，直接改这里 + mediaKeywords.ts
 */
export const aboutIntro: LocaleText = {
  zh: '我目前是 [hdu] 计算机科学与技术专业的**硕士研究生**，研究方向为 [dataviz] 与 [hci]。2026 年初开始在 [ntu] 进行为期三个月的访问研究。',
  en: "I'm a **Master's student** in Computer Science at [hdu], working on [dataviz] and [hci]. Since early 2026, I've been on a three-month visiting research stay at [ntu].",
}
