import { useEffect, useState } from 'react'
import SectionGadgets from '../components/SectionGadgets'

/** 小玩意儿页：陈列自己设计的小程序，挂载后淡入。 */
export default function GadgetsView() {
  const [isIn, setIsIn] = useState(false)

  // 挂载后下一帧再切到 is-in，触发淡入过渡。
  // 只在 rAF 回调里 setState（而非在 effect 体内同步调用），符合 react-hooks 规则；
  // prefers-reduced-motion 由 index.css 的 .reveal 媒体查询直接置为可见，无需 JS 特判。
  useEffect(() => {
    const raf = requestAnimationFrame(() => setIsIn(true))
    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <div className={`reveal ${isIn ? 'is-in' : ''}`}>
      <SectionGadgets />
    </div>
  )
}
