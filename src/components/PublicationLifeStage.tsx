import { useLayoutEffect, useRef } from 'react'
import { SECTION_IDS } from '../config/site'
import SectionPhotoMarquee from './SectionPhotoMarquee'
import SectionPubs from './SectionPubs'

/** Keep the sticky boundary in CSS without rerendering publications or albums. */
export default function PublicationLifeStage() {
  const publicationRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const element = publicationRef.current
    if (!element) return
    const updateHeight = (height: number) => {
      element.style.setProperty('--publication-stage-height', height + 'px')
    }
    updateHeight(element.getBoundingClientRect().height)
    const observer = new ResizeObserver(([entry]) => {
      updateHeight(entry.borderBoxSize[0]?.blockSize ?? entry.contentRect.height)
    })
    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  return (
    <section id={SECTION_IDS.publications} className="mb-16">
      <div ref={publicationRef} className="publication-life-stage-content">
        <SectionPubs />
      </div>
      <SectionPhotoMarquee />
    </section>
  )
}
