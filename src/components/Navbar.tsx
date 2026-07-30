import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation, useNavigate } from 'react-router-dom'
import {
  Sun, Moon,
  User, Newspaper, BookOpen, Image as ImageIcon, Boxes, ArrowUp,
} from 'lucide-react'
import {
  MEDIA_QUERIES,
  NAVIGATION,
  PAGE_CONTAINER_CLASS,
  PAGE_MAX_WIDTH_CLASS,
  ROUTES,
  SECTION_IDS,
} from '../config/site'
import { useTheme } from '../hooks/useTheme'
import { Letter3DSwap } from './Letter3DSwap'

type NavIcon = React.ComponentType<{
  size?: number
  className?: string
  style?: React.CSSProperties
}>

type NavItemBase = {
  key: string
  id: string
  icon: NavIcon
}

type NavItem =
  | (NavItemBase & { kind: 'section' })
  | (NavItemBase & { kind: 'route'; path: string })

const NAV_ITEMS = [
  {
    key: 'about',
    id: SECTION_IDS.about,
    icon: User,
    kind: 'section',
  },
  {
    key: 'timeline',
    id: SECTION_IDS.timeline,
    icon: Newspaper,
    kind: 'section',
  },
  {
    key: 'publications',
    id: SECTION_IDS.publications,
    icon: BookOpen,
    kind: 'section',
  },
  {
    key: 'life',
    id: 'life',
    icon: ImageIcon,
    kind: 'route',
    path: ROUTES.life,
  },
  {
    key: 'gadgets',
    id: SECTION_IDS.gadgets,
    icon: Boxes,
    kind: 'route',
    path: ROUTES.gadgets,
  },
] satisfies readonly NavItem[]

function scrollToSection(id: string) {
  const element = document.getElementById(id)
  if (!element) return

  const isMobile = window.matchMedia(
    MEDIA_QUERIES.mobileNavigation,
  ).matches
  const offset = isMobile
    ? NAVIGATION.mobileScrollOffset
    : NAVIGATION.desktopScrollOffset
  const top =
    element.getBoundingClientRect().top + window.pageYOffset - offset

  window.scrollTo({ top, behavior: 'smooth' })
}

