import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import type { LocaleText } from '../data/types'
import { pickLocale } from '../data/types'
import { currentLocale } from '../i18n'
import { useTranslation } from 'react-i18next'

/**
 * Fancy 系列之二 —— 文本轮播。
 * 每 interval ms 换一条，走 popLayout 使容器不跳动。
 * 用户 hover 时暂停轮播，方便细看。
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
  useTranslation()
  const locale = currentLocale()

  useEffect(() => {
    if (paused || items.length <= 1) return
    const tid = setInterval(() => {
      setIndex((i) => (i + 1) % items.length)
    }, interval)
    return () => clearInterval(tid)
  }, [items.length, interval, paused])

  // reduced-motion：直接显示当前项，不做切换动画
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
          {pickLocale(items[index], locale)}
        </motion.span>
      </AnimatePresence>
    </span>
  )
}
