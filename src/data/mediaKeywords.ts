import type { LocaleText } from './types'

/**
 * Media Between Text 用的"关键词 → 图片"映射。
 *
 * 规则：
 * - id：SSoT，组件里用 <MBT keyword="ntu" /> 引用
 * - label：关键词在两种语言下显示的文字
 * - media：鼠标悬停时飘出的图片 URL（建议放在 src/assets/mbt/ 下）
 * - alt：图片无障碍描述
 *
 * 图片您可以先用占位，之后替换为真实照片。
 * 组件接在 <SectionAbout /> 的正文里。
 */
export type MediaKeyword = {
  id: string
  label: LocaleText
  media: string
  alt: LocaleText
}

// 占位图使用 public/mbt/ 下的文件。您后续把真实 jpg 按同名替换即可。
export const mediaKeywords: MediaKeyword[] = [
  {
    id: 'hdu',
    label: { zh: '杭州电子科技大学', en: 'Hangzhou Dianzi University' },
    media: '/mbt/hdu.jpg',
    alt: { zh: '杭州电子科技大学校园', en: 'HDU campus' },
  },
  {
    id: 'ntu',
    label: { zh: '新加坡南洋理工大学', en: 'NTU Singapore' },
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
]

/** 方便根据 id 查 media 项 */
export function findMedia(id: string): MediaKeyword | undefined {
  return mediaKeywords.find((m) => m.id === id)
}
