import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { SECTION_IDS } from '../config/site'
import { news } from '../data/news'
import { useLocale } from '../hooks/useLocale'
import { Letter3DSwap } from './Letter3DSwap'
import { LocaleSwap } from './LocaleSwap'
import { RichText } from './RichText'

const PREVIEW_COUNT = 3
const sortedNews = [...news].sort((a, b) => b.date.localeCompare(a.date))
const dateFormatters = {
  zh: new Intl.DateTimeFormat('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit', timeZone: 'UTC' }),
  en: new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'short', day: 'numeric', timeZone: 'UTC' }),
}
const monthFormatter = new Intl.DateTimeFormat('en-US', {
  year: 'numeric',
  month: 'short',
  timeZone: 'UTC',
})

function formatNewsDate(date: string, locale: string) {
  if (/^\d{4}-\d{2}$/.test(date)) {
    return locale === 'zh'
      ? date.replace('-', '.')
      : monthFormatter.format(new Date(`${date}-01T00:00:00Z`))
  }
  const formatter = locale === 'zh' ? dateFormatters.zh : dateFormatters.en
  return formatter.format(new Date(`${date}T00:00:00Z`))
}

export default function SectionNews() {
  const { t } = useTranslation()
  const { locale, L } = useLocale()
  const [expanded, setExpanded] = useState(false)
  const visibleNews = expanded ? sortedNews : sortedNews.slice(0, PREVIEW_COUNT)

  return (
    <section id={SECTION_IDS.news} className="mb-16" aria-labelledby="news-heading">
      <h2 id="news-heading" className="m-0 mb-7 text-[1.35rem] font-semibold text-fg-strong">
        <Letter3DSwap text={t('news.title')} />
      </h2>

      {sortedNews.length === 0 ? (
        <p className="m-0 text-[0.96rem] leading-[1.65] text-fg-secondary">
          <LocaleSwap>{t('news.empty')}</LocaleSwap>
        </p>
      ) : (
        <ul id="news-list" className="m-0 flex list-none flex-col gap-5 p-0">
          {visibleNews.map((item) => (
            <li key={item.id} className="grid grid-cols-[7.5rem_minmax(0,1fr)] items-baseline gap-x-5 gap-y-1.5 max-[600px]:grid-cols-1">
              <time dateTime={item.date} className="text-[0.8rem] tabular-nums text-fg-tertiary">
                <LocaleSwap>{formatNewsDate(item.date, locale)}</LocaleSwap>
              </time>
              <p className="m-0 min-w-0 break-words text-[0.96rem] leading-[1.65] text-fg-primary">
                <LocaleSwap>
                  {item.icon && (
                    <span aria-hidden="true" className="mr-1.5 inline-block text-[0.95em]">
                      {item.icon}
                    </span>
                  )}
                  <RichText text={L(item.body)} />
                  {item.link && (
                    <>
                      {' '}
                      <a
                        href={item.link.url}
                        className="text-accent underline decoration-line underline-offset-4 transition-colors hover:text-highlight hover:decoration-current"
                      >
                        {L(item.link.label)}
                      </a>
                    </>
                  )}
                </LocaleSwap>
              </p>
            </li>
          ))}
        </ul>
      )}

      {sortedNews.length > PREVIEW_COUNT && (
        <button
          type="button"
          aria-expanded={expanded}
          aria-controls="news-list"
          onClick={() => setExpanded((value) => !value)}
          className="mt-5 inline-flex min-h-11 items-center text-[0.85rem] text-fg-secondary underline decoration-line underline-offset-4 transition-colors hover:text-accent hover:decoration-current"
        >
          <LocaleSwap>{t(expanded ? 'news.showLess' : 'news.showMore')}</LocaleSwap>
        </button>
      )}
    </section>
  )
}
