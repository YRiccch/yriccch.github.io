import type { LocaleText } from './types'

type Profile = {
  name: LocaleText
  role: LocaleText
  affiliation: LocaleText
  location: LocaleText
  email: string
  social: {
    github: string
  }
  avatar: string
}

/**
 * 个人基础信息。简介区和页脚共用这些数据。
 * 之后想改简历，只改这一个文件就够。
 */
export const profile = {
  name: {
    zh: '虞瑞麒',
    en: 'Ruiqi Yu',
  },

  role: {
    zh: '硕士研究生',
    en: "Master's Student",
  },

  affiliation: {
    zh: '杭州电子科技大学',
    en: 'Hangzhou Dianzi University',
  },

  location: {
    zh: '中国 · 杭州',
    en: 'Hangzhou, China',
  },

  email: 'richyu@hdu.edu.cn',

  /**
   * 社交 / 外部链接 —— 要增删只改这一块
   */
  social: {
    github: 'https://github.com/YRiccch',
    // linkedin: 'https://www.linkedin.com/in/...',
    // scholar: 'https://scholar.google.com/...',
  },

  /**
   * 头像路径：丢在 public/avatar.png 即可
   */
  avatar: '/avatar.png',
} satisfies Profile
