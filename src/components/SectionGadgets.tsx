import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Download, ExternalLink, Monitor } from 'lucide-react'
import { MEDIA_QUERIES, SECTION_IDS } from '../config/site'
import { gadgets } from '../data/gadgets'
import { useLocale } from '../hooks/useLocale'
import { Letter3DSwap } from './Letter3DSwap'

// TodoFlow 更新源（与博客同源）。以后每次发版只改这个 JSON，下载链接+版本号自动跟着变。
const TODOFLOW_FEED = 'https://yriccch.github.io/gadgets/todoflow-latest.json'
const TODOFLOW_GADGET_ID = 'todoflow'

// 读取 TodoFlow 最新版本与下载链接；拿不到就保持空，渲染时回退到 gadgets.ts 写死的值。
function useLatestTodoFlow() {
  const [info, setInfo] = useState<{ version: string; url: string }>({
    version: '',
    url: '',
  })
  useEffect(() => {
    let alive = true
    fetch(TODOFLOW_FEED, { cache: 'no-store' })
      .then((response) => response.json())
      .then((data) => {
        if (alive && data && data.url) {
          setInfo({ version: data.version || '', url: data.url })
        }
      })
      .catch(() => {
        /* 读取失败：静默，沿用写死的值 */
      })
    return () => {
      alive = false
    }
  }, [])
  return info
}

/**
 * 小玩意儿 Section —— 每个作品一张旗舰卡片：悬浮时背后亮起旋转流光边框 + 光晕，
 * 随鼠标轻微 3D 倾斜。左图标、中名称/简介、下载按钮靠卡片最右侧。
 * 数据来自 src/data/gadgets.ts，加新作品只需在那里追加一项，卡片自动堆叠。
 */
export default function SectionGadgets() {
  const { t } = useTranslation()
  const { L } = useLocale()
  const reduceRef = useRef<boolean | null>(null)
  // TodoFlow 的最新版本/链接（仅作用于 TodoFlow 那一条；其它条目不受影响）
  const todoFlowRelease = useLatestTodoFlow()

  // 鼠标跟随 3D 倾斜（尊重 prefers-reduced-motion；用 currentTarget 支持任意张卡片，
  // 只改 DOM style，不触发重渲染）
  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (reduceRef.current === null) {
      reduceRef.current =
        typeof window !== 'undefined' &&
        !!window.matchMedia?.(MEDIA_QUERIES.reducedMotion).matches
    }
    if (reduceRef.current) return
    const el = e.currentTarget
    const rect = el.getBoundingClientRect()
    const px = (e.clientX - rect.left) / rect.width - 0.5
    const py = (e.clientY - rect.top) / rect.height - 0.5
    el.style.transform = `perspective(1000px) rotateY(${(px * 5).toFixed(2)}deg) rotateX(${(-py * 5).toFixed(2)}deg) scale(1.006)`
  }
  const onLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    e.currentTarget.style.transform =
      'perspective(1000px) rotateY(0deg) rotateX(0deg) scale(1)'
  }

  return (
    <section id={SECTION_IDS.gadgets} className="mb-12">
      <h2 className="text-2xl font-bold text-fg-strong mb-1.5">
        <Letter3DSwap text={t('gadgets.title')} />
      </h2>
      <p className="text-sm text-fg-tertiary mb-6">{t('gadgets.desc')}</p>

      <div className="gadget-grid">
        {gadgets.map((gadget) => {
          // 仅对 TodoFlow 且成功取到 feed 时，用动态链接/版本；否则沿用写死的值。
          const isTodoFlow = gadget.id === TODOFLOW_GADGET_ID
          const href =
            isTodoFlow && todoFlowRelease.url
              ? todoFlowRelease.url
              : gadget.action.href
          const version =
            isTodoFlow && todoFlowRelease.version
              ? `v${todoFlowRelease.version}`
              : gadget.version
          const isWebGadget = gadget.action.kind === 'web'
          const actionLabel = t(
            isWebGadget ? 'gadgets.tryItNow' : 'gadgets.download',
          )

          return (
            <div
              key={gadget.id}
              className="gadget-feat"
              onMouseMove={onMove}
              onMouseLeave={onLeave}
            >
              <div className="gadget-feat-inner">
                <span className="gadget-glow" aria-hidden="true" />
                <div className="relative z-10 flex items-center gap-5 max-[560px]:flex-col max-[560px]:items-start">
                  <div className="shrink-0 w-20 h-20 rounded-2xl overflow-hidden ring-1 ring-line bg-white">
                    <img
                      src={gadget.icon}
                      alt={gadget.name}
                      loading="lazy"
                      decoding="async"
                      className="block w-full h-full object-cover"
                    />
                  </div>

                  <div className="min-w-0 flex-1">
                    <h3 className="text-xl font-semibold text-accent m-0 leading-snug">
                      {gadget.name}
                    </h3>
                    <p className="text-[0.92rem] italic text-fg-secondary m-0 mt-1 leading-snug">
                      {L(gadget.tagline)}
                    </p>
                    <p className="text-[0.88rem] text-fg-secondary m-0 mt-2 leading-relaxed">
                      {L(gadget.description)}
                    </p>
                  </div>

                  <div className="shrink-0 flex flex-col items-end gap-2 max-[560px]:items-start">
                    <a
                      href={href}
                      download={isWebGadget ? undefined : true}
                      target={isWebGadget ? '_blank' : undefined}
                      rel={isWebGadget ? 'noopener noreferrer' : undefined}
                      aria-label={
                        isWebGadget
                          ? `${gadget.name}: ${actionLabel} (${t('gadgets.opensInNewTab')})`
                          : `${gadget.name}: ${actionLabel}`
                      }
                      className="gadget-dl"
                    >
                      {isWebGadget ? (
                        <ExternalLink size={15} />
                      ) : (
                        <Download size={15} />
                      )}
                      <Letter3DSwap text={actionLabel} />
                    </a>
                    <span className="inline-flex items-center gap-1.5 text-xs text-fg-tertiary">
                      <Monitor size={13} />
                      {gadget.platform} · {version}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
