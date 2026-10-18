import * as m from 'motion/react-m'
import { useEffect, useState } from 'react'
import { AnimatePresence, useReducedMotion } from 'motion/react'
import { MOTION_EASING } from '../config/site'
import type { TextRotateItem } from '../data/types'
import { useLocale } from '../hooks/useLocale'
import { useAnimationActivity } from '../hooks/useAnimationActivity'

const CORRECTION_DELAY_MS = 420

/**
 * Fancy 系列 —— 文本轮播。
 * 普通词向下切换；特殊词露馅后轻颤、划掉并向上抽走，空一拍再补上下一个词。
 * hover 时暂停，离屏、页面隐藏或减少动态效果时停止自动播放。
 */
export function TextRotate({
  items,
  interval = 3000,
  className = '',
}: {
  items: TextRotateItem[]
  interval?: number
  className?: string
}) {
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const { L } = useLocale()
  const reduced = useReducedMotion()
  const { ref, active } = useAnimationActivity<HTMLSpanElement>()
  const activeIndex = items.length ? index % items.length : 0
  const activeItem = items[activeIndex]
  const previousItem = items[(activeIndex - 1 + items.length) % items.length]
  const duration = activeItem?.durationMs ?? interval
  const correctionDelay = previousItem?.reverseOnExit ? CORRECTION_DELAY_MS : 0

  useEffect(() => {
    if (paused || !active || items.length <= 1) return
    const timeoutId = setTimeout(() => {
      setIndex((i) => (i + 1) % items.length)
    }, duration + correctionDelay)
    return () => clearTimeout(timeoutId)
  }, [items.length, duration, correctionDelay, index, paused, active])

  if (!activeItem) return null

  const activeText = L(activeItem)

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
          key={`${activeIndex}-${activeText}`}
          initial={reduced ? false : { y: '-100%', opacity: 1 }}
          animate={{ y: 0, x: 0, rotate: 0, opacity: 1 }}
          exit={reduced ? undefined : activeItem.reverseOnExit ? {
            y: ['0%', '8%', '8%', '-150%'],
            x: [0, -2, 2, 0],
            rotate: [0, -3, 2, -6],
            opacity: [1, 1, 1, 0],
            transition: {
              duration: 0.3,
              delay: 0,
              times: [0, 0.2, 0.38, 1],
              ease: 'easeIn',
            },
          } : {
            y: '100%',
            transition: {
              duration: 0.28,
              delay: 0,
              ease: MOTION_EASING.verticalSwap,
            },
          }}
          transition={{
            duration: reduced ? 0 : previousItem?.reverseOnExit ? 0.2 : 0.34,
            delay: reduced ? 0 : correctionDelay / 1000,
            ease: MOTION_EASING.verticalSwap,
          }}
          style={{ transformOrigin: 'left center' }}
          className="col-start-1 row-start-1 inline-block font-medium leading-[1.5] text-accent whitespace-nowrap"
        >
          <span className="relative inline-block">
            {activeText}
            {activeItem.reverseOnExit && (
              <m.span
                aria-hidden="true"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 0 }}
                exit={reduced ? undefined : { scaleX: 1 }}
                transition={{ duration: reduced ? 0 : 0.08, delay: 0, ease: 'easeOut' }}
                className="pointer-events-none absolute inset-x-0 top-1/2 h-[2px] origin-left bg-highlight"
              />
            )}
          </span>
        </m.span>
      </AnimatePresence>
    </span>
  )
}
