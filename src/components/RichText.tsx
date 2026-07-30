import { Fragment, type ReactNode } from 'react'
import { MediaBetweenText } from './MediaBetweenText'

/**
 * 通用富文本渲染。三种行内标记按出现顺序解析：
 *   [id]      → <MediaBetweenText id={id} />   悬停浮图、可放大、可外链
 *   {text}    → 加粗 + 静态虚线下划线（仅装饰，无交互）
 *   **text**  → <b>text</b>                    普通强调
 */
const TOKEN_PATTERN = /\[(\w+)\]|\{([^{}]+)\}|\*\*([^*]+)\*\*/g

export function RichText({ text }: { text: string }) {
  const nodes: ReactNode[] = []
  let lastIndex = 0
  let key = 0

  for (const match of text.matchAll(TOKEN_PATTERN)) {
    if (match.index > lastIndex) {
      nodes.push(
        <Fragment key={key++}>
          {text.slice(lastIndex, match.index)}
        </Fragment>,
      )
    }
    if (match[1] !== undefined) {
      nodes.push(<MediaBetweenText key={key++} id={match[1]} />)
    } else if (match[2] !== undefined) {
      nodes.push(
        <span
          key={key++}
          className="font-medium text-fg-primary"
        >
          {match[2]}
        </span>,
      )
    } else if (match[3] !== undefined) {
      nodes.push(<b key={key++}>{match[3]}</b>)
    }
    lastIndex = match.index + match[0].length
  }
  if (lastIndex < text.length) {
    nodes.push(<Fragment key={key}>{text.slice(lastIndex)}</Fragment>)
  }

  return <>{nodes}</>
}
