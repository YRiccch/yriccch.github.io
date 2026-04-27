import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'motion/react'
import { GALLERY_TAGS, GALLERY_CAPTIONS } from '../data/gallery'
import { useLocale } from '../hooks/useLocale'
import { Letter3DSwap } from './Letter3DSwap'
import { LocaleSwap } from './LocaleSwap'

/*
 * 使用说明：
 *   1. 图片丢进 src/assets/gallery/<tag>/ 即可，Vite 构建时自动扫描注入
 *   2. 支持 svg / jpg / jpeg / png / webp / gif / avif
 *   3. 想给某张图加说明：在 src/data/gallery.ts 的 GALLERY_CAPTIONS 里加条目
 */

type Item = {
  id: string
  tag: string
  url: string
  key: string
}

// Vite 构建时静态注入所有匹配的图片 URL
const modules = import.meta.glob<string>(
  '../assets/gallery/**/*.{svg,jpg,jpeg,png,webp,gif,avif}',
  { eager: true, import: 'default' },
)

const allItems: Item[] = Object.entries(modules).map(([path, url]) => {
  const parts = path.split('/')
  const file = parts[parts.length - 1]
  const tag = parts[parts.length - 2]
  const id = file.replace(/\.[^.]+$/, '')
  const key = `${tag}/${id}`
  return { id, tag, url, key }
})

const TAG_ORDER = GALLERY_TAGS.map((t) => t.key)
allItems.sort((a, b) => {
  const ai = TAG_ORDER.indexOf(a.tag)
  const bi = TAG_ORDER.indexOf(b.tag)
  if (ai !== bi) return ai - bi
  return a.id.localeCompare(b.id)
})

export default function SectionLifeGallery() {
  const { t } = useTranslation()
  const { L } = useLocale()
  const [activeTag, setActiveTag] = useState<string>('all')
  const [lightbox, setLightbox] = useState<Item | null>(null)

  // 可用的标签 —— 只显示真正有图片的
  const availableTags = useMemo(() => {
    const set = new Set(allItems.map((i) => i.tag))
    return GALLERY_TAGS.filter((t) => set.has(t.key))
  }, [])

  const visible = useMemo(
    () => (activeTag === 'all' ? allItems : allItems.filter((i) => i.tag === activeTag)),
    [activeTag],
  )

  const countFor = (tag: string) =>
    tag === 'all' ? allItems.length : allItems.filter((i) => i.tag === tag).length

  const tagLabelFor = (tagKey: string) => {
    if (tagKey === 'all') return t('life.all')
    const found = GALLERY_TAGS.find((t) => t.key === tagKey)
    return found ? L(found.label) : tagKey
  }

  const captionOf = (item: Item | null) => {
    if (!item) return ''
    const c = GALLERY_CAPTIONS[item.key]
    return c ? L(c) : ''
  }

  // ESC 关闭 lightbox
  useEffect(() => {
    if (!lightbox) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightbox(null)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [lightbox])

  const tabs: string[] = ['all', ...availableTags.map((t) => t.key)]

  return (
    <section className="mb-12">
      <h2 className="text-2xl font-bold text-fg-primary mb-2 flex items-center gap-2 min-h-[2rem]">
        <span role="img" aria-label="life">
          🖼️
        </span>
        <Letter3DSwap text={t('life.title')} />
      </h2>
      <p className="text-[0.95rem] text-fg-tertiary mb-5 min-h-[1.5em]">
        <LocaleSwap>{t('life.desc')}</LocaleSwap>
      </p>

      {/* 标签栏 */}
      <div
        role="tablist"
        aria-label={t('life.filterLabel')}
        className="flex flex-wrap gap-2 mb-5"
      >
        {tabs.map((tg) => {
          const active = activeTag === tg
          return (
            <button
              key={tg}
              role="tab"
              aria-selected={active}
              onClick={() => setActiveTag(tg)}
              className={
                'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-[0.85rem] ' +
                'transition-colors active:scale-95 font-sans ' +
                (active
                  ? 'bg-accent text-white border-accent'
                  : 'bg-card text-fg-secondary border-line hover:text-accent hover:border-accent')
              }
            >
              <Letter3DSwap text={tagLabelFor(tg)} />
              <span
                className={
                  'text-[0.72rem] tabular-nums ' +
                  (active ? 'text-white/80' : 'text-fg-tertiary')
                }
              >
                {countFor(tg)}
              </span>
            </button>
          )
        })}
      </div>

      {/* Masonry —— CSS columns 实现 */}
      {visible.length > 0 ? (
        <div className="columns-2 min-[900px]:columns-3 min-[1400px]:columns-4 gap-3">
          {visible.map((item) => {
            const tagInfo = GALLERY_TAGS.find((t) => t.key === item.tag)
            const tagLabel = tagInfo ? L(tagInfo.label) : item.tag
            return (
              <figure
                key={item.key}
                onClick={() => setLightbox(item)}
                className="group break-inside-avoid mb-3 relative rounded-[10px] overflow-hidden cursor-zoom-in bg-card transition-[transform,box-shadow] duration-300 hover:-translate-y-0.5 hover:shadow-lg active:scale-[0.99]"
              >
                <img
                  src={item.url}
                  alt={captionOf(item) || tagLabel}
                  loading="lazy"
                  decoding="async"
                  className="block w-full h-auto transition-transform duration-500 group-hover:scale-[1.03]"
                />
                <figcaption className="absolute left-2 bottom-2 px-2.5 py-0.5 rounded-full text-[0.72rem] bg-black/55 text-white opacity-0 translate-y-1 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0 pointer-events-none [@media(hover:none)]:opacity-100 [@media(hover:none)]:translate-y-0">
                  {tagLabel}
                </figcaption>
              </figure>
            )
          })}
        </div>
      ) : (
        <p className="text-fg-tertiary text-[0.95rem] py-8 text-center">
          <LocaleSwap>{t('life.empty')}</LocaleSwap>
        </p>
      )}

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setLightbox(null)}
            role="dialog"
            aria-modal="true"
            className="fixed inset-0 bg-black/80 z-[1000] flex items-center justify-center p-6 backdrop-blur-sm"
          >
            <button
              onClick={(e) => {
                e.stopPropagation()
                setLightbox(null)
              }}
              aria-label={t('life.close')}
              className="absolute top-4 right-4 w-10 h-10 rounded-full border border-white/30 bg-black/40 text-white text-xl leading-none flex items-center justify-center hover:bg-white/15 hover:border-white/60 transition-colors"
            >
              ×
            </button>
            <motion.figure
              initial={{ scale: 0.92 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.92 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
              onClick={(e) => e.stopPropagation()}
              className="max-w-[min(900px,92vw)] max-h-[86vh] flex flex-col items-center gap-3 m-0"
            >
              <img
                src={lightbox.url}
                alt={captionOf(lightbox)}
                className="max-w-full max-h-[78vh] w-auto h-auto rounded-lg shadow-2xl"
              />
              {captionOf(lightbox) && (
                <figcaption className="text-white/85 text-sm text-center">
                  {captionOf(lightbox)}
                </figcaption>
              )}
            </motion.figure>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
