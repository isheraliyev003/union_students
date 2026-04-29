import { useEffect, useLayoutEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Compass, Search } from 'lucide-react'
import SiteFooter from './components/SiteFooter.jsx'
import SiteHeader from './components/SiteHeader.jsx'
import { getRegions, getUniversities } from './api/catalogApi.js'
import { useI18n } from './i18n.jsx'
import { applyDarkClass, persistTheme, readStoredThemeIsDark } from './theme.js'

export default function UniversitiesPage() {
  const { language } = useI18n()
  const [searchParams, setSearchParams] = useSearchParams()
  const [isDark, setIsDark] = useState(readStoredThemeIsDark)
  const [query, setQuery] = useState('')
  const [apiRegions, setApiRegions] = useState([])
  const [universities, setUniversities] = useState([])
  const [catalogLoading, setCatalogLoading] = useState(true)
  const [catalogError, setCatalogError] = useState('')

  const regionsUi = useMemo(() => {
    const all = { id: 'all', label: 'All regions' }
    if (!apiRegions.length) return [all]
    return [all, ...apiRegions.map((r) => ({ id: r.slug, label: r.label }))]
  }, [apiRegions])

  const validRegionSet = useMemo(
    () => new Set(regionsUi.map((r) => r.id)),
    [regionsUi],
  )

  const rawRegion = searchParams.get('region') || 'all'
  const region = useMemo(() => {
    if (catalogLoading) return rawRegion
    return validRegionSet.has(rawRegion) ? rawRegion : 'all'
  }, [catalogLoading, validRegionSet, rawRegion])

  useEffect(() => {
    let c = true
    setCatalogLoading(true)
    setCatalogError('')
    Promise.all([getRegions(), getUniversities()])
      .then(([regions, unis]) => {
        if (!c) return
        setApiRegions(regions)
        setUniversities(unis)
        setCatalogLoading(false)
      })
      .catch(() => {
        if (!c) return
        setCatalogError('Could not load the catalog. Is the API running?')
        setCatalogLoading(false)
      })
    return () => {
      c = false
    }
  }, [])

  const setRegionFilter = (id) => {
    if (id === 'all') setSearchParams({}, { replace: true })
    else setSearchParams({ region: id }, { replace: true })
  }

  useLayoutEffect(() => {
    applyDarkClass(isDark)
    persistTheme(isDark)
  }, [isDark])

  const filtered = useMemo(() => {
    if (catalogLoading) return []
    const q = query.trim().toLowerCase()
    return universities.filter((u) => {
      const matchRegion = region === 'all' || u.region === region
      const matchName = !q || u.name.toLowerCase().includes(q) || u.shortDetail.toLowerCase().includes(q)
      return matchRegion && matchName
    })
  }, [query, region, universities, catalogLoading])

  const regionLabel = (r) => {
    if (language === 'uz') {
      const map = {
        all: 'Barcha hududlar',
        tashkent: 'Toshkent',
        samarkand: 'Samarqand',
        bukhara: 'Buxoro',
        fergana: "Farg'ona vodiysi",
        other: 'Boshqa',
      }
      return map[r.id] ?? r.label
    }
    if (language === 'ru') {
      const map = {
        all: 'Все регионы',
        tashkent: 'Ташкент',
        samarkand: 'Самарканд',
        bukhara: 'Бухара',
        fergana: 'Ферганская долина',
        other: 'Другие',
      }
      return map[r.id] ?? r.label
    }
    return r.label
  }

  return (
    <>
    <main className="uni-atlas uni-atlas-bg relative min-h-screen text-[var(--uni-ink)]">
      {/* overflow hidden only here so `position: sticky` on the regions rail still works */}
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="uni-grid-lines absolute inset-0" />
        <svg
          className="absolute right-0 top-40 w-[min(42vw,320px)] text-slate-400 opacity-[0.35] dark:text-[var(--uni-teal)] dark:opacity-[0.18]"
          viewBox="0 0 120 120"
          fill="none"
        >
          <path
            d="M60 4 L116 32 L116 88 L60 116 L4 88 L4 32 Z"
            stroke="currentColor"
            strokeWidth="0.8"
          />
          <circle cx="60" cy="60" r="8" fill="currentColor" opacity="0.35" />
          <path d="M60 20v80M20 60h80" stroke="currentColor" strokeWidth="0.35" opacity="0.5" />
        </svg>
      </div>

      <SiteHeader isDark={isDark} setIsDark={setIsDark} />

      <div className="relative mx-auto max-w-[1360px] px-5 pb-20 pt-4 sm:px-8 md:px-10 lg:pt-6">
        <div className="flex flex-col gap-10 lg:flex-row-reverse lg:items-start lg:gap-16 xl:gap-20">
          <aside className="sticky top-24 z-20 w-full max-w-full shrink-0 self-start border-b border-[var(--uni-line)] bg-[var(--uni-paper)]/95 px-0 pb-3 backdrop-blur-md sm:top-28 lg:top-[6.5rem] lg:w-[220px] lg:border-b-0 lg:bg-[var(--uni-paper)]/85 lg:pb-0 lg:backdrop-blur-sm xl:top-[7rem] xl:w-[248px] dark:lg:bg-transparent dark:lg:backdrop-blur-none">
            <motion.div
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.55, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            >
            <div className="mb-3 flex items-center gap-2 lg:mb-5">
              <Compass className="h-4 w-4 text-[var(--uni-teal-bright)] dark:text-[var(--uni-teal)]" aria-hidden />
              <span className="text-[11px] font-bold uppercase tracking-[0.28em] text-[var(--uni-teal)] dark:text-[var(--uni-muted)]">
                {language === 'uz' ? 'Hududlar' : language === 'ru' ? 'Регионы' : 'Regions'}
              </span>
            </div>

            <div className="flex snap-x snap-mandatory gap-2 overflow-x-auto pb-2 lg:hidden [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {regionsUi.map((r) => {
                const active = region === r.id
                return (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => setRegionFilter(r.id)}
                    className={`snap-center shrink-0 rounded-full border px-4 py-2.5 text-left text-sm font-medium transition ${
                      active
                        ? 'border-[var(--uni-teal)] bg-[var(--uni-teal-dim)] text-[var(--uni-ink)] shadow-sm dark:border-2'
                        : 'border-[var(--uni-line)] bg-white text-[var(--uni-muted)] shadow-sm dark:border-2 dark:bg-slate-950/40'
                    }`}
                  >
                    <span className="font-mono text-[10px] text-[var(--uni-teal-bright)] dark:text-[var(--uni-teal)]">
                      {String(regionsUi.indexOf(r)).padStart(2, '0')}
                    </span>
                    <span className="mt-0.5 block whitespace-nowrap">{regionLabel(r)}</span>
                  </button>
                )
              })}
            </div>

            <nav
              aria-label={language === 'uz' ? "Hudud bo'yicha filter" : language === 'ru' ? 'Фильтр по региону' : 'Filter by region'}
              className="relative hidden border-l-2 border-[var(--uni-line)] pl-1 lg:block"
            >
              {regionsUi.map((r) => {
                const active = region === r.id
                return (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => setRegionFilter(r.id)}
                    className={`relative flex w-full items-center gap-3 px-4 py-3.5 text-left transition ${
                      active
                        ? 'text-[var(--uni-ink)]'
                        : 'text-[var(--uni-muted)] hover:text-[var(--uni-ink)] dark:hover:text-[var(--uni-ink)]'
                    }`}
                  >
                    {active ? (
                      <motion.span
                        layoutId="uni-region-rail"
                        className="absolute bottom-1 left-0 top-1 w-1 rounded-full bg-[var(--uni-teal-bright)] dark:bg-[var(--uni-teal)]"
                        transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                      />
                    ) : null}
                    <span
                      className={`font-mono text-[11px] tabular-nums ${active ? 'text-[var(--uni-teal-bright)] dark:text-[var(--uni-teal)]' : 'opacity-50'}`}
                    >
                      {String(regionsUi.indexOf(r)).padStart(2, '0')}
                    </span>
                    <span className={`text-sm ${active ? 'font-semibold' : 'font-medium'}`}>{regionLabel(r)}</span>
                  </button>
                )
              })}
            </nav>
            </motion.div>
          </aside>

          <div className="relative z-10 min-w-0 flex-1">
            <p
              aria-hidden
              className="uni-display pointer-events-none absolute -left-1 top-6 select-none text-[clamp(5.5rem,20vw,11rem)] font-bold leading-[0.82] tracking-tight text-slate-900/[0.07] dark:text-white/[0.06] sm:-left-2 sm:top-4 md:text-[clamp(6rem,17vw,10rem)]"
            >
              {language === 'uz' ? 'Atlas' : language === 'ru' ? 'Атлас' : 'Atlas'}
            </p>

            <motion.header
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              className="relative z-[1] max-w-3xl border-l-2 border-[var(--uni-teal)] pl-5 sm:pl-6"
            >
              <p className="text-[11px] font-semibold uppercase tracking-[0.42em] text-[var(--uni-teal)] dark:text-teal-300">
                {language === 'uz' ? 'Union katalogi' : language === 'ru' ? 'Каталог Union' : 'Union directory'}
              </p>
              <h1 className="uni-display mt-2 text-[clamp(2.15rem,5vw,3.35rem)] font-semibold leading-[1.08] tracking-tight text-[var(--uni-ink)]">
                {language === 'uz' ? 'Universitet ' : language === 'ru' ? 'Атлас ' : 'University '}
                <span className="text-[var(--uni-ink)] dark:text-slate-200">
                  {language === 'uz' ? 'atlasi' : language === 'ru' ? 'университетов' : 'atlas'}
                </span>
              </h1>
              <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-[var(--uni-muted)]">
                {language === 'uz'
                  ? "Hududlar bo‘yicha universitetlarni o‘rganish uchun yagona maydon. Ma’lumotlar serverdan olinadi."
                  : language === 'ru'
                    ? 'Единая поверхность для изучения университетов по регионам. Данные приходят с сервера.'
                    : 'A single surface to wander institutions by region. Data is loaded from the API.'}
              </p>
            </motion.header>

            {catalogError ? (
              <p className="mt-6 rounded-lg border border-red-300/80 bg-red-50 px-4 py-3 text-sm text-red-800 dark:border-red-800 dark:bg-red-950/50 dark:text-red-200">
                {catalogError}
              </p>
            ) : null}

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
              className="uni-search-glow relative z-[1] mt-10 max-w-xl rounded-xl border border-[var(--uni-line)] bg-white transition-shadow dark:rounded-sm dark:border-2 dark:bg-slate-950/50"
            >
              <label className="relative flex items-center gap-3 px-4 py-3.5 sm:px-5 sm:py-4">
                <span className="sr-only">
                  {language === 'uz' ? 'Universitetlarni qidirish' : language === 'ru' ? 'Поиск университетов' : 'Search universities'}
                </span>
                <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[var(--uni-teal-dim)] text-[var(--uni-teal-bright)] dark:text-[var(--uni-teal)]">
                  <Search className="h-4 w-4" strokeWidth={2.2} aria-hidden />
                </span>
                <input
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={
                    language === 'uz'
                      ? 'Nomi, yo‘nalishi yoki joylashuvini kiriting…'
                      : language === 'ru'
                        ? 'Введите название, направление или место…'
                        : 'Type a name, discipline, or place...'
                  }
                  className="min-w-0 flex-1 bg-transparent text-[15px] font-medium outline-none placeholder:text-[var(--uni-muted)] placeholder:opacity-75"
                />
              </label>
            </motion.div>

            <motion.p
              key={`${region}-${query}-${filtered.length}-${catalogLoading}`}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              className="mt-5 font-mono text-[12px] tracking-tight text-[var(--uni-muted)]"
            >
              <span className="text-[var(--uni-teal-bright)] dark:text-[var(--uni-teal)]">
                {String(catalogLoading ? 0 : filtered.length).padStart(2, '0')}
              </span>
              &nbsp;·&nbsp;
              {catalogLoading
                ? language === 'uz'
                  ? 'Yuklanmoqda'
                  : language === 'ru'
                    ? 'Загрузка'
                    : 'Loading'
                : language === 'uz'
                  ? `${filtered.length === 1 ? 'moslik' : 'mosliklar'} ko‘rinmoqda`
                  : language === 'ru'
                    ? `${filtered.length === 1 ? 'совпадение' : 'совпадений'} в выдаче`
                    : `${filtered.length === 1 ? 'match' : 'matches'} in view`}
            </motion.p>

            <motion.div layout className="mt-10 grid grid-cols-12 gap-5 md:gap-6">
              <AnimatePresence mode="popLayout">
                {filtered.map((u, index) => {
                  const isWide = index === 0 && filtered.length >= 4
                  const colClass = isWide
                    ? 'col-span-12 xl:col-span-8 xl:flex xl:max-h-[min(340px,42vh)] xl:flex-row'
                    : 'col-span-12 sm:col-span-6 xl:col-span-4'
                  return (
                    <Link
                      key={u.id}
                      to={`/universities/${u.id}`}
                      className={`group block min-h-0 outline-none focus-visible:ring-2 focus-visible:ring-amber-400/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--uni-paper)] dark:focus-visible:ring-offset-slate-950 ${colClass}`}
                    >
                    <motion.article
                      layout
                      initial={{ opacity: 0, y: 32, rotate: -0.4 }}
                      animate={{
                        opacity: 1,
                        y: 0,
                        rotate: 0,
                        transition: {
                          type: 'spring',
                          stiffness: 340,
                          damping: 28,
                          delay: Math.min(index * 0.05, 0.24),
                        },
                      }}
                      exit={{ opacity: 0, scale: 0.94, rotate: 0.5, transition: { duration: 0.2 } }}
                      whileHover={{
                        y: -6,
                        rotate: index % 2 === 0 ? -0.6 : 0.6,
                        transition: { type: 'spring', stiffness: 400, damping: 22 },
                      }}
                      className="relative flex h-full min-h-0 flex-col overflow-hidden rounded-br-[2.25rem] rounded-tl-3xl rounded-tr-sm border border-[var(--uni-line)] bg-white shadow-[4px_4px_0_0_rgba(15,23,42,0.06)] transition-shadow group-hover:shadow-[6px_8px_0_0_rgba(15,23,42,0.08)] dark:border-2 dark:border-[var(--uni-line)] dark:bg-slate-950/70 dark:shadow-[6px_6px_0_0] dark:shadow-teal-500/20 dark:group-hover:shadow-[8px_10px_0_0] dark:group-hover:shadow-teal-500/25"
                    >
                      <span
                        aria-hidden
                        className="uni-display absolute right-4 top-3 text-5xl font-semibold tabular-nums text-[var(--uni-ink)]/[0.06] dark:text-white/[0.07] sm:text-6xl"
                      >
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      <div
                        className={`relative overflow-hidden bg-slate-200 dark:bg-slate-800 ${isWide ? 'aspect-[16/10] xl:aspect-auto xl:h-auto xl:w-[46%] xl:min-h-[240px] xl:shrink-0' : 'aspect-[16/11]'}`}
                      >
                        <div
                          className="pointer-events-none absolute inset-0 z-[1] mix-blend-multiply opacity-[0.09] dark:mix-blend-soft-light dark:opacity-[0.2]"
                          style={{
                            background: `linear-gradient(135deg, var(--uni-teal) 0%, transparent 45%, var(--uni-coral) 100%)`,
                          }}
                        />
                        <motion.img
                          src={u.image}
                          alt=""
                          className="h-full w-full object-cover"
                          loading="lazy"
                          whileHover={{ scale: 1.06 }}
                          transition={{ type: 'spring', stiffness: 280, damping: 22 }}
                        />
                        <span className="absolute bottom-3 left-3 z-[2] max-w-[85%] rounded-sm border border-white/30 bg-[var(--uni-ink)]/85 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-white backdrop-blur-sm dark:border-white/15 dark:bg-black/70">
                          {regionLabel(
                            regionsUi.find((x) => x.id === u.region) ?? {
                              id: u.region,
                              label: u.regionLabel,
                            },
                          )}
                        </span>
                      </div>
                      <div className={`relative flex flex-1 flex-col justify-center p-5 ${isWide ? 'xl:py-8 xl:pl-8 xl:pr-10' : ''}`}>
                        <h2 className="uni-display pr-14 text-lg font-semibold leading-snug sm:text-xl">
                          {u.name}
                        </h2>
                        <p className="mt-3 text-sm leading-relaxed text-[var(--uni-muted)] sm:text-[15px]">
                          {u.shortDetail}
                        </p>
                        <motion.span
                          className="mt-5 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-[var(--uni-teal-bright)] dark:text-[var(--uni-teal)]"
                          whileHover={{ x: 4 }}
                        >
                          {language === 'uz' ? "Sahifani ochish" : language === 'ru' ? 'Открыть лист' : 'Open sheet'}
                          <span aria-hidden className="inline-block transition-transform group-hover:translate-x-0.5">
                            →
                          </span>
                        </motion.span>
                      </div>
                    </motion.article>
                    </Link>
                  )
                })}
              </AnimatePresence>
            </motion.div>

            {filtered.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mt-14 border-2 border-dashed border-[var(--uni-line)] bg-white/50 px-6 py-14 text-center dark:bg-slate-950/40"
              >
                <Compass className="mx-auto h-10 w-10 text-[var(--uni-teal)] opacity-70" aria-hidden />
                <p className="uni-display mt-4 text-lg text-[var(--uni-muted)]">
                  {language === 'uz' ? "Bu yo'nalishda natija yo'q" : language === 'ru' ? 'По этому направлению пусто' : 'Nothing on this bearing'}
                </p>
                <p className="mt-2 text-sm text-[var(--uni-muted)]">
                  {language === 'uz'
                    ? "Hududni kengaytiring yoki qidiruv maydonini tozalang."
                    : language === 'ru'
                      ? 'Расширьте регион или очистите поиск.'
                      : 'Widen the region or clear the search field.'}
                </p>
              </motion.div>
            ) : null}
          </div>
        </div>
      </div>
    </main>
    <SiteFooter />
    </>
  )
}
