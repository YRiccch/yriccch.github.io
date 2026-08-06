import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ALL_GALLERY_TAG, findGalleryTag } from '../data/gallery'
import {
  availableGalleryTags,
  getGalleryItemCount,
  getGalleryItems,
  type GalleryItem,
} from '../data/galleryItems'
import { useLocale } from '../hooks/useLocale'
import GalleryLightbox from './GalleryLightbox'
import { Letter3DSwap } from './Letter3DSwap'
import { LocaleSwap } from './LocaleSwap'

const galleryTabs = [
  ALL_GALLERY_TAG,
  ...availableGalleryTags.map((tag) => tag.key),
]

export default function SectionLifeGallery() {
  const { t } = useTranslation()
  const { L } = useLocale()
  const [activeTag, setActiveTag] = useState<string>(ALL_GALLERY_TAG)
  const [lightbox, setLightbox] = useState<GalleryItem | null>(null)

  const visible = getGalleryItems(activeTag)

  const tagLabelFor = (tagKey: string) => {
    if (tagKey === ALL_GALLERY_TAG) return t('life.all')
    const tag = findGalleryTag(tagKey)
    return tag ? L(tag.label) : tagKey
  }

  const tagsLabelFor = (item: GalleryItem) =>
    item.tags.map(tagLabelFor).join(' · ')

  const captionOf = (item: GalleryItem | null) =>
    item?.caption ? L(item.caption) : ''

  const lightboxCaption = captionOf(lightbox)

  return (
    <section className="mb-12">
      <h2 className="text-2xl font-bold text-fg-strong mb-2 min-h-[2rem]">
        <Letter3DSwap text={t('life.title')} />
      </h2>
      <p className="text-[0.95rem] text-fg-tertiary mb-5 min-h-[1.5em]">
        <LocaleSwap>{t('life.desc')}</LocaleSwap>
      </p>

      <div
        role="tablist"
        aria-label={t('life.filterLabel')}
        className="flex flex-wrap gap-2 mb-5"
      >
        {galleryTabs.map((tagKey) => {
          const active = activeTag === tagKey
          return (
            <button
              key={tagKey}
              role="tab"
              aria-selected={active}
              onClick={() => setActiveTag(tagKey)}
              className={
                'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-[0.85rem] ' +
                'transition-colors active:scale-95 font-sans ' +
                (active
                  ? 'bg-hover text-accent border-accent'
                  : 'bg-card text-fg-secondary border-line hover:text-accent hover:border-accent')
              }
            >
              <Letter3DSwap text={tagLabelFor(tagKey)} />
              <span
                className={
                  'text-[0.72rem] tabular-nums ' +
                  (active ? 'text-fg-secondary' : 'text-fg-tertiary')
                }
              >
                {getGalleryItemCount(tagKey)}
              </span>
            </button>
          )
        })}
      </div>

      {visible.length > 0 ? (
        <div className="columns-2 min-[900px]:columns-3 min-[1400px]:columns-4 gap-3">
          {visible.map((item) => {
            const tagLabel = tagsLabelFor(item)
            return (
              <figure
                key={item.fileName}
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
                <figcaption className="absolute left-2 bottom-2 max-w-[calc(100%-1rem)] truncate px-2.5 py-0.5 rounded-full text-[0.72rem] bg-black/55 text-white opacity-0 translate-y-1 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0 pointer-events-none [@media(hover:none)]:opacity-100 [@media(hover:none)]:translate-y-0">
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

      <GalleryLightbox
        item={lightbox}
        caption={lightboxCaption}
        closeLabel={t('life.close')}
        onClose={() => setLightbox(null)}
      />
    </section>
  )
}
