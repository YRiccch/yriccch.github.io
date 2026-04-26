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
    label: { zh: '新加坡南洋理工大学', en: 'Nanyang Technological University' },
    media: '/mbt/ntu.jpg',
    alt: { zh: '南洋理工大学校园', en: 'NTU campus' },
  },
  {
    id: 'dataviz',
    label: { zh: '数据可视化', en: 'Data Visualization' },
    media: '/mbt/dataviz.jpg',
    alt: { zh: '数据可视化作品截图', en: 'Data visualization project' },
  },
  {
    id: 'hci',
    label: { zh: '人机交互', en: 'Human–Computer Interaction' },
    media: '/mbt/hci.jpg',
    alt: { zh: '人机交互项目截图', en: 'HCI project' },
  },
  {
    id: 'wang',
    label: { zh: 'Wang 教授', en: 'Prof. Wang' },
    media: '/mbt/wang.jpg',
    alt: { zh: 'Wang 教授', en: 'Prof. Yong Wang' },
    link: 'https://yong-wang.org',
  },
  {
    id: 'dmt',
    label: { zh: '数字媒体技术', en: 'Digital Media Technology' },
    media: '/mbt/dmt.jpg',
    alt: { zh: '数字媒体技术专业', en: 'Digital Media Technology' },
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
    media: '/mbt/zhou.jpg',
    alt: { zh: '周志光教授', en: 'Prof. Zhiguang Zhou' },
    link: 'https://hdvis.net',
  },
  {
    id: 'cs',
    label: { zh: '计算机科学与技术', en: 'Computer Science' },
    media: '/mbt/cs.jpg',
    alt: { zh: '计算机科学与技术', en: 'Computer Science' },
  },
]

/** 方便根据 id 查 media 项 */
export function findMedia(id: string): MediaKeyword | undefined {
  return mediaKeywords.find((m) => m.id === id)
}
