import { useTranslation } from 'react-i18next'
import { aboutIntro } from '../data/aboutIntro'
import { interestsRotator } from '../data/interests'
import { pickLocale } from '../data/types'
import { currentLocale } from '../i18n'
import { MediaBetweenText } from './MediaBetweenText'
import { TextRotate } from './TextRotate'
import type { ReactNode } from 'react'

/**
 * About Section：
 *   - 标题（约束 min-height 防中英切换塌缩）
 *   - 正文：把 "...[id]..." 切成文字段 + MBT 组件；**文字** 会渲染成 <b>
 *   - 底部一行：Interests: [Text Rotate]
 */

function renderBoldInline(s: string): ReactNode[] {
  // 把 **xxx** 切成普通文字与 <b>xxx</b> 两种片段
  const out: ReactNode[] = []
  const re = /\*\*(.*?)\*\*/g
  let last = 0
  let m: RegExpExecArray | null
  let key = 0
  while ((m = re.exec(s)) !== null) {
    if (m.index > last) out.push(<span key={key++}>{s.slice(last, m.index)}</span>)
    out.push(<b key={key++}>{m[1]}</b>)
    last = m.index + m[0].length
  }
  if (last < s.length) out.push(<span key={key++}>{s.slice(last)}</span>)
  return out
}

export default function SectionAbout() {
  const { t } = useTranslation()
  const locale = currentLocale()
  const intro = pickLocale(aboutIntro, locale)

  // 按 [xxx] 切分；偶数下标 = 文字段，奇数下标 = id
  const segments = intro.split(/\[(\w+)\]/g)

  return (
    <section id="about" className="mb-12">
      <h2 className="text-2xl font-bold text-fg-primary mb-4 min-h-[2rem]">
        {t('about.title')}
      </h2>

      <p className="text-[1.05rem] leading-[1.7] text-fg-primary mb-6 min-h-[5.1em]">
        {segments.map((seg, i) =>
          i % 2 === 0 ? (
            // 文字段：再解析 **bold**
            <span key={i}>{renderBoldInline(seg)}</span>
          ) : (
            // 关键词 id → MBT
            <MediaBetweenText key={i} id={seg} />
          ),
        )}
      </p>

      <div className="flex items-baseline gap-2 flex-wrap text-[1rem]">
        <span className="text-fg-secondary">{t('about.interestsLabel')}:</span>
        <TextRotate items={interestsRotator} />
      </div>
    </section>
  )
}
