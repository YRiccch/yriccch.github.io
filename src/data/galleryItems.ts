import { GALLERY_TAGS } from './gallery'

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

const tagOrder = GALLERY_TAGS.map((tag) => tag.key)

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
    const tagDifference = tagOrder.indexOf(a.tag) - tagOrder.indexOf(b.tag)
    return tagDifference || a.id.localeCompare(b.id)
  })
