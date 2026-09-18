import { useRef, useSyncExternalStore } from 'react'
import { useInView, useReducedMotion } from 'motion/react'

function subscribeVisibility(onChange: () => void) {
  document.addEventListener('visibilitychange', onChange)
  return () => document.removeEventListener('visibilitychange', onChange)
}

/** Continuous decoration only needs work while its surface can be seen. */
export function useAnimationActivity<T extends HTMLElement>() {
  const ref = useRef<T>(null)
  const inView = useInView(ref)
  const reduced = useReducedMotion()
  const visible = useSyncExternalStore(
    subscribeVisibility,
    () => document.visibilityState === 'visible',
    () => true,
  )
  return { ref, active: inView && visible && !reduced }
}
