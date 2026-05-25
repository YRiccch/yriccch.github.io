import { useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { Download, Monitor } from 'lucide-react'
import { gadgets } from '../data/gadgets'
import { useLocale } from '../hooks/useLocale'
import { Letter3DSwap } from './Letter3DSwap'

/**
 * 小玩意儿 Section —— 每个作品一张旗舰卡片：悬浮时背后亮起旋转流光边框 + 光晕，
 * 随鼠标轻微 3D 倾斜。左图标、中名称/简介、下载按钮靠卡片最右侧。
 * 数据来自 src/data/gadgets.ts，加新作品只需在那里追加一项，卡片自动堆叠。
 */
export default function SectionGadgets() {
  const { t } = useTranslation()
  const { L } = useLocale()
  const reduceRef = useRef<boolean | null>(null)

  // 鼠标跟随 3D 倾斜（尊重 prefers-reduced-motion；用 currentTarget 支持任意张卡片，
  // 只改 DOM style，不触发重渲染）
  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (reduceRef.current === null) {
      reduceRef.current =
        typeof window !== 'undefined' &&
        !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    }
    if (reduceRef.current) return
    const el = e.currentTarget
    const r = el.getBoundingClientRect()
    const px = (e.clientX - r.left) / r.width - 0.5
    const py = (e.clientY - r.top) / r.height - 0.5
    el.style.transform = `perspective(1000px) rotateY(${(px * 5).toFixed(2)}deg) rotateX(${(-py * 5).toFixed(2)}deg) scale(1.006)`
  }
  const onLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    e.currentTarget.style.transform =
      'perspective(1000px) rotateY(0deg) rotateX(0deg) scale(1)'
  }

  return (
    <section id="gadgets" className="mb-12">
      <h2 className="text-2xl font-bold text-fg-primary mb-1.5">
        <Letter3DSwap text={t('gadgets.title')} />
      </h2>
      <p className="text-sm text-fg-tertiary mb-6">{t('gadgets.desc')}</p>

      <div className="gadget-grid">
        {gadgets.map((g) => (
          <div
            key={g.id}
            className="gadget-feat"
            onMouseMove={onMove}
            onMouseLeave={onLeave}
          >
            <div className="gadget-feat-inner">
              <span className="gadget-glow" aria-hidden="true" />
              <div className="relative z-10 flex items-center gap-5 max-[560px]:flex-col max-[560px]:items-start">
                <div className="shrink-0 w-20 h-20 rounded-2xl overflow-hidden ring-1 ring-line bg-white">
                  <img
                    src={g.icon}
                    alt={g.name}
                    loading="lazy"
                    decoding="async"
                    className="block w-full h-full object-cover"
                  />
                </div>

                <div className="min-w-0 flex-1">
                  <h3 className="text-xl font-semibold text-accent m-0 leading-snug">
                    {g.name}
                  </h3>
                  <p className="text-[0.92rem] italic text-fg-secondary m-0 mt-1 leading-snug">
                    {L(g.tagline)}
                  </p>
                  <p className="text-[0.88rem] text-fg-secondary m-0 mt-2 leading-relaxed">
                    {L(g.description)}
                  </p>
                </div>

                <div className="shrink-0 flex flex-col items-end gap-2 max-[560px]:items-start">
                  <a href={g.downloadHref} download className="gadget-dl">
                    <Download size={15} />
                    <Letter3DSwap text={t('gadgets.download')} />
                  </a>
                  <span className="inline-flex items-center gap-1.5 text-xs text-fg-tertiary">
                    <Monitor size={13} />
                    {g.platform} · {g.version}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
