import { useTranslation } from 'react-i18next'
import { aboutIntro } from '../data/aboutIntro'
import { interestsRotator } from '../data/interests'
import { profile } from '../data/profile'
import { pickLocale } from '../data/types'
import { currentLocale } from '../i18n'
import { MediaBetweenText } from './MediaBetweenText'
import { TextRotate } from './TextRotate'
import type { ReactNode } from 'react'

/**
 * About Section（liubruce 风格的 Hero + Bio 合并）：
 *   - 顶部：头像（圆形）+ 姓名 + 角色 / 机构
 *   - 标题问候：about.title
 *   - 正文：把 "...[id]..." 切成文字段 + MBT 组件；**文字** 会渲染成 <b>
 *   - 底部一行：Interests: [Text Rotate]
 */

function renderBoldInline(s: string): ReactNode[] {
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
  const L = (txt: { zh: string; en: string }) => pickLocale(txt, locale)
  const intro = L(aboutIntro)

  // 按 [xxx] 切分；偶数下标 = 文字段，奇数下标 = id
  const segments = intro.split(/\[(\w+)\]/g)

  return (
    <section id="about" className="mb-14">
      {/* Hero：头像 + 姓名 + 角色 */}
      <header className="mb-8">
        <div className="w-20 h-20 rounded-full overflow-hidden bg-hover mb-5 ring-1 ring-line">
          <img
            src={profile.avatar}
            alt={L(profile.name)}
            className="w-full h-full object-cover"
            onError={(e) => {
              ;(e.currentTarget as HTMLImageElement).style.display = 'none'
            }}
          />
        </div>
        <h1 className="text-[1.65rem] font-bold text-fg-primary leading-tight m-0 min-h-[2.1rem]">
          {L(profile.name)}
        </h1>
        <p className="text-[0.95rem] text-fg-secondary mt-1.5 m-0 min-h-[1.4rem]">
          {L(profile.role)} · {L(profile.affiliation)}
        </p>
      </header>

      {/* 问候标题 */}
      <h2 className="text-[1.25rem] font-semibold text-fg-primary mb-3 min-h-[1.8rem]">
        {t('about.title')}
      </h2>

      {/* 正文 */}
      <p className="text-[1.02rem] leading-[1.75] text-fg-primary mb-5 min-h-[5.1em]">
        {segments.map((seg, i) =>
          i % 2 === 0 ? (
            <span key={i}>{renderBoldInline(seg)}</span>
          ) : (
            <MediaBetweenText key={i} id={seg} />
          ),
        )}
      </p>

      {/* Interests 轮播 */}
      <div className="flex items-baseline gap-2 flex-wrap text-[0.95rem]">
        <span className="text-fg-secondary">{t('about.interestsLabel')}:</span>
        <TextRotate items={interestsRotator} />
      </div>
    </section>
  )
}
