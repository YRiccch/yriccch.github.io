import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation, useNavigate } from 'react-router-dom'
import {
  Languages, Sun, Moon,
  Home, User, Newspaper, BookOpen, Image as ImageIcon, ArrowUp,
} from 'lucide-react'
import { useTheme } from '../hooks/useTheme'

type NavKind = 'section' | 'route'
type NavItem = {
  key: string
  id: string
  icon: React.ComponentType<{ size?: number }>
  kind: NavKind
  path?: string
}

const NAV_ITEMS: NavItem[] = [
  { key: 'home', id: 'home', icon: Home, kind: 'section' },
  { key: 'about', id: 'about', icon: User, kind: 'section' },
  { key: 'timeline', id: 'timeline', icon: Newspaper, kind: 'section' },
  { key: 'publications', id: 'publications', icon: BookOpen, kind: 'section' },
  { key: 'life', id: 'life', icon: ImageIcon, kind: 'route', path: '/life' },
]

export default function Navbar() {
  const { t, i18n } = useTranslation()
  const { isDark, toggle: toggleTheme } = useTheme()
  const location = useLocation()
  const navigate = useNavigate()

  const [activeId, setActiveId] = useState<string>('home')
  const [showBackTop, setShowBackTop] = useState(false)
  const observerRef = useRef<IntersectionObserver | null>(null)

  const toggleLanguage = () => {
    i18n.changeLanguage(i18n.resolvedLanguage === 'en' ? 'zh' : 'en')
  }

  const themeTitle = isDark ? t('actions.switchToLight') : t('actions.switchToDark')
  const onHomeRoute = location.pathname === '/'

  /* ------- 跳转逻辑 ------- */
  const navigateTo = async (item: NavItem) => {
    if (item.kind === 'route') {
      if (location.pathname !== item.path) {
        navigate(item.path!)
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }
      return
    }

    // section：如果不在 home，先跳回 home
    if (!onHomeRoute) {
      navigate('/')
      // 等下一帧 DOM 渲染再滚动
      requestAnimationFrame(() => requestAnimationFrame(() => scrollToSection(item.id)))
      return
    }
    scrollToSection(item.id)
  }

  const scrollToSection = (id: string) => {
    if (id === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }
    const el = document.getElementById(id)
    if (!el) return
    const navbar = document.querySelector('.desktop-nav') as HTMLElement | null
    const navH = navbar?.offsetHeight ?? 0
    const top = el.getBoundingClientRect().top + window.pageYOffset - navH - 20
    window.scrollTo({ top, behavior: 'smooth' })
  }

  /* ------- Scroll spy：只在 home 路由生效 ------- */
  useEffect(() => {
    if (observerRef.current) {
      observerRef.current.disconnect()
      observerRef.current = null
    }
    if (!onHomeRoute) {
      setActiveId(location.pathname === '/life' ? 'life' : 'home')
      return
    }
    setActiveId('home')

    // 延迟到 DOM 就绪
    const setup = () => {
      const sections = NAV_ITEMS
        .filter((n) => n.kind === 'section' && n.id !== 'home')
        .map((n) => document.getElementById(n.id))
        .filter((e): e is HTMLElement => !!e)

      const io = new IntersectionObserver(
        (entries) => {
          const visible = entries
            .filter((e) => e.isIntersecting)
            .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
          if (visible.length > 0) setActiveId(visible[0].target.id)
        },
        { rootMargin: '-100px 0px -55% 0px', threshold: 0 },
      )
      sections.forEach((s) => io.observe(s))
      observerRef.current = io
    }

    // 等 route 切换 + DOM 渲染
    const tid = setTimeout(setup, 50)
    return () => {
      clearTimeout(tid)
      observerRef.current?.disconnect()
    }
  }, [onHomeRoute, location.pathname])

  /* ------- 滚动监听：是否显示"回到顶部"；接近顶部时 active = home ------- */
  useEffect(() => {
    const onScroll = () => {
      setShowBackTop(window.scrollY > 480)
      if (onHomeRoute && window.scrollY < 120) setActiveId('home')
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [onHomeRoute])

  const backToTop = () => {
    if (!onHomeRoute) navigate('/')
    else window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <nav className="z-[100] sticky top-0 max-[900px]:static">
      {/* ============ Desktop ============ */}
      <div
        className={
          'desktop-nav flex justify-between items-center py-4 mb-8 border-b border-line ' +
          'bg-navbar backdrop-blur-[5px] transition-shadow duration-300 ' +
          'max-[900px]:hidden ' +
          (showBackTop ? 'shadow-[0_2px_12px_rgba(0,0,0,0.05)]' : '')
        }
      >
        <ul className="flex gap-5 m-0 p-0 list-none">
          {NAV_ITEMS.map((item) => {
            const active = activeId === item.id
            return (
              <li key={item.key}>
                <a
                  href={item.kind === 'route' ? `#${item.path}` : '#'}
                  onClick={(e) => {
                    e.preventDefault()
                    navigateTo(item)
                  }}
                  className={
                    'inline-block min-w-[78px] text-center px-1 py-2 text-[0.95rem] font-medium ' +
                    'transition-colors duration-300 ' +
                    (active ? 'text-accent' : 'text-fg-secondary hover:text-accent')
                  }
                >
                  <span className="relative inline-block pb-0.5">
                    {t(`nav.${item.key}`)}
                    <span
                      className={
                        'absolute left-0 bottom-0 h-[2px] bg-accent transition-[width] duration-300 ease-out ' +
                        (active ? 'w-full' : 'w-0 group-hover:w-full')
                      }
                    />
                  </span>
                </a>
              </li>
            )
          })}
        </ul>

        <div className="flex items-center gap-4">
          <button
            onClick={toggleTheme}
            title={themeTitle}
            aria-label={themeTitle}
            className="flex items-center justify-center p-1.5 border border-line rounded-md text-fg-secondary hover:bg-hover hover:text-fg-primary transition-colors active:scale-95"
          >
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <button
            onClick={toggleLanguage}
            title={t('actions.switchLanguage')}
            aria-label={t('actions.switchLanguage')}
            className="flex items-center gap-2 px-3 py-1.5 border border-line rounded-md text-fg-secondary hover:bg-hover hover:text-fg-primary text-[0.9rem] transition-colors active:scale-95"
          >
            <Languages size={18} />
            <span className="min-w-[52px] inline-block text-center">
              {i18n.resolvedLanguage === 'en' ? '中文' : 'English'}
            </span>
          </button>
        </div>
      </div>

      {/* ============ Mobile ============ */}
      <div className="hidden max-[900px]:flex flex-col sticky top-8 mx-4 gap-5 items-end z-[99]">
        <div className="flex flex-col items-end gap-2 pb-1.5 border-b border-dashed border-line mb-0.5">
          <button
            onClick={toggleTheme}
            title={themeTitle}
            aria-label={themeTitle}
            className="flex items-center justify-center gap-1 bg-card border border-line rounded-[20px] px-3 py-2 shadow-sm text-fg-secondary text-xs hover:text-accent hover:border-accent transition-colors"
          >
            {isDark ? <Sun size={16} /> : <Moon size={16} />}
          </button>
          <button
            onClick={toggleLanguage}
            title={t('actions.switchLanguage')}
            aria-label={t('actions.switchLanguage')}
            className="flex items-center justify-center gap-1 bg-card border border-line rounded-[20px] px-3 py-2 shadow-sm text-fg-secondary text-xs hover:text-accent hover:border-accent transition-colors"
          >
            <Languages size={16} />
            <span>{i18n.resolvedLanguage === 'en' ? '中' : 'En'}</span>
          </button>
        </div>

        <div className="flex flex-col gap-2.5 items-end">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon
            const active = activeId === item.id
            return (
              <a
                key={item.key}
                href={item.kind === 'route' ? `#${item.path}` : '#'}
                onClick={(e) => {
                  e.preventDefault()
                  navigateTo(item)
                }}
                aria-current={active ? 'page' : undefined}
                aria-label={t(`nav.${item.key}`)}
                className={
                  'inline-flex items-center justify-center gap-2 min-w-[44px] min-h-[44px] box-border ' +
                  'rounded-full border shadow-sm text-[0.85rem] transition-all duration-300 ' +
                  (active
                    ? 'text-white bg-accent border-accent px-4'
                    : 'text-fg-secondary bg-card border-line px-3 hover:text-accent hover:border-accent')
                }
              >
                <Icon size={18} />
                {active && <span className="whitespace-nowrap">{t(`nav.${item.key}`)}</span>}
              </a>
            )
          })}
        </div>
      </div>

      {/* 回到顶部 */}
      {showBackTop && (
        <button
          onClick={backToTop}
          title={t('actions.backToTop')}
          aria-label={t('actions.backToTop')}
          className="fixed bottom-6 right-6 w-[42px] h-[42px] rounded-full bg-card border border-line text-fg-secondary flex items-center justify-center shadow-md hover:text-accent hover:border-accent transition-colors active:scale-95 z-[101] max-[900px]:bottom-4 max-[900px]:right-4 max-[900px]:w-10 max-[900px]:h-10"
        >
          <ArrowUp size={18} />
        </button>
      )}
    </nav>
  )
}
