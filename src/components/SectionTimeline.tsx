import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
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
    if (!map.has(item.year)) map.set(item.year, [])
    map.get(item.year)!.push(item)
  }
  return Array.from(map.entries()).map(([year, entries]) => ({ year, entries }))
}

export default function SectionTimeline() {
  const { t } = useTranslation()
  const { L } = useLocale()
  const groups = useMemo(() => groupByYear(timeline), [])

  return (
    <section id="timeline" className="mb-12">
      <h2 className="text-2xl font-bold text-fg-primary mb-8">
        <Letter3DSwap text={t('timeline.title')} />
      </h2>

      <div className="flex flex-col gap-7">
        {groups.map((group) => (
          <article
            key={group.year}
            className="grid grid-cols-[110px_1fr] gap-7 items-baseline max-[600px]:grid-cols-[76px_1fr] max-[600px]:gap-4"
          >
            <div className="text-[2.4rem] font-medium text-accent leading-none tabular-nums select-none max-[600px]:text-[1.85rem]">
              {group.year}
            </div>
            <div className="flex flex-col gap-3.5">
              {group.entries.map((entry) => (
                <div
                  key={entry.id}
                  className="pt-2 border-t border-line text-fg-primary text-base leading-[1.65] max-[600px]:text-[0.95rem]"
                >
                  <LocaleSwap>
                    <RichText text={L(entry.body)} />
                  </LocaleSwap>
                </div>
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
