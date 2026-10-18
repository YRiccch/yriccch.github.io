import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { FileText, BookOpen, Link2, Image as ImageIcon } from 'lucide-react'
import { acceptedPublications, underReviewPublications } from '../data/publications'
import type { Publication, PubLink } from '../data/publications'
import { Letter3DSwap } from './Letter3DSwap'
import { GithubIcon } from './icons'
import { useLocale } from '../hooks/useLocale'
import { imageSource } from '../data/imageSources'

/**
 * Publications Section：桌面左侧文字、右侧封面；手机标题占整行，作者等信息与小封面并排。
 * 封面使用白底、完整显示不裁剪。缩略图来源 public/pubs/<id>.png，
 * 可在 publications.ts 的 thumbnail 字段里覆盖默认路径或扩展名。
 */

function IconFor({ kind }: { kind: PubLink['kind'] }) {
  switch (kind) {
    case 'doi':
      return <Link2 size={14} />
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
      <div className="aspect-video w-full overflow-hidden rounded-md bg-white flex items-center justify-center text-fg-tertiary">
        <ImageIcon size={20} />
      </div>
    )
  }
  return (
    <div className="aspect-video w-full overflow-hidden rounded-md bg-white">
      <img
        {...imageSource(src)}
        sizes="(max-width: 700px) 7rem, (max-width: 750px) calc((100vw - 76px) * 0.382), 258px"
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
    <h3 className="m-0 mb-2 text-[1.02rem] font-semibold leading-[1.4] text-accent max-[700px]:col-span-2 max-[700px]:mb-0">
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
  const { L } = useLocale()

  return (
    <div className="flex flex-col gap-10 max-[700px]:gap-6">
      {items.map((pub) => (
        <article
          key={pub.id}
          className="relative grid grid-cols-[minmax(0,618fr)_minmax(0,382fr)] items-start gap-7 max-[700px]:grid-cols-[minmax(0,1fr)_7rem] max-[700px]:gap-x-4 max-[700px]:gap-y-3 max-[700px]:pb-6 max-[700px]:after:absolute max-[700px]:after:inset-x-6 max-[700px]:after:bottom-0 max-[700px]:after:h-px max-[700px]:after:bg-line max-[700px]:after:content-[''] max-[700px]:last:pb-0 max-[700px]:last:after:hidden"
        >
          <div className="min-w-0 max-[700px]:contents">
            <PubTitle pub={pub} />
            <div className="min-w-0">
              <p
                className="m-0 text-[0.86rem] leading-[1.55] text-fg-secondary"
                dangerouslySetInnerHTML={{ __html: pub.authorsHtml }}
              />
              <div className="mt-3 flex flex-wrap items-center gap-2.5">
                <span className="text-[0.78rem] italic text-fg-tertiary">
                  {typeof pub.venue === 'string' ? pub.venue : L(pub.venue)}
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
                    <Letter3DSwap text={link.label ? L(link.label) : t(`pubs.links.${link.kind}`)} />
                  </a>
                ))}
              </div>
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
  const hasUnderReview = underReviewPublications.length > 0

  return (
    <>
      <div className="mb-8 flex flex-wrap items-center gap-x-3 gap-y-2">
        <h2 className="m-0 text-[1.35rem] font-semibold text-fg-strong">
          <Letter3DSwap text={t('pubs.title')} />
        </h2>
        {/* <a
          href="/paper-reading/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border border-line px-2.5 py-1 text-[0.72rem] leading-none text-fg-secondary transition-colors hover:border-accent hover:text-accent active:scale-[0.98]"
        >
          <BookOpen size={14} aria-hidden="true" />
          <Letter3DSwap text={t('pubs.readInChinese')} />
        </a> */}
      </div>

      <PublicationList items={acceptedPublications} />

      {hasUnderReview && (
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
    </>
  )
}
