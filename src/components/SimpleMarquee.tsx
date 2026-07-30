import { useRef, type PointerEvent, type ReactNode } from 'react'
import { wrap } from 'motion'
import {
  motion,
  useAnimationFrame,
  useInView,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from 'motion/react'

type SimpleMarqueeProps = {
  children: ReactNode
  className?: string
  baseVelocity?: number
  repeat?: number
  slowdownOnHover?: boolean
  slowDownFactor?: number
  draggable?: boolean
}

/**
 * A focused adaptation of Fancy Components' Simple Marquee for this site.
 * https://www.fancycomponents.dev/docs/components/blocks/simple-marquee
 */
export function SimpleMarquee({
  children,
  className = '',
  baseVelocity = 3,
  repeat = 3,
  slowdownOnHover = true,
  slowDownFactor = 0.15,
  draggable = true,
}: SimpleMarqueeProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const firstGroupRef = useRef<HTMLDivElement>(null)
  const isDragging = useRef(false)
  const lastPointerX = useRef(0)
  const dragVelocity = useRef(0)
  const dragGroupWidth = useRef(0)
  const baseX = useMotionValue(-0.01)
  const hoverFactor = useMotionValue(1)
  const smoothHoverFactor = useSpring(hoverFactor, {
    damping: 42,
    stiffness: 320,
  })
  const shouldReduceMotion = useReducedMotion()
  const isInView = useInView(containerRef, { amount: 0.05 })
  const copies = Math.max(2, Math.floor(repeat))
  const canDrag = draggable && !shouldReduceMotion

  const x = useTransform(baseX, (value) => `${wrap(-100, 0, value)}%`)

  useAnimationFrame((_, delta) => {
    if (shouldReduceMotion || !isInView || isDragging.current) return

    let moveBy =
      -Math.abs(baseVelocity) *
      (delta / 1000) *
      smoothHoverFactor.get()

    if (Math.abs(dragVelocity.current) > 0.001) {
      moveBy += dragVelocity.current
      dragVelocity.current *= 0.92
    } else {
      dragVelocity.current = 0
    }

    baseX.set(baseX.get() + moveBy)
  })

  const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (!canDrag) return
    event.currentTarget.setPointerCapture(event.pointerId)
    isDragging.current = true
    lastPointerX.current = event.clientX
    dragVelocity.current = 0
    dragGroupWidth.current =
      firstGroupRef.current?.getBoundingClientRect().width ?? 0
  }

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (!canDrag || !isDragging.current) return

    const groupWidth = dragGroupWidth.current
    if (!groupWidth) return

    const deltaPercent =
      ((event.clientX - lastPointerX.current) / groupWidth) * 100
    baseX.set(baseX.get() + deltaPercent)
    dragVelocity.current = deltaPercent
    lastPointerX.current = event.clientX
  }

  const finishDragging = (event: PointerEvent<HTMLDivElement>) => {
    if (!canDrag) return
    isDragging.current = false
    dragGroupWidth.current = 0
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId)
    }
  }

  return (
    <motion.div
      ref={containerRef}
      className={`overflow-hidden ${canDrag ? 'cursor-grab active:cursor-grabbing' : ''} ${className}`}
      style={{ touchAction: canDrag ? 'pan-y' : undefined }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={finishDragging}
      onPointerCancel={finishDragging}
      onHoverStart={() =>
        hoverFactor.set(slowdownOnHover ? slowDownFactor : 1)
      }
      onHoverEnd={() => hoverFactor.set(1)}
    >
      <div className="flex w-max">
        {Array.from({ length: copies }, (_, index) => (
          <motion.div
            ref={index === 0 ? firstGroupRef : undefined}
            key={index}
            aria-hidden={index > 0}
            className="flex shrink-0"
            style={{ x }}
          >
            {children}
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}
