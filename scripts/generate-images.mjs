import sharp from 'sharp'
import { createHash } from 'node:crypto'
import { mkdir, readFile, readdir, stat, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const outputDirectory = path.join(root, 'public/optimized')
const manifestPath = path.join(root, 'src/data/generatedImages.json')
const raster = /\.(png|jpe?g|webp|avif)$/i
const recipeVersion = 'responsive-v2'

await mkdir(outputDirectory, { recursive: true })
const sources = []
for (const [directory, prefix, widths, quality] of [
  ['src/assets/gallery', 'gallery/', [320, 640, 960], 84],
  ['public/pubs', '/pubs/', [320, 640, 960, 1280], 88],
  ['public/mbt', '/mbt/', [240, 480, 960], 85],
  ['public', '/', [144, 288, 432], 88],
]) {
  for (const file of (await readdir(path.join(root, directory))).sort()) {
    if (!raster.test(file)) continue
    if (directory === 'public' && !['avatar.png', 'todoflow.png'].includes(file)) continue
    sources.push({ input: path.join(root, directory, file), key: prefix + file, widths, quality })
  }
}

const manifest = {}
let originalBytes = 0
let previewBytes = 0
for (const { input, key, widths, quality } of sources) {
  const content = await readFile(input)
  const metadata = await sharp(content).metadata()
  // Animated images keep their original frames; previews must not silently flatten them.
  if ((metadata.pages ?? 1) > 1) continue
  const swapped = (metadata.orientation ?? 1) >= 5
  const width = swapped ? metadata.height : metadata.width
  const height = swapped ? metadata.width : metadata.height
  if (!width || !height) throw new Error(`Image has no dimensions: ${key}`)
  const fingerprint = createHash('sha256').update(content).update(`${recipeVersion}:${quality}:${sharp.versions.sharp}`).digest('hex').slice(0, 12)
  const name = key.replace(/\.[^.]+$/, '').replace(/[^a-zA-Z0-9-]/g, '-')
  const variants = []
  for (const targetWidth of [...new Set(widths.map(size => Math.min(size, width)))]) {
    const filename = `${name}-${targetWidth}-${fingerprint}.webp`
    const destination = path.join(outputDirectory, filename)
    try { await stat(destination) } catch {
      await sharp(content).rotate().resize({ width: targetWidth, withoutEnlargement: true, fastShrinkOnLoad: false }).webp({ quality, effort: 5 }).toFile(destination)
    }
    variants.push({ src: `/optimized/${filename}`, width: targetWidth, bytes: (await stat(destination)).size })
  }
  const preview = variants[Math.min(1, variants.length - 1)]
  manifest[key] = {
    src: preview.src,
    srcSet: variants.map(variant => `${variant.src} ${variant.width}w`).join(', '),
    width,
    height,
  }
  originalBytes += content.length
  previewBytes += preview.bytes
}
const json = JSON.stringify(manifest, null, 2) + '\n'
const previous = await readFile(manifestPath, 'utf8').catch(() => '')
if (previous !== json) await writeFile(manifestPath, json)
console.log(`Responsive images: ${Object.keys(manifest).length} sources; ${(originalBytes / 1e6).toFixed(2)} MB originals → ${(previewBytes / 1e6).toFixed(2)} MB default previews (originals retained).`)
