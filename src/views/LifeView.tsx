import { useEffect, useState } from 'react'
import SectionLifeGallery from '../components/SectionLifeGallery'

/**
 * Life 页：仅一个 SectionLifeGallery，挂载后淡入即可。
 */
export default function LifeView() {
  const [isIn, setIsIn] = useState(false)

  useEffect(() => {
    const reduce =
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    if (reduce) {
      setIsIn(true)
      return
    }
    const raf = requestAnimationFrame(() => setIsIn(true))
    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <div className={`reveal ${isIn ? 'is-in' : ''}`}>
      <SectionLifeGallery />
    </div>
  )
}
