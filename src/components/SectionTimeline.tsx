import { useTranslation } from 'react-i18next'
import { SECTION_IDS } from '../config/site'
import { timeline } from '../data/timeline'
import type { TimelineItem } from '../data/timeline'
import { useLocale } from '../hooks/useLocale'
import { RichText } from './RichText'
import { Letter3DSwap } from './Letter3DSwap'
import { LocaleSwap } from './LocaleSwap'

/**
 * Timeline —— 大年份编辑风。同年事件挂同一年份下，年份只显示一次。
 * 关键字（学校 / 教授 / 实验室）通过 [id] 接入 MediaBetweenText。
 */

type YearGroup = { year: string; entries: TimelineItem[] }

function groupByYear(items: TimelineItem[]): YearGroup[] {
  const map = new Map<string, TimelineItem[]>()
  for (const item of items) {
    const entries = map.get(item.year)
    if (entries) {
      entries.push(item)
    } else {
      map.set(item.year, [item])
    }
  }
  return Array.from(map.entries()).map(([year, entries]) => ({ year, entries }))
}

const timelineGroups = groupByYear(timeline)
const timelineYearRange =
  timelineGroups.length > 0
    ? `${timelineGroups[timelineGroups.length - 1].year} — ${timelineGroups[0].year}`
    : ''

export default function SectionTimeline() {
  const { t } = useTranslation()
  const { L } = useLocale()

  return (
    <section id={SECTION_IDS.timeline} className="mb-16">
      <header className="mb-7 flex items-center justify-between gap-6">
        <h2 className="m-0 text-[1.35rem] font-semibold text-fg-strong">
          <Letter3DSwap text={t('timeline.title')} />
        </h2>
        {timelineYearRange && (
          <div
            aria-hidden
            className="flex items-center gap-3 text-[0.72rem] font-medium text-fg-tertiary tabular-nums max-[600px]:hidden"
          >
            <span className="h-px w-6 bg-line" />
            <span>{timelineYearRange}</span>
          </div>
        )}
      </header>

      <div className="relative">
        <div
          aria-hidden
          className="absolute bottom-1 left-[94px] top-1 w-px bg-line max-[600px]:left-[65px]"
        />

        <div className="flex flex-col">
          {timelineGroups.map((group, groupIndex) => (
            <article
              key={group.year}
              className="relative grid grid-cols-[72px_12px_minmax(0,1fr)] gap-x-4 pb-8 last:pb-0 max-[600px]:grid-cols-[48px_10px_minmax(0,1fr)] max-[600px]:gap-x-3 max-[600px]:pb-6"
            >
              <time
                dateTime={group.year}
                className="select-none text-right text-[1.75rem] font-semibold leading-none text-fg-strong tabular-nums max-[600px]:text-[1.25rem]"
              >
                {group.year}
              </time>

              <div
                aria-hidden
                className="relative z-10 flex justify-center pt-1"
              >
                <span
                  className={
                    'h-2.5 w-2.5 rounded-full border-[1.5px] border-accent ' +
                    (groupIndex === 0 ? 'bg-accent' : 'bg-body')
                  }
                />
              </div>

              <div className="max-w-[68ch] pb-1">
                {group.entries.map((entry, entryIndex) => (
                  <div
                    key={entry.id}
                    className={
                      entryIndex === 0
                        ? ''
                        : 'mt-4 pt-1'
                    }
                  >
                    <time
                      dateTime={entry.period.start}
                      className="block text-[0.75rem] font-medium leading-none text-fg-tertiary tabular-nums"
                    >
                      {L(entry.period.label)}
                    </time>
                    <div className="mt-2 text-[0.96rem] leading-[1.65] text-fg-primary max-[600px]:text-[0.92rem]">
                      <LocaleSwap>
                        <RichText text={L(entry.body)} />
                      </LocaleSwap>
                    </div>
                  </div>
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
