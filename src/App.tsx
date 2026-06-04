import { Outlet } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import Navbar from './components/Navbar'
import { profile } from './data/profile'
import { useLocale } from './hooks/useLocale'
import { useGoatcounter } from './hooks/useGoatcounter'
import { LocaleSwap } from './components/LocaleSwap'

/**
 * 布局壳：单列 max-w-640，Navbar 桌面端 fixed 内容右上角，移动端浮右侧。
 */
export default function App() {
  const { t } = useTranslation()
  const { L } = useLocale()
  useGoatcounter()

  return (
    <>
      <Navbar />

      <div className="min-h-screen">
        <div className="max-w-[640px] mx-auto px-6 max-[600px]:px-4">
          <main className="pt-12 pb-16 max-[900px]:pt-20">
            <Outlet />

            <footer className="mt-16 pt-8 border-t border-line">
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
