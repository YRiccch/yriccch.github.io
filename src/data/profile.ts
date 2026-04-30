import type { LocaleText } from './types'

/**
 * 个人基础信息 —— 所有侧边栏 + 页脚出现的个人数据都在这里。
 * 之后想改简历，只改这一个文件就够。
 */
export const profile = {
  name: {
    zh: '虞瑞麒',
    en: 'Ruiqi Yu',
  } as LocaleText,

  role: {
    zh: '硕士研究生',
    en: "Master's Student",
  } as LocaleText,

  affiliation: {
    zh: '杭州电子科技大学',
    en: 'Hangzhou Dianzi University',
  } as LocaleText,

  location: {
    zh: '中国 · 杭州',
    en: 'Hangzhou, China',
  } as LocaleText,

  motto: {
    zh: '这个放这里，那个放那里，啊这个位置不错~',
    en: 'Through iterative exploration, meaningful patterns eventually emerge.',
  } as LocaleText,

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
}
