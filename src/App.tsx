import { Outlet } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Mail, MapPin } from 'lucide-react'
import Navbar from './components/Navbar'
import { useLocaleFade } from './hooks/useLocaleFade'
import { profile } from './data/profile'
import { pickLocale } from './data/types'
import { currentLocale } from './i18n'

/**
 * 布局壳（liubruce.me 风格的单列）：
 *   - <Navbar /> 桌面端 fixed 贴在视口左边缘 56px 宽
 *   - 主内容单列，最大 640px 居中（窄而易读）
 *   - >=901px 给 main 加 pl-[80px] 给左侧 Navbar 让位
 *   - 页脚集中放联系方式 + 版权
 *   - 语言切换时做 260ms 含蓄淡出脉冲（opacity 70%）
 */

// GitHub 内嵌 SVG（lucide v1+ 已移除品牌图标）
function GithubIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
    </svg>
  )
}

export default function App() {
  useTranslation()
  const langSwitching = useLocaleFade()
  const locale = currentLocale()
  const L = (t: { zh: string; en: string }) => pickLocale(t, locale)

  return (
    <>
      {/* 全局浮动导航：桌面贴左、移动浮右 */}
      <Navbar />

      <div className="min-h-screen">
        <div className="max-w-[640px] mx-auto px-6 max-[600px]:px-4">
          <main
            className={
              'pt-12 pb-16 transition-opacity duration-[220ms] ease-out ' +
              (langSwitching ? 'opacity-70' : 'opacity-100')
            }
          >
            <Outlet />

            {/* 联系区 + 页脚 */}
            <section className="mt-16 pt-8 border-t border-line text-sm text-fg-secondary">
              <div className="flex flex-wrap items-center gap-x-5 gap-y-2 mb-4">
                <a
                  href={`mailto:${profile.email}`}
                  className="inline-flex items-center gap-1.5 hover:text-accent transition-colors"
                >
                  <Mail size={14} />
                  {profile.email}
                </a>
                <span className="inline-flex items-center gap-1.5 text-fg-tertiary">
                  <MapPin size={14} />
                  {L(profile.location)}
                </span>
                <a
                  href={profile.social.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 hover:text-accent transition-colors"
                >
                  <GithubIcon size={14} />
                  GitHub
                </a>
              </div>
              <p className="text-xs text-fg-quaternary m-0">
                &copy; {new Date().getFullYear()} {L(profile.name)}. All rights reserved.
              </p>
            </section>
          </main>
        </div>
      </div>
    </>
  )
}
