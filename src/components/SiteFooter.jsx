import { useMemo } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { WandSparkles } from 'lucide-react'
import { Link, NavLink, useLocation } from 'react-router-dom'

const exploreLinks = [
  { to: '/', label: 'Home', end: true },
  { to: '/universities', label: 'Universities' },
  { to: '/collections', label: 'Collections' },
  { to: '/news', label: 'News' },
  { to: '/about', label: 'About' },
]

function resolveFooterKey(pathname) {
  if (pathname === '/') return 'home'
  if (pathname === '/login') return 'login'
  if (pathname.startsWith('/universities/')) return 'uni-detail'
  if (pathname === '/universities') return 'uni-atlas'
  if (pathname.startsWith('/collections/')) return 'prd-signal'
  if (pathname === '/collections') return 'col-lab'
  if (pathname === '/news') return 'news-wire'
  if (pathname === '/about') return 'about-charter'
  return 'home'
}

/** Per-route footer surface + typography (scoped theme classes set CSS variables). */
const THEMES = {
  home: {
    root: 'border-slate-200/90 bg-slate-50/95 text-slate-900 shadow-[0_-1px_0_0_rgba(139,92,246,0.06)] backdrop-blur-sm dark:border-slate-800/90 dark:bg-slate-950/95 dark:text-slate-100 dark:shadow-[0_-1px_0_0_rgba(139,92,246,0.08)]',
    gradient: 'from-transparent via-violet-400/50 to-transparent dark:via-violet-500/35',
    h2: 'text-slate-500 dark:text-slate-500',
    navBase: 'text-sm text-slate-600 transition hover:text-violet-600 dark:text-slate-400 dark:hover:text-violet-400',
    navActive: 'font-semibold text-violet-600 dark:text-violet-400',
    brand: 'text-sm font-semibold text-slate-900 transition hover:text-violet-600 dark:text-slate-100 dark:hover:text-violet-400',
    icon: 'text-violet-500',
    blurb: 'text-sm leading-relaxed text-slate-600 dark:text-slate-400',
    mono: 'font-mono text-[10px] uppercase tracking-[0.18em] text-slate-500 dark:text-slate-500',
    contact: 'text-sm font-medium text-violet-600 transition hover:underline dark:text-violet-400',
    hint: 'text-xs leading-relaxed text-slate-500 dark:text-slate-500',
    bottom: 'border-slate-200/80 dark:border-slate-800/80',
    muted: 'text-slate-500 dark:text-slate-500',
    termsHover: 'hover:text-violet-600 dark:hover:text-violet-400',
  },
  'uni-atlas': {
    root: 'uni-atlas uni-atlas-bg border-[var(--uni-line)] text-[var(--uni-ink)] shadow-[0_-12px_40px_-24px_rgba(15,23,42,0.12)] backdrop-blur-md dark:shadow-[0_-14px_44px_-20px_rgba(0,0,0,0.45)]',
    gradient: 'from-transparent via-[var(--uni-teal)]/45 to-transparent dark:via-[var(--uni-teal-bright)]/35',
    h2: 'text-[var(--uni-muted)]',
    navBase: 'text-sm text-[var(--uni-muted)] transition hover:text-[var(--uni-teal)]',
    navActive: 'font-semibold text-[var(--uni-teal-bright)]',
    brand: 'text-sm font-semibold text-[var(--uni-ink)] transition hover:text-[var(--uni-teal)]',
    icon: 'text-[var(--uni-teal)]',
    blurb: 'text-sm leading-relaxed text-[var(--uni-muted)]',
    mono: 'font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--uni-muted)] opacity-90',
    contact: 'text-sm font-medium text-[var(--uni-teal)] transition hover:underline',
    hint: 'text-xs leading-relaxed text-[var(--uni-muted)]',
    bottom: 'border-[var(--uni-line)]',
    muted: 'text-[var(--uni-muted)]',
    termsHover: 'hover:text-[var(--uni-teal)]',
  },
  'uni-detail': {
    root: 'uni-detail border-slate-200 bg-slate-100/95 text-slate-900 shadow-[0_-8px_32px_-16px_rgba(15,23,42,0.1)] backdrop-blur-md dark:border-white/10 dark:bg-[#050508]/95 dark:text-zinc-100 dark:shadow-[0_-12px_40px_-18px_rgba(0,0,0,0.5)]',
    gradient: 'from-transparent via-violet-500/40 to-transparent dark:via-violet-400/30',
    h2: 'text-slate-500 dark:text-zinc-500',
    navBase: 'text-sm text-slate-600 transition hover:text-violet-600 dark:text-zinc-400 dark:hover:text-violet-400',
    navActive: 'font-semibold text-violet-600 dark:text-violet-400',
    brand: 'text-sm font-semibold text-slate-900 transition hover:text-violet-600 dark:text-zinc-100 dark:hover:text-violet-400',
    icon: 'text-violet-500 dark:text-violet-400',
    blurb: 'text-sm leading-relaxed text-slate-600 dark:text-zinc-400',
    mono: 'font-mono text-[10px] uppercase tracking-[0.18em] text-slate-500 dark:text-zinc-500',
    contact: 'text-sm font-medium text-violet-600 transition hover:underline dark:text-violet-400',
    hint: 'text-xs leading-relaxed text-slate-500 dark:text-zinc-500',
    bottom: 'border-slate-200 dark:border-white/10',
    muted: 'text-slate-500 dark:text-zinc-500',
    termsHover: 'hover:text-violet-600 dark:hover:text-violet-400',
  },
  'col-lab': {
    root: 'col-lab col-lab-mesh border-[var(--col-line)] text-[var(--col-ink)] shadow-[0_-16px_48px_-28px_var(--col-shadow)] backdrop-blur-md',
    gradient: 'from-transparent via-[var(--col-accent)]/40 to-transparent dark:via-[var(--col-accent)]/35',
    h2: 'text-[var(--col-muted)]',
    navBase: 'text-sm text-[var(--col-muted)] transition hover:text-[var(--col-accent)]',
    navActive: 'font-semibold text-[var(--col-accent)]',
    brand: 'col-lab-display text-sm font-semibold text-[var(--col-ink)] transition hover:text-[var(--col-accent)]',
    icon: 'text-[var(--col-accent)]',
    blurb: 'text-sm leading-relaxed text-[var(--col-muted)]',
    mono: 'font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--col-muted)]',
    contact: 'text-sm font-medium text-[var(--col-secondary)] transition hover:underline dark:text-[var(--col-accent)]',
    hint: 'text-xs leading-relaxed text-[var(--col-muted)]',
    bottom: 'border-[var(--col-line)]',
    muted: 'text-[var(--col-muted)]',
    termsHover: 'hover:text-[var(--col-accent)]',
  },
  'prd-signal': {
    root: 'prd-signal prd-signal-mesh border-[var(--prd-line)] text-[var(--prd-ink)] shadow-[0_-14px_44px_-22px_rgba(8,11,16,0.14)] backdrop-blur-md dark:shadow-[0_-16px_48px_-20px_rgba(0,0,0,0.5)]',
    gradient: 'from-transparent via-[var(--prd-lime)]/50 to-transparent dark:via-[var(--prd-lime)]/35',
    h2: 'text-[var(--prd-muted)]',
    navBase: 'text-sm text-[var(--prd-muted)] transition hover:text-[var(--prd-lime)]',
    navActive: 'font-semibold text-[var(--prd-lime)]',
    brand: 'text-sm font-semibold text-[var(--prd-ink)] transition hover:text-[var(--prd-lime)]',
    icon: 'text-[var(--prd-lime)]',
    blurb: 'text-sm leading-relaxed text-[var(--prd-muted)]',
    mono: 'font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--prd-muted)]',
    contact: 'text-sm font-medium text-[var(--prd-magenta)] transition hover:underline dark:text-[var(--prd-lime)]',
    hint: 'text-xs leading-relaxed text-[var(--prd-muted)]',
    bottom: 'border-[var(--prd-line)]',
    muted: 'text-[var(--prd-muted)]',
    termsHover: 'hover:text-[var(--prd-lime)]',
  },
  'news-wire': {
    root: 'news-wire news-wire-paper border-[var(--nw-line)] text-[var(--nw-ink)] shadow-[0_-10px_36px_-18px_rgba(22,19,17,0.12)] backdrop-blur-sm dark:shadow-[0_-12px_40px_-16px_rgba(0,0,0,0.45)]',
    gradient: 'from-transparent via-[var(--nw-signal)]/45 to-transparent dark:via-[var(--nw-signal)]/40',
    h2: 'text-[var(--nw-muted)]',
    navBase: 'text-sm text-[var(--nw-muted)] transition hover:text-[var(--nw-signal)]',
    navActive: 'font-semibold text-[var(--nw-signal)]',
    brand: 'news-wire-display text-sm font-semibold text-[var(--nw-ink)] transition hover:text-[var(--nw-signal)]',
    icon: 'text-[var(--nw-signal)]',
    blurb: 'text-sm leading-relaxed text-[var(--nw-muted)]',
    mono: 'font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--nw-muted)]',
    contact: 'text-sm font-medium text-[var(--nw-signal)] transition hover:underline',
    hint: 'text-xs leading-relaxed text-[var(--nw-muted)]',
    bottom: 'border-[var(--nw-line)]',
    muted: 'text-[var(--nw-muted)]',
    termsHover: 'hover:text-[var(--nw-signal)]',
  },
  'about-charter': {
    root: 'about-charter about-charter-canvas border-[var(--ab-line)] text-[var(--ab-ink)] shadow-[0_-12px_40px_-20px_var(--ab-shadow)] backdrop-blur-md',
    gradient: 'from-transparent via-[var(--ab-accent)]/40 to-transparent dark:via-[var(--ab-accent)]/35',
    h2: 'about-charter-label text-[var(--ab-muted)] !tracking-[0.22em]',
    navBase: 'about-charter-ui text-sm text-[var(--ab-muted)] transition hover:text-[var(--ab-accent)]',
    navActive: 'font-semibold text-[var(--ab-accent)]',
    brand: 'about-charter-display text-sm font-semibold text-[var(--ab-ink)] transition hover:text-[var(--ab-accent)]',
    icon: 'text-[var(--ab-accent)]',
    blurb: 'about-charter-ui text-sm leading-relaxed text-[var(--ab-muted)]',
    mono: 'about-charter-label font-mono text-[10px] uppercase text-[var(--ab-muted)] !tracking-[0.18em]',
    contact: 'about-charter-ui text-sm font-medium text-[var(--ab-accent)] transition hover:underline',
    hint: 'about-charter-ui text-xs leading-relaxed text-[var(--ab-muted)]',
    bottom: 'border-[var(--ab-line)]',
    muted: 'text-[var(--ab-muted)]',
    termsHover: 'hover:text-[var(--ab-accent)]',
  },
  login: {
    root: 'border-white/10 bg-slate-950/92 text-slate-100 shadow-[0_-12px_40px_-12px_rgba(0,0,0,0.55)] backdrop-blur-xl',
    gradient: 'from-transparent via-amber-200/35 to-transparent',
    h2: 'text-slate-400',
    navBase: 'text-sm text-slate-400 transition hover:text-amber-200',
    navActive: 'font-semibold text-amber-100',
    brand: 'text-sm font-semibold text-white transition hover:text-amber-200',
    icon: 'text-amber-300',
    blurb: 'text-sm leading-relaxed text-slate-400',
    mono: 'font-mono text-[10px] uppercase tracking-[0.18em] text-slate-500',
    contact: 'text-sm font-medium text-amber-200 transition hover:underline',
    hint: 'text-xs leading-relaxed text-slate-500',
    bottom: 'border-white/10',
    muted: 'text-slate-500',
    termsHover: 'hover:text-amber-200',
  },
}

