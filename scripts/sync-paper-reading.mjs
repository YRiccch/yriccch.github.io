import { copyFile, mkdir, readFile, readdir, stat, writeFile } from 'node:fs/promises'
import { createHash } from 'node:crypto'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

// Sync an already rendered reader. CI only builds the committed public files.
const sourceArg = process.argv.indexOf('--source')
if (sourceArg < 0 || !process.argv[sourceArg + 1]) {
  throw new Error('Usage: node scripts/sync-paper-reading.mjs --source /path/to/中文全文阅读')
}
const source = path.resolve(process.argv[sourceArg + 1])
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const destination = path.join(root, 'public/paper-reading')
const original = await readFile(path.join(source, 'index.html'), 'utf8')
let document = original
const files = new Map()
const images = new Set()
for (const tag of document.matchAll(/<img\b[^>]*>/g)) {
  for (const attribute of tag[0].matchAll(/\b(?:src|data-original-src)="([^"]+)"/g)) {
    const relative = attribute[1]
    if (!relative.startsWith('assets/') || relative.includes('..')) {
      throw new Error(`Unexpected image path: ${relative}`)
    }
    images.add(relative)
    files.set(relative, path.join(source, relative))
  }
}
const pdfs = {
  graphqag: 'https://arxiv.org/pdf/2607.27182v1',
  compovista: 'https://arxiv.org/pdf/2607.07105v2',
  coivis: 'https://arxiv.org/pdf/2512.06834v2',
  hypermooc: 'originals/hypermooc-chi2026.pdf',
  electricity: 'originals/electricity-chinavis2025.pdf',
  sampling: 'originals/sampling-2022.pdf',
}
for (const [id, replacement] of Object.entries(pdfs)) {
  const data = JSON.parse(await readFile(path.join(source, '内容', `${id}.json`), 'utf8'))
  const oldLink = `href="${encodeURI(data.source_pdf)}"`
  if (!document.includes(oldLink)) throw new Error(`Missing original PDF link: ${id}`)
  document = document.replace(oldLink, `href="${replacement}" rel="noopener noreferrer"`)
  if (!replacement.startsWith('https://')) files.set(replacement, path.resolve(source, data.source_pdf))
}
const summaryLinks = `<br><a href="${encodeURI('../跨论文研究总结.md')}">跨论文研究总结</a> · <a href="${encodeURI('../主页与原文核对.md')}">版本与原文核对记录</a>`
if (!document.includes(summaryLinks)) throw new Error('Reader summary links changed; review before publishing.')
document = document.replace(summaryLinks, '')
document = document.replace('<div class="eyebrow">研究回顾 / 2026 年 10 月</div>', '<div class="eyebrow"><a href="/">← 个人主页</a> · 研究回顾 / 2026 年 10 月</div>')
document = document.replace('本地图片与离线公式', '原文配图与离线公式')
document = document.replace(' · 支持离线打开</footer>', ' · <a href="/">返回个人主页</a></footer>')
document = document.replace(/[ \t]+$/gm, '')
if (/\b(?:href|src)="(?:\.\.\/|file:)/.test(document)) throw new Error('Unresolved local link in reader.')
if (/<textarea\b[^>]*>[\s\S]+?<\/textarea>/.test(document.replace(/<textarea\b[^>]*><\/textarea>/g, ''))) {
  throw new Error('Reader contains saved note text; publish only empty note fields.')
}
if ((document.match(/<article\b/g) || []).length !== 6 || (document.match(/<figure\b[^>]*class="paper-figure"/g) || []).length !== 48) {
  throw new Error('Expected six complete papers and 48 figures.')
}
let bytes = Buffer.byteLength(document)
for (const [relative, local] of files) {
  const info = await stat(local)
  if (!info.isFile() || info.size > 50 * 1024 * 1024) throw new Error(`Unexpected or oversized asset: ${relative}`)
  bytes += info.size
}
// Do not overwrite an unrelated folder or silently remove user-added files.
const walk = async (dir, prefix = '') => {
  let entries
  try { entries = await readdir(dir, { withFileTypes: true }) } catch (error) {
    if (error.code === 'ENOENT') return []
    throw error
  }
  const result = []
  for (const entry of entries) {
    const relative = path.posix.join(prefix, entry.name)
    if (entry.isDirectory()) result.push(...await walk(path.join(dir, entry.name), relative))
    else result.push(relative)
  }
  return result
}
const expected = new Set(['index.html', 'bundle-manifest.json', ...files.keys()])
for (const existing of await walk(destination)) {
  if (!expected.has(existing)) throw new Error(`Unexpected existing file; review manually: ${existing}`)
}
await mkdir(destination, { recursive: true })
for (const [relative, local] of files) {
  const target = path.join(destination, relative)
  await mkdir(path.dirname(target), { recursive: true })
  await copyFile(local, target)
}
await writeFile(path.join(destination, 'index.html'), document)
const manifest = {
  generatedBy: 'scripts/sync-paper-reading.mjs',
  sourceHtmlSha256: createHash('sha256').update(original).digest('hex'),
  deployedHtmlSha256: createHash('sha256').update(document).digest('hex'),
  papers: 6,
  figures: 48,
  images: images.size,
  bytes,
  files: [...files.keys()].sort(),
  originalPdfLinks: pdfs,
}
await writeFile(path.join(destination, 'bundle-manifest.json'), JSON.stringify(manifest, null, 2) + '\n')
console.log(JSON.stringify({ destination: 'public/paper-reading/', papers: 6, figures: 48, images: images.size, bytes }))
