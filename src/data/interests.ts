import type { LocaleText } from './types'

/**
 * "Interests" Text Rotate 轮播内容 —— 研究方向 + 个人爱好合并。
 * 出现在姓名下方的那一行状态位，每 ~3s 切换一条。
 * 想加 / 删 / 调序 直接改这个数组即可。
 */
export const interestsRotator: LocaleText[] = [
  { zh: '数据可视化', en: 'Data Visualization' },
  { zh: '人机交互', en: 'Human–Computer Interaction' },
  { zh: '生成式 AI 与可视化的融合', en: 'Generative AI × Visualization' },
  { zh: '打篮球', en: 'Basketball' },
  { zh: '弹吉他', en: 'Guitar' },
  { zh: '唱歌', en: 'Singing' },
  { zh: '旅行', en: 'Travel' },
]
