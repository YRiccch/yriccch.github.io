import type { LocaleText } from './types'

/**
 * About 段正文。
 *   - [id]    → 渲染成 <MediaBetweenText id={id} />（悬停浮图、可放大、可外链）
 *   - **xx**  → 渲染成 <b>xx</b>（仅强调，无浮图）
 */
export const aboutIntro: LocaleText = {
  zh: '我目前是 [hdu] 计算机科学与技术专业的**硕士研究生**，所属 [vai]，导师 [zhou]，研究方向为**数据可视化**与**人机交互**。2026 年初开始在 [ntu] 进行为期三个月的访问研究。',
  en: "I'm a **Master's student** in Computer Science at [hdu], affiliated with the [vai] under [zhou], working on **Data Visualization** and **Human–Computer Interaction**. Since early 2026, I've been on a three-month visiting research stay at [ntu].",
}
