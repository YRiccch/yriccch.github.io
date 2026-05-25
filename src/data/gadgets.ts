import type { LocaleText } from './types'

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
  size: string
  /** 安装包下载路径（public/ 下的静态文件） */
  downloadHref: string
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
    icon: '/gadgets/todoflow.png',
    platform: 'Windows',
    version: 'v0.1.0',
    size: '≈ 1.5 MB',
    downloadHref: '/gadgets/TodoFlow_0.1.0_x64-setup.exe',
  },
]
