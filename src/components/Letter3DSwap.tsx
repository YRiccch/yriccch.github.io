import { memo } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { MEDIA_QUERIES, MOTION_EASING } from '../config/site'

type Letter3DSwapProps = {
  text: string
  className?: string
  staggerMs?: number
  duration?: number
}

/**
 * Fancy 系列 —— Letter 3D Swap。
 *
 * 当 text prop 变化时，旧文本的每个字母依次 X 轴向后翻转消失，
 * 新文本的每个字母依次 X 轴向前翻转出现。stagger 制造"逐字翻牌"效果。
 *
 * 适合短标题 / 名字 / 角色等短文本；不建议套在长段落上（视觉太密集）。
 *
 * 用法：
 *   <Letter3DSwap text={t('about.title')} className="text-2xl font-bold" />
 *
 * 当 text 没变（同一帧重新渲染）时不会重新动画，靠 React key={text} 实现。
 */
function Letter3DSwapComponent({
  text,
  className = '',
  staggerMs = 35,
  duration = 0.45,
}: Letter3DSwapProps) {
  const reduced =
    typeof window !== 'undefined' &&
    window.matchMedia?.(MEDIA_QUERIES.reducedMotion).matches

  if (reduced) {
    return <span className={className}>{text}</span>
  }

  return (
    <span
      className={`inline-block ${className}`}
      style={{ perspective: '700px' }}
    >
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={text}
          className="inline-block"
          style={{ transformStyle: 'preserve-3d' }}
        >
          {Array.from(text).map((ch, i) => (
            <motion.span
              key={`${i}-${ch}`}
              className="inline-block"
              style={{ transformStyle: 'preserve-3d', backfaceVisibility: 'hidden' }}
              initial={{ rotateX: -90, opacity: 0, y: '-0.2em' }}
              animate={{ rotateX: 0, opacity: 1, y: 0 }}
              exit={{ rotateX: 90, opacity: 0, y: '0.2em' }}
              transition={{
                duration,
                delay: (i * staggerMs) / 1000,
                ease: MOTION_EASING.standard,
              }}
            >
              {ch === ' ' ? '\u00A0' : ch}
            </motion.span>
          ))}
        </motion.span>
      </AnimatePresence>
    </span>
  )
}

export const Letter3DSwap = memo(Letter3DSwapComponent)
