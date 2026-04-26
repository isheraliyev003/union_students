import { useLayoutEffect, useMemo, useRef, useState } from 'react'
import { motion, useMotionTemplate, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { ChevronDown, ShoppingBag } from 'lucide-react'
import { Navigate, useParams } from 'react-router-dom'
import SiteFooter from './components/SiteFooter.jsx'
import SiteHeader from './components/SiteHeader.jsx'
import { getUniversityDetail, UNIVERSITY_HERO_VIDEOS } from './data/universityDetail.js'
import { applyDarkClass, persistTheme, readStoredThemeIsDark } from './theme.js'

const springCfg = { stiffness: 38, damping: 18, mass: 0.6 }

export default function UniversityDetailPage() {
  const { id } = useParams()
  const uni = useMemo(() => (id ? getUniversityDetail(id) : null), [id])
  const videos = useMemo(() => {
    if (!uni) return [...UNIVERSITY_HERO_VIDEOS]
    return [...new Set([uni.heroVideo, ...UNIVERSITY_HERO_VIDEOS])]
  }, [uni])
  const [isDark, setIsDark] = useState(readStoredThemeIsDark)
  const [videoIndex, setVideoIndex] = useState(0)
  const heroRef = useRef(null)

  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const mxS = useSpring(mx, springCfg)
  const myS = useSpring(my, springCfg)
  const tiltX = useTransform(myS, [-0.5, 0.5], [7, -7])
  const tiltY = useTransform(mxS, [-0.5, 0.5], [-10, 10])
  const glowX = useTransform(mxS, [-0.5, 0.5], [12, 88])
  const glowY = useTransform(myS, [-0.5, 0.5], [20, 80])
  const glow = useMotionTemplate`radial-gradient(420px circle at ${glowX}% ${glowY}%, rgba(124, 58, 237, 0.12), transparent 55%)`

  useLayoutEffect(() => {
    applyDarkClass(isDark)
    persistTheme(isDark)
  }, [isDark])

  const onHeroMove = (e) => {
    const el = heroRef.current
    if (!el) return
    const r = el.getBoundingClientRect()
    mx.set((e.clientX - r.left) / r.width - 0.5)
    my.set((e.clientY - r.top) / r.height - 0.5)
  }

  const onHeroLeave = () => {
    mx.set(0)
    my.set(0)
  }

  if (!uni) {
    return <Navigate to="/universities" replace />
  }

  return (
    <div className="uni-detail relative min-h-screen bg-slate-50 text-slate-900 dark:bg-[#050508] dark:text-zinc-100">
      <SiteHeader isDark={isDark} setIsDark={setIsDark} />

      <section
        ref={heroRef}
        onMouseMove={onHeroMove}
        onMouseLeave={onHeroLeave}
        className="relative -mt-[88px] isolate min-h-[100dvh] min-h-[100svh] overflow-hidden"
      >
        <video
          key={videos[videoIndex % videos.length]}
          className="absolute inset-0 h-full w-full scale-105 object-cover opacity-95 saturate-[1.05] dark:opacity-90 dark:saturate-100"
          autoPlay
          muted
          loop
          playsInline
          src={videos[videoIndex % videos.length]}
          onError={() => setVideoIndex((i) => i + 1)}
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-50 via-slate-50/75 to-slate-900/25 dark:from-[#050508] dark:via-[#050508]/65 dark:to-[#0a0d18]/55" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_90%_55%_at_50%_115%,rgba(124,58,237,0.12),transparent)] dark:bg-[radial-gradient(ellipse_90%_60%_at_50%_120%,rgba(88,28,135,0.35),transparent)]" />
        <motion.div
          className="pointer-events-none absolute inset-0 opacity-45 dark:opacity-80"
          style={{ background: glow }}
        />

        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.04] dark:opacity-[0.07]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          }}
        />

        <div className="pointer-events-none absolute left-[8%] top-[18%] hidden h-32 w-32 rounded-full border border-violet-400/25 md:block dark:border-amber-400/15" />
        <div className="pointer-events-none absolute bottom-[22%] right-[6%] hidden h-48 w-48 rotate-12 border border-fuchsia-400/20 md:block dark:border-fuchsia-500/10" />

        <div className="relative z-20 flex min-h-[inherit] flex-col justify-start gap-12 px-5 pb-14 pt-[6.5rem] sm:px-10 lg:flex-row lg:items-start lg:justify-center lg:gap-10 lg:pb-16 lg:pt-36">
          <motion.div
            initial={{ opacity: 0, y: 36 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-xl lg:max-w-2xl"
          >
            <p className="text-[10px] font-bold uppercase tracking-[0.45em] text-violet-700 dark:text-amber-200/90">
              {uni.regionLabel}
            </p>
            <h1 className="mt-3 max-w-[18ch] text-[clamp(2.25rem,6vw,4rem)] font-extrabold leading-[0.95] tracking-tight text-slate-950 drop-shadow-sm dark:text-white dark:drop-shadow-none">
              {uni.name}
            </h1>
            <p className="mt-5 max-w-prose text-sm leading-relaxed text-slate-700 sm:text-base dark:text-zinc-300">
              {uni.tagline}
            </p>
            <motion.a
              href="#about"
              className="mt-8 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.28em] text-violet-700 dark:text-amber-300/95"
              whileHover={{ x: 6 }}
            >
              Scroll for story + picks
              <ChevronDown className="h-4 w-4 animate-bounce" aria-hidden />
            </motion.a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40, rotate: -2 }}
            animate={{ opacity: 1, x: 0, rotate: -1.2 }}
            transition={{ type: 'spring', stiffness: 120, damping: 18, delay: 0.12 }}
            style={{ rotateX: tiltX, rotateY: tiltY, transformStyle: 'preserve-3d' }}
            className="relative w-full max-w-md perspective-[1200px] lg:max-w-sm"
          >
            <div className="rounded-2xl border border-slate-200/90 bg-white/90 p-6 shadow-xl shadow-slate-900/10 backdrop-blur-xl dark:border-white/20 dark:bg-black/45 dark:shadow-[0_0_0_1px_rgba(255,255,255,0.06),0_24px_80px_-20px_rgba(0,0,0,0.85)]">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.35em] text-violet-600 dark:text-fuchsia-300/90">
                    {uni.shopHeadline}
                  </p>
                  <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-zinc-300">{uni.shopIntro}</p>
                </div>
                <ShoppingBag className="h-8 w-8 shrink-0 text-violet-500 dark:text-amber-300/80" aria-hidden />
              </div>
              <ul className="mt-5 space-y-2.5 border-t border-slate-200 pt-5 text-sm text-slate-600 dark:border-white/10 dark:text-zinc-400">
                {uni.shopBullets.map((line) => (
                  <li key={line} className="flex gap-2">
                    <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-violet-500 dark:bg-amber-400/80" aria-hidden />
                    <span>{line}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-6 flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {uni.shopProductTeasers.map((p) => (
                  <motion.div
                    key={p.name}
                    whileHover={{ y: -4, scale: 1.03 }}
                    className="w-24 shrink-0 overflow-hidden rounded-lg border border-slate-200 bg-slate-50 dark:border-white/10 dark:bg-white/5"
                  >
                    <img src={p.img} alt="" className="aspect-square w-full object-cover" loading="lazy" />
                    <div className="px-1.5 py-1.5">
                      <p className="truncate text-[10px] font-semibold text-slate-800 dark:text-zinc-200">{p.name}</p>
                      <p className="text-[10px] text-violet-600 dark:text-amber-200/90">${p.price}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
              <motion.a
                href="#about"
                className="mt-6 block w-full rounded-xl bg-gradient-to-r from-violet-600 to-violet-500 py-3 text-center text-xs font-extrabold uppercase tracking-[0.2em] text-white shadow-lg shadow-violet-500/25 dark:from-amber-400 dark:via-amber-300 dark:to-yellow-200 dark:text-zinc-900 dark:shadow-amber-500/20"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Read the story
              </motion.a>
            </div>
          </motion.div>
        </div>

        <motion.div
          aria-hidden
          className="pointer-events-none absolute bottom-6 left-1/2 z-20 -translate-x-1/2 text-slate-500 dark:text-zinc-500"
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
        >
          <div className="h-10 w-px bg-gradient-to-b from-transparent via-slate-400 to-transparent dark:via-zinc-500" />
        </motion.div>
      </section>

      <section
        id="about"
        className="relative border-t border-slate-200 bg-slate-100 px-5 py-20 sm:px-10 md:py-28 dark:border-white/10 dark:bg-[#080a10]"
      >
        <div className="mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.6 }}
            className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between"
          >
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-violet-600 dark:text-fuchsia-400/90">
                Inside the campus
              </p>
              <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 md:text-4xl dark:text-white">
                Field notes
              </h2>
            </div>
            <p className="max-w-md text-sm text-slate-600 dark:text-zinc-400">
              Numbers are illustrative for this demo — wire your analytics and CRM when you connect a backend.
            </p>
          </motion.div>

          <motion.ul
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-40px' }}
            variants={{
              hidden: {},
              show: { transition: { staggerChildren: 0.08 } },
            }}
            className="mt-14 grid grid-cols-2 gap-4 sm:grid-cols-4 lg:gap-5"
          >
            {uni.stats.map((s) => (
              <motion.li
                key={s.label}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 26 } },
                }}
                className="rounded-2xl border border-slate-200 bg-white px-4 py-6 shadow-sm dark:border-white/10 dark:bg-zinc-900/90 dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]"
              >
                <p className="font-mono text-2xl font-semibold text-violet-700 sm:text-3xl dark:text-amber-200/95">
                  {s.value}
                </p>
                <p className="mt-2 text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-zinc-400">
                  {s.label}
                </p>
              </motion.li>
            ))}
          </motion.ul>

          <div className="mt-20 grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
            {uni.paragraphs.map((para, i) => (
              <motion.p
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ delay: i * 0.06, duration: 0.55 }}
                className={`text-base leading-relaxed text-slate-600 dark:text-zinc-400 ${i === 1 ? 'lg:border-l lg:border-slate-300 lg:pl-10 dark:lg:border-white/10' : ''}`}
              >
                {para}
              </motion.p>
            ))}
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  )
}