export default function SiteFooter() {
  const reduceMotion = useReducedMotion()
  const { pathname } = useLocation()
  const key = useMemo(() => resolveFooterKey(pathname), [pathname])
  const t = THEMES[key] ?? THEMES.home

  const navClass = ({ isActive }) => `${t.navBase} ${isActive ? t.navActive : ''}`

  return (
    <motion.footer
      id="site-footer"
      role="contentinfo"
      initial={reduceMotion ? false : { opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className={`relative z-10 border-t pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-12 ${t.root}`}
    >
      <div
        aria-hidden
        className={`pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r ${t.gradient}`}
      />

      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 md:px-10">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-12 lg:gap-8 lg:gap-y-10">
          <div className="max-w-sm lg:col-span-5">
            <Link to="/" className={`inline-flex items-center gap-2 ${t.brand}`}>
              <WandSparkles className={`h-4 w-4 shrink-0 ${t.icon}`} aria-hidden />
              Union Students Studio
            </Link>
            <p className={`mt-3 ${t.blurb}`}>
              Demo surfaces for motion, maps, and catalogs — swap in your brand and content.
            </p>
            <p className={`mt-4 ${t.mono}`}>React · Vite · Tailwind · Framer Motion</p>
          </div>

          <nav aria-labelledby="footer-explore-heading" className="min-w-0 lg:col-span-3">
            <h2 id="footer-explore-heading" className={`text-xs font-semibold uppercase tracking-[0.22em] ${t.h2}`}>
              Explore
            </h2>
            <ul className="mt-4 flex flex-col gap-2.5">
              {exploreLinks.map(({ to, label, end }) => (
                <li key={to}>
                  <NavLink to={to} end={end} className={navClass}>
                    {label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-labelledby="footer-account-heading" className="min-w-0 lg:col-span-2">
            <h2 id="footer-account-heading" className={`text-xs font-semibold uppercase tracking-[0.22em] ${t.h2}`}>
              Account
            </h2>
            <ul className="mt-4 flex flex-col gap-2.5">
              <li>
                <NavLink to="/login" className={navClass}>
                  Sign in
                </NavLink>
              </li>
            </ul>
          </nav>

          <div className="min-w-0 lg:col-span-2">
            <h2 className={`text-xs font-semibold uppercase tracking-[0.22em] ${t.h2}`}>Contact</h2>
            <a href="mailto:hello@union.studio" className={`mt-4 inline-block ${t.contact}`}>
              hello@union.studio
            </a>
            <p className={`mt-4 ${t.hint}`}>For partnerships or feedback on this demo build.</p>
          </div>
        </div>

        <div className={`mt-12 flex flex-col gap-6 border-t pt-8 lg:flex-row lg:items-start lg:justify-between lg:gap-8 ${t.bottom}`}>
          <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-6 sm:gap-y-1">
            <p className={`text-xs ${t.muted}`}>© {new Date().getFullYear()} Union Students Studio. All rights reserved.</p>
            <p className={`text-xs ${t.muted}`}>
              <Link to="/about" className={`underline-offset-2 transition hover:underline ${t.termsHover}`}>
                Terms & privacy (demo)
              </Link>
            </p>
          </div>
          <p className={`max-w-xl text-xs leading-relaxed ${t.muted}`}>
            Cinematic preview — not affiliated with any real institution or store. Placeholder copy and imagery only.
          </p>
        </div>
      </div>
    </motion.footer>
  )
}
