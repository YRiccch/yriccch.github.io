import { Outlet } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import Navbar from './components/Navbar'
import { profile } from './data/profile'
import { useLocale } from './hooks/useLocale'
import { useGoatcounter } from './hooks/useGoatcounter'
import { LocaleSwap } from './components/LocaleSwap'
import { PAGE_CONTAINER_CLASS } from './config/site'

/**
 * 布局壳：单列 max-w-750，Navbar 桌面端 fixed 内容右上角，移动端浮右侧。
 */
export default function App() {
  const { t } = useTranslation()
  const { L } = useLocale()
  useGoatcounter()

  return (
    <>
      <Navbar />

      <div className="min-h-screen">
        <div className={PAGE_CONTAINER_CLASS}>
          <main className="pt-12 pb-16 max-[900px]:pt-20">
            <Outlet />

            <footer className="mt-10 pt-6 border-t border-line">
              <p className="text-xs text-fg-quaternary m-0">
                <LocaleSwap>
                  &copy; {new Date().getFullYear()} {L(profile.name)}. {t('footer.rights')}
                </LocaleSwap>
              </p>
            </footer>
          </main>
        </div>
      </div>
    </>
  )
}
