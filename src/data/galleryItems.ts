import {
  ALL_GALLERY_TAG,
  GALLERY_METADATA,
  GALLERY_TAGS,
  type GalleryMetadata,
  type GalleryTagKey,
} from './gallery'
import type { LocaleText } from './types'

export type GalleryItem = {
  id: string
  fileName: string
  url: string
  takenAt: string | null
  tags: readonly GalleryTagKey[]
  caption?: LocaleText
}

const modules = import.meta.glob<string>(
  '../assets/gallery/*.{svg,jpg,jpeg,png,webp,gif,avif}',
  { eager: true, import: 'default' },
)

function fileNameFromPath(path: string) {
  const fileName = path.split('/').at(-1)
  if (!fileName) throw new Error(`Unable to read Life gallery file name: ${path}`)
  return fileName
}

const imageUrlByFileName = new Map(
  Object.entries(modules).map(([path, url]) => [fileNameFromPath(path), url]),
)

function assertAssetsMatchMetadata() {
  const imageFiles = new Set(imageUrlByFileName.keys())
  const metadataFiles = new Set(Object.keys(GALLERY_METADATA))
  const imagesWithoutMetadata = [...imageFiles].filter(
    (fileName) => !metadataFiles.has(fileName),
  )
  const metadataWithoutImages = [...metadataFiles].filter(
    (fileName) => !imageFiles.has(fileName),
  )

  if (imagesWithoutMetadata.length || metadataWithoutImages.length) {
    const details = [
      'Life gallery images and metadata must match one-to-one.',
      imagesWithoutMetadata.length
        ? `Images without metadata: ${imagesWithoutMetadata.join(', ')}`
        : '',
      metadataWithoutImages.length
        ? `Metadata without images: ${metadataWithoutImages.join(', ')}`
        : '',
    ]
      .filter(Boolean)
      .join('\n')

    throw new Error(details)
  }
}

assertAssetsMatchMetadata()

function toGalleryItem(
  fileName: string,
  metadata: GalleryMetadata,
): GalleryItem {
  const url = imageUrlByFileName.get(fileName)
  if (!url) throw new Error(`Missing Life gallery image: ${fileName}`)

  return {
    id: fileName.replace(/\.[^.]+$/, ''),
    fileName,
    url,
    takenAt: metadata.takenAt,
    tags: metadata.tags,
    caption: metadata.caption,
  }
}

function compareGalleryItems(a: GalleryItem, b: GalleryItem) {
  if (a.takenAt && b.takenAt && a.takenAt !== b.takenAt) {
    return b.takenAt.localeCompare(a.takenAt)
  }
  if (a.takenAt) return -1
  if (b.takenAt) return 1
  return a.fileName.localeCompare(b.fileName)
}

export const galleryItems = Object.entries(GALLERY_METADATA)
  .map(([fileName, metadata]) => toGalleryItem(fileName, metadata))
  .sort(compareGalleryItems)

const galleryItemsByTag = new Map<GalleryTagKey, GalleryItem[]>(
  GALLERY_TAGS.map((tag) => [tag.key, []]),
)

for (const item of galleryItems) {
  for (const tag of item.tags) {
    galleryItemsByTag.get(tag)?.push(item)
  }
}

const EMPTY_GALLERY_ITEMS: readonly GalleryItem[] = []

export const availableGalleryTags = GALLERY_TAGS.filter(
  (tag) => (galleryItemsByTag.get(tag.key)?.length ?? 0) > 0,
)

export function getGalleryItems(tag: string): readonly GalleryItem[] {
  if (tag === ALL_GALLERY_TAG) return galleryItems
  return galleryItemsByTag.get(tag) ?? EMPTY_GALLERY_ITEMS
}

export function getGalleryItemCount(tag: string): number {
  return getGalleryItems(tag).length
}
