import { Fragment, type ReactNode } from 'react'
import { MediaBetweenText } from './MediaBetweenText'

/**
 * 通用富文本渲染：
 *   - "[id]" 占位 → <MediaBetweenText id={id} />
 *   - "**xx**"      → <b>xx</b>
 *
 * 同时被 SectionAbout / SectionTimeline 使用，方便保持一致的 markup 风格。
 */
export function RichText({ text }: { text: string }) {
  // 先按 [id] 切；偶数下标 = 普通文字（再处理 bold），奇数下标 = mediaKeyword id
  const segments = text.split(/\[(\w+)\]/g)
  return (
    <>
      {segments.map((seg, i) =>
        i % 2 === 0 ? (
          <Fragment key={i}>{renderBold(seg)}</Fragment>
        ) : (
          <MediaBetweenText key={i} id={seg} />
        ),
      )}
    </>
  )
}

function renderBold(s: string): ReactNode[] {
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
