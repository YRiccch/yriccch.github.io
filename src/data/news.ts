import type { LocaleText } from './types'

export type NewsItem = {
  id: string
  /** 事件日期，按实际精度填写 YYYY-MM 或 YYYY-MM-DD；页面会自动按日期倒序排列。 */
  date: string
  /** 可选行内图标，例如获奖动态使用奖章。 */
  icon?: string
  body: LocaleText
  link?: {
    label: LocaleText
    url: string
  }
}

/** 在这里添加真实动态；首页默认显示最新 3 条，其余可展开查看。 */
export const news: NewsItem[] = [
  {
    id: 'national-scholarship-2026',
    date: '2026-10',
    icon: '🏅',
    body: {
      zh: '获得**2026年硕士研究生国家奖学金**！',
      en: "Won **China's 2026 National Scholarship for Master's Students**!",
    },
  },
  {
    id: 'hege-scholarship-2026',
    date: '2026-06',
    icon: '🏅',
    body: {
      zh: '获得**2026年度黑格科技三等奖学金**！',
      en: 'Won the **Third Prize of HeyGears\u00a0Technology Scholarship**!',
    },
  },
  {
    id: 'coivis-accepted-2026',
    date: '2026-05',
    icon: '📜',
    body: {
      zh: '我们的论文 **COIVis** 被 **IEEE TVCG 2026** 录用！',
      en: 'Our paper **COIVis** is accepted by **IEEE TVCG 2026**!',
    },
  },
  {
    id: 'hypermooc-accepted-2026',
    date: '2026-01',
    icon: '📜',
    body: {
      zh: '我们的论文 **HyperMOOC** 被 **ACM CHI 2026** 录用！',
      en: 'Our paper **HyperMOOC** is accepted by **ACM CHI 2026**!',
    },
  },
]
