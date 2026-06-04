import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

/**
 * GoatCounter 路由上报。
 *
 * 本站是 hash 路由 SPA（createHashRouter），index.html 里已用
 * `no_onload: true` 关掉了默认的"加载即上报"，所以这里负责：
 *   1. 首屏；2. 每次路由切换 —— 都手动上报一次。
 *
 * 上报的 path 用 react-router 的逻辑路径（/、/life、/gadgets），
 * 而不是带 `#` 的真实 URL，这样面板里的页面统计才干净可读。
 *
 * window.goatcounter.count 由 //gc.zgo.at/count.js 异步注入；
 * 脚本可能晚于首屏 effect 到达，这里做最多 ~5s 的轮询等待。
 */
type GoatcounterCount = (vars?: {
  path?: string
  title?: string
  referrer?: string
  event?: boolean
}) => void

declare global {
  interface Window {
    goatcounter?: { count?: GoatcounterCount }
  }
}

export function useGoatcounter() {
  const { pathname, search } = useLocation()

  useEffect(() => {
    // 本地开发不上报，避免污染线上数据
    if (import.meta.env.DEV) return

    const path = pathname + search
    let tries = 0
    let timer: number | undefined

    const send = () => {
      const count = window.goatcounter?.count
      if (count) {
        count({ path })
        return
      }
      // 统计脚本还没到，稍后重试（最多 ~5s）
      if (tries++ < 50) {
        timer = window.setTimeout(send, 100)
      }
    }

    send()
    return () => {
      if (timer) window.clearTimeout(timer)
    }
  }, [pathname, search])
}
