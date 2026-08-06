import type { LocaleText } from './types'

/**
 * 时间线条目。
 * - year：用于排序和旧展示兼容
 * - period：时间轴上的位置和展示标签，start/end 支持 YYYY-MM 或 YYYY-MM-DD
 * - body：右侧正文仅用 [id] 标记支持悬停预览的媒体关键词
 * - 添加新条目时放在数组最上方（时间倒序）
 */
export type TimelineItem = {
  id: string
  year: string
  period: {
    start: string
    end?: string
    label: LocaleText
  }
  body: LocaleText
}

export const timeline: TimelineItem[] = [
  {
    id: 'ntuVisit',
    year: '2026',
    period: {
      start: '2026-03',
      end: '2026-05',
      label: { zh: '2026.01 - 2026.04', en: 'Jan 2026 - Apr 2026' },
    },
    body: {
      zh: '在 [ntu] 进行为期三个月的访问研究，师从 [wang]。',
      en: 'Three-month visiting research stay at [ntu], mentored by [wang].',
    },
  },
  {
    id: 'masterStart',
    year: '2024',
    period: {
      start: '2024-09',
      end: '2026-07',
      label: { zh: '2024.09 - 至今', en: 'Sep 2024 - present' },
    },
    body: {
      zh: '开始在 [hdu] 攻读计算机科学与技术硕士学位，师从 [zhou]。',
      en: "Started my Master's program in Computer Science at [hdu], supervised by [zhou].",
    },
  },
  {
    id: 'bachelor',
    year: '2023',
    period: {
      start: '2023-06',
      label: { zh: '2019.09 - 2023.06', en: 'Jun 2023' },
    },
    body: {
      zh: '在 [hdu] 获得数字媒体技术学士学位，本科期间师从 [liu]。',
      en: "Earned my Bachelor's degree in Digital Media Technology at [hdu], where I was advised by [liu].",
    },
  },
]
