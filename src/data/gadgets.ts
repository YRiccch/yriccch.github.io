import type { LocaleText } from './types'

export type GadgetAction =
  | { kind: 'download'; href: string }
  | { kind: 'web'; href: string }

/** 一个“小玩意儿”：自己设计的小程序 / 小工具。以后加新作品只需在 gadgets 里追加一项。 */
export interface Gadget {
  id: string
  name: string
  tagline: LocaleText
  description: LocaleText
  /** 图标/缩略图，放在 public/ 下 */
  icon: string
  platform: string
  version: string
  /** 下载桌面安装包，或打开独立网页工具。 */
  action: GadgetAction
}

export const gadgets: Gadget[] = [
  {
    id: 'todoflow',
    name: 'TodoFlow',
    tagline: {
      zh: '你尽管写，我帮你记',
      en: 'Just write — it remembers for you',
    },
    description: {
      zh: '把待办写成笔记，自动长成一张依赖关系图。',
      en: 'Jot to-dos like notes — they grow into a dependency graph.',
    },
    icon: '/todoflow.png',
    platform: 'Windows',
    version: 'v0.4.0',
    action: {
      kind: 'download',
      href: 'https://gitee.com/Yriccch/gadgets/releases/download/v0.4.0/TodoFlow_0.4.0_x64-setup.exe',
    },
  },
  {
    id: 'travel-map-studio',
    name: 'Travel Map Studio',
    tagline: {
      zh: '把旅行计划放回一张地图里',
      en: 'Plan your trip on one map.',
    },
    description: {
      zh: '整理地点、路线、交通和备注，并导出可携带的互动攻略。',
      en: 'Plan places, routes, transport, and notes in one map. Export an interactive guide when you are ready.',
    },
    icon: '/travel-map-studio.svg',
    platform: 'Web',
    version: 'Preview',
    action: {
      kind: 'web',
      href: 'https://yriccch.github.io/gadgets/travel-map-studio/',
    },
  },
]
