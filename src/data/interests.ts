import type { TextRotateItem } from './types'

/**
 * "Interests" Text Rotate 轮播内容 —— 研究方向 + 个人爱好合并。
 * 出现在简介后的兴趣行，普通词每 3s 切换；游戏词展示 1s 后反向撤回。
 * 想加 / 删 / 调序直接改数组；特殊词用 durationMs 和 reverseOnExit 配置。
 */
export const interestsRotator: TextRotateItem[] = [
  { zh: '数据可视化', en: 'Data Visualization' },
  { zh: '人机交互', en: 'Human–Computer Interaction' },
  { zh: '生成式 AI 与可视化的融合', en: 'Generative AI × Visualization' },
  { zh: '打篮球', en: 'Basketball' },
  { zh: 'NBA 2K', en: 'NBA 2K', durationMs: 1000, reverseOnExit: true },
  { zh: '弹吉他', en: 'Guitar' },
  { zh: '唱歌', en: 'Singing' },
  { zh: '打瓦', en: 'Valorant', durationMs: 1000, reverseOnExit: true },
  { zh: '旅行', en: 'Travel' },
]
