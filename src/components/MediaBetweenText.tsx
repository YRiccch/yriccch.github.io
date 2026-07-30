import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type FocusEvent,
  type MouseEvent,
  type PointerEvent,
} from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'motion/react'
import { findMedia } from '../data/mediaKeywords'
import { useLocale } from '../hooks/useLocale'

const PREVIEW_MAX_WIDTH = 240
const PREVIEW_MAX_HEIGHT = 220
const PREVIEW_GAP = 12
const VIEWPORT_PADDING = 12

type PreviewPosition = {
  centerX: number
  anchorY: number
  placement: 'top' | 'bottom'
  maxWidth: number
  maxHeight: number
}

/**
 * Fancy Components inspired interaction:
 * the keyword receives an underline-to-background highlight while its media
 * preview floats above the text. The preview is portaled to avoid clipping.
 */
export function MediaBetweenText({ id }: { id: string }) {
  const [active, setActive] = useState(false)
  const [zoomed, setZoomed] = useState(false)
  const [broken, setBroken] = useState(false)
  const [previewPosition, setPreviewPosition] =
    useState<PreviewPosition | null>(null)
  const triggerRef = useRef<HTMLAnchorElement | HTMLSpanElement | null>(null)
  const anchorRectIndexRef = useRef(0)
  const { L } = useLocale()
  const media = findMedia(id)

  const updatePreviewPosition = useCallback(() => {
    const trigger = triggerRef.current
    if (!trigger) return

    const clientRects = Array.from(trigger.getClientRects()).filter(
      (rect) => rect.width > 0 && rect.height > 0,
    )
    const rect =
      clientRects[
        Math.min(anchorRectIndexRef.current, clientRects.length - 1)
      ] ?? trigger.getBoundingClientRect()
    const maxWidth = Math.min(
      PREVIEW_MAX_WIDTH,
      window.innerWidth - VIEWPORT_PADDING * 2,
    )
    const idealCenterX = rect.left + rect.width / 2
    const centerX = Math.min(
      window.innerWidth - VIEWPORT_PADDING - maxWidth / 2,
      Math.max(VIEWPORT_PADDING + maxWidth / 2, idealCenterX),
    )
    const availableAbove = Math.max(
      1,
      rect.top - PREVIEW_GAP - VIEWPORT_PADDING,
    )
    const availableBelow = Math.max(
      1,
      window.innerHeight - rect.bottom - PREVIEW_GAP - VIEWPORT_PADDING,
    )
    const placement =
      availableAbove >= Math.min(PREVIEW_MAX_HEIGHT, availableBelow)
        ? 'top'
        : 'bottom'
    const maxHeight = Math.min(
      PREVIEW_MAX_HEIGHT,
      placement === 'top' ? availableAbove : availableBelow,
    )
    const anchorY =
      placement === 'top'
        ? rect.top - PREVIEW_GAP
        : rect.bottom + PREVIEW_GAP

    setPreviewPosition({
      centerX,
      anchorY,
      placement,
      maxWidth,
      maxHeight,
    })
  }, [])

  const showPreview = (
    event:
      | PointerEvent<HTMLElement>
      | MouseEvent<HTMLElement>
      | FocusEvent<HTMLElement>,
  ) => {
    const currentTarget = event.currentTarget as
      | HTMLAnchorElement
      | HTMLSpanElement
    const focusedElement = document.activeElement

    if (
      focusedElement !== currentTarget &&
      focusedElement?.getAttribute('data-media-trigger') === 'true' &&
      'blur' in focusedElement
    ) {
      ;(focusedElement as HTMLElement).blur()
    }

    triggerRef.current = currentTarget
    const clientRects = Array.from(currentTarget.getClientRects()).filter(
      (rect) => rect.width > 0 && rect.height > 0,
    )
    if ('clientX' in event && 'clientY' in event) {
      const hoveredRectIndex = clientRects.findIndex(
        (rect) =>
          event.clientX >= rect.left &&
          event.clientX <= rect.right &&
          event.clientY >= rect.top &&
          event.clientY <= rect.bottom,
      )
      anchorRectIndexRef.current =
        hoveredRectIndex >= 0 ? hoveredRectIndex : 0
    } else {
      anchorRectIndexRef.current = 0
    }
    updatePreviewPosition()
    setActive(true)
  }

  useEffect(() => {
    if (!zoomed) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setZoomed(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [zoomed])

  useEffect(() => {
    if (!active) return

    const closeOutsideTrigger = (
      event: globalThis.MouseEvent | globalThis.PointerEvent,
    ) => {
      const trigger = triggerRef.current
      const target = event.target

      if (trigger && target instanceof Node && trigger.contains(target)) return
      setActive(false)
    }

    updatePreviewPosition()
    window.addEventListener('resize', updatePreviewPosition)
    window.addEventListener('scroll', updatePreviewPosition, true)
    document.addEventListener('mousemove', closeOutsideTrigger)
    document.addEventListener('pointermove', closeOutsideTrigger)

    return () => {
      window.removeEventListener('resize', updatePreviewPosition)
      window.removeEventListener('scroll', updatePreviewPosition, true)
      document.removeEventListener('mousemove', closeOutsideTrigger)
      document.removeEventListener('pointermove', closeOutsideTrigger)
    }
  }, [active, updatePreviewPosition])

  if (!media) return <span className="text-fg-tertiary">[{id}]</span>

  const isVideo = media.type === 'video'
  const hasLink = !!media.link
  const labelText = L(media.label)
  const altText = L(media.alt)

  const triggerClass =
    'group relative isolate inline cursor-pointer align-baseline font-medium outline-none'

  const handlers = {
    onPointerEnter: showPreview,
    onPointerLeave: () => setActive(false),
    onMouseEnter: showPreview,
    onMouseMove: (event: MouseEvent<HTMLElement>) => {
      if (!active) showPreview(event)
    },
    onMouseLeave: () => setActive(false),
    onFocus: showPreview,
    onBlur: () => setActive(false),
  }

  const innerVisual = (
    <span
      className={
        'relative z-10 -mx-[3px] -my-px rounded-[3px] px-[3px] py-px text-accent ' +
        '[background-image:linear-gradient(var(--highlight-color),var(--highlight-color))] ' +
        '[background-position:0_0] [background-repeat:no-repeat] [background-size:0%_100%] ' +
        '[box-decoration-break:clone] [-webkit-box-decoration-break:clone] ' +
        'transition-[background-size,color] duration-500 ease-[cubic-bezier(0.22,0.9,0.3,1)] ' +
        'group-hover:[background-size:100%_100%] group-hover:text-onHighlight ' +
        'group-focus-visible:[background-size:100%_100%] group-focus-visible:text-onHighlight ' +
        (active ? '[background-size:100%_100%] text-onHighlight' : '')
      }
    >
      {labelText}
    </span>
  )

  const preview =
    typeof document !== 'undefined'
      ? createPortal(
          <AnimatePresence>
            {active && !zoomed && previewPosition && (
              <div
                data-media-preview
                aria-hidden="true"
                className="pointer-events-none fixed z-[900]"
                style={{
                  left: previewPosition.centerX,
                  top: previewPosition.anchorY,
                  transform:
                    previewPosition.placement === 'top'
                      ? 'translate(-50%, -100%)'
                      : 'translateX(-50%)',
                }}
              >
                <motion.figure
                  initial={{
                    opacity: 0,
                    y: previewPosition.placement === 'top' ? 12 : -12,
                    scale: 0.9,
                  }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{
                    opacity: 0,
                    y: previewPosition.placement === 'top' ? 8 : -8,
                    scale: 0.94,
                  }}
                  transition={{
                    type: 'spring',
                    stiffness: 360,
                    damping: 28,
                    mass: 0.62,
                  }}
                  className="m-0 w-fit overflow-hidden rounded-[10px] border border-line bg-card shadow-[0_18px_45px_rgba(0,0,0,0.24)]"
                >
                  {!broken ? (
                    isVideo ? (
                      <video
                        src={media.media}
                        autoPlay
                        muted
                        loop
                        playsInline
                        className="block h-auto w-auto"
                        style={{
                          maxWidth: previewPosition.maxWidth,
                          maxHeight: previewPosition.maxHeight,
                        }}
                        onError={() => setBroken(true)}
                      />
                    ) : (
                      <img
                        src={media.media}
                        alt=""
                        className="block h-auto w-auto"
                        style={{
                          maxWidth: previewPosition.maxWidth,
                          maxHeight: previewPosition.maxHeight,
                        }}
                        onError={() => setBroken(true)}
                      />
                    )
                  ) : (
                    <span
                      className="flex flex-col items-center justify-center p-3 text-center text-xs text-fg-tertiary"
                      style={{
                        width: Math.min(220, previewPosition.maxWidth),
                        height: Math.min(140, previewPosition.maxHeight),
                      }}
                    >
                      {altText}
                      <span className="mt-1 text-[10px] opacity-60">
                        (add: public{media.media})
                      </span>
                    </span>
                  )}
                </motion.figure>
              </div>
            )}
          </AnimatePresence>,
          document.body,
        )
      : null

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
          data-media-trigger="true"
          title={media.link}
          {...handlers}
        >
          {innerVisual}
        </a>
        {preview}
        {lightbox}
      </>
    )
  }

  return (
    <>
      <span
        className={triggerClass}
        data-media-trigger="true"
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
      </span>
      {preview}
      {lightbox}
    </>
  )
}
