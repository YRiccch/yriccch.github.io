import { useTranslation } from 'react-i18next'
import { FileText, BookOpen, Link2 } from 'lucide-react'
import { publications } from '../data/publications'
import type { PubLink } from '../data/publications'
import { Letter3DSwap } from './Letter3DSwap'
import { GithubIcon } from './icons'

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

export default function SectionPubs() {
  const { t } = useTranslation()

  return (
    <section id="publications" className="mb-12">
      <h2 className="text-2xl font-bold text-fg-primary mb-6 flex items-center gap-2">
        <span role="img" aria-label="publications">
          📝
        </span>
        <Letter3DSwap text={t('pubs.title')} />
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
