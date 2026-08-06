// Adapted from Fancy Components' Animated Gradient With SVG pattern.
import { useId } from 'react'
import { motion, useReducedMotion } from 'motion/react'

const glowPaths = [
  {
    cx: [12, 40, 28, 12],
    cy: [16, 24, 54, 16],
    duration: 34,
    fill: 'var(--life-photo-wall-glow-a)',
    opacity: 0.5,
    radius: 43,
  },
  {
    cx: [80, 62, 74, 80],
    cy: [20, 52, 30, 20],
    duration: 42,
    fill: 'var(--life-photo-wall-glow-b)',
    opacity: 0.3,
    radius: 38,
  },
  {
    cx: [55, 72, 42, 55],
    cy: [92, 68, 82, 92],
    duration: 38,
    fill: 'var(--life-photo-wall-glow-c)',
    opacity: 0.25,
    radius: 36,
  },
] as const

export default function AnimatedAlbumBackdrop() {
  const reduceMotion = useReducedMotion()
  const filterId = useId().replace(/:/g, '')
  const sheen =
    'linear-gradient(135deg, var(--life-photo-wall-sheen-start), transparent 54%, var(--life-photo-wall-sheen-end))'

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden"
      style={{ backgroundColor: 'var(--life-photo-wall-base)' }}
    >
      <svg
        className="h-full w-full scale-110"
        preserveAspectRatio="none"
        viewBox="0 0 100 100"
      >
        <defs>
          <filter id={filterId} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="13" />
          </filter>
        </defs>
        <g filter={`url(#${filterId})`}>
          {glowPaths.map((glow, index) => (
            <motion.circle
              key={glow.fill}
              animate={
                reduceMotion
                  ? { cx: glow.cx[0], cy: glow.cy[0] }
                  : { cx: [...glow.cx], cy: [...glow.cy] }
              }
              cy={glow.cy[0]}
              cx={glow.cx[0]}
              fill={glow.fill}
              opacity={glow.opacity}
              r={glow.radius}
              transition={{
                delay: index * -6,
                duration: glow.duration,
                ease: 'easeInOut',
                repeat: Infinity,
                repeatType: 'mirror',
              }}
            />
          ))}
        </g>
      </svg>
      <div className="absolute inset-0" style={{ background: sheen }} />
    </div>
  )
}
