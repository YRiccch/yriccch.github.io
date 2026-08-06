import { motion, useReducedMotion } from 'motion/react'
import { GALLERY_TAGS, type GalleryTag } from '../data/gallery'
import { getGalleryItems, type GalleryItem } from '../data/galleryItems'
import { useLocale } from '../hooks/useLocale'
import StackingCards, { StackingCardItem } from './fancy/StackingCards'

const PREVIEW_PHOTO_LIMIT = 4

type AlbumPreview = {
  tag: GalleryTag
  photos: readonly GalleryItem[]
}

type PhotoLayout = {
  className: string
  x: number
  y: number
  rotate: number
  tilt: number
}

const albumPreviews: readonly AlbumPreview[] = GALLERY_TAGS.flatMap((tag) => {
  const photos = getGalleryItems(tag.key).slice(0, PREVIEW_PHOTO_LIMIT)
  return photos.length > 0 ? [{ tag, photos }] : []
})

const photoLayouts: readonly PhotoLayout[] = [
  {
    className: 'left-[3%] top-[18%] w-[43%]',
    x: 4,
    y: -7,
    rotate: -4,
    tilt: 1.2,
  },
  {
    className: 'right-[4%] top-[8%] w-[45%]',
    x: -5,
    y: 6,
    rotate: 3,
    tilt: -1,
  },
  {
    className: 'bottom-[3%] left-[27%] w-[43%]',
    x: 5,
    y: -5,
    rotate: -1.5,
    tilt: 0.8,
  },
  {
    className: 'bottom-[8%] right-[7%] w-[32%]',
    x: -3,
    y: 5,
    rotate: 5,
    tilt: -1.2,
  },
]

function PhotoTile({
  item,
  alt,
  layout,
  index,
  className,
}: {
  item: GalleryItem
  alt: string
  layout: PhotoLayout
  index: number
  className?: string
}) {
  const reduceMotion = useReducedMotion()
  const floatDuration = 11 + index * 1.8

  return (
    <motion.figure
      initial={{ opacity: 0, y: 12, rotate: layout.rotate }}
      animate={
        reduceMotion
          ? { opacity: 1, x: 0, y: 0, rotate: layout.rotate }
          : {
              opacity: 1,
              x: [0, layout.x, 0],
              y: [0, layout.y, 0],
              rotate: [layout.rotate, layout.rotate + layout.tilt, layout.rotate],
            }
      }
      transition={
        reduceMotion
          ? { duration: 0.2 }
          : {
              opacity: { duration: 0.28, delay: index * 0.08 },
              x: {
                duration: floatDuration,
                ease: 'easeInOut',
                repeat: Infinity,
              },
              y: {
                duration: floatDuration * 0.88,
                ease: 'easeInOut',
                repeat: Infinity,
              },
              rotate: {
                duration: floatDuration * 1.08,
                ease: 'easeInOut',
                repeat: Infinity,
              },
            }
      }
      className={`m-0 ${className ?? layout.className}`}
      style={{ zIndex: index + 1 }}
    >
      <img
        src={item.url}
        alt={alt}
        loading="lazy"
        decoding="async"
        draggable={false}
        className="block h-auto w-full rounded-md shadow-[0_16px_36px_-18px_rgba(0,0,0,0.62)]"
      />
    </motion.figure>
  )
}

function PhotoWall({ album }: { album: AlbumPreview }) {
  const { L } = useLocale()
  const altFor = (item: GalleryItem) => item.caption ? L(item.caption) : L(album.tag.label)
  const singlePhoto = album.photos.length === 1 ? album.photos[0] : null

  if (singlePhoto) {
    return (
      <div className="flex min-h-[18rem] items-center justify-center px-5 py-6 max-[700px]:min-h-[15rem]">
        <PhotoTile
          item={singlePhoto}
          alt={altFor(singlePhoto)}
          index={0}
          layout={{ className: '', x: 3, y: -6, rotate: -1.5, tilt: 0.7 }}
          className="relative w-[min(72%,17rem)]"
        />
      </div>
    )
  }

  return (
    <div className="relative min-h-[18rem] max-[700px]:min-h-[15rem]">
      {album.photos.map((item, index) => (
        <PhotoTile
          key={item.fileName}
          item={item}
          alt={altFor(item)}
          index={index}
          layout={photoLayouts[index] ?? photoLayouts.at(-1)!}
          className={`absolute ${photoLayouts[index]?.className ?? photoLayouts.at(-1)!.className}`}
        />
      ))}
    </div>
  )
}

function AlbumCard({ album }: { album: AlbumPreview }) {
  const { L, locale } = useLocale()
  const photoCount = album.photos.length
  const countLabel = locale === 'zh'
    ? `${photoCount} 张照片`
    : `${photoCount} photo${photoCount === 1 ? '' : 's'}`

  return (
    <article
      aria-labelledby={`life-album-${album.tag.key}`}
      className="grid min-h-[20rem] grid-cols-[minmax(0,0.82fr)_minmax(0,1.18fr)] overflow-hidden rounded-lg border border-line bg-card max-[700px]:grid-cols-1"
    >
      <div className="flex min-h-full flex-col justify-between px-7 py-8 max-[700px]:px-6 max-[700px]:py-6">
        <div>
          <span className="mb-5 block h-1 w-8 rounded-full bg-highlight" aria-hidden="true" />
          <h3 id={`life-album-${album.tag.key}`} className="m-0 text-[1.65rem] font-semibold leading-tight text-fg-strong">
            {L(album.tag.label)}
          </h3>
          <p className="m-0 mt-3 max-w-[22ch] text-[0.98rem] leading-[1.7] text-fg-secondary">
            {L(album.tag.description)}
          </p>
        </div>
        <p className="m-0 mt-8 text-xs text-fg-tertiary">{countLabel}</p>
      </div>
      <div className="border-l border-line max-[700px]:border-l-0 max-[700px]:border-t">
        <PhotoWall album={album} />
      </div>
    </article>
  )
}

export default function SectionPhotoMarquee() {
  if (albumPreviews.length === 0) return null

  return (
    <section aria-label="Life albums" className="mt-20">
      <h2 className="sr-only">Life</h2>
      <StackingCards totalCards={albumPreviews.length} className="relative">
        {albumPreviews.map((album, index) => (
          <StackingCardItem
            key={album.tag.key}
            index={index}
            topPosition={`calc(var(--life-stack-pin-top) + ${index * 0.9}rem)`}
            className="life-stack-item !h-[20rem] max-[700px]:!h-[28rem]"
          >
            <AlbumCard album={album} />
          </StackingCardItem>
        ))}
        <div aria-hidden="true" className="h-48 max-[700px]:h-56" />
      </StackingCards>
    </section>
  )
}
