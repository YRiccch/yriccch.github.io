import galleryData from '../assets/gallery/gallery.json'
import type { LocaleText } from './types'

export type GalleryTag = {
  key: string
  label: LocaleText
}

export type GalleryTagKey = GalleryTag['key']

export type GalleryMetadata = {
  /** Use YYYY-MM-DD when known. Keep null rather than guessing a date. */
  takenAt: string | null
  tags: readonly GalleryTagKey[]
  caption?: LocaleText
}

type GalleryData = {
  tags: readonly GalleryTag[]
  photos: Readonly<Record<string, GalleryMetadata>>
}

const data: GalleryData = galleryData

export const ALL_GALLERY_TAG = 'all'
export const GALLERY_TAGS = data.tags
export const GALLERY_METADATA = data.photos

const galleryTagByKey = new Map(
  GALLERY_TAGS.map((tag) => [tag.key, tag]),
)

function validateGalleryMetadata() {
  const knownTagKeys = new Set(GALLERY_TAGS.map((tag) => tag.key))

  for (const [fileName, metadata] of Object.entries(GALLERY_METADATA)) {
    if (!fileName || fileName.includes('/') || fileName.includes('\\')) {
      throw new Error(`Invalid Life gallery file name: ${fileName}`)
    }

    if (
      metadata.takenAt !== null &&
      !/^\d{4}-\d{2}-\d{2}$/.test(metadata.takenAt)
    ) {
      throw new Error(
        `Life gallery date must use YYYY-MM-DD: ${fileName}`,
      )
    }

    if (metadata.tags.length === 0) {
      throw new Error(`Life gallery image needs at least one tag: ${fileName}`)
    }

    const uniqueTags = new Set(metadata.tags)
    if (uniqueTags.size !== metadata.tags.length) {
      throw new Error(`Life gallery image has duplicate tags: ${fileName}`)
    }

    for (const tag of metadata.tags) {
      if (!knownTagKeys.has(tag)) {
        throw new Error(`Unknown Life gallery tag "${tag}" for ${fileName}`)
      }
    }
  }
}

validateGalleryMetadata()

export function findGalleryTag(key: string): GalleryTag | undefined {
  return galleryTagByKey.get(key)
}
