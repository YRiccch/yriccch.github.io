import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'motion/react'
import { findMedia } from '../data/mediaKeywords'
import { useLocale } from '../hooks/useLocale'

/**
 * Fancy 系列 —— 文字里的"关键词"在悬停时浮出图片或视频，
 * 单击可放大到 Lightbox 全屏查看（带 link 的关键词除外，链接优先）。
 *
 * 视觉效果：
 *   - 默认：仅文字（accent 色），无下划线
 *   - Hover：accent 圆角矩形从左滑出填满文字背景（Underline-to-Background），文字反白
 *   - 同时上方浮出预览：高度锚定 200px，宽度按图片原始比例自动计算
 *     · 容器 w-fit 让它 shrink-to-fit
 *     · 图片 max-w-none 解开 Tailwind preflight 默认的 max-width: 100% 限制
 *   - 单击：放大 Lightbox（无 link）；或外链跳转（有 link）
 */
export function MediaBetweenText({ id }: { id: string }) {
  const [hover, setHover] = useState(false)
  const [zoomed, setZoomed] = useState(false)
  const [broken, setBroken] = useState(false)
  const { L } = useLocale()
  const media = findMedia(id)

  useEffect(() => {
    if (!zoomed) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setZoomed(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [zoomed])

  if (!media) return <span className="text-fg-tertiary">[{id}]</span>

  const isVideo = media.type === 'video'
  const hasLink = !!media.link
  const labelText = L(media.label)
  const altText = L(media.alt)

  const triggerClass =
    'group relative isolate inline-block font-medium align-baseline cursor-pointer'

  const handlers = {
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    onFocus: () => setHover(true),
    onBlur: () => setHover(false),
  }

  const innerVisual = (
    <>
      <span
        aria-hidden
        className="absolute inset-x-[-3px] inset-y-[-1px] z-0 bg-accent rounded-md origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-[cubic-bezier(0.22,0.9,0.3,1)]"
      />
      <span className="relative z-10 text-accent transition-colors duration-300 group-hover:text-white">
        {labelText}
      </span>
    </>
  )

  // 悬停预览：高度锁定 200px，宽度由图片自然比例决定
  const popup = (
    <AnimatePresence>
      {hover && !zoomed && (
        <motion.span
          initial={{ opacity: 0, y: 10, scale: 0.85, x: '-50%' }}
          animate={{ opacity: 1, y: 0, scale: 1, x: '-50%' }}
          exit={{ opacity: 0, y: 10, scale: 0.85, x: '-50%' }}
          transition={{ duration: 0.22, ease: [0.22, 0.9, 0.3, 1] }}
          className="absolute left-1/2 bottom-full mb-2 rounded-xl overflow-hidden shadow-2xl pointer-events-none z-50 bg-card w-fit"
          style={{ height: 130 }}
        >
          {!broken ? (
            isVideo ? (
              <video
                src={media.media}
                autoPlay
                muted
                loop
                playsInline
                className="block h-full w-auto max-w-none"
                onError={() => setBroken(true)}
              />
            ) : (
              <img
                src={media.media}
                alt={altText}
                className="block h-full w-auto max-w-none"
                onError={() => setBroken(true)}
              />
            )
          ) : (
            <span className="block h-full min-w-[160px] flex items-center justify-center text-xs text-fg-tertiary p-3 text-center">
              {altText}
              <br />
              <span className="text-[10px] opacity-60">
                (add: public{media.media})
              </span>
            </span>
          )}
        </motion.span>
      )}
    </AnimatePresence>
  )

  const lightbox =
    typeof document !== 'undefined'
      ? createPortal(
          <AnimatePresence>
            {zoomed && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                onClick={() => setZoomed(false)}
                role="dialog"
                aria-modal="true"
                aria-label={labelText}
                className="fixed inset-0 bg-black/85 z-[1000] flex items-center justify-center p-6 backdrop-blur-sm"
              >
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    setZoomed(false)
                  }}
                  aria-label="Close"
                  className="absolute top-4 right-4 w-10 h-10 rounded-full border border-white/30 bg-black/40 text-white text-xl leading-none flex items-center justify-center hover:bg-white/15 hover:border-white/60 transition-colors"
                >
                  ×
                </button>
                <motion.figure
                  initial={{ scale: 0.92 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0.92 }}
                  transition={{ duration: 0.22, ease: 'easeOut' }}
                  onClick={(e) => e.stopPropagation()}
                  className="max-w-[min(1100px,92vw)] max-h-[88vh] flex flex-col items-center gap-3 m-0"
                >
                  {!broken ? (
                    isVideo ? (
                      <video
                        src={media.media}
                        autoPlay
                        loop
                        controls
                        playsInline
                        className="max-w-full max-h-[80vh] rounded-lg shadow-2xl"
                      />
                    ) : (
                      <img
                        src={media.media}
                        alt={altText}
                        className="max-w-full max-h-[80vh] rounded-lg shadow-2xl"
                      />
                    )
                  ) : (
                    <div className="text-white/90 text-sm bg-white/10 rounded-lg p-8">
                      {altText}
                      <div className="text-[11px] opacity-60 mt-2">
                        (add: public{media.media})
                      </div>
                    </div>
                  )}
                  {altText && (
                    <figcaption className="text-white/80 text-sm text-center">
                      {altText}
                    </figcaption>
                  )}
                </motion.figure>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body,
        )
      : null

  if (hasLink) {
    return (
      <>
        <a
          href={media.link}
          target="_blank"
          rel="noopener noreferrer"
          className={triggerClass}
          title={media.link}
          {...handlers}
        >
          {innerVisual}
          {popup}
        </a>
        {lightbox}
      </>
    )
  }

  return (
    <>
      <span
        className={triggerClass}
        tabIndex={0}
        role="button"
        onClick={() => setZoomed(true)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            setZoomed(true)
          }
        }}
        {...handlers}
      >
        {innerVisual}
        {popup}
      </span>
      {lightbox}
    </>
  )
}
