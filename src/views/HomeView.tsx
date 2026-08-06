import SectionAbout from '../components/SectionAbout'
import PublicationLifeStage from '../components/PublicationLifeStage'
import SectionTimeline from '../components/SectionTimeline'

/** 首页依次组合个人介绍、时间线、论文和底部照片墙。 */
export default function HomeView() {
  return (
    <div id="home">
      <SectionAbout />
      <SectionTimeline />
      <PublicationLifeStage />
    </div>
  )
}
