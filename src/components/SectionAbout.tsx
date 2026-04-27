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
    <section id="about" className="mb-14">
      {/* Hero */}
      <header className="mb-8">
        <div className="w-28 h-28 rounded-full overflow-hidden bg-hover mb-5 ring-1 ring-line">
          <img
            src={profile.avatar}
            alt={L(profile.name)}
            className="w-full h-full object-cover"
            onError={(e) => {
              ;(e.currentTarget as HTMLImageElement).style.display = 'none'
            }}
          />
        </div>
        <h1 className="text-[1.65rem] font-bold text-fg-primary leading-tight m-0 min-h-[2.1rem]">
          <Letter3DSwap text={L(profile.name)} />
        </h1>
        <p className="text-[0.95rem] text-fg-secondary mt-1.5 m-0 min-h-[1.4rem]">
          <Letter3DSwap text={`${L(profile.role)} · ${L(profile.affiliation)}`} />
        </p>

        <div className="mt-3.5 flex flex-col gap-1.5 text-[0.85rem] text-fg-secondary">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
            <a
              href={`mailto:${profile.email}`}
              className="inline-flex items-center gap-1.5 hover:text-accent transition-colors"
            >
              <Mail size={14} />
              {profile.email}
            </a>
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
          <div className="inline-flex items-center gap-1.5 text-fg-tertiary">
            <MapPin size={14} />
            <span>{L(profile.location)}</span>
          </div>
        </div>
      </header>

      <h2 className="text-[1.25rem] font-semibold text-fg-primary mb-3 min-h-[1.8rem]">
        <Letter3DSwap text={t('about.title')} />
      </h2>

      <p className="text-[1.02rem] leading-[1.75] text-fg-primary mb-5 min-h-[5.1em]">
        <LocaleSwap>
          <RichText text={L(aboutIntro)} />
        </LocaleSwap>
      </p>

      <div className="flex items-baseline gap-2 flex-wrap text-[0.95rem]">
        <span className="text-fg-secondary">
          <Letter3DSwap text={`${t('about.interestsLabel')}:`} />
        </span>
        <TextRotate items={interestsRotator} />
      </div>
    </section>
  )
}
