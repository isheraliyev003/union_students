/* eslint-disable react/prop-types -- local presentational helpers; news shapes are static */
import { useLayoutEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { LayoutGrid, List, Radio, Terminal } from 'lucide-react'
import SiteFooter from './components/SiteFooter.jsx'
import SiteHeader from './components/SiteHeader.jsx'
import { NEWS_CATEGORIES, NEWS_ITEMS } from './data/newsData.js'
import { useI18n } from './i18n.jsx'
import { applyDarkClass, persistTheme, readStoredThemeIsDark } from './theme.js'

function WireArticle({ item, index, layout, reduceMotion }) {
  const { language, tl } = useI18n()
  const isBoard = layout === 'board'

  return (
    <motion.article
      layout
      initial={reduceMotion ? false : { opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 260, damping: 26, delay: reduceMotion ? 0 : index * 0.045 }}
      className={`group relative border border-[var(--nw-line)] bg-[var(--nw-surface)] shadow-[3px_3px_0_0_var(--nw-line)] transition-shadow hover:shadow-[5px_5px_0_0_var(--nw-signal-dim)] dark:shadow-[4px_4px_0_0_rgba(251,191,36,0.1)] ${
        isBoard && item.featured ? 'md:col-span-2' : ''
      } ${isBoard ? 'p-5 sm:p-6' : 'p-5 sm:p-6 md:pl-14'}`}
    >
      {!isBoard ? (
        <>
          <div aria-hidden className="absolute left-4 top-6 hidden h-[calc(100%-3rem)] w-px bg-[var(--nw-line)] md:block" />
          <span
            aria-hidden
            className="absolute left-2.5 top-7 hidden size-3 rounded-full border-2 border-[var(--nw-signal)] bg-[var(--nw-surface)] md:block"
          />
        </>
      ) : null}

      <div className="flex flex-wrap items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--nw-muted)]">
        <span className="text-[var(--nw-signal)]">{tl(item.category)}</span>
        <span aria-hidden>·</span>
        <time dateTime={item.date}>{item.date}</time>
        <span aria-hidden>·</span>
        <span>{item.readMin} {language === 'uz' ? "daq o'qish" : language === 'ru' ? 'мин чтения' : 'min read'}</span>
      </div>

      <h2 className="news-wire-display mt-3 text-xl font-semibold leading-snug tracking-tight text-[var(--nw-ink)] sm:text-2xl">
        <button type="button" className="text-left transition hover:text-[var(--nw-signal)]">
          {tl(item.title)}
        </button>
      </h2>
      <p className="mt-2 text-sm leading-relaxed text-[var(--nw-muted)]">{tl(item.dek)}</p>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-[var(--nw-ink)]">{item.id}</span>
        <span className="h-3 w-px bg-[var(--nw-line)]" aria-hidden />
        <button
          type="button"
          className="text-[11px] font-bold uppercase tracking-wider text-[var(--nw-signal)] underline-offset-4 transition hover:underline"
        >
          {language === 'uz' ? 'Yangilikni ochish' : language === 'ru' ? 'Открыть материал' : 'Open wire'}
        </button>
      </div>
    </motion.article>
  )
}

export default function NewsPage() {
  const reduceMotion = useReducedMotion()
  const { language, tl } = useI18n()
  const [isDark, setIsDark] = useState(readStoredThemeIsDark)
  const [category, setCategory] = useState('All')
  const [layout, setLayout] = useState('stream')

  useLayoutEffect(() => {
    applyDarkClass(isDark)
    persistTheme(isDark)
  }, [isDark])

  const filtered = useMemo(() => {
    if (category === 'All') return NEWS_ITEMS
    return NEWS_ITEMS.filter((n) => (n.category?.en ?? n.category) === category)
  }, [category])

  const featured = useMemo(() => filtered.find((n) => n.featured) ?? filtered[0], [filtered])
  const rest = useMemo(() => filtered.filter((n) => n.id !== featured?.id), [filtered, featured])

  const tickerItems = useMemo(() => NEWS_ITEMS.map((n) => tl(n.title)), [language])

  return (
    <div className="news-wire news-wire-paper relative min-h-dvh w-full min-w-0 text-[var(--nw-ink)]">
      <div
        aria-hidden
        className="pointer-events-none fixed inset-x-0 top-0 z-[30] h-1 bg-gradient-to-r from-transparent via-[var(--nw-stripe)] to-transparent opacity-90"
      />

      <SiteHeader isDark={isDark} setIsDark={setIsDark} />

      <div className="w-full overflow-x-hidden">
        <div className="news-wire-ticker-mask border-b border-[var(--nw-line)] bg-[var(--nw-surface)]/80 py-2.5 backdrop-blur-sm">
          <div className="flex w-max gap-10 whitespace-nowrap px-4 font-mono text-[11px] font-medium uppercase tracking-[0.18em] text-[var(--nw-muted)] motion-safe:animate-nw-ticker motion-reduce:animate-none">
            {[...tickerItems, ...tickerItems].map((t, i) => (
              <span key={`${i}-${t.slice(0, 24)}`} className="inline-flex items-center gap-2">
                <Radio className="h-3 w-3 shrink-0 text-[var(--nw-signal)]" aria-hidden />
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>

      <main className="relative z-10 mx-auto w-full min-w-0 max-w-[1240px] px-4 pb-24 pt-8 sm:px-6 md:pt-12">
        <header className="flex min-w-0 flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="min-w-0 max-w-2xl">
            <p className="flex items-center gap-2 font-mono text-[10px] font-bold uppercase tracking-[0.35em] text-[var(--nw-signal)]">
              <Terminal className="h-4 w-4" aria-hidden />
              {language === 'uz' ? 'Union wire · demo oqim' : language === 'ru' ? 'Union wire · демо-лента' : 'Union wire · demo feed'}
            </p>
            <h1 className="news-wire-display mt-4 text-[clamp(2.1rem,6vw,3.5rem)] font-semibold leading-[1.05] tracking-tight">
              {language === 'uz'
                ? "Saytning qolgan bezaklarisiz sarlavhalar."
                : language === 'ru'
                  ? 'Заголовки без остального визуального шума сайта.'
                  : "Headlines without the rest of the site's chrome."}
            </h1>
            <p className="mt-4 max-w-xl font-mono text-sm leading-relaxed text-[var(--nw-muted)]">
              {language === 'uz'
                ? "Stream rejimi vaqt chizig'i bo'ylab, Board esa qat'iy grid bo'ylab ishlaydi. Filtrlar kanal qulfidir."
                : language === 'ru'
                  ? 'Режим Stream идет по таймлайну, Board - по жесткой сетке. Фильтры работают как переключатели каналов.'
                  : 'Stream follows a spine timeline; Board snaps to a brutal grid. Filters are channel locks - nothing here pretends to be your catalog or your atlas.'}
            </p>
          </div>

          <div className="flex min-w-0 flex-shrink-0 flex-wrap items-center gap-2 lg:flex-col lg:items-stretch">
            <span className="w-full font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--nw-muted)] lg:text-right">
              {language === 'uz' ? 'ko‘rinish' : language === 'ru' ? 'вид' : 'layout'}
            </span>
            <div className="flex rounded-lg border border-[var(--nw-line)] bg-[var(--nw-bg)] p-1 shadow-inner">
              <button
                type="button"
                onClick={() => setLayout('stream')}
                className={`flex items-center gap-2 rounded-md px-3 py-2 text-xs font-bold uppercase tracking-wider transition ${
                  layout === 'stream'
                    ? 'bg-[var(--nw-surface)] text-[var(--nw-ink)] shadow-sm'
                    : 'text-[var(--nw-muted)] hover:text-[var(--nw-ink)]'
                }`}
              >
                <List className="h-4 w-4" aria-hidden />
                {language === 'uz' ? 'Lenta' : language === 'ru' ? 'Поток' : 'Stream'}
              </button>
              <button
                type="button"
                onClick={() => setLayout('board')}
                className={`flex items-center gap-2 rounded-md px-3 py-2 text-xs font-bold uppercase tracking-wider transition ${
                  layout === 'board'
                    ? 'bg-[var(--nw-surface)] text-[var(--nw-ink)] shadow-sm'
                    : 'text-[var(--nw-muted)] hover:text-[var(--nw-ink)]'
                }`}
              >
                <LayoutGrid className="h-4 w-4" aria-hidden />
                {language === 'uz' ? 'Grid' : language === 'ru' ? 'Сетка' : 'Board'}
              </button>
            </div>
          </div>
        </header>

        {featured ? (
          <motion.section
            initial={reduceMotion ? false : { opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="relative mt-12 overflow-hidden border-2 border-[var(--nw-signal)] bg-[var(--nw-surface)] shadow-[8px_8px_0_0_var(--nw-signal-dim)] dark:border-[var(--nw-signal)] dark:shadow-[8px_8px_0_0_rgba(251,191,36,0.15)] sm:mt-14"
          >
            <div className="grid gap-0 md:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
              <div className="relative min-h-[200px] bg-[var(--nw-ink)] md:min-h-[280px]">
                <div
                  aria-hidden
                  className="absolute inset-0 opacity-40"
                  style={{
                    backgroundImage:
                      'repeating-linear-gradient(-12deg, transparent, transparent 14px, rgba(255,255,255,0.06) 14px, rgba(255,255,255,0.06) 15px)',
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-br from-[var(--nw-signal)]/30 via-transparent to-[var(--nw-alert)]/20" />
                <p className="absolute bottom-4 left-4 font-mono text-[10px] font-bold uppercase tracking-[0.3em] text-white/80">
                  {language === 'uz' ? 'asosiy' : language === 'ru' ? 'главное' : 'featured'}
                </p>
              </div>
              <div className="flex flex-col justify-center p-6 sm:p-8">
                <p className="font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-[var(--nw-signal)]">
                  {tl(featured.category)} · {featured.date}
                </p>
                <h2 className="news-wire-display mt-3 text-2xl font-semibold leading-tight tracking-tight sm:text-3xl">
                  <button type="button" className="text-left hover:text-[var(--nw-signal)]">
                    {tl(featured.title)}
                  </button>
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-[var(--nw-muted)] sm:text-base">{tl(featured.dek)}</p>
                <div className="mt-5 flex flex-wrap items-center gap-4">
                  <span className="font-mono text-xs text-[var(--nw-muted)]">{featured.readMin} min</span>
                  <span className="inline-flex items-center gap-1 font-mono text-xs font-bold uppercase text-[var(--nw-alert)]">
                    {language === 'uz' ? 'jonli' : language === 'ru' ? 'live' : 'live'}
                    <span className="motion-safe:animate-nw-blink motion-reduce:animate-none">▍</span>
                  </span>
                </div>
              </div>
            </div>
          </motion.section>
        ) : null}

        <div className="mt-12 flex min-w-0 flex-col gap-10 lg:mt-16 lg:flex-row lg:gap-12">
          <aside className="w-full min-w-0 max-w-full lg:sticky lg:top-[5.75rem] lg:z-10 lg:w-56 lg:shrink-0 lg:self-start lg:pb-6">
            <p className="font-mono text-[10px] font-bold uppercase tracking-[0.25em] text-[var(--nw-muted)]">
              {language === 'uz' ? 'kanallar' : language === 'ru' ? 'каналы' : 'channels'}
            </p>
            <nav
              aria-label={language === 'uz' ? 'Kategoriya bo‘yicha filter' : language === 'ru' ? 'Фильтр по категории' : 'Filter by category'}
              className="mt-3 flex max-w-full flex-row gap-2 overflow-x-auto overflow-y-hidden pb-1 [-webkit-overflow-scrolling:touch] lg:flex-col lg:overflow-visible"
            >
              {NEWS_CATEGORIES.map((c) => {
                const code = c.en
                const on = category === code
                return (
                  <motion.button
                    key={code}
                    type="button"
                    onClick={() => setCategory(code)}
                    whileTap={{ scale: 0.98 }}
                    className={`relative flex items-center gap-2 overflow-hidden whitespace-nowrap rounded-lg border px-3 py-2.5 text-left text-xs font-bold uppercase tracking-wider transition lg:whitespace-normal ${
                      on
                        ? 'border-[var(--nw-signal)] bg-[var(--nw-surface)] text-[var(--nw-ink)] shadow-sm'
                        : 'border-[var(--nw-line)] bg-transparent text-[var(--nw-muted)] hover:border-[var(--nw-signal)]/40 hover:text-[var(--nw-ink)]'
                    }`}
                  >
                    {on ? (
                      <motion.span
                        layoutId="nw-channel"
                        className="absolute inset-0 rounded-lg bg-[var(--nw-signal-dim)]"
                        transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                      />
                    ) : null}
                    <span
                      className={`relative z-10 size-1.5 shrink-0 rounded-full ${on ? 'bg-[var(--nw-signal)]' : 'bg-[var(--nw-line)]'}`}
                      aria-hidden
                    />
                    <span className="relative z-10">{tl(c)}</span>
                  </motion.button>
                )
              })}
            </nav>
            <p className="mt-8 hidden font-mono text-[10px] leading-relaxed text-[var(--nw-muted)] lg:block">
              {language === 'uz'
                ? "Maslahat: Board tez ko'rib chiqish uchun, Stream esa ketma-ket o'qish uchun."
                : language === 'ru'
                  ? 'Совет: Board удобен для сканирования, Stream - для последовательного чтения.'
                  : 'Tip: Board mode rewards scanning; Stream mode is for reading order.'}
            </p>
          </aside>

          <div className="min-w-0 flex-1">
            <AnimatePresence mode="wait">
              <motion.div
                key={`${layout}-${category}`}
                initial={reduceMotion ? false : { opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduceMotion ? undefined : { opacity: 0, y: -8 }}
                transition={{ duration: 0.3 }}
                className={layout === 'board' ? 'grid gap-4 sm:grid-cols-2' : 'flex flex-col gap-6'}
              >
                {rest.map((item, index) => (
                  <WireArticle key={item.id} item={item} index={index} layout={layout} reduceMotion={reduceMotion} />
                ))}
              </motion.div>
            </AnimatePresence>

            {!rest.length ? (
              <p className="mt-8 rounded-lg border border-dashed border-[var(--nw-line)] bg-[var(--nw-surface)]/60 p-8 text-center font-mono text-sm text-[var(--nw-muted)]">
                {language === 'uz'
                  ? "Bu kanalda material yo'q - boshqa kanalni tanlang."
                  : language === 'ru'
                    ? 'В этом канале нет материалов - выберите другой.'
                    : 'No items on this channel - pick another lock.'}
              </p>
            ) : null}
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}
