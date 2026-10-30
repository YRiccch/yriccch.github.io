import * as m from 'motion/react-m'
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
import { AnimatePresence, useReducedMotion } from 'motion/react'
import { findMedia } from '../data/mediaKeywords'
import { useLocale } from '../hooks/useLocale'
import { imageSource } from '../data/imageSources'

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
  const pointerRef = useRef<{ x: number; y: number } | null>(null)
  const positionFrameRef = useRef<number | null>(null)
  const { L } = useLocale()
  const reducedMotion = useReducedMotion()
  const media = findMedia(id)

  const updatePreviewPosition = useCallback(() => {
    const trigger = triggerRef.current
    if (!trigger) return

    const clientRects = Array.from(trigger.getClientRects()).filter(
      (rect) => rect.width > 0 && rect.height > 0,
    )
    const pointer = pointerRef.current
    if (pointer) {
      const pointerIndex = clientRects.findIndex((rect) =>
        pointer.x >= rect.left && pointer.x <= rect.right &&
        pointer.y >= rect.top && pointer.y <= rect.bottom,
      )
      if (pointerIndex >= 0) anchorRectIndexRef.current = pointerIndex
    }
    const rect =
      clientRects[
        Math.min(anchorRectIndexRef.current, clientRects.length - 1)
      ] ?? trigger.getBoundingClientRect()
    const maxWidth = Math.min(
      PREVIEW_MAX_WIDTH,
      window.innerWidth - VIEWPORT_PADDING * 2,
    )
    const rectCenterX = rect.left + rect.width / 2
    const pointerX = pointer ? Math.min(rect.right, Math.max(rect.left, pointer.x)) : rectCenterX
    const idealCenterX = rectCenterX + (pointerX - rectCenterX) * 0.5
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

    setPreviewPosition((current) => {
      if (current && current.centerX === centerX && current.anchorY === anchorY &&
        current.placement === placement && current.maxWidth === maxWidth &&
        current.maxHeight === maxHeight) return current
      return { centerX, anchorY, placement, maxWidth, maxHeight }
    })
  }, [])

  const schedulePosition = useCallback(() => {
    if (positionFrameRef.current !== null) return
    positionFrameRef.current = requestAnimationFrame(() => {
      positionFrameRef.current = null
      updatePreviewPosition()
    })
  }, [updatePreviewPosition])

  const hidePreview = useCallback(() => {
    pointerRef.current = null
    if (positionFrameRef.current !== null) cancelAnimationFrame(positionFrameRef.current)
    positionFrameRef.current = null
    setActive(false)
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
    if ('clientX' in event && 'clientY' in event &&
      (!('pointerType' in event) || event.pointerType !== 'touch')) {
      pointerRef.current = { x: event.clientX, y: event.clientY }
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
      pointerRef.current = null
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
      hidePreview()
    }

    const onViewportChange = () => {
      const pointer = pointerRef.current
      const trigger = triggerRef.current
      if (trigger) {
        const rects = Array.from(trigger.getClientRects())
        const inViewport = rects.some((rect) =>
          rect.bottom > 0 && rect.top < window.innerHeight &&
          rect.right > 0 && rect.left < window.innerWidth,
        )
        const underPointer = !pointer || rects.some((rect) =>
          pointer.x >= rect.left && pointer.x <= rect.right &&
          pointer.y >= rect.top && pointer.y <= rect.bottom,
        )
        if (!inViewport || !underPointer) {
          hidePreview()
          return
        }
      }
      schedulePosition()
    }
    updatePreviewPosition()
    window.addEventListener('resize', onViewportChange)
    window.addEventListener('scroll', onViewportChange, { capture: true, passive: true })
    document.addEventListener('pointermove', closeOutsideTrigger)

    return () => {
      window.removeEventListener('resize', onViewportChange)
      if (positionFrameRef.current !== null) cancelAnimationFrame(positionFrameRef.current)
      positionFrameRef.current = null
      window.removeEventListener('scroll', onViewportChange, true)
      document.removeEventListener('pointermove', closeOutsideTrigger)
    }
  }, [active, hidePreview, schedulePosition, updatePreviewPosition])

  if (!media) return <span className="text-fg-tertiary">[{id}]</span>

  const isVideo = media.type === 'video'
  const hasLink = !!media.link
  const labelText = L(media.label)
  const altText = L(media.alt)

  const triggerClass =
    'group relative isolate inline cursor-pointer align-baseline font-medium outline-none'

  const handlers = {
    onPointerEnter: showPreview,
    onPointerLeave: hidePreview,
    onPointerCancel: hidePreview,
    onPointerMove: (event: PointerEvent<HTMLElement>) => {
      if (!active) {
        showPreview(event)
      } else if (event.pointerType !== 'touch') {
        pointerRef.current = { x: event.clientX, y: event.clientY }
        schedulePosition()
      }
    },
    onFocus: showPreview,
    onBlur: hidePreview,
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

  if (!media.media) {
    return media.link ? (
      <a
        href={media.link}
        target="_blank"
        rel="noopener noreferrer"
        className={`${triggerClass} whitespace-nowrap`}
        title={media.link}
      >
        {innerVisual}
      </a>
    ) : innerVisual
  }

  const preview =
    typeof document !== 'undefined'
      ? createPortal(
          <AnimatePresence>
            {active && !zoomed && previewPosition && (
              <m.div
                data-media-preview
                aria-hidden="true"
                className="pointer-events-none fixed z-[900]"
                initial={false}
                animate={{ x: previewPosition.centerX }}
                transition={reducedMotion ? { duration: 0 } : { type: 'spring', stiffness: 500, damping: 45, mass: 0.5 }}
                style={{
                  left: 0,
                  top: previewPosition.anchorY,
                }}
              >
                <div style={{
                  transform:
                    previewPosition.placement === 'top'
                      ? 'translate(-50%, -100%)'
                      : 'translateX(-50%)',
                }}>
                <m.figure
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
                  className={`m-0 w-fit overflow-hidden rounded-[10px] border border-line shadow-[0_18px_45px_rgba(0,0,0,0.24)] ${media.whiteBackground ? 'bg-white' : 'bg-card'}`}
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
                        {...imageSource(media.media)}
                        sizes="240px"
                        decoding="async"
                        alt=""
                        className={`block h-auto w-auto ${media.whiteBackground ? 'p-2' : ''}`}
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
                </m.figure>
                </div>
              </m.div>
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
              <m.div
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
                <m.figure
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
                </m.figure>
              </m.div>
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
          className={`${triggerClass}${media.keepLabelTogether ? ' whitespace-nowrap' : ''}`}
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
