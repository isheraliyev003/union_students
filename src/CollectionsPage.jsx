/* eslint-disable react/prop-types -- local presentational helpers; catalog shapes are static */
import { useLayoutEffect, useMemo, useState } from 'react'
import { AnimatePresence, LayoutGroup, motion, useReducedMotion } from 'framer-motion'
import {
  ArrowDownAZ,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  Layers,
  Search,
  SlidersHorizontal,
  Sparkles,
  Wand2,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import SiteFooter from './components/SiteFooter.jsx'
import SiteHeader from './components/SiteHeader.jsx'
import { COLLECTION_CATEGORIES, COLLECTION_PRODUCTS, COLLECTION_TAGS } from './data/collectionsData.js'
import { useI18n } from './i18n.jsx'
import { applyDarkClass, persistTheme, readStoredThemeIsDark } from './theme.js'

const SORTS = [
  { id: 'featured', label: 'Featured', icon: Sparkles },
  { id: 'price-asc', label: 'Price · low', icon: ChevronUp },
  { id: 'price-desc', label: 'Price · high', icon: ChevronDown },
  { id: 'name', label: 'Name', icon: ArrowDownAZ },
]

function useFilteredProducts(query, category, activeTags, sortId) {
  return useMemo(() => {
    const q = query.trim().toLowerCase()
    let list = COLLECTION_PRODUCTS.filter((p) => {
      if (category !== 'all' && p.category !== category) return false
      if (activeTags.size && !activeTags.has(p.tag)) return false
      if (!q) return true
      return (
        p.name.toLowerCase().includes(q) ||
        p.tag.toLowerCase().includes(q) ||
        COLLECTION_CATEGORIES.find((c) => c.id === p.category)?.label.toLowerCase().includes(q)
      )
    })

    const copy = [...list]
    if (sortId === 'featured') copy.sort((a, b) => b.featuredScore - a.featuredScore)
    else if (sortId === 'price-asc') copy.sort((a, b) => a.price - b.price)
    else if (sortId === 'price-desc') copy.sort((a, b) => b.price - a.price)
    else if (sortId === 'name') copy.sort((a, b) => a.name.localeCompare(b.name))
    return copy
  }, [query, category, activeTags, sortId])
}

const heroLines = ['Curated for campus rhythm.', 'Demo catalog — swap in your SKUs.']

export default function CollectionsPage() {
  const reduceMotion = useReducedMotion()
  const { language, tl } = useI18n()
  const [isDark, setIsDark] = useState(readStoredThemeIsDark)
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('all')
  const [activeTags, setActiveTags] = useState(() => new Set())
  const [sortId, setSortId] = useState('featured')
  const [searchFocused, setSearchFocused] = useState(false)

  useLayoutEffect(() => {
    applyDarkClass(isDark)
    persistTheme(isDark)
  }, [isDark])

  const filtered = useFilteredProducts(query, category, activeTags, sortId)

  const toggleTag = (tag) => {
    setActiveTags((prev) => {
      const next = new Set(prev)
      if (next.has(tag)) next.delete(tag)
      else next.add(tag)
      return next
    })
  }

  return (
    <div className="col-lab col-lab-mesh relative min-h-screen text-[var(--col-ink)]">
      <div aria-hidden className="pointer-events-none fixed inset-0 overflow-hidden">
        <div
          className="absolute -left-[18%] top-[6%] h-[min(52vw,420px)] w-[min(52vw,420px)] rounded-full opacity-75 blur-[80px] motion-safe:animate-col-drift-a motion-reduce:animate-none motion-reduce:opacity-60"
          style={{ background: 'var(--col-blob-a)' }}
        />
        <div
          className="absolute -right-[12%] top-[28%] h-[min(48vw,380px)] w-[min(48vw,380px)] rounded-full opacity-70 blur-[90px] motion-safe:animate-col-drift-b motion-reduce:animate-none motion-reduce:opacity-55"
          style={{ background: 'var(--col-blob-b)' }}
        />
        <div
          className="absolute bottom-[-10%] left-[22%] h-[min(40vw,320px)] w-[min(40vw,320px)] rounded-full opacity-60 blur-[72px] motion-safe:animate-col-drift-c motion-reduce:animate-none motion-reduce:opacity-45"
          style={{ background: 'var(--col-blob-c)' }}
        />
      </div>

      <div aria-hidden className="pointer-events-none fixed inset-0 col-lab-grain opacity-40 dark:opacity-30" />

      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 opacity-[0.04] dark:opacity-[0.07]"
        style={{
          backgroundImage:
            'repeating-linear-gradient(-12deg, var(--col-ink) 0 1px, transparent 1px 14px)',
        }}
      />

      <SiteHeader isDark={isDark} setIsDark={setIsDark} />

      <main className="relative z-10 overflow-x-hidden">
        <div className="mx-auto max-w-[1200px] px-4 pb-28 pt-8 sm:px-6 md:pt-12">
          <section className="relative grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-stretch lg:gap-10">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
              className="relative flex flex-col justify-between overflow-hidden rounded-[2rem] border border-[var(--col-line)] bg-[var(--col-surface)] p-8 shadow-[0_24px_80px_-32px_var(--col-shadow)] backdrop-blur-xl sm:p-10 md:p-12"
            >
              <div
                aria-hidden
                className="pointer-events-none absolute -right-16 top-0 h-48 w-48 rounded-full opacity-50 blur-3xl"
                style={{ background: 'var(--col-accent-dim)' }}
              />
              <div className="relative">
                <motion.div
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.12, duration: 0.5 }}
                  className="inline-flex items-center gap-2 rounded-full border border-[var(--col-line)] bg-[var(--col-surface-strong)] px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.28em] text-[var(--col-muted)]"
                >
                  <Wand2 className="h-3.5 w-3.5 text-[var(--col-accent)]" aria-hidden />
                    {language === 'uz' ? 'Union laboratoriyasi' : language === 'ru' ? 'Лаборатория Union' : 'Union lab'}
                </motion.div>

                <h1 className="col-lab-display mt-6 text-[clamp(2.75rem,9vw,4.25rem)] font-semibold leading-[0.95] tracking-tight">
                  <motion.span
                    className="block bg-gradient-to-br from-[var(--col-accent)] via-[var(--col-secondary)] to-[var(--col-ink)] bg-clip-text text-transparent dark:from-[#fbcfe8] dark:via-[#c4b5fd] dark:to-[#e9d5ff]"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.08, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                  >
                    {language === 'uz' ? 'Kolleksiyalar' : language === 'ru' ? 'Коллекции' : 'Collections'}
                  </motion.span>
                  <motion.span
                    className="col-lab-display mt-3 block text-[clamp(1.15rem,3.8vw,1.55rem)] font-normal italic leading-snug text-[var(--col-muted)]"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.28, duration: 0.6 }}
                  >
                    {language === 'uz'
                      ? "Buyumlarning jonli devori - faqat kategoriya emas, kayfiyat bo'yicha filtrlang."
                      : language === 'ru'
                        ? 'Живая витрина объектов - фильтруйте не только по категории, но и по настроению.'
                        : 'A living wall of objects - filter by mood, not just category.'}
                  </motion.span>
                </h1>

                <ul className="mt-8 space-y-3 text-sm text-[var(--col-muted)]">
                  {heroLines.map((line, i) => (
                    <motion.li
                      key={line}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.35 + i * 0.1, duration: 0.45 }}
                      className="flex items-start gap-3"
                    >
                      <span
                        className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full"
                        style={{ background: 'var(--col-accent)' }}
                      />
                      {line}
                    </motion.li>
                  ))}
                </ul>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45, duration: 0.5 }}
                className="relative mt-10 grid grid-cols-3 gap-3 sm:gap-4"
              >
                {[
                  { k: 'Pieces', v: String(COLLECTION_PRODUCTS.length) },
                  { k: 'Worlds', v: String(COLLECTION_CATEGORIES.length) },
                  { k: 'Tags', v: String(COLLECTION_TAGS.length) },
                ].map((cell, idx) => (
                  <motion.div
                    key={cell.k}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 + idx * 0.06, type: 'spring', stiffness: 320, damping: 28 }}
                    className="rounded-2xl border border-[var(--col-line)] bg-[var(--col-surface-strong)] px-3 py-4 text-center backdrop-blur-sm sm:px-4"
                  >
                    <p className="font-mono text-2xl font-semibold tabular-nums text-[var(--col-ink)] sm:text-3xl">{cell.v}</p>
                    <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--col-muted)]">{cell.k}</p>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.15, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="relative flex min-h-[280px] flex-col justify-between overflow-hidden rounded-[2rem] border border-[var(--col-line)] bg-[var(--col-surface-strong)] p-7 shadow-[0_20px_70px_-36px_var(--col-shadow)] backdrop-blur-xl sm:min-h-[320px] sm:p-8"
            >
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 opacity-30 dark:opacity-25"
                style={{
                  background:
                    'conic-gradient(from 120deg at 70% 40%, var(--col-accent-dim), transparent 40%, var(--col-secondary-dim), transparent 75%)',
                }}
              />
              <div className="relative flex items-start justify-between gap-4">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-[var(--col-muted)]">Signal</p>
                  <p className="col-lab-display mt-2 text-2xl font-semibold leading-tight sm:text-3xl">{"Tonight's edit"}</p>
                </div>
                <Layers className="h-8 w-8 text-[var(--col-secondary)] opacity-90" aria-hidden />
              </div>
              <div className="relative mt-6 space-y-3">
                {COLLECTION_CATEGORIES.slice(0, 3).map((c, i) => (
                  <motion.div
                    key={c.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.35 + i * 0.08, duration: 0.45 }}
                    className="flex items-center justify-between rounded-xl border border-[var(--col-line)] bg-[var(--col-surface)] px-4 py-3"
                  >
                    <span className="text-sm font-medium">{tl(c.label)}</span>
                    <span className="font-mono text-xs text-[var(--col-muted)]">
                      {COLLECTION_PRODUCTS.filter((p) => p.category === c.id).length} {language === 'uz' ? 'dona' : language === 'ru' ? 'шт' : 'pcs'}
                    </span>
                  </motion.div>
                ))}
              </div>
              <p className="relative mt-6 text-xs leading-relaxed text-[var(--col-muted)]">
                {language === 'uz'
                  ? "Maslahat: teglarni qidiruv bilan birga ishlating - grid keskin emas, silliq yangilanadi."
                  : language === 'ru'
                    ? 'Совет: комбинируйте теги и поиск - сетка перестраивается плавно.'
                    : 'Tip: combine tags with search - the grid reshuffles with a spring, not a hard cut.'}
              </p>
            </motion.div>
          </section>

          <motion.section
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            aria-label="Filter catalog"
            className="relative z-20 mt-10 md:sticky md:top-24"
          >
            <div className="col-refine-aurora p-px shadow-[0_28px_90px_-36px_var(--col-shadow)] motion-reduce:shadow-[0_18px_60px_-28px_var(--col-shadow)]">
              <div className="relative overflow-hidden rounded-[1.8rem] bg-[var(--col-surface)] backdrop-blur-xl">
                <div
                  aria-hidden
                  className="pointer-events-none absolute -right-24 -top-28 h-72 w-72 rounded-full bg-[var(--col-accent-dim)] blur-3xl"
                />
                <div
                  aria-hidden
                  className="pointer-events-none absolute -bottom-24 -left-16 h-64 w-64 rounded-full bg-[var(--col-secondary-dim)] blur-3xl"
                />

                <div className="relative flex flex-col gap-8 p-5 sm:p-7 lg:flex-row lg:items-stretch lg:gap-10 lg:p-8">
                  <div className="min-w-0 flex-1 space-y-7">
                    <div className="flex flex-wrap items-end justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2 text-[var(--col-muted)]">
                          <SlidersHorizontal className="h-4 w-4 shrink-0 text-[var(--col-accent)]" aria-hidden />
                          <span className="text-[10px] font-bold uppercase tracking-[0.28em]">Refine</span>
                        </div>
                        <p className="col-lab-display mt-2 text-xl font-semibold tracking-tight sm:text-2xl">Tune the shelf</p>
                        <p className="mt-1 max-w-md text-xs leading-relaxed text-[var(--col-muted)]">
                          {language === 'uz'
                            ? "Qidiring, bo'lim tanlang, keyin teg qo'ying - tartiblash o'ng tomonda."
                            : language === 'ru'
                              ? 'Ищите, выбирайте раздел, затем теги - сортировка справа.'
                              : 'Search, pick a world, then tag the vibe - order is on the rail.'}
                        </p>
                      </div>
                      <motion.div
                        key={filtered.length}
                        initial={reduceMotion ? false : { scale: 1.12, opacity: 0.65 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ type: 'spring', stiffness: 420, damping: 26 }}
                        className="-rotate-1 select-none rounded-2xl border border-[var(--col-line)] bg-[var(--col-surface-strong)] px-4 py-2.5 text-center shadow-sm"
                      >
                        <span className="font-mono text-2xl font-bold tabular-nums leading-none text-[var(--col-ink)]">
                          {filtered.length}
                        </span>
                        <span className="mt-1 block text-[9px] font-bold uppercase tracking-[0.2em] text-[var(--col-muted)]">
                          shown
                        </span>
                      </motion.div>
                    </div>

                    <label className="block">
                      <span className="sr-only">Search</span>
                      <div
                        className={`relative rounded-[1.35rem] border bg-[var(--col-surface-strong)]/90 p-0.5 shadow-inner transition-[box-shadow,border-color] duration-300 ${
                          searchFocused
                            ? 'border-[var(--col-accent)]/55 shadow-[0_0_0_1px_var(--col-accent-dim),0_16px_48px_-18px_var(--col-accent-dim)] dark:border-[var(--col-accent)]/40'
                            : 'border-[var(--col-line)]'
                        }`}
                      >
                        <div className="relative flex items-center rounded-[1.25rem]">
                          <motion.span
                            className="pointer-events-none absolute left-4 flex text-[var(--col-muted)]"
                            aria-hidden
                            animate={
                              reduceMotion
                                ? undefined
                                : { rotate: searchFocused ? [0, -14, 10, -6, 0] : 0, scale: searchFocused ? 1.08 : 1 }
                            }
                            transition={{ duration: 0.45, ease: 'easeInOut' }}
                          >
                            <Search className="h-4 w-4" />
                          </motion.span>
                          <input
                            type="search"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            onFocus={() => setSearchFocused(true)}
                            onBlur={() => setSearchFocused(false)}
                            placeholder={
                              language === 'uz'
                                ? "Nomi, tegi yoki kategoriyani qidiring..."
                                : language === 'ru'
                                  ? 'Поиск по названию, тегу или категории...'
                                  : 'Search name, tag, or category...'
                            }
                            className="w-full rounded-[1.25rem] border-0 bg-transparent py-3.5 pl-11 pr-4 text-sm text-[var(--col-ink)] outline-none ring-0 placeholder:text-[var(--col-muted)]"
                          />
                        </div>
                      </div>
                    </label>

                    <LayoutGroup id="col-cats">
                      <div>
                        <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--col-muted)]">
                          Category
                        </p>
                        <div className="col-refine-chips -mx-1 flex snap-x snap-mandatory gap-2 overflow-x-auto px-1 pb-1 lg:flex-wrap lg:overflow-visible">
                          <div className="snap-start lg:snap-none">
                            <CuratorChip active={category === 'all'} onClick={() => setCategory('all')} layoutId="col-cat-pill">
                              All
                            </CuratorChip>
                          </div>
                          {COLLECTION_CATEGORIES.map((c) => (
                            <div key={c.id} className="snap-start lg:snap-none">
                              <CuratorChip active={category === c.id} onClick={() => setCategory(c.id)} layoutId="col-cat-pill">
                                {tl(c.label)}
                              </CuratorChip>
                            </div>
                          ))}
                        </div>
                      </div>
                    </LayoutGroup>

                    <div>
                      <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--col-muted)]">Tags</p>
                      <div className="flex flex-wrap gap-2">
                        {COLLECTION_TAGS.map((tag, i) => {
                          const on = activeTags.has(tag)
                          return (
                            <motion.button
                              key={tag}
                              type="button"
                              layout
                              onClick={() => toggleTag(tag)}
                              initial={reduceMotion ? false : { opacity: 0, y: 8 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: reduceMotion ? 0 : 0.04 + i * 0.035, duration: 0.35 }}
                              whileHover={{ scale: 1.03 }}
                              whileTap={{ scale: 0.96 }}
                              className={`relative overflow-hidden rounded-full border px-3.5 py-2 text-xs font-semibold transition-colors ${
                                on
                                  ? 'border-transparent bg-gradient-to-r from-[var(--col-accent)] to-[#be185d] text-white shadow-md shadow-[var(--col-accent-dim)] dark:to-[#9d174d]'
                                  : 'border-[var(--col-line)] bg-[var(--col-surface-strong)]/90 text-[var(--col-muted)] hover:border-[var(--col-accent)]/45 hover:text-[var(--col-ink)]'
                              }`}
                            >
                              {on ? (
                                <span
                                  aria-hidden
                                  className="pointer-events-none absolute inset-0 opacity-35"
                                  style={{
                                    background:
                                      'radial-gradient(circle at 28% 18%, rgba(255,255,255,0.85), transparent 52%)',
                                  }}
                                />
                              ) : null}
                              <span className="relative z-10">{tag}</span>
                            </motion.button>
                          )
                        })}
                      </div>
                    </div>
                  </div>

                  <div className="shrink-0 lg:w-[min(100%,220px)] lg:border-l lg:border-[var(--col-line)] lg:pl-8">
                    <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--col-muted)]">Order by</p>
                    <nav aria-label="Sort results" className="flex flex-col gap-1.5">
                      {SORTS.map(({ id, label, icon: Icon }) => {
                        const active = sortId === id
                        return (
                          <motion.button
                            key={id}
                            type="button"
                            onClick={() => setSortId(id)}
                            className={`relative flex w-full items-center gap-3 overflow-hidden rounded-xl border px-3 py-3.5 text-left text-sm font-semibold transition-colors ${
                              active
                                ? 'border-[var(--col-accent)]/35 text-[var(--col-ink)]'
                                : 'border-transparent text-[var(--col-muted)] hover:bg-[var(--col-surface-strong)] hover:text-[var(--col-ink)]'
                            }`}
                            whileTap={{ scale: 0.98 }}
                          >
                            {active ? (
                              <motion.span
                                layoutId="col-sort-rail-bg"
                                className="absolute inset-0 rounded-xl bg-gradient-to-br from-[var(--col-secondary)]/22 via-[var(--col-surface-strong)] to-[var(--col-accent)]/18 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]"
                                transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                              />
                            ) : null}
                            <span className="relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[var(--col-line)] bg-[var(--col-surface-strong)]/80 text-[var(--col-accent)] dark:text-[var(--col-secondary)]">
                              <Icon className="h-4 w-4" aria-hidden />
                            </span>
                            <span className="relative z-10 leading-tight">{label}</span>
                          </motion.button>
                        )
                      })}
                    </nav>
                  </div>
                </div>
              </div>
            </div>
          </motion.section>

          <ul className="mt-14 grid list-none grid-cols-1 gap-9 sm:grid-cols-2 sm:gap-8 lg:grid-cols-3 lg:gap-10">
            <AnimatePresence mode="popLayout">
              {filtered.map((p, i) => (
                <CuratorCard key={p.id} product={p} index={i} reduceMotion={reduceMotion} />
              ))}
            </AnimatePresence>
          </ul>

          {!filtered.length ? (
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              className="mx-auto mt-20 max-w-md rounded-[1.75rem] border border-[var(--col-line)] bg-[var(--col-surface)] px-8 py-14 text-center shadow-[0_16px_48px_-24px_var(--col-shadow)] backdrop-blur-md"
            >
              <p className="col-lab-display text-xl font-semibold text-[var(--col-ink)]">
                {language === 'uz' ? "Bu ko'rinishda mos natija yo'q" : language === 'ru' ? 'В этой выборке нет совпадений' : 'No matches in this edit'}
              </p>
              <p className="mt-3 text-sm text-[var(--col-muted)]">
                {language === 'uz'
                  ? "Teglarni kamaytiring yoki qidiruvni tozalang."
                  : language === 'ru'
                    ? 'Ослабьте теги или очистите поиск.'
                    : 'Loosen tags or clear search to bring pieces back.'}
              </p>
              <motion.button
                type="button"
                className="mt-8 rounded-full bg-gradient-to-r from-[var(--col-accent)] to-[var(--col-secondary)] px-8 py-3 text-sm font-bold text-white shadow-lg shadow-[var(--col-accent-dim)]"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  setQuery('')
                  setCategory('all')
                  setActiveTags(new Set())
                }}
              >
                {language === 'uz' ? 'Filtrlarni tiklash' : language === 'ru' ? 'Сбросить фильтры' : 'Reset filters'}
              </motion.button>
            </motion.div>
          ) : null}
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}

