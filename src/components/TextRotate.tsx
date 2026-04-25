import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import type { LocaleText } from '../data/types'
import { useLocale } from '../hooks/useLocale'

/**
 * Fancy 系列 —— 文本轮播。
 * 每 interval ms 换一条；hover 时暂停。popLayout 让容器不跳动。
 */
export function TextRotate({
  items,
  interval = 2400,
  className = '',
}: {
  items: LocaleText[]
  interval?: number
  className?: string
}) {
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const { L } = useLocale()

  useEffect(() => {
    if (paused || items.length <= 1) return
    const tid = setInterval(() => {
      setIndex((i) => (i + 1) % items.length)
    }, interval)
    return () => clearInterval(tid)
  }, [items.length, interval, paused])

  const reduced =
    typeof window !== 'undefined' &&
    window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

  return (
    <span
      className={`relative inline-block align-baseline ${className}`}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <AnimatePresence mode="popLayout">
        <motion.span
          key={index}
          initial={reduced ? {} : { opacity: 0, y: 14 }}
          animate={reduced ? {} : { opacity: 1, y: 0 }}
          exit={reduced ? {} : { opacity: 0, y: -14 }}
          transition={{ duration: 0.3, ease: [0.22, 0.9, 0.3, 1] }}
          className="inline-block font-medium text-accent whitespace-nowrap"
        >
          {L(items[index])}
        </motion.span>
      </AnimatePresence>
    </span>
  )
}
