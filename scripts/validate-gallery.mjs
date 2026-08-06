import { readdir, readFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const rootDirectory = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '..',
)
const galleryDirectory = path.join(
  rootDirectory,
  'src',
  'assets',
  'gallery',
)
const metadataPath = path.join(galleryDirectory, 'gallery.json')
const supportedExtensions = new Set([
  '.svg',
  '.jpg',
  '.jpeg',
  '.png',
  '.webp',
  '.gif',
  '.avif',
])
const datePattern = /^\d{4}-\d{2}-\d{2}$/

function isRecord(value) {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function addError(errors, message) {
  errors.push(`- ${message}`)
}

const metadata = JSON.parse(await readFile(metadataPath, 'utf8'))
const directoryEntries = await readdir(galleryDirectory, { withFileTypes: true })
const errors = []

if (!Array.isArray(metadata.tags)) {
  addError(errors, 'gallery.json must contain a tags array.')
}
if (!isRecord(metadata.photos)) {
  addError(errors, 'gallery.json must contain a photos object.')
}

const tagKeys = new Set()
if (Array.isArray(metadata.tags)) {
  for (const tag of metadata.tags) {
    if (!isRecord(tag) || typeof tag.key !== 'string' || !tag.key) {
      addError(errors, 'Each gallery tag needs a non-empty key.')
      continue
    }
    if (tagKeys.has(tag.key)) {
      addError(errors, `Duplicate gallery tag: ${tag.key}`)
    }
    tagKeys.add(tag.key)
  }
}

const imageFiles = new Set()
for (const entry of directoryEntries) {
  if (entry.isDirectory()) {
    addError(errors, `Life gallery directory must stay flat: ${entry.name}`)
    continue
  }

  if (supportedExtensions.has(path.extname(entry.name).toLowerCase())) {
    imageFiles.add(entry.name)
  }
}

const photos = isRecord(metadata.photos) ? metadata.photos : {}
const metadataFiles = new Set(Object.keys(photos))

for (const fileName of imageFiles) {
  if (!metadataFiles.has(fileName)) {
    addError(errors, `Image has no metadata entry: ${fileName}`)
  }
}

for (const [fileName, photo] of Object.entries(photos)) {
  if (!imageFiles.has(fileName)) {
    addError(errors, `Metadata points to a missing image: ${fileName}`)
  }
  if (!isRecord(photo)) {
    addError(errors, `Metadata for ${fileName} must be an object.`)
    continue
  }
  if (!(photo.takenAt === null || (typeof photo.takenAt === 'string' && datePattern.test(photo.takenAt)))) {
    addError(errors, `takenAt for ${fileName} must be null or YYYY-MM-DD.`)
  }
  if (!Array.isArray(photo.tags) || photo.tags.length === 0) {
    addError(errors, `Metadata for ${fileName} needs at least one tag.`)
    continue
  }

  const uniquePhotoTags = new Set(photo.tags)
  if (uniquePhotoTags.size !== photo.tags.length) {
    addError(errors, `Metadata for ${fileName} has duplicate tags.`)
  }
  for (const tag of photo.tags) {
    if (typeof tag !== 'string' || !tagKeys.has(tag)) {
      addError(errors, `Metadata for ${fileName} has unknown tag: ${String(tag)}`)
    }
  }
}

if (errors.length) {
  console.error('Life gallery validation failed:\n' + errors.join('\n'))
  process.exitCode = 1
} else {
  console.log(`Life gallery valid: ${imageFiles.size} image(s).`)
}
