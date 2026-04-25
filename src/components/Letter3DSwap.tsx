import { motion, AnimatePresence } from 'motion/react'
import { useEffect, useState } from 'react'

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
export function Letter3DSwap({
  text,
  className = '',
  staggerMs = 35,
  duration = 0.45,
}: {
  text: string
  className?: string
  staggerMs?: number
  duration?: number
}) {
  // 跳过首次渲染（避免页面打开时所有标题都"飞"进来）
  const [hasMounted, setHasMounted] = useState(false)
  useEffect(() => {
    setHasMounted(true)
  }, [])

  const reduced =
    typeof window !== 'undefined' &&
    window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

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
              initial={hasMounted ? { rotateX: -90, opacity: 0, y: '-0.2em' } : false}
              animate={{ rotateX: 0, opacity: 1, y: 0 }}
              exit={{ rotateX: 90, opacity: 0, y: '0.2em' }}
              transition={{
                duration,
                delay: (i * staggerMs) / 1000,
                ease: [0.22, 0.9, 0.3, 1],
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
