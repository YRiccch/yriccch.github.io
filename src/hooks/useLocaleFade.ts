import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'

/**
 * 语言切换时返回一个短促的 true 脉冲，用来触发主内容淡出再淡回。
 * 即策略 C：用 220-260ms 的视觉闪烁掩饰中英版面差异带来的位移。
 */
export function useLocaleFade(duration = 260) {
  const { i18n } = useTranslation()
  const [switching, setSwitching] = useState(false)
  const tid = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    const onChange = () => {
      setSwitching(true)
      if (tid.current) clearTimeout(tid.current)
      tid.current = setTimeout(() => {
        setSwitching(false)
        tid.current = null
      }, duration)
    }
    i18n.on('languageChanged', onChange)
    return () => {
      i18n.off('languageChanged', onChange)
      if (tid.current) clearTimeout(tid.current)
    }
  }, [i18n, duration])

  return switching
}
