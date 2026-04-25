import { useEffect, useState, useCallback } from 'react'

type Theme = 'light' | 'dark'

/**
 * 主题切换（View Transitions API 圆形扩散）。
 *
 * 方向语义：
 *   - 浅 → 深：旧的浅色画面"自外向内"收缩到点击点（new 在底，old 在顶，old 圆形 maxR → 0）
 *   - 深 → 浅：新的浅色画面"自内向外"扩散到全屏（old 在底，new 在顶，new 圆形 0 → maxR）
 *
 * 不支持 View Transitions 的浏览器：fallback 到"瞬间切换 + 临时禁过渡"。
 * reduced-motion：跳过扩散动画但仍走原子切换。
 */
export function useTheme() {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window === 'undefined') return 'light'
    const saved = localStorage.getItem('theme')
    if (saved === 'dark' || saved === 'light') return saved
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  })

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
    localStorage.setItem('theme', theme)
  }, [theme])

  const toggle = useCallback(
    (origin?: { clientX: number; clientY: number }) => {
      const next: Theme = theme === 'dark' ? 'light' : 'dark'
      const goingToDark = next === 'dark'
      const html = document.documentElement

      const applyTheme = () => {
        html.classList.toggle('dark', goingToDark)
        localStorage.setItem('theme', next)
        setTheme(next)
      }

      const supportsVT =
        typeof document !== 'undefined' &&
        'startViewTransition' in document
      if (!supportsVT) {
        html.classList.add('theme-switching')
        applyTheme()
        window.setTimeout(() => html.classList.remove('theme-switching'), 60)
        return
      }

      const reduced =
        window.matchMedia &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches

      const x = origin?.clientX ?? window.innerWidth - 40
      const y = origin?.clientY ?? 40
      const endRadius = Math.hypot(
        Math.max(x, window.innerWidth - x),
        Math.max(y, window.innerHeight - y),
      )

      // 切到深色时，让 view-transition-old(root) 处于顶层（CSS 控制 z-index）
      if (goingToDark) html.classList.add('vt-going-dark')

      // @ts-expect-error: View Transitions API 类型在部分 TS 版本里还不全
      const transition = document.startViewTransition(() => {
        applyTheme()
      })

      transition.ready
        .then(() => {
          if (reduced) return

          if (goingToDark) {
            // 浅 → 深：旧的浅色画面收缩到点击点
            html.animate(
              {
                clipPath: [
                  `circle(${endRadius}px at ${x}px ${y}px)`,
                  `circle(0px at ${x}px ${y}px)`,
                ],
              },
              {
                duration: 480,
                fill: 'both',
                easing: 'cubic-bezier(0.22, 0.9, 0.3, 1)',
                pseudoElement: '::view-transition-old(root)',
              },
            )
          } else {
            // 深 → 浅：新的浅色画面从点击点扩散到全屏
            html.animate(
              {
                clipPath: [
                  `circle(0px at ${x}px ${y}px)`,
                  `circle(${endRadius}px at ${x}px ${y}px)`,
                ],
              },
              {
                duration: 480,
                fill: 'both',
                easing: 'cubic-bezier(0.22, 0.9, 0.3, 1)',
                pseudoElement: '::view-transition-new(root)',
              },
            )
          }
        })
        .catch(() => {})

      transition.finished.finally(() => {
        html.classList.remove('vt-going-dark')
      })
    },
    [theme],
  )

  return { theme, toggle, isDark: theme === 'dark' }
}
