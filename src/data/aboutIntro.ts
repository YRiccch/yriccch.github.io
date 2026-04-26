import type { LocaleText } from './types'

/**
 * About 段正文。
 *   - [id]    → <MediaBetweenText />，悬停浮图 / 可放大 / 可外链
 *   - {text}  → 加粗 + 静态虚线下划线（仅装饰，无交互）
 *   - **text** → 普通粗体
 */
export const aboutIntro: LocaleText = {
  zh: '我目前是 [hdu] 计算机科学与技术专业的**硕士研究生**，所属 [vai]，师从 [zhou]，研究方向为{数据可视化}与{人机交互}。',
  en: "I'm a **Master's student** in Computer Science at [hdu], affiliated with the [vai] and mentored by [zhou], working on {Data Visualization} and {Human–Computer Interaction}.",
}
