import { motion, AnimatePresence } from 'motion/react'
import type { ReactNode } from 'react'
import { useLocale } from '../hooks/useLocale'

/**
 * 语言切换时给 children 做整段 fade + Y 位移过渡。
 *
 * 设计动机：
 *   富文本段落（含 MBT 关键词、加粗、虚线下划线）不能像 Letter3DSwap 那样
 *   逐字翻牌——会破坏关键词的 hover 区域和字符间动画密度。这里整段平滑替换，
 *   节奏与 Letter3DSwap 同曲线（cubic-bezier(0.22, 0.9, 0.3, 1)），
 *   所以两种过渡同时播放时观感统一。
 *
 * 使用：
 *   <LocaleSwap>
 *     <RichText text={L(aboutIntro)} />
 *   </LocaleSwap>
 *
 * 行为：
 *   - 始终输出 inline-block 的 motion.span，可放在 <p> / <div> / <li> 里
 *   - prefers-reduced-motion 下退化为静态渲染
 *   - mode="wait" 让 exit→enter 串行，避免新旧文本叠加
 */
export function LocaleSwap({
  children,
  className = '',
  duration = 0.4,
  y = 8,
}: {
  children: ReactNode
  className?: string
  duration?: number
  y?: number
}) {
  const { locale } = useLocale()

  const reduced =
    typeof window !== 'undefined' &&
    window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

  if (reduced) {
    return <span className={className}>{children}</span>
  }

  return (
    <span className={className}>
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={locale}
          initial={{ opacity: 0, y }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -y }}
          transition={{ duration, ease: [0.22, 0.9, 0.3, 1] }}
          className="inline-block"
        >
          {children}
        </motion.span>
      </AnimatePresence>
    </span>
  )
}
