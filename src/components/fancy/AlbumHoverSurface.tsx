import { useEffect, useRef, type PointerEvent, type PropsWithChildren } from 'react'
import { useReducedMotion } from 'motion/react'

/** Keep pointer measurement outside the tilted surface so it cannot chase itself. */
export default function AlbumHoverSurface({ children }: PropsWithChildren) {
  const boundsRef = useRef<HTMLDivElement>(null)
  const surfaceRef = useRef<HTMLDivElement>(null)
  const frameRef = useRef<number | null>(null)
  const pointerRef = useRef({ x: 0, y: 0 })
  const reduced = useReducedMotion()

  const reset = () => {
    if (frameRef.current !== null) cancelAnimationFrame(frameRef.current)
    frameRef.current = null
    surfaceRef.current?.removeAttribute('data-hovered')
  }

  useEffect(() => {
    const onVisibility = () => { if (document.hidden) reset() }
    window.addEventListener('blur', reset)
    document.addEventListener('visibilitychange', onVisibility)
    return () => {
      reset()
      window.removeEventListener('blur', reset)
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [reduced])

  const move = (event: PointerEvent<HTMLDivElement>) => {
    if (reduced || event.pointerType === 'touch' ||
      !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return
    pointerRef.current = { x: event.clientX, y: event.clientY }
    if (frameRef.current !== null) return
    frameRef.current = requestAnimationFrame(() => {
      frameRef.current = null
      const bounds = boundsRef.current
      const surface = surfaceRef.current
      if (!bounds || !surface) return
      const rect = bounds.getBoundingClientRect()
      if (!rect.width || !rect.height) return
      const x = Math.max(0, Math.min(1, (pointerRef.current.x - rect.left) / rect.width))
      const y = Math.max(0, Math.min(1, (pointerRef.current.y - rect.top) / rect.height))
      const width = bounds.clientWidth
      const height = bounds.clientHeight
      surface.style.setProperty('--album-rx', `${(0.5 - y) * 8}deg`)
      surface.style.setProperty('--album-ry', `${(x - 0.5) * 10}deg`)
      surface.style.setProperty('--album-gx', `${x * width}px`)
      surface.style.setProperty('--album-gy', `${y * height}px`)
      surface.setAttribute('data-hovered', '')
    })
  }

  return (
    <div ref={boundsRef} className="album-hover-bounds"
      onPointerEnter={move} onPointerMove={move}
      onPointerLeave={reset} onPointerCancel={reset}>
      <div ref={surfaceRef} className="album-hover-surface">
        {children}
        <div aria-hidden="true" className="album-hover-light">
          <div className="album-hover-spot" />
        </div>
      </div>
    </div>
  )
}
