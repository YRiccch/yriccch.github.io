import type { LocaleText } from './types'

/**
 * 时间线条目。
 * - year 会被渲染成左栏大号年份（视觉锚点）
 * - body 是右侧正文，支持 **粗体** 标记（渲染时会换成 <b>...</b>）
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
      zh: '在**新加坡南洋理工大学**进行为期三个月的访问研究，导师：**Wang 教授**。',
      en: 'Three-month visiting research stay at **Nanyang Technological University**, Singapore, with **Prof. Wang**.',
    },
  },
  {
    id: 'masterStart',
    year: '2024',
    body: {
      zh: '开始在**杭州电子科技大学**攻读硕士学位。',
      en: "Started my Master's program at **Hangzhou Dianzi University**.",
    },
  },
  {
    id: 'bachelor',
    year: '2019',
    body: {
      zh: '在**杭州电子科技大学**获得**数字媒体技术**学士学位。',
      en: "Earned my Bachelor's degree in **Digital Media Technology** at **Hangzhou Dianzi University**.",
    },
  },
]