export default function Navbar() {
  const { t, i18n } = useTranslation()
  const { isDark, toggle: toggleTheme } = useTheme()
  const location = useLocation()
  const navigate = useNavigate()

  const [activeId, setActiveId] = useState<string>(SECTION_IDS.about)
  const [showBackTop, setShowBackTop] = useState(false)
  const observerRef = useRef<IntersectionObserver | null>(null)

  const toggleLanguage = () => {
    i18n.changeLanguage(i18n.resolvedLanguage === 'en' ? 'zh' : 'en')
  }

  const themeTitle = isDark ? t('actions.switchToLight') : t('actions.switchToDark')
  const onHomeRoute = location.pathname === ROUTES.home

  /* ------- 跳转逻辑 ------- */
  const navigateTo = (item: NavItem) => {
    if (item.kind === 'route') {
      if (location.pathname !== item.path) {
        navigate(item.path)
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }
      return
    }

    // section：如果不在 home，先跳回 home
    if (!onHomeRoute) {
      navigate(ROUTES.home)
      // 等下一帧 DOM 渲染再滚动
      requestAnimationFrame(() => requestAnimationFrame(() => scrollToSection(item.id)))
      return
    }
    scrollToSection(item.id)
  }

  /* ------- Scroll spy：只在 home 路由生效 ------- */
  useEffect(() => {
    if (observerRef.current) {
      observerRef.current.disconnect()
      observerRef.current = null
    }
    if (!onHomeRoute) {
      const routeItem = NAV_ITEMS.find(
        (n) => n.kind === 'route' && n.path === location.pathname,
      )
      const routeFrame = requestAnimationFrame(() => {
        setActiveId(routeItem ? routeItem.id : SECTION_IDS.about)
      })
      return () => cancelAnimationFrame(routeFrame)
    }
    const homeFrame = requestAnimationFrame(() =>
      setActiveId(SECTION_IDS.about),
    )

    // 延迟到 DOM 就绪
    const setup = () => {
      const sections = NAV_ITEMS
        .filter((item) => item.kind === 'section')
        .map((item) => document.getElementById(item.id))
        .filter((element): element is HTMLElement => !!element)

      const observer = new IntersectionObserver(
        (entries) => {
          const visible = entries
            .filter((entry) => entry.isIntersecting)
            .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
          if (visible.length > 0) setActiveId(visible[0].target.id)
        },
        { rootMargin: NAVIGATION.observerRootMargin, threshold: 0 },
      )
      sections.forEach((section) => observer.observe(section))
      observerRef.current = observer
    }

    // 等 route 切换 + DOM 渲染
    const setupTimerId = setTimeout(
      setup,
      NAVIGATION.observerSetupDelayMs,
    )
    return () => {
      cancelAnimationFrame(homeFrame)
      clearTimeout(setupTimerId)
      observerRef.current?.disconnect()
    }
  }, [onHomeRoute, location.pathname])

  /* ------- 滚动监听：是否显示"回到顶部"；接近顶部时 active = about ------- */
  useEffect(() => {
    let frameId: number | null = null

    const updateScrollState = () => {
      frameId = null
      const scrollY = window.scrollY
      setShowBackTop(scrollY > NAVIGATION.backToTopThreshold)
      if (
        onHomeRoute &&
        scrollY < NAVIGATION.homeActivationThreshold
      ) {
        setActiveId(SECTION_IDS.about)
      }
    }

    const onScroll = () => {
      if (frameId === null) {
        frameId = requestAnimationFrame(updateScrollState)
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    updateScrollState()
    return () => {
      window.removeEventListener('scroll', onScroll)
      if (frameId !== null) cancelAnimationFrame(frameId)
    }
  }, [onHomeRoute])

  const backToTop = () => {
    if (!onHomeRoute) navigate(ROUTES.home)
    else window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <nav>
      {/* ============ Desktop（紧贴内容右上角的纵向无边框导航）============ */}
      <div className="pointer-events-none fixed inset-x-0 top-12 z-50 max-[900px]:hidden">
        <div className={`${PAGE_CONTAINER_CLASS} relative`}>
          <div className="desktop-nav pointer-events-auto absolute left-full top-0 ml-[30px] flex flex-col items-start gap-0.5">
        {/* 工具区：主题 + 语言 */}
        <button
          onClick={(e) => toggleTheme({ clientX: e.clientX, clientY: e.clientY })}
          title={themeTitle}
          aria-label={themeTitle}
          className="flex items-center justify-center w-9 h-9 rounded-md text-fg-tertiary hover:text-accent transition-colors active:scale-95"
        >
          {isDark ? <Sun size={16} /> : <Moon size={16} />}
        </button>
        <button
          onClick={toggleLanguage}
          title={t('actions.switchLanguage')}
          aria-label={t('actions.switchLanguage')}
          className="flex items-center justify-center w-9 h-9 rounded-md text-fg-tertiary hover:text-accent transition-colors active:scale-95"
        >
          <span className="text-[11px] font-semibold tracking-tight">
            <Letter3DSwap text={i18n.resolvedLanguage === 'en' ? '中' : 'En'} />
          </span>
        </button>

        {/* 极淡分隔点 */}
        <div className="w-1 h-1 rounded-full bg-line my-2 opacity-60 ml-4" />

        {/* 纵向导航 —— 默认仅图标，hover 时文字向右滑出（max-width / margin-left 平滑过渡）*/}
        <ul className="flex flex-col items-start gap-0.5 m-0 p-0 list-none">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon
            const active = activeId === item.id
            return (
              <li key={item.key}>
                <a
                  href={item.kind === 'route' ? `#${item.path}` : '#'}
                  onClick={(e) => {
                    e.preventDefault()
                    navigateTo(item)
                  }}
                  aria-current={active ? 'page' : undefined}
                  aria-label={t(`nav.${item.key}`)}
                  className={
                    'group inline-flex items-center h-9 px-2 rounded-md ' +
                    'transition-colors duration-200 ' +
                    (active
                      ? 'text-accent'
                      : 'text-fg-tertiary hover:text-accent')
                  }
                >
                  <Icon
                    size={18}
                    className="transition-colors duration-200 group-hover:text-highlight"
                    style={
                      active
                        ? { color: 'var(--highlight-color)' }
                        : undefined
                    }
                  />
                  {/* 文字默认 max-w-0 隐藏；hover 展开到自然宽度 */}
                  <span
                    className={
                      'inline-block overflow-hidden whitespace-nowrap text-sm ' +
                      'max-w-0 ml-0 group-hover:max-w-[160px] group-hover:ml-2 ' +
                      'opacity-0 group-hover:opacity-100 ' +
                      'transition-[max-width,margin-left,opacity] duration-300 ease-[cubic-bezier(0.22,0.9,0.3,1)]'
                    }
                  >
                    <Letter3DSwap text={t(`nav.${item.key}`)} />
                  </span>
                </a>
              </li>
            )
          })}
        </ul>
          </div>
        </div>
      </div>

      {/* ============ Mobile（吸顶横向图标条）============ */}
      <div className="hidden max-[900px]:block fixed top-0 inset-x-0 z-[100] bg-navbar backdrop-blur-md border-b border-line">
        <div
          className={`${PAGE_MAX_WIDTH_CLASS} mx-auto flex h-14 items-center gap-1 px-3`}
        >
          {/* 导航图标：横向平铺，可横向滚动以防溢出 */}
          <ul className="flex items-center gap-1 m-0 p-0 list-none flex-1 min-w-0 overflow-x-auto no-scrollbar">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon
              const active = activeId === item.id
              return (
                <li key={item.key} className="shrink-0">
                  <a
                    href={item.kind === 'route' ? `#${item.path}` : '#'}
                    onClick={(e) => {
                      e.preventDefault()
                      navigateTo(item)
                    }}
                    aria-current={active ? 'page' : undefined}
                    aria-label={t(`nav.${item.key}`)}
                    className={
                      'group inline-flex items-center justify-center gap-1.5 h-10 min-w-[40px] box-border ' +
                      'rounded-full text-[0.85rem] transition-colors duration-200 ' +
                      (active
                        ? 'text-accent px-2'
                        : 'text-fg-tertiary px-2 hover:text-accent')
                    }
                  >
                    <Icon
                      size={18}
                      className="transition-colors duration-200 group-hover:text-highlight"
                      style={
                        active
                          ? { color: 'var(--highlight-color)' }
                          : undefined
                      }
                    />
                    {active && (
                      <span className="whitespace-nowrap">
                        <Letter3DSwap text={t(`nav.${item.key}`)} />
                      </span>
                    )}
                  </a>
                </li>
              )
            })}
          </ul>

          {/* 工具区：主题 + 语言，靠右 */}
          <div className="flex items-center gap-0.5 shrink-0 pl-1 ml-1 border-l border-line">
            <button
              onClick={(e) => toggleTheme({ clientX: e.clientX, clientY: e.clientY })}
              title={themeTitle}
              aria-label={themeTitle}
              className="flex items-center justify-center w-10 h-10 rounded-full text-fg-tertiary hover:text-accent transition-colors active:scale-95"
            >
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <button
              onClick={toggleLanguage}
              title={t('actions.switchLanguage')}
              aria-label={t('actions.switchLanguage')}
              className="flex items-center justify-center w-10 h-10 rounded-full text-fg-tertiary hover:text-accent transition-colors active:scale-95"
            >
              <span className="text-[13px] font-semibold tracking-tight">
                <Letter3DSwap text={i18n.resolvedLanguage === 'en' ? '中' : 'En'} />
              </span>
            </button>
          </div>
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
