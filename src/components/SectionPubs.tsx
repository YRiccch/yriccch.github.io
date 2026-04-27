import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { FileText, BookOpen, Link2, Image as ImageIcon } from 'lucide-react'
import { publications } from '../data/publications'
import type { Publication, PubLink } from '../data/publications'
import { Letter3DSwap } from './Letter3DSwap'
import { GithubIcon } from './icons'

/**
 * Publications Section：每条论文左侧缩略图（按图原始比例渲染、白底无裁剪、垂直居中），
 * 右侧标题/作者/会议/链接。缩略图来源 public/pubs/<id>.png，
 * 可在 publications.ts 的 thumbnail 字段里覆盖默认路径或扩展名。
 */

function IconFor({ kind }: { kind: PubLink['kind'] }) {
  switch (kind) {
    case 'journal':
    case 'paper':
      return <FileText size={14} />
    case 'arxiv':
      return <BookOpen size={14} />
    case 'project':
      return <GithubIcon size={14} />
    default:
      return <Link2 size={14} />
  }
}

function thumbnailSrc(pub: Publication): string {
  return pub.thumbnail ?? `/pubs/${pub.id}.png`
}

function PubThumb({ pub }: { pub: Publication }) {
  const [broken, setBroken] = useState(false)
  const src = thumbnailSrc(pub)

  if (broken) {
    return (
      <div className="self-center aspect-square w-full rounded-md bg-white ring-1 ring-line flex items-center justify-center text-fg-tertiary">
        <ImageIcon size={20} />
      </div>
    )
  }
  return (
    <div className="self-center w-full rounded-md overflow-hidden ring-1 ring-line bg-white">
      <img
        src={src}
        alt={pub.title}
        loading="lazy"
        decoding="async"
        className="block w-full h-auto"
        onError={() => setBroken(true)}
      />
    </div>
  )
}

export default function SectionPubs() {
  const { t } = useTranslation()

  return (
    <section id="publications" className="mb-12">
      <h2 className="text-2xl font-bold text-fg-primary mb-6">
        <Letter3DSwap text={t('pubs.title')} />
      </h2>

      <div className="flex flex-col gap-6">
        {publications.map((pub) => (
          <article
            key={pub.id}
            className="grid grid-cols-[120px_1fr] gap-4 items-start max-[600px]:grid-cols-[88px_1fr] max-[600px]:gap-3"
          >
            <PubThumb pub={pub} />

            <div className="min-w-0">
              <h3 className="text-[1.05rem] font-semibold text-accent m-0 mb-1 leading-snug">
                {pub.title}
              </h3>
              <p
                className="text-[0.92rem] m-0 mb-1 text-fg-secondary leading-snug"
                dangerouslySetInnerHTML={{ __html: pub.authorsHtml }}
              />
              <p className="text-[0.85rem] italic text-fg-tertiary m-0 mb-2">
                {pub.venue}
              </p>

              {pub.links.length > 0 && (
                <div className="flex gap-2 items-center flex-wrap">
                  {pub.links.map((link, i) => (
                    <span key={link.url} className="flex items-center gap-2">
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs px-2.5 py-0.5 border border-line rounded text-fg-secondary bg-card hover:border-accent hover:text-accent transition-colors active:scale-95"
                      >
                        <IconFor kind={link.kind} />
                        <Letter3DSwap text={t(`pubs.links.${link.kind}`)} />
                      </a>
                      {i < pub.links.length - 1 && (
                        <span className="text-line">|</span>
                      )}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