function CuratorChip({ children, active, onClick, layoutId }) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileTap={{ scale: 0.97 }}
      className={`relative rounded-full border px-4 py-2.5 text-sm font-semibold transition-colors ${
        active
          ? 'border-transparent text-white'
          : 'border-[var(--col-line)] bg-[var(--col-surface-strong)] text-[var(--col-ink)] hover:border-[var(--col-accent)]/35'
      }`}
    >
      {active ? (
        <motion.span
          layoutId={layoutId}
          className="absolute inset-0 rounded-full bg-[var(--col-ink)] dark:bg-gradient-to-r dark:from-[#312e81] dark:to-[#831843]"
          transition={{ type: 'spring', stiffness: 400, damping: 32 }}
        />
      ) : null}
      <span className={`relative z-10 ${active ? 'text-white' : ''}`}>{children}</span>
    </motion.button>
  )
}

function CuratorCard({ product, index, reduceMotion }) {
  const cat = COLLECTION_CATEGORIES.find((c) => c.id === product.category)?.label ?? product.category
  const specimen = String(index + 1).padStart(2, '0')
  const to = `/collections/${product.id}`

  return (
    <motion.li
      layout
      initial={{ opacity: 0, y: 36 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97, y: 8 }}
      transition={{ type: 'spring', stiffness: 280, damping: 28, delay: index * 0.032 }}
      className="group flex h-full"
    >
      <Link
        to={to}
        className="flex h-full min-h-0 w-full flex-col rounded-[1.35rem] outline-none ring-offset-2 ring-offset-white transition-shadow focus-visible:ring-2 focus-visible:ring-[var(--col-accent)] dark:ring-offset-[var(--col-bg)]"
      >
        <motion.article
          layout
          className="relative flex h-full min-h-0 w-full flex-col overflow-hidden rounded-[1.35rem] border border-[var(--col-line)] bg-[var(--col-surface-strong)] shadow-[0_4px_0_0_var(--col-line),0_22px_56px_-34px_var(--col-shadow)] dark:shadow-[0_3px_0_0_var(--col-line),0_26px_60px_-36px_var(--col-shadow)]"
          whileHover={reduceMotion ? {} : { y: -5, boxShadow: '0 6px 0 0 var(--col-line), 0 32px 70px -28px var(--col-shadow)' }}
          transition={{ type: 'spring', stiffness: 340, damping: 22 }}
        >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[var(--col-accent)]/45 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 motion-reduce:group-hover:opacity-0"
        />

        <div className="relative p-3 sm:p-3.5">
          <div className="relative aspect-[4/5] overflow-hidden rounded-xl bg-[var(--col-bg2)] ring-1 ring-[var(--col-line)]/80">
            <div
              aria-hidden
              className="pointer-events-none absolute left-2.5 top-2.5 z-20 h-7 w-7 border-l-2 border-t-2 border-[var(--col-accent)]/75"
            />
            <div
              aria-hidden
              className="pointer-events-none absolute right-2.5 top-2.5 z-20 h-7 w-7 border-r-2 border-t-2 border-[var(--col-secondary)]/65"
            />

            <motion.img
              src={product.image}
              alt=""
              className="h-full w-full object-cover"
              loading="lazy"
              whileHover={reduceMotion ? {} : { scale: 1.05 }}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            />
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 bg-[linear-gradient(165deg,transparent_40%,var(--col-ink)_125%)] opacity-35 dark:opacity-50"
            />
            <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[var(--col-ink)]/75 via-[var(--col-ink)]/20 to-transparent dark:from-black/80" />
            <div className="absolute bottom-3 left-3 right-3 flex flex-wrap items-end justify-between gap-2">
              <span className="max-w-[70%] truncate rounded-md border border-white/20 bg-black/35 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-white shadow-sm backdrop-blur-md">
                {product.tag}
              </span>
              <span className="rounded-md bg-white/95 px-2 py-1 font-mono text-xs font-bold tabular-nums text-[var(--col-ink)] shadow-sm backdrop-blur-sm dark:bg-[var(--col-ink)] dark:text-[var(--col-bg)]">
                ${product.price}
              </span>
            </div>
          </div>
        </div>

        <div className="mt-auto flex flex-1 flex-col px-4 pb-4 pt-0 sm:px-5 sm:pb-5">
          <div className="flex items-center justify-between gap-2 border-b border-[var(--col-line)] pb-3">
            <p className="min-w-0 truncate font-mono text-[10px] uppercase tracking-wider text-[var(--col-muted)]">
              <span className="text-[var(--col-ink)]">{product.id}</span>
              <span className="mx-1.5 text-[var(--col-line)]" aria-hidden>
                ·
              </span>
              <span className="tabular-nums text-[var(--col-accent)]">#{specimen}</span>
            </p>
            <span className="shrink-0 text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--col-accent)]">{cat}</span>
          </div>
          <h2 className="col-lab-display mt-3 text-[1.15rem] font-semibold leading-snug tracking-tight text-[var(--col-ink)] sm:text-xl">
            {product.name}
          </h2>
          <span className="group/btn relative mt-4 flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-[var(--col-ink)] py-3 text-xs font-bold uppercase tracking-[0.2em] text-[var(--col-bg)] dark:bg-gradient-to-r dark:from-[#3730a3] dark:via-[#6b21a8] dark:to-[#9d174d] dark:text-white">
            <span className="relative z-10">View piece</span>
            <span className="relative z-10 text-[10px] font-semibold normal-case tracking-normal opacity-80">open</span>
            <ArrowRight
              className="relative z-10 h-3.5 w-3.5 transition-transform duration-300 group-hover/btn:translate-x-0.5 motion-reduce:transition-none"
              aria-hidden
            />
          </span>
        </div>
      </motion.article>
      </Link>
    </motion.li>
  )
}
