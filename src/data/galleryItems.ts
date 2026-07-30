import { ALL_GALLERY_TAG, GALLERY_TAGS } from './gallery'

export type GalleryItem = {
  id: string
  tag: string
  url: string
  key: string
}

const modules = import.meta.glob<string>(
  '../assets/gallery/**/*.{svg,jpg,jpeg,png,webp,gif,avif}',
  { eager: true, import: 'default' },
)

const tagOrderByKey = new Map(
  GALLERY_TAGS.map((tag, index) => [tag.key, index]),
)

export const galleryItems: GalleryItem[] = Object.entries(modules)
  .map(([path, url]) => {
    const parts = path.split('/')
    const file = parts[parts.length - 1]
    const tag = parts[parts.length - 2]
    const id = file.replace(/\.[^.]+$/, '')

    return {
      id,
      tag,
      url,
      key: `${tag}/${id}`,
    }
  })
  .sort((a, b) => {
    const tagDifference =
      (tagOrderByKey.get(a.tag) ?? -1) -
      (tagOrderByKey.get(b.tag) ?? -1)
    return tagDifference || a.id.localeCompare(b.id)
  })

const galleryItemsByTag = new Map<string, GalleryItem[]>()
for (const item of galleryItems) {
  const items = galleryItemsByTag.get(item.tag)
  if (items) {
    items.push(item)
  } else {
    galleryItemsByTag.set(item.tag, [item])
  }
}

const EMPTY_GALLERY_ITEMS: GalleryItem[] = []

export const availableGalleryTags = GALLERY_TAGS.filter((tag) =>
  galleryItemsByTag.has(tag.key),
)

export function getGalleryItems(tag: string): readonly GalleryItem[] {
  if (tag === ALL_GALLERY_TAG) return galleryItems
  return galleryItemsByTag.get(tag) ?? EMPTY_GALLERY_ITEMS
}

export function getGalleryItemCount(tag: string): number {
  return getGalleryItems(tag).length
}
