import SectionAbout from '../components/SectionAbout'
import SectionPhotoMarquee from '../components/SectionPhotoMarquee'
import SectionTimeline from '../components/SectionTimeline'
import SectionPubs from '../components/SectionPubs'

/**
 * Home 页 —— Phase 2。
 * Section 进入视口时淡入上移；尊重 prefers-reduced-motion。
 */
export default function HomeView() {
  return (
    <div id="home">
      <SectionAbout />
      <SectionTimeline />
      <SectionPubs />
      <SectionPhotoMarquee />
    </div>
  )
}
