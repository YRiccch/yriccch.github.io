import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { findMedia } from '../data/mediaKeywords'
import { pickLocale } from '../data/types'
import { currentLocale } from '../i18n'
import { useTranslation } from 'react-i18next'

/**
 * Fancy 系列之一 —— 文字里的"关键词"在悬停时浮出图片。
 * 图片在 public/mbt/<id>.jpg；若加载失败保留一个 subtle 占位，不崩溃。
 */
export function MediaBetweenText({ id }: { id: string }) {
  const [hover, setHover] = useState(false)
  const [broken, setBroken] = useState(false)
  useTranslation() // 订阅 locale 变化触发重渲染
  const locale = currentLocale()
  const media = findMedia(id)
  if (!media) return <span className="text-fg-tertiary">[{id}]</span>

  return (
    <span
      className="relative inline-block font-medium text-accent cursor-pointer border-b border-dashed border-accent/60 hover:border-accent transition-colors"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onFocus={() => setHover(true)}
      onBlur={() => setHover(false)}
      tabIndex={0}
    >
      {pickLocale(media.label, locale)}
      <AnimatePresence>
        {hover && (
          <motion.span
            initial={{ opacity: 0, y: 10, scale: 0.85 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.85 }}
            transition={{ duration: 0.22, ease: [0.22, 0.9, 0.3, 1] }}
            className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 rounded-xl overflow-hidden shadow-2xl pointer-events-none z-50 bg-card"
            style={{ width: 200 }}
          >
            {!broken ? (
              <img
                src={media.media}
                alt={pickLocale(media.alt, locale)}
                className="block w-full h-auto"
                onError={() => setBroken(true)}
              />
            ) : (
              <span className="block w-full h-[120px] flex items-center justify-center text-xs text-fg-tertiary p-3 text-center">
                {pickLocale(media.alt, locale)}
                <br />
                <span className="text-[10px] opacity-60">
                  (add: public/mbt/{id}.jpg)
                </span>
              </span>
            )}
          </motion.span>
        )}
      </AnimatePresence>
    </span>
  )
}
