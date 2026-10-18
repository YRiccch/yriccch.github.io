import { useLayoutEffect, useRef } from 'react'
import { SECTION_IDS } from '../config/site'
import SectionTimeline from './SectionTimeline'
import SectionPhotoMarquee from './SectionPhotoMarquee'

/** Preserve the preceding content while the Life albums stack, as in the original shared stage. */
export default function TimelineLifeStage() {
  const timelineRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const element = timelineRef.current
    if (!element) return
    const updateHeight = (height: number) => {
      element.style.setProperty('--timeline-stage-height', height + 'px')
    }
    updateHeight(element.getBoundingClientRect().height)
    const observer = new ResizeObserver(([entry]) => {
      updateHeight(entry.borderBoxSize[0]?.blockSize ?? entry.contentRect.height)
    })
    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  return (
    <div data-scroll-anchor={SECTION_IDS.timeline}>
      <div ref={timelineRef} className="timeline-life-stage-content">
        <SectionTimeline />
      </div>
      <SectionPhotoMarquee />
    </div>
  )
}
