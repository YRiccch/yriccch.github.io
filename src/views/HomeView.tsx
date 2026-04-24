import { useEffect, useRef } from 'react'
import SectionAbout from '../components/SectionAbout'
import SectionTimeline from '../components/SectionTimeline'
import SectionPubs from '../components/SectionPubs'

/**
 * Home 页 —— Phase 2。
 * Section 进入视口时淡入上移；尊重 prefers-reduced-motion。
 */
export default function HomeView() {
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    const prefersReduced =
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

    const els = Array.from(root.querySelectorAll<HTMLElement>('.reveal'))

    if (prefersReduced || !('IntersectionObserver' in window)) {
      els.forEach((el) => el.classList.add('is-in'))
      return
    }

    const io = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-in')
            obs.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.08, rootMargin: '0px 0px -40px 0px' },
    )

    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])

  return (
    <div id="home" ref={rootRef}>
      <div className="reveal">
        <SectionAbout />
      </div>
      <div className="reveal">
        <SectionTimeline />
      </div>
      <div className="reveal">
        <SectionPubs />
      </div>
    </div>
  )
}
