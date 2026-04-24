import { useTranslation } from 'react-i18next'
import { FileText, BookOpen, Link2 } from 'lucide-react'
import { publications } from '../data/publications'
import type { PubLink } from '../data/publications'

/**
 * Project 图标 —— 品牌图标 lucide v1 里没了，内嵌 SVG。
 */
function ProjectIcon({ size = 14 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
    </svg>
  )
}

function IconFor({ kind }: { kind: PubLink['kind'] }) {
  switch (kind) {
    case 'journal':
    case 'paper':
      return <FileText size={14} />
    case 'arxiv':
      return <BookOpen size={14} />
    case 'project':
      return <ProjectIcon size={14} />
    default:
      return <Link2 size={14} />
  }
}

export default function SectionPubs() {
  const { t } = useTranslation()

  return (
    <section id="publications" className="mb-12">
      <h2 className="text-2xl font-bold text-fg-primary mb-6 flex items-center gap-2">
        <span role="img" aria-label="publications">
          📝
        </span>
        {t('pubs.title')}
      </h2>

      <div className="flex flex-col gap-5">
        {publications.map((pub) => (
          <div
            key={pub.id}
            className="px-4 py-3 rounded-lg border-l-[3px] border-transparent transition-colors duration-200 hover:bg-tl-bg hover:border-accent"
          >
            <h3 className="text-lg font-semibold text-accent m-0 mb-1 leading-snug">
              {pub.title}
            </h3>
            <p
              className="text-[0.95rem] m-0 mb-1 text-fg-secondary"
              dangerouslySetInnerHTML={{ __html: pub.authorsHtml }}
            />
            <p className="text-sm italic text-fg-tertiary m-0 mb-2">{pub.venue}</p>

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
                      {t(`pubs.links.${link.kind}`)}
                    </a>
                    {i < pub.links.length - 1 && (
                      <span className="text-line">|</span>
                    )}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  )
}
