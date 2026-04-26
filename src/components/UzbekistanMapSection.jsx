import { useCallback, useId, useMemo, useRef, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { MapPin } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useI18n } from '../i18n.jsx'
import { UZ_MAP_ATTRIBUTION, UZ_MAP_VIEWBOX, UZ_REGIONS } from '../data/uzbekistanMap.js'

const baseFill = {
  light: 'rgba(29, 47, 69, 0.42)',
  dark: 'rgba(148, 163, 184, 0.35)',
}
const hoverFill = {
  light: 'rgba(139, 92, 246, 0.45)',
  /* Dark mode: lift with a light “paper” fill so hover reads clearly brighter than base */
  dark: 'rgba(248, 250, 252, 0.62)',
}
const stroke = {
  light: 'rgba(15, 23, 42, 0.18)',
  dark: 'rgba(226, 232, 240, 0.22)',
}

/** Max tooltip width matches max-w-sm (24rem) for edge / clamp math */
const TOOLTIP_MAX_W = 384
const TOOLTIP_EDGE_MARGIN = 8

export default function UzbekistanMapSection({ isDark = false }) {
  const reduceMotion = useReducedMotion()
  const { language, tl } = useI18n()
  const navigate = useNavigate()
  const titleId = useId()
  const descId = useId()
  const liveId = useId()
  const mapWrapRef = useRef(null)
  const [hoveredId, setHoveredId] = useState(null)
  const [pointer, setPointer] = useState({ x: 0, y: 0 })
  const [wrapSize, setWrapSize] = useState({ w: 0, h: 0 })

  const active = useMemo(() => UZ_REGIONS.find((r) => r.id === hoveredId) ?? null, [hoveredId])

  const updatePointerFromClient = useCallback((clientX, clientY) => {
    const el = mapWrapRef.current
    if (!el) return
    const r = el.getBoundingClientRect()
    setWrapSize({ w: r.width, h: r.height })
    setPointer({ x: clientX - r.left, y: clientY - r.top })
  }, [])

  const centerPointerInMap = useCallback(() => {
    const el = mapWrapRef.current
    if (!el) return
    const r = el.getBoundingClientRect()
    setWrapSize({ w: r.width, h: r.height })
    setPointer({ x: r.width / 2, y: r.height * 0.42 })
  }, [])

  const onRegionClick = useCallback(
    (catalogRegionId) => {
      navigate(`/universities?region=${encodeURIComponent(catalogRegionId)}`)
    },
    [navigate],
  )

  const fillFor = (id) => {
    const base = isDark ? baseFill.dark : baseFill.light
    const hi = isDark ? hoverFill.dark : hoverFill.light
    return hoveredId === id ? hi : base
  }

  const strokeFor = () => (isDark ? stroke.dark : stroke.light)

  const tooltipLayout = useMemo(() => {
    const top = Math.max(pointer.y - 12, 8)
    const w = wrapSize.w
    if (!w) {
      return {
        left: pointer.x,
        top,
        transform: 'translate(-50%, -100%)',
      }
    }

    const m = TOOLTIP_EDGE_MARGIN
    const tw = Math.min(TOOLTIP_MAX_W, Math.max(w - 2 * m, 80))
    const x = pointer.x
    const threshold = tw / 2 + m + 20
    const nearLeft = x < threshold
    const nearRight = x > w - threshold

    let mode
    if (nearLeft && nearRight) mode = x < w / 2 ? 'start' : 'end'
    else if (nearLeft) mode = 'start'
    else if (nearRight) mode = 'end'
    else mode = 'center'

    if (mode === 'start') {
      return {
        left: Math.min(Math.max(x, m), w - tw - m),
        top,
        transform: 'translate(0, -100%)',
      }
    }
    if (mode === 'end') {
      const px = Math.min(Math.max(x, m + tw), w - m)
      return { left: px, top, transform: 'translate(-100%, -100%)' }
    }
    const half = tw / 2
    return {
      left: Math.min(Math.max(x, half + m), w - half - m),
      top,
      transform: 'translate(-50%, -100%)',
    }
  }, [pointer.x, pointer.y, wrapSize.w])

  return (
    <section
      id="uzbekistan-map"
      aria-labelledby={titleId}
      aria-describedby={descId}
      className="relative isolate min-h-dvh w-full min-w-0 overflow-x-hidden scroll-mt-24 bg-gradient-to-b from-slate-100 via-slate-50 to-slate-100 py-16 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 sm:py-20"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.35] dark:opacity-[0.2]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(15,23,42,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(15,23,42,0.06) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />

      <div className="relative z-10 mx-auto flex min-h-[min(100dvh,880px)] max-w-6xl flex-col px-4 sm:px-6 md:px-8">
        <div className="mb-8 max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-violet-600 dark:text-violet-400">
            {language === 'uz' ? "Ko'rib chiqing" : language === 'ru' ? 'Изучайте' : 'Explore'}
          </p>
          <h2 id={titleId} className="mt-2 text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50 sm:text-4xl">
            {language === 'uz' ? 'Oʻzbekiston bir qarashda' : language === 'ru' ? 'Узбекистан с первого взгляда' : 'Uzbekistan at a glance'}
          </h2>
          <p id={descId} className="mt-3 text-pretty text-sm leading-relaxed text-slate-600 dark:text-slate-300 sm:text-base">
            {language === 'uz'
              ? "Hudud ustiga olib boring yoki fokus qiling, so'ng Enter bosing - shu hudud bo'yicha universitetlar ro'yxati ochiladi (demo)."
              : language === 'ru'
                ? 'Наведите или выделите регион, затем нажмите Enter - откроется список университетов с фильтром по региону (демо).'
                : 'Hover or focus a region, then press Enter to open the universities list filtered for that area (demo regions).'}
          </p>
        </div>

        <div
          className="relative flex min-h-0 flex-1 flex-col items-center justify-center"
          onPointerLeave={() => setHoveredId(null)}
        >
          <motion.div
            ref={mapWrapRef}
            initial={reduceMotion ? false : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-10% 0px' }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full max-w-[min(100%,920px)]"
            onPointerMove={(e) => {
              if (e.pointerType === 'mouse' || e.pointerType === 'pen') {
                updatePointerFromClient(e.clientX, e.clientY)
              }
            }}
          >
            <svg
              viewBox={UZ_MAP_VIEWBOX}
              role="img"
              aria-label={language === 'uz' ? "O'zbekiston hududlari xaritasi" : language === 'ru' ? 'Карта регионов Узбекистана' : 'Map of Uzbekistan regions'}
              className="h-auto w-full drop-shadow-[0_20px_50px_-20px_rgba(15,23,42,0.25)] dark:drop-shadow-[0_24px_60px_-24px_rgba(0,0,0,0.55)]"
              preserveAspectRatio="xMidYMid meet"
            >
              {UZ_REGIONS.map((region, index) => {
                const common = {
                  d: region.path,
                  fill: fillFor(region.id),
                  stroke: strokeFor(),
                  strokeWidth: 1.1,
                  style: { vectorEffect: 'non-scaling-stroke' },
                  className: 'transition-[fill] duration-200',
                }

                const interactive = {
                  onPointerEnter: (e) => {
                    setHoveredId(region.id)
                    updatePointerFromClient(e.clientX, e.clientY)
                  },
                  onPointerLeave: () => setHoveredId((h) => (h === region.id ? null : h)),
                  onFocus: () => {
                    setHoveredId(region.id)
                    queueMicrotask(() => centerPointerInMap())
                  },
                  onBlur: () => setHoveredId((h) => (h === region.id ? null : h)),
                  onClick: () => onRegionClick(region.catalogRegionId),
                  onKeyDown: (e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault()
                      onRegionClick(region.catalogRegionId)
                    }
                  },
                }

                return (
                  <g
                    key={region.id}
                    role="button"
                    tabIndex={0}
                    aria-label={`${tl(region.label)}, ${region.catalogRegionId}`}
                    {...interactive}
                    className="outline-none focus-visible:outline-none"
                  >
                    {reduceMotion ? (
                      <path {...common} />
                    ) : (
                      <motion.path
                        {...common}
                        initial={{ opacity: 0, y: 4 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.45, delay: index * 0.035, ease: [0.22, 1, 0.36, 1] }}
                      />
                    )}
                  </g>
                )
              })}
            </svg>

            {active ? (
              <motion.div
                role="tooltip"
                aria-hidden
                initial={reduceMotion ? false : { opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                className="pointer-events-none absolute z-20 w-[min(calc(100%-1rem),24rem)] max-w-sm rounded-xl border border-slate-200/90 bg-white/95 px-3 py-2 text-left text-xs text-slate-800 shadow-lg backdrop-blur-md dark:border-slate-600/90 dark:bg-slate-900/95 dark:text-slate-100"
                style={{
                  left: tooltipLayout.left,
                  top: tooltipLayout.top,
                  transform: tooltipLayout.transform,
                }}
              >
                <p className="font-semibold">{tl(active.label)}</p>
                <p className="mt-0.5 text-[11px] text-slate-500 dark:text-slate-400">{active.catalogRegionId}</p>
                <p className="mt-1 text-[10px] font-medium uppercase tracking-wider text-violet-600 dark:text-violet-400">
                  {language === 'uz'
                    ? `Universitetlar ochiladi · ${active.catalogRegionId}`
                    : language === 'ru'
                      ? `Откроются университеты · ${active.catalogRegionId}`
                      : `Opens universities · ${active.catalogRegionId}`}
                </p>
              </motion.div>
            ) : null}
          </motion.div>

          <p id={liveId} className="sr-only" aria-live="polite">
            {active ? `${tl(active.label)}.` : ''}
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <MapPin className="h-3.5 w-3.5 shrink-0 text-violet-500" aria-hidden />
            <span>{tl(UZ_MAP_ATTRIBUTION.title)}</span>
          </div>
          <p className="mt-2 max-w-3xl text-[11px] leading-relaxed text-slate-500 dark:text-slate-500">
            {tl(UZ_MAP_ATTRIBUTION.note)}
            {UZ_MAP_ATTRIBUTION.referenceUrl ? (
              <>
                {' '}
                <a
                  href={UZ_MAP_ATTRIBUTION.referenceUrl}
                  className="text-violet-600 underline-offset-2 hover:underline dark:text-violet-400"
                >
                  {language === 'uz' ? 'Manba' : language === 'ru' ? 'Источник' : 'Reference'}
                </a>
              </>
            ) : null}
            {UZ_MAP_ATTRIBUTION.licenseUrl ? (
              <>
                {' '}
                ·{' '}
                <a
                  href={UZ_MAP_ATTRIBUTION.licenseUrl}
                  className="text-violet-600 underline-offset-2 hover:underline dark:text-violet-400"
                >
                  {language === 'uz' ? 'Litsenziya' : language === 'ru' ? 'Лицензия' : 'License'}
                </a>
              </>
            ) : null}
          </p>
        </div>
      </div>
    </section>
  )
}
