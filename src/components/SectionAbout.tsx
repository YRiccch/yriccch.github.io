import { useTranslation } from 'react-i18next'
import { Mail, MapPin } from 'lucide-react'
import { aboutIntro } from '../data/aboutIntro'
import { interestsRotator } from '../data/interests'
import { profile } from '../data/profile'
import { useLocale } from '../hooks/useLocale'
import { TextRotate } from './TextRotate'
import { RichText } from './RichText'
import { Letter3DSwap } from './Letter3DSwap'
import { LocaleSwap } from './LocaleSwap'
import { GithubIcon } from './icons'

/**
 * About Section（liubruce 风的 Hero + Bio 合并）：
 *   头像 → 姓名 → 角色/机构 → 联系信息 → 问候 → 含 MBT 的正文 → Interests 轮播
 */
export default function SectionAbout() {
  const { t } = useTranslation()
  const { L } = useLocale()

  return (
    <section id="about" className="mb-16">
      {/* Hero */}
      <header className="mb-11 flex items-center gap-7 max-[600px]:mb-9 max-[600px]:flex-col max-[600px]:items-start max-[600px]:gap-5">
        <div className="w-36 h-36 shrink-0 rounded-full overflow-hidden bg-hover ring-1 ring-line max-[600px]:w-28 max-[600px]:h-28">
          <img
            src={profile.avatar}
            alt={L(profile.name)}
            className="w-full h-full object-cover"
            onError={(e) => {
              ;(e.currentTarget as HTMLImageElement).style.display = 'none'
            }}
          />
        </div>
        <div className="min-w-0">
          <h1 className="m-0 text-[2rem] font-bold leading-tight text-fg-strong max-[600px]:text-[1.65rem]">
            <Letter3DSwap text={L(profile.name)} />
          </h1>
          <p className="m-0 mt-2 text-[1.05rem] text-fg-secondary max-[600px]:mt-1.5 max-[600px]:text-[0.95rem]">
            <Letter3DSwap text={`${L(profile.role)} · ${L(profile.affiliation)}`} />
          </p>

          <div className="mt-4 flex flex-col gap-2 text-[0.95rem] text-fg-secondary max-[600px]:mt-3.5 max-[600px]:gap-1.5 max-[600px]:text-[0.85rem]">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
              <a
                href={`mailto:${profile.email}`}
                className="inline-flex items-center gap-1.5 hover:text-accent transition-colors"
              >
                <Mail
                  size={16}
                  className="max-[600px]:w-3.5 max-[600px]:h-3.5"
                />
                {profile.email}
              </a>
              <a
                href={profile.social.github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 hover:text-accent transition-colors"
              >
                <GithubIcon
                  size={16}
                  className="max-[600px]:w-3.5 max-[600px]:h-3.5"
                />
                GitHub
              </a>
            </div>
            <div className="inline-flex items-center gap-1.5 text-fg-tertiary">
              <MapPin
                size={16}
                className="max-[600px]:w-3.5 max-[600px]:h-3.5"
              />
              <span>{L(profile.location)}</span>
            </div>
          </div>
        </div>
      </header>

      <h2 className="mb-3 text-[1.15rem] font-semibold text-fg-strong">
        <Letter3DSwap text={t('about.title')} />
      </h2>

      <p className="mb-5 max-w-[68ch] text-[1rem] leading-[1.75] text-fg-primary">
        <LocaleSwap>
          <RichText text={L(aboutIntro)} />
        </LocaleSwap>
      </p>

      <div className="flex items-baseline gap-2 flex-wrap text-[0.95rem]">
        <span className="text-fg-secondary">
          <Letter3DSwap text={`${t('about.interestsLabel')}:`} />
        </span>
        <TextRotate items={interestsRotator} interval={4800} />
      </div>
    </section>
  )
}
