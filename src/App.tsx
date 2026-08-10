import { Outlet } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import Navbar from './components/Navbar'
import { profile } from './data/profile'
import { useLocale } from './hooks/useLocale'
import { useGoatcounter } from './hooks/useGoatcounter'
import { LocaleSwap } from './components/LocaleSwap'
import { PAGE_CONTAINER_CLASS, SITE_BUILD } from './config/site'

const lastUpdatedAt = new Date(SITE_BUILD.lastCommitAt)

const lastUpdatedFormatters = {
  zh: new Intl.DateTimeFormat('zh-CN', {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
    timeZone: 'Asia/Shanghai',
  }),
  en: new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
    timeZone: 'Asia/Shanghai',
  }),
} as const

/**
 * 布局壳：单列 max-w-750，Navbar 桌面端 fixed 内容右上角，移动端浮右侧。
 */
export default function App() {
  const { t } = useTranslation()
  const { locale, L } = useLocale()
  useGoatcounter()

  return (
    <>
      <Navbar />

      <div className="min-h-screen">
        <div className={PAGE_CONTAINER_CLASS}>
          <main className="pt-12 pb-16 max-[900px]:pt-20">
            <Outlet />

            <footer className="mt-10 flex items-center justify-between gap-4 border-t border-line pt-6 max-[600px]:items-start max-[600px]:flex-col">
              <p className="text-xs text-fg-quaternary m-0">
                <LocaleSwap>
                  &copy; {new Date().getFullYear()} {L(profile.name)}. {t('footer.rights')}
                </LocaleSwap>
              </p>
              <p className="m-0 shrink-0 text-xs tabular-nums text-fg-quaternary">
                <LocaleSwap>
                  {t('footer.lastUpdated', {
                    date:
                      (locale === 'zh'
                        ? lastUpdatedFormatters.zh
                        : lastUpdatedFormatters.en
                      ).format(lastUpdatedAt),
                  })}
                </LocaleSwap>
              </p>
            </footer>
          </main>
        </div>
      </div>
    </>
  )
}
