import { useEffect, useState } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'motion/react'
import { MOTION_EASING } from '../config/site'
import type { LocaleText } from '../data/types'
import { useLocale } from '../hooks/useLocale'

/**
 * Fancy 系列 —— 文本轮播。
 * 每 interval ms 向上滚动一条；hover 时暂停。
 */
export function TextRotate({
  items,
  interval = 4800,
  className = '',
}: {
  items: LocaleText[]
  interval?: number
  className?: string
}) {
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const { L } = useLocale()
  const reduced = useReducedMotion()

  useEffect(() => {
    if (paused || items.length <= 1) return
    const intervalId = setInterval(() => {
      setIndex((i) => (i + 1) % items.length)
    }, interval)
    return () => clearInterval(intervalId)
  }, [items.length, interval, paused])

  const activeText = L(items[index])

  return (
    <span
      className={`relative inline-grid overflow-hidden align-baseline ${className}`}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <span
        aria-hidden="true"
        className="invisible col-start-1 row-start-1 inline-block font-medium leading-[1.5] whitespace-nowrap"
      >
        {activeText}
      </span>
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={`${index}-${activeText}`}
          initial={reduced ? false : { y: '100%' }}
          animate={{ y: 0 }}
          exit={reduced ? undefined : { y: '-100%' }}
          transition={{
            duration: reduced ? 0 : 0.34,
            ease: MOTION_EASING.verticalSwap,
          }}
          className="col-start-1 row-start-1 inline-block font-medium leading-[1.5] text-accent whitespace-nowrap"
        >
          {activeText}
        </motion.span>
      </AnimatePresence>
    </span>
  )
}
