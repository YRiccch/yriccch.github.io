import { useTranslation } from 'react-i18next'
import { timeline } from '../data/timeline'
import { pickLocale } from '../data/types'
import { currentLocale } from '../i18n'

/**
 * 时间线 —— 方案 B"大年份编辑风"。
 * 左栏大号年份 / 右栏正文，正文顶边线在 hover 时变为 accent 色。
 */

// 注意：这里用 dangerouslySetInnerHTML 因为 body 含 <b> 标签。
// 内容全部来自 src/data/timeline.ts（用户可控），没有 XSS 风险。
function renderBold(s: string) {
  return { __html: s.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>') }
}

export default function SectionTimeline() {
  const { t } = useTranslation()
  const locale = currentLocale()

  return (
    <section id="timeline" className="mb-12">
      <h2 className="text-2xl font-bold text-fg-primary mb-8 flex items-center gap-2">
        <span role="img" aria-label="timeline">
          ⌛
        </span>
        {t('timeline.title')}
      </h2>

      <div className="flex flex-col gap-7">
        {timeline.map((item) => (
          <article
            key={item.id}
            className="group grid grid-cols-[110px_1fr] gap-7 items-baseline transition-transform duration-300 hover:translate-x-0.5 max-[600px]:grid-cols-[76px_1fr] max-[600px]:gap-4"
          >
            <div className="text-[2.4rem] font-medium text-accent leading-none tabular-nums select-none max-[600px]:text-[1.85rem]">
              {item.year}
            </div>
            <div
              className="pt-2 border-t border-line group-hover:border-accent transition-colors duration-300 text-fg-primary text-base leading-[1.65] max-[600px]:text-[0.95rem]"
              dangerouslySetInnerHTML={renderBold(pickLocale(item.body, locale))}
            />
          </article>
        ))}
      </div>
    </section>
  )
}
