import type { LocaleText } from './types'

/**
 * 时间线条目。
 * - year：左栏大号年份
 * - body：右侧正文，支持 [id]（媒体关键词）和 **text**（粗体）两种行内标记
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
      zh: '在 [ntu] 进行为期三个月的访问研究，师从 [wang]。',
      en: 'Three-month visiting research stay at [ntu], mentored by [wang].',
    },
  },
  {
    id: 'masterStart',
    year: '2024',
    body: {
      zh: '开始在 [hdu] 攻读**计算机科学与技术**硕士学位。',
      en: "Started my Master's program in **Computer Science** at [hdu].",
    },
  },
  {
    id: 'bachelor',
    year: '2023',
    body: {
      zh: '在 [hdu] 获得**数字媒体技术**学士学位。',
      en: "Earned my Bachelor's degree in **Digital Media Technology** at [hdu].",
    },
  },
]
