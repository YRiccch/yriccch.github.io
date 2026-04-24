import { Outlet } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import Sidebar from './components/Sidebar'
import Navbar from './components/Navbar'
import { useLocaleFade } from './hooks/useLocaleFade'

/**
 * 布局壳：
 *   - 桌面两列：左 Sidebar，右 Navbar + 路由出口 Outlet
 *   - 移动单列：Sidebar 在顶，Navbar 浮在右侧，内容在左
 *   - 语言切换时 route-area 做 260ms 淡出脉冲（策略 C）
 */
export default function App() {
  const { t } = useTranslation()
  const langSwitching = useLocaleFade()

  return (
    <div className="max-w-[1200px] mx-auto px-6 min-h-screen max-[900px]:px-4 max-[900px]:pr-0">
      <div className="grid grid-cols-[280px_1fr] gap-16 pt-8 max-[900px]:grid-cols-1 max-[900px]:gap-8 max-[600px]:gap-6">
        {/* Sidebar 列 */}
        <div className="relative max-[900px]:order-first">
          <div className="min-[901px]:sticky min-[901px]:top-8">
            <Sidebar />
          </div>
        </div>

        {/* 主内容列 */}
        <main className="pt-0 pb-16">
          <div className="max-[900px]:flex max-[900px]:flex-row max-[900px]:relative">
            <Navbar />
            <div
              className={
                'max-[900px]:flex-1 max-[900px]:min-w-0 max-[900px]:order-1 ' +
                'transition-opacity duration-[220ms] ease-out ' +
                (langSwitching ? 'opacity-40' : 'opacity-100')
              }
            >
              <Outlet />

              <footer className="mt-16 pt-8 border-t border-line text-center text-fg-quaternary text-[0.85rem] max-[600px]:mt-12">
                <p>
                  &copy; {new Date().getFullYear()} Ruiqi Yu. {t('footer.rights')}
                </p>
              </footer>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
