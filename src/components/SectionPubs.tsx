import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { FileText, BookOpen, Link2, Image as ImageIcon } from 'lucide-react'
import { acceptedPublications, underReviewPublications } from '../data/publications'
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
      <div className="aspect-video w-full overflow-hidden rounded-md bg-white ring-1 ring-line flex items-center justify-center text-fg-tertiary">
        <ImageIcon size={20} />
      </div>
    )
  }
  return (
    <div className="aspect-video w-full overflow-hidden rounded-md bg-white ring-1 ring-line">
      <img
        src={src}
        alt={pub.title}
        loading="lazy"
        decoding="async"
        className="block h-full w-full object-contain"
        onError={() => setBroken(true)}
      />
    </div>
  )
}

function PubTitle({ pub }: { pub: Publication }) {
  const logo = pub.titleLogo
  const canReplace = logo && pub.title.startsWith(logo.replaces)
  const remainingTitle = canReplace
    ? pub.title.slice(logo.replaces.length)
    : pub.title

  return (
    <h3 className="m-0 mb-2 text-[1.02rem] font-semibold leading-[1.4] text-accent">
      {canReplace && (
        <img
          src={logo.src}
          alt={logo.alt}
          decoding="async"
          className="publication-title-logo"
          style={{
            height: `${logo.heightEm ?? 1.04}em`,
            verticalAlign: `${logo.baselineEm ?? -0.14}em`,
          }}
        />
      )}
      {remainingTitle}
    </h3>
  )
}

function PublicationList({ items }: { items: Publication[] }) {
  const { t } = useTranslation()

  return (
    <div className="flex flex-col gap-10">
      {items.map((pub) => (
        <article
          key={pub.id}
          className="grid grid-cols-[minmax(0,618fr)_minmax(0,382fr)] items-start gap-7 max-[700px]:grid-cols-1 max-[700px]:gap-4"
        >
          <div className="min-w-0">
            <PubTitle pub={pub} />
            <p
              className="m-0 text-[0.86rem] leading-[1.55] text-fg-secondary"
              dangerouslySetInnerHTML={{ __html: pub.authorsHtml }}
            />
            <div className="mt-3 flex flex-wrap items-center gap-2.5">
              <span className="text-[0.78rem] italic text-fg-tertiary">
                {pub.venue}
              </span>
              {pub.links.map((link) => (
                <a
                  key={link.url}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-full border border-line px-2.5 py-1 text-[0.72rem] leading-none text-fg-secondary transition-colors hover:border-accent hover:text-accent active:scale-[0.98]"
                >
                  <IconFor kind={link.kind} />
                  <Letter3DSwap text={t(`pubs.links.${link.kind}`)} />
                </a>
              ))}
            </div>
          </div>

          <PubThumb pub={pub} />
        </article>
      ))}
    </div>
  )
}

export default function SectionPubs() {
  const { t } = useTranslation()

  return (
    <section id="publications" className="mb-16">
      <h2 className="mb-8 text-[1.35rem] font-semibold text-fg-strong">
        <Letter3DSwap text={t('pubs.title')} />
      </h2>

      <PublicationList items={acceptedPublications} />

      {underReviewPublications.length > 0 && (
        <>
          <div
            className="my-10 flex items-center gap-4 text-xs font-medium text-fg-tertiary"
            role="separator"
            aria-label={t('pubs.underReview')}
          >
            <span className="h-px flex-1 bg-line" />
            <span className="whitespace-nowrap">{t('pubs.underReview')}</span>
            <span className="h-px flex-1 bg-line" />
          </div>
          <PublicationList items={underReviewPublications} />
        </>
      )}
    </section>
  )
}
