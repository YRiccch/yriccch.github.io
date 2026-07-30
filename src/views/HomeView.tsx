import SectionAbout from '../components/SectionAbout'
import SectionPhotoMarquee from '../components/SectionPhotoMarquee'
import SectionTimeline from '../components/SectionTimeline'
import SectionPubs from '../components/SectionPubs'

/** 首页依次组合个人介绍、时间线、论文和底部照片墙。 */
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
