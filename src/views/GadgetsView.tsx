import SectionGadgets from '../components/SectionGadgets'

/** 小玩意儿页。保留现有 wrapper 类名，避免改变 DOM 和样式接口。 */
export default function GadgetsView() {
  return (
    <div className="reveal is-in">
      <SectionGadgets />
    </div>
  )
}
