import { useId, useState } from 'react'
import { AnimatePresence, LayoutGroup, motion, useReducedMotion } from 'framer-motion'
import {
  ArrowRight,
  BookOpen,
  ChevronDown,
  Compass,
  Layers,
  MapPinned,
  MessageCircle,
  Sparkles,
  Zap,
} from 'lucide-react'
import { Link } from 'react-router-dom'

const MotionLink = motion.create(Link)

const view = { once: true, amount: 0.22, margin: '0px 0px -10% 0px' }
const spring = { type: 'spring', stiffness: 380, damping: 30 }

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: spring },
}

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
}

const stats = [
  { label: 'Map regions', value: '13', hint: 'Interactive Uzbekistan', Icon: MapPinned },
  { label: 'Motion layers', value: '∞', hint: 'Framer-powered UI', Icon: Layers },
  { label: 'Theme modes', value: '2', hint: 'Light & dark memory', Icon: Zap },
  { label: 'Focus paths', value: '4+', hint: 'News, about, catalog…', Icon: Compass },
]

const spotlightTabs = [
  {
    id: 'map',
    title: 'Map-first',
    description:
      'Skim the country, hover for context, and jump straight into a filtered universities view for that area.',
    cta: 'Open the map',
    to: '/#uzbekistan-map',
  },
  {
    id: 'study',
    title: 'Study search',
    description:
      'Scan programs and institutions with filters that stay in sync with the URL — easy to share or revisit.',
    cta: 'Browse universities',
    to: '/universities',
  },
  {
    id: 'collections',
    title: 'Curated picks',
    description:
      'Collections bundle highlights with rich cards and motion so browsing feels tactile instead of flat.',
    cta: 'View collections',
    to: '/collections',
  },
]

const bento = [
  {
    title: 'Universities',
    text: 'Compare options with cards tuned for scanning.',
    to: '/universities',
    span: 'md:col-span-2',
    Icon: BookOpen,
  },
  {
    title: 'News desk',
    text: 'Rhythm, type scale, and spacing built for reading.',
    to: '/news',
    span: 'md:col-span-1',
    Icon: MessageCircle,
  },
  {
    title: 'Collections',
    text: 'Layered imagery and hover depth for products.',
    to: '/collections',
    span: 'md:col-span-1',
    Icon: Sparkles,
  },
  {
    title: 'About the build',
    text: 'Principles, stack, and how the experience is shaped.',
    to: '/about',
    span: 'md:col-span-2',
    Icon: Layers,
  },
]

const faq = [
  {
    q: 'Can I deep-link to a map region?',
    a: 'Yes. Choose a region on the map and the universities list opens with a matching ?region= query you can bookmark or share.',
  },
  {
    q: 'Does motion respect accessibility settings?',
    a: 'Sections use reduced-motion preferences: looping ambient motion pauses and entrances simplify when you prefer less movement.',
  },
  {
    q: 'Where should I start as a developer?',
    a: 'Skim App routes, then UzbekistanMapSection for interaction patterns, and CollectionsPage for denser UI examples.',
  },
]

