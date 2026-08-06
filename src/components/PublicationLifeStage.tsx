import {
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
} from 'react'
import { SECTION_IDS } from '../config/site'
import SectionPhotoMarquee from './SectionPhotoMarquee'
import SectionPubs from './SectionPubs'

function useElementHeight() {
  const ref = useRef<HTMLDivElement>(null)
  const [height, setHeight] = useState(0)

  useLayoutEffect(() => {
    const element = ref.current
    if (!element) return

    const updateHeight = () => {
      const nextHeight = element.getBoundingClientRect().height
      setHeight((currentHeight) =>
        currentHeight === nextHeight ? currentHeight : nextHeight,
      )
    }

    updateHeight()
    const observer = new ResizeObserver(updateHeight)
    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  return { ref, height }
}

/** Coordinates the shared sticky range without coupling either content section. */
export default function PublicationLifeStage() {
  const { ref: publicationRef, height: publicationHeight } = useElementHeight()
  const publicationStyle = {
    '--publication-stage-height': `${publicationHeight}px`,
  } as CSSProperties

  return (
    <section id={SECTION_IDS.publications} className="mb-16">
      <div
        ref={publicationRef}
        className="publication-life-stage-content"
        style={publicationStyle}
      >
        <SectionPubs />
      </div>
      <SectionPhotoMarquee />
    </section>
  )
}
