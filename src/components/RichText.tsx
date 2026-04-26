import { Fragment, type ReactNode } from 'react'
import { MediaBetweenText } from './MediaBetweenText'

/**
 * 通用富文本渲染。三种行内标记按出现顺序解析：
 *   [id]      → <MediaBetweenText id={id} />   悬停浮图、可放大、可外链
 *   {text}    → 加粗 + 静态虚线下划线（仅装饰，无交互）
 *   **text**  → <b>text</b>                    普通强调
 */
const TOKEN_RE = /\[(\w+)\]|\{([^{}]+)\}|\*\*([^*]+)\*\*/g

export function RichText({ text }: { text: string }) {
  const out: ReactNode[] = []
  let last = 0
  let m: RegExpExecArray | null
  let key = 0

  while ((m = TOKEN_RE.exec(text)) !== null) {
    if (m.index > last) {
      out.push(<Fragment key={key++}>{text.slice(last, m.index)}</Fragment>)
    }
    if (m[1] !== undefined) {
      out.push(<MediaBetweenText key={key++} id={m[1]} />)
    } else if (m[2] !== undefined) {
      out.push(
        <span
          key={key++}
          className="font-medium border-b border-dashed border-fg-tertiary/50"
        >
          {m[2]}
        </span>,
      )
    } else if (m[3] !== undefined) {
      out.push(<b key={key++}>{m[3]}</b>)
    }
    last = m.index + m[0].length
  }
  if (last < text.length) {
    out.push(<Fragment key={key++}>{text.slice(last)}</Fragment>)
  }

  return <>{out}</>
}