export default function HomeMoreSections() {
  const reduceMotion = useReducedMotion()
  const [tab, setTab] = useState(0)
  const [openFaq, setOpenFaq] = useState(null)
  const statsHeadingId = useId()
  const spotlightId = useId()
  const bentoId = useId()
  const faqId = useId()

  const active = spotlightTabs[tab]

  return (
    <div className="border-t border-slate-200/80 bg-gradient-to-b from-slate-100 via-slate-50 to-slate-100 dark:border-slate-800/80 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="mx-auto max-w-6xl space-y-20 px-4 py-16 sm:space-y-24 sm:px-6 sm:py-20 md:space-y-28 md:px-8 md:py-24 lg:px-10">
        {/* Stats */}
        <section aria-labelledby={statsHeadingId}>
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={view}
            className="text-center"
          >
            <motion.p
              variants={fadeUp}
              id={statsHeadingId}
              className="text-xs font-semibold uppercase tracking-[0.28em] text-violet-600 dark:text-violet-400"
            >
              At a glance
            </motion.p>
            <motion.h2
              variants={fadeUp}
              className="mt-3 text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50 sm:text-3xl"
            >
              Built for exploration
            </motion.h2>
          </motion.div>
          <motion.ul
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={view}
            className="mt-10 grid grid-cols-2 gap-3 sm:mt-12 sm:grid-cols-4 sm:gap-4"
          >
            {stats.map((s) => (
              <motion.li
                key={s.label}
                variants={fadeUp}
                whileHover={reduceMotion ? undefined : { y: -4, transition: { type: 'spring', stiffness: 400, damping: 22 } }}
                className="rounded-2xl border border-slate-200/90 bg-white/90 p-4 text-left shadow-sm dark:border-slate-700/90 dark:bg-slate-900/85 sm:p-5"
              >
                <s.Icon className="h-5 w-5 text-violet-500" aria-hidden />
                <p className="mt-3 text-2xl font-bold tabular-nums text-slate-900 dark:text-slate-50">{s.value}</p>
                <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  {s.label}
                </p>
                <p className="mt-2 text-[11px] leading-snug text-slate-500 dark:text-slate-500">{s.hint}</p>
              </motion.li>
            ))}
          </motion.ul>
        </section>

        {/* Interactive spotlight tabs */}
        <section aria-labelledby={spotlightId} className="rounded-3xl border border-slate-200/90 bg-white/80 p-6 shadow-sm dark:border-slate-700/90 dark:bg-slate-900/75 sm:p-8 md:p-10">
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={view}
            className="mx-auto max-w-3xl text-center"
          >
            <motion.p variants={fadeUp} id={spotlightId} className="text-xs font-semibold uppercase tracking-[0.28em] text-violet-600 dark:text-violet-400">
              Interactive
            </motion.p>
            <motion.h2 variants={fadeUp} className="mt-3 text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50 sm:text-3xl">
              Pick a lens — content updates in place
            </motion.h2>
          </motion.div>

          <LayoutGroup>
            <div className="mt-8 flex flex-wrap justify-center gap-2 sm:mt-10" role="tablist" aria-label="Spotlight topics">
              {spotlightTabs.map((t, i) => {
                const selected = i === tab
                return (
                  <button
                    key={t.id}
                    type="button"
                    role="tab"
                    aria-selected={selected}
                    aria-controls={`spotlight-panel-${t.id}`}
                    id={`spotlight-tab-${t.id}`}
                    onClick={() => setTab(i)}
                    className={`relative overflow-hidden rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                      selected
                        ? 'text-white'
                        : 'text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white'
                    }`}
                  >
                    {selected ? (
                      <motion.span
                        layoutId="spotlight-pill"
                        className="absolute inset-0 z-0 rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-600 shadow-md dark:from-violet-500 dark:to-fuchsia-500"
                        transition={{ type: 'spring', stiffness: 400, damping: 34 }}
                      />
                    ) : null}
                    <span className="relative z-10">{t.title}</span>
                  </button>
                )
              })}
            </div>
          </LayoutGroup>

          <div className="relative mt-8 min-h-[200px] sm:min-h-[180px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={active.id}
                id={`spotlight-panel-${active.id}`}
                role="tabpanel"
                aria-labelledby={`spotlight-tab-${active.id}`}
                initial={reduceMotion ? false : { opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduceMotion ? undefined : { opacity: 0, y: -10 }}
                transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                className="mx-auto max-w-xl text-center"
              >
                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50">{active.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-300">{active.description}</p>
                <MotionLink
                  to={active.to}
                  whileHover={reduceMotion ? undefined : { scale: 1.03 }}
                  whileTap={reduceMotion ? undefined : { scale: 0.98 }}
                  className="mt-6 inline-flex items-center gap-2 rounded-full bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white shadow-md transition-colors hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100"
                >
                  {active.cta}
                  <ArrowRight className="h-4 w-4" aria-hidden />
                </MotionLink>
              </motion.div>
            </AnimatePresence>
          </div>
        </section>

        {/* Bento */}
        <section aria-labelledby={bentoId}>
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={view}
            className="max-w-2xl"
          >
            <motion.p variants={fadeUp} id={bentoId} className="text-xs font-semibold uppercase tracking-[0.28em] text-violet-600 dark:text-violet-400">
              Surfaces
            </motion.p>
            <motion.h2 variants={fadeUp} className="mt-3 text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50 sm:text-3xl">
              Bento grid — hover, tap, and go
            </motion.h2>
            <motion.p variants={fadeUp} className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-300 sm:text-base">
              Each tile is a real route in this demo. Motion highlights affordance without getting in the way.
            </motion.p>
          </motion.div>

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={view}
            className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-5"
          >
            {bento.map((cell) => {
              const Icon = cell.Icon
              return (
                <MotionLink
                  key={cell.title}
                  to={cell.to}
                  variants={fadeUp}
                  whileHover={reduceMotion ? undefined : { y: -6, transition: { type: 'spring', stiffness: 420, damping: 26 } }}
                  whileTap={reduceMotion ? undefined : { scale: 0.99 }}
                  className={`group flex flex-col rounded-2xl border border-slate-200/90 bg-white/90 p-6 shadow-sm transition-shadow hover:border-violet-400/50 hover:shadow-lg dark:border-slate-700/90 dark:bg-slate-900/80 dark:hover:border-violet-500/45 ${cell.span}`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <Icon className="h-6 w-6 text-violet-500" aria-hidden />
                    <ArrowRight className="h-4 w-4 shrink-0 text-slate-400 transition-transform duration-200 group-hover:translate-x-0.5 dark:text-slate-500" aria-hidden />
                  </div>
                  <h3 className="mt-4 text-lg font-semibold text-slate-900 dark:text-slate-50">{cell.title}</h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600 dark:text-slate-300">{cell.text}</p>
                  <span className="mt-5 text-xs font-semibold uppercase tracking-wider text-violet-600 dark:text-violet-400">
                    Open
                  </span>
                </MotionLink>
              )
            })}
          </motion.div>
        </section>

        {/* FAQ accordion */}
        <section aria-labelledby={faqId} className="pb-4">
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={view}
            className="max-w-2xl"
          >
            <motion.p variants={fadeUp} id={faqId} className="text-xs font-semibold uppercase tracking-[0.28em] text-violet-600 dark:text-violet-400">
              FAQ
            </motion.p>
            <motion.h2 variants={fadeUp} className="mt-3 text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50 sm:text-3xl">
              Quick answers
            </motion.h2>
          </motion.div>

          <motion.ul
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={view}
            className="mt-8 space-y-3"
          >
            {faq.map((item, i) => {
              const open = openFaq === i
              return (
                <motion.li
                  key={item.q}
                  variants={fadeUp}
                  className="overflow-hidden rounded-2xl border border-slate-200/90 bg-white/90 dark:border-slate-700/90 dark:bg-slate-900/80"
                >
                  <button
                    type="button"
                    aria-expanded={open}
                    onClick={() => setOpenFaq(open ? null : i)}
                    className="flex w-full items-center justify-between gap-4 p-4 text-left text-sm font-semibold text-slate-900 transition-colors hover:bg-slate-50/80 dark:text-slate-100 dark:hover:bg-slate-800/60 sm:p-5 sm:text-base"
                  >
                    <span className="pr-2">{item.q}</span>
                    <ChevronDown
                      className={`h-5 w-5 shrink-0 text-violet-500 transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
                      aria-hidden
                    />
                  </button>
                  <AnimatePresence initial={false}>
                    {open ? (
                      <motion.div
                        initial={reduceMotion ? false : { height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={reduceMotion ? undefined : { height: 0, opacity: 0 }}
                        transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
                        className="overflow-hidden border-t border-slate-100 dark:border-slate-800"
                      >
                        <p className="px-4 pb-4 pt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-300 sm:px-5 sm:pb-5">
                          {item.a}
                        </p>
                      </motion.div>
                    ) : null}
                  </AnimatePresence>
                </motion.li>
              )
            })}
          </motion.ul>
        </section>

        {/* CTA band */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={view}
          variants={fadeUp}
          className="relative overflow-hidden rounded-3xl border border-violet-200/80 bg-gradient-to-br from-violet-600 via-fuchsia-600 to-indigo-700 p-8 text-center shadow-xl dark:border-violet-500/30 dark:from-violet-700 dark:via-fuchsia-700 dark:to-indigo-900 sm:p-10 md:p-12"
        >
          {!reduceMotion ? (
            <motion.div
              aria-hidden
              className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-white/20 blur-3xl"
              animate={{ scale: [1, 1.15, 1], opacity: [0.35, 0.55, 0.35] }}
              transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
            />
          ) : null}
          <h2 className="relative text-2xl font-bold tracking-tight text-white sm:text-3xl">Ready when you are</h2>
          <p className="relative mx-auto mt-3 max-w-lg text-sm leading-relaxed text-violet-100 sm:text-base">
            Jump into universities, skim collections, or read the latest — each route keeps the same motion vocabulary.
          </p>
          <div className="relative mt-8 flex flex-wrap justify-center gap-3">
            <MotionLink
              to="/universities"
              whileHover={reduceMotion ? undefined : { y: -2 }}
              whileTap={reduceMotion ? undefined : { scale: 0.98 }}
              className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-violet-700 shadow-md"
            >
              Universities
              <ArrowRight className="h-4 w-4" aria-hidden />
            </MotionLink>
            <MotionLink
              to="/collections"
              whileHover={reduceMotion ? undefined : { y: -2 }}
              whileTap={reduceMotion ? undefined : { scale: 0.98 }}
              className="inline-flex items-center gap-2 rounded-full border border-white/40 bg-white/10 px-5 py-2.5 text-sm font-semibold text-white backdrop-blur-sm transition-colors hover:bg-white/20"
            >
              Collections
            </MotionLink>
            <MotionLink
              to="/news"
              whileHover={reduceMotion ? undefined : { y: -2 }}
              whileTap={reduceMotion ? undefined : { scale: 0.98 }}
              className="inline-flex items-center gap-2 rounded-full border border-white/40 bg-white/10 px-5 py-2.5 text-sm font-semibold text-white backdrop-blur-sm transition-colors hover:bg-white/20"
            >
              News
            </MotionLink>
          </div>
        </motion.section>
      </div>
    </div>
  )
}
