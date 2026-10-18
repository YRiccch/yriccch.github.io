import SectionAbout from '../components/SectionAbout'
import SectionNews from '../components/SectionNews'
import SectionPubs from '../components/SectionPubs'
import TimelineLifeStage from '../components/TimelineLifeStage'
import { SECTION_IDS } from '../config/site'

/** 首页依次组合个人介绍、近期动态、论文、时间线和生活照片。 */
export default function HomeView() {
  return (
    <div id="home">
      <SectionAbout />
      <SectionNews />
      <section id={SECTION_IDS.publications} className="mb-16">
        <SectionPubs />
      </section>
      <TimelineLifeStage />
    </div>
  )
}
