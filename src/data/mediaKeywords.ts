import type { LocaleText } from './types'

/**
 * Media Between Text 用的"关键词 → 媒体"映射。
 *
 * 字段：
 *   - id        SSoT，正文里用 [id] 占位
 *   - label     关键词的中英显示文字
 *   - media?    可选的悬停预览 URL（图片放 public/mbt/，视频也是）
 *   - alt       无障碍描述
 *   - type?     'image'（默认）| 'video'
 *   - link?     可选外链。带 link 的关键词渲染成 <a target="_blank">
 *   - whiteBackground? 透明图预览使用白底和留白
 *   - keepLabelTogether? 保持关键词不被换行拆开
 */
export type MediaKeyword = {
  id: string
  label: LocaleText
  media?: string
  alt: LocaleText
  type?: 'image' | 'video'
  link?: string
  whiteBackground?: boolean
  keepLabelTogether?: boolean
}

export const mediaKeywords: MediaKeyword[] = [
  {
    id: 'hdu',
    label: { zh: '杭州电子科技大学', en: 'Hangzhou Dianzi University' },
    media: '/mbt/hdu.jpg',
    alt: { zh: '杭州电子科技大学校园', en: 'HDU campus' },
  },
  {
    id: 'ntu',
    // 把 CCDS（计算与数据科学学院）和 NTU 包在同一个关键词里，悬停浮一张图
    label: { zh: '南洋理工大学计算与数据科学学院', en: 'College of Computing and Data Science (CCDS), Nanyang Technological University' },
    media: '/mbt/ntu.jpg',
    alt: { zh: '南洋理工大学计算与数据科学学院（CCDS）', en: 'CCDS, NTU campus' },
  },
  {
    id: 'vida',
    label: { zh: 'VIDA Lab', en: 'VIDA Lab' },
    media: '/mbt/vida.png',
    alt: { zh: 'VIDA Lab', en: 'VIDA Lab' },
    link: 'https://vida-lab.org/',
    whiteBackground: true,
    keepLabelTogether: true,
  },
  {
    id: 'wang',
    label: { zh: '王勇教授', en: 'Prof. Yong Wang' },
    media: '/mbt/wang.jpg',
    alt: { zh: '王勇教授', en: 'Prof. Yong Wang' },
    link: 'https://yong-wang.org',
  },
  {
    id: 'vai',
    label: { zh: 'VAI 实验室', en: 'VAI Lab' },
    media: '/mbt/vai.jpg',
    alt: { zh: 'VAI 实验室', en: 'VAI Lab' },
    link: 'http://124.220.224.64:5000',
  },
  {
    id: 'zhou',
    label: { zh: '周志光教授', en: 'Prof. Zhiguang Zhou' },
    media: '/mbt/zhou.png',
    alt: { zh: '周志光教授', en: 'Prof. Zhiguang Zhou' },
    link: 'https://faculty.hdu.edu.cn/rwys/zzg2/main.htm',
  },
  {
    id: 'liu',
    label: { zh: '刘玉华老师', en: 'Prof. Yuhua Liu' },
    media: '/mbt/liu.png',
    alt: { zh: '刘玉华老师', en: 'Prof. Yuhua Liu' },
    link: 'https://faculty.hdu.edu.cn/rwys/lyh2/main.htm',
  },
]

const mediaKeywordById = new Map(
  mediaKeywords.map((keyword) => [keyword.id, keyword]),
)

/** 方便根据 id 查 media 项 */
export function findMedia(id: string): MediaKeyword | undefined {
  return mediaKeywordById.get(id)
}
