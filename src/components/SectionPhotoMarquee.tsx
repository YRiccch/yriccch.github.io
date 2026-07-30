import { GALLERY_CAPTIONS, findGalleryTag } from '../data/gallery'
import { galleryItems } from '../data/galleryItems'
import { useLocale } from '../hooks/useLocale'
import { SimpleMarquee } from './SimpleMarquee'

export default function SectionPhotoMarquee() {
  const { L } = useLocale()

  if (galleryItems.length === 0) return null

  const altFor = (key: string, tag: string) => {
    const caption = GALLERY_CAPTIONS[key]
    if (caption) return L(caption)

    const tagInfo = findGalleryTag(tag)
    return tagInfo ? L(tagInfo.label) : 'Life photo'
  }

  const photos = galleryItems.map((item) => (
    <figure
      key={item.key}
      className="m-0 h-[110px] w-fit shrink-0 overflow-hidden rounded-md bg-card ring-1 ring-line max-[600px]:h-[84px]"
    >
      <img
        src={item.url}
        alt={altFor(item.key, item.tag)}
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
