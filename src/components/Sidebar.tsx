import { Mail, MapPin } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { profile } from '../data/profile'
import { pickLocale } from '../data/types'
import { currentLocale } from '../i18n'

/**
 * GitHub 官方图标。
 * lucide-react v1+ 出于商标考虑移除了品牌图标，
 * 这里用官方 Simple Icons SVG（public domain）内嵌，零依赖、不会再出问题。
 */
function GithubIcon({ size = 20 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
    </svg>
  )
}

export default function Sidebar() {
  useTranslation() // 订阅语言切换，让 currentLocale() 在变化时重算
  const locale = currentLocale()
  const L = (t: { zh: string; en: string }) => pickLocale(t, locale)

  return (
    <aside className="w-full py-8">
      <div className="flex flex-col items-start max-[900px]:items-center max-[900px]:text-center">
        {/* 头像 */}
        <div className="w-[220px] h-[300px] mb-6 rounded-xl overflow-hidden shadow-md bg-hover">
          <img
            src={profile.avatar}
            alt={L(profile.name)}
            className="w-full h-full object-cover"
            onError={(e) => {
              ;(e.currentTarget as HTMLImageElement).style.display = 'none'
            }}
          />
        </div>

        {/* 名字 / 头衔 / 机构 —— 策略 A：min-height 防中英切换塌缩 */}
        <h1 className="text-[1.75rem] font-bold mb-2 text-fg-primary leading-tight min-h-[2.1rem]">
          {L(profile.name)}
        </h1>
        <p className="text-[1.1rem] text-fg-secondary mb-1 min-h-[1.6rem]">
          {L(profile.role)}
        </p>
        <p className="text-base text-accent font-medium mb-6 min-h-[1.5rem]">
          {L(profile.affiliation)}
        </p>

        {/* 联系信息 */}
        <div className="mb-6 w-full max-[900px]:flex max-[900px]:flex-col max-[900px]:items-center">
          <div className="flex items-center gap-2 mb-2 text-fg-secondary text-sm">
            <Mail size={16} />
            <a
              href={`mailto:${profile.email}`}
              className="hover:text-accent hover:underline"
            >
              {profile.email}
            </a>
          </div>
          <div className="flex items-center gap-2 mb-2 text-fg-secondary text-sm">
            <MapPin size={16} />
            <span>{L(profile.location)}</span>
          </div>

          {/* Motto —— 策略 A：固定 min-height 覆盖英文最长情况 */}
          <div className="mt-4 pl-4 border-l-[3px] border-line min-h-[4.6rem]">
            <p className="font-serif italic text-fg-tertiary text-[0.95rem] leading-6 m-0">
              " {L(profile.motto)} "
            </p>
          </div>
        </div>

        {/* 社交链接 */}
        <div className="flex flex-col gap-2 max-[900px]:items-center">
          <a
            href={profile.social.github}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-fg-secondary text-[0.95rem] hover:text-accent"
          >
            <GithubIcon size={20} />
            <span>GitHub</span>
          </a>
        </div>
      </div>
    </aside>
  )
}
