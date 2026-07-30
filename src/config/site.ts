/**
 * Application-wide configuration shared across routing, layout, navigation,
 * localization, theme handling, and motion.
 *
 * Content collections stay in src/data so this file remains focused on
 * cross-cutting behavior rather than page copy.
 */
export const ROUTES = {
  home: '/',
  life: '/life',
  gadgets: '/gadgets',
  fallback: '*',
} as const

export const SECTION_IDS = {
  about: 'about',
  timeline: 'timeline',
  publications: 'publications',
  gadgets: 'gadgets',
} as const

export const PAGE_MAX_WIDTH_CLASS = 'max-w-[750px]'
export const PAGE_CONTAINER_CLASS =
  `${PAGE_MAX_WIDTH_CLASS} mx-auto px-6 max-[600px]:px-4`

export const MEDIA_QUERIES = {
  mobileNavigation: '(max-width: 900px)',
  reducedMotion: '(prefers-reduced-motion: reduce)',
} as const

export const MOTION_EASING = {
  standard: [0.22, 0.9, 0.3, 1] as const,
  verticalSwap: [0.22, 1, 0.36, 1] as const,
  standardCss: 'cubic-bezier(0.22, 0.9, 0.3, 1)',
} as const

export const NAVIGATION = {
  desktopScrollOffset: 20,
  mobileScrollOffset: 72,
  backToTopThreshold: 480,
  homeActivationThreshold: 120,
  observerRootMargin: '-100px 0px -55% 0px',
  observerSetupDelayMs: 50,
} as const

export const STORAGE_KEYS = {
  locale: 'blog-locale',
  // Keep this value aligned with the pre-paint theme script in index.html.
  theme: 'theme',
} as const

export const THEME_TRANSITION = {
  durationMs: 480,
  fallbackMs: 60,
  switchingClass: 'theme-switching',
  goingDarkClass: 'vt-going-dark',
} as const

export const LOCALE_CONFIG = {
  fallback: 'en',
  supported: ['en', 'zh'] as const,
  htmlLanguage: {
    en: 'en',
    zh: 'zh-CN',
  },
} as const
