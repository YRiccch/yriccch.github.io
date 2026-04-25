import type { LocaleText } from './types'

/**
 * 时间线条目。
 * - year：左栏大号年份（视觉锚点）
 * - body：右侧正文，支持两种行内标记：
 *     [id]    → 渲染成 <MediaBetweenText id={id} />（悬停浮图 / 视频，可外链）
 *     **xx**  → 渲染成 <b>xx</b>
 *   关键词配置在 src/data/mediaKeywords.ts
 * - 添加新条目时放在数组最上方（时间倒序）
 */
export type TimelineItem = {
  id: string
  year: string
  body: LocaleText
}

export const timeline: TimelineItem[] = [
  {
    id: 'ntuVisit',
    year: '2026',
    body: {
      zh: '在 [ntu] 进行为期三个月的访问研究，导师：[wang]。',
      en: 'Three-month visiting research stay at [ntu], with [wang].',
    },
  },
  {
    id: 'masterStart',
    year: '2024',
    body: {
      zh: '开始在 [hdu] 攻读硕士学位。',
      en: "Started my Master's program at [hdu].",
    },
  },
  {
    id: 'bachelor',
    year: '2023',
    body: {
      zh: '在 [hdu] 获得 [dmt] 学士学位。',
      en: "Earned my Bachelor's degree in [dmt] at [hdu].",
    },
  },
]
