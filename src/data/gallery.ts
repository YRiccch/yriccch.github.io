import type { LocaleText } from './types'

/**
 * Life 页的标签配置 + 图片 caption。
 *
 * 标签：
 *   - key 用作文件夹名 (src/assets/gallery/<key>/)
 *   - label 对应中英双语显示
 *   - 增删标签：改 TAGS 数组 + 在 assets/gallery/ 下加 / 删对应目录
 *
 * 图片：
 *   - 无需在此登记。Life 页会自动扫描 src/assets/gallery/<tag>/ 下的图
 *   - 如需给某张图加说明，在 CAPTIONS 里加一条 "<tag>/<文件名不带扩展>" 即可
 */
export type GalleryTag = {
  key: string
  label: LocaleText
}

export const GALLERY_TAGS: GalleryTag[] = [
  { key: 'travel',      label: { zh: '旅行', en: 'Travel' } },
  { key: 'campus',      label: { zh: '校园', en: 'Campus' } },
  { key: 'friends',     label: { zh: '朋友', en: 'Friends' } },
  { key: 'performance', label: { zh: '演出', en: 'Performance' } },
  { key: 'daily',       label: { zh: '日常', en: 'Daily' } },
  { key: 'scenery',     label: { zh: '风景', en: 'Scenery' } },
]

/**
 * 图片说明。key 格式："<tag>/<文件名不带扩展>"
 * 未登记的图片不显示 caption，这是刻意的 —— 大多数照片不需要文字解释。
 */
export const GALLERY_CAPTIONS: Record<string, LocaleText> = {
  // 示例（请按需替换为真实内容）：
  // 'travel/xihu-sunset': {
  //   zh: '2025 · 西湖的黄昏',
  //   en: '2025 · Dusk at West Lake',
  // },
}
