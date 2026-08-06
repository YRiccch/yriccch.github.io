import { findGalleryTag } from '../data/gallery'
import { galleryItems, type GalleryItem } from '../data/galleryItems'
import { useLocale } from '../hooks/useLocale'
import { SimpleMarquee } from './SimpleMarquee'

export default function SectionPhotoMarquee() {
  const { L } = useLocale()

  if (galleryItems.length === 0) return null

  const altFor = (item: GalleryItem) => {
    if (item.caption) return L(item.caption)

    const tagInfo = findGalleryTag(item.tags[0] ?? '')
    return tagInfo ? L(tagInfo.label) : 'Life photo'
  }

  const photos = galleryItems.map((item) => (
    <figure
      key={item.fileName}
      className="m-0 h-[110px] w-fit shrink-0 overflow-hidden rounded-md bg-card ring-1 ring-line max-[600px]:h-[84px]"
    >
      <img
        src={item.url}
        alt={altFor(item)}
        loading="lazy"
        decoding="async"
        draggable={false}
        className="block h-full w-auto max-w-none select-none opacity-85 saturate-[0.78] transition-[opacity,filter] duration-300 ease-out hover:opacity-100 hover:saturate-100"
      />
    </figure>
  ))

  if (galleryItems.length < 4) {
    return (
      <section aria-label="Life photos" className="mt-4 overflow-hidden">
        <div className="flex items-center gap-4 py-2 max-[600px]:gap-3">
          {photos}
        </div>
      </section>
    )
  }

  return (
    <section aria-label="Life photos" className="mt-4 overflow-hidden">
      <SimpleMarquee
        baseVelocity={2.4}
        repeat={3}
        slowdownOnHover
        slowDownFactor={0.08}
        draggable
        className="py-2"
      >
        <div className="flex items-center gap-4 pr-4 max-[600px]:gap-3 max-[600px]:pr-3">
          {photos}
        </div>
      </SimpleMarquee>
    </section>
  )
}
