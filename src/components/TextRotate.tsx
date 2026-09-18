import * as m from 'motion/react-m'
import { useEffect, useState } from 'react'
import { AnimatePresence, useReducedMotion } from 'motion/react'
import { MOTION_EASING } from '../config/site'
import type { LocaleText } from '../data/types'
import { useLocale } from '../hooks/useLocale'
import { useAnimationActivity } from '../hooks/useAnimationActivity'

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
  const { ref, active } = useAnimationActivity<HTMLSpanElement>()

  useEffect(() => {
    if (paused || !active || items.length <= 1) return
    const intervalId = setInterval(() => {
      setIndex((i) => (i + 1) % items.length)
    }, interval)
    return () => clearInterval(intervalId)
  }, [items.length, interval, paused, active])

  const activeText = L(items[index])

  return (
    <span
      ref={ref}
      className={`relative inline-grid overflow-hidden align-baseline ${className}`}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <span
        aria-hidden="true"
        className="invisible col-start-1 row-start-1 inline-grid font-medium leading-[1.5] whitespace-nowrap"
      >
        {items.map((item, itemIndex) => (
          <span key={itemIndex} className="col-start-1 row-start-1">
            {L(item)}
          </span>
        ))}
      </span>
      <AnimatePresence mode="popLayout" initial={false}>
        <m.span
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
        </m.span>
      </AnimatePresence>
    </span>
  )
}
