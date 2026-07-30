import type { LocaleText } from './types'

/**
 * Media Between Text 用的"关键词 → 媒体"映射。
 *
 * 字段：
 *   - id        SSoT，正文里用 [id] 占位
 *   - label     关键词的中英显示文字
 *   - media     悬停时浮出的媒体 URL（图片放 public/mbt/，视频也是）
 *   - alt       无障碍描述
 *   - type?     'image'（默认）| 'video'
 *   - link?     可选外链。带 link 的关键词渲染成 <a target="_blank">
 */
export type MediaKeyword = {
  id: string
  label: LocaleText
  media: string
  alt: LocaleText
  type?: 'image' | 'video'
  link?: string
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
    label: { zh: '南洋理工大学计算与数据科学学院', en: 'CCDS, Nanyang Technological University' },
    media: '/mbt/ntu.jpg',
    alt: { zh: '南洋理工大学计算与数据科学学院（CCDS）', en: 'CCDS, NTU campus' },
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
