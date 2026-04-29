import { useLayoutEffect, useMemo, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { Sparkles } from 'lucide-react'
import { BrowserRouter, Link, Navigate, Route, Routes } from 'react-router-dom'
import HomeMoreSections from './components/HomeMoreSections.jsx'
import ScrollToTop from './components/ScrollToTop.jsx'
import SiteFooter from './components/SiteFooter.jsx'
import SiteHeader from './components/SiteHeader.jsx'
import UzbekistanMapSection from './components/UzbekistanMapSection.jsx'
import CartPage from './CartPage.jsx'
import CheckoutPage from './CheckoutPage.jsx'
import CollectionProductPage from './CollectionProductPage.jsx'
import CollectionsPage from './CollectionsPage.jsx'
import LoginPage from './LoginPage.jsx'
import AboutPage from './AboutPage.jsx'
import NewsPage from './NewsPage.jsx'
import UniversitiesPage from './UniversitiesPage.jsx'
import UniversityDetailPage from './UniversityDetailPage.jsx'
import { useI18n } from './i18n.jsx'
import { applyDarkClass, persistTheme, readStoredThemeIsDark } from './theme.js'

const BANNER_VIDEO_SOURCES = [
  'https://media.istockphoto.com/id/1364131749/video/female-junior-high-teacher-supervising-students-taking-exam-at-desks.mp4?s=mp4-640x640-is&k=20&c=nJKmCkCm7uhZEg9wUacaMtfUQpyHoHNGQ-AhyiABzg8=',
  '/banner.mp4',
  'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
]

function MainSite() {
  const reduceMotion = useReducedMotion()
  const { language, t } = useI18n()
  const [isDark, setIsDark] = useState(readStoredThemeIsDark)
  const [bannerVideoIndex, setBannerVideoIndex] = useState(0)

  useLayoutEffect(() => {
    applyDarkClass(isDark)
    persistTheme(isDark)
  }, [isDark])

  const cards = useMemo(
    () =>
      language === 'uz'
        ? [
            {
              id: 'universities',
              title: 'Mood Lens UI',
              description: "Qatlamli chuqurlik, shaffof yuzalar va brendingizga mos harakatlar.",
            },
            {
              id: 'news',
              title: 'Silliq animatsiyalar',
              description: 'Framer Motion asosidagi mikro-interaksiyalar va suzuvchi qatlamlar.',
            },
            {
              id: 'about',
              title: 'Dark / Light xotirasi',
              description: 'Mavzu tanlovi saqlanadi va keyingi kirishda tiklanadi.',
            },
          ]
        : language === 'ru'
          ? [
              {
                id: 'universities',
                title: 'Mood Lens UI',
                description: 'Слоистая глубина, стеклянные поверхности и анимации в тоне вашего бренда.',
              },
              {
                id: 'news',
                title: 'Плавные анимации',
                description: 'Микро-взаимодействия и парящие слои на Framer Motion.',
              },
              {
                id: 'about',
                title: 'Память темы',
                description: 'Выбранная тема сохраняется и автоматически восстанавливается.',
              },
            ]
          : [
      {
        id: 'universities',
        title: 'Mood Lens UI',
        description: 'Layered depth, glass surfaces, and motion that match your brand tone.',
      },
      {
        id: 'news',
        title: 'Fluid Animations',
        description: 'Micro interactions and floating layers powered by Framer Motion.',
      },
      {
        id: 'about',
        title: 'Dark / Light Memory',
        description: 'Theme preference is stored and restored automatically on next visit.',
      },
    ],
    [language],
  )

  return (
    <>
      <SiteHeader isDark={isDark} setIsDark={setIsDark} />

      <main className="relative min-h-dvh w-full">
        <section
          id="home"
          className="relative isolate -mt-[5.75rem] min-h-dvh scroll-mt-0 overflow-x-hidden overflow-y-hidden bg-black shadow-[inset_0_-48px_64px_-20px_rgba(248,250,252,0.5),inset_0_-100px_90px_-40px_rgba(226,232,240,0.2)] dark:shadow-[inset_0_-48px_64px_-20px_rgba(2,6,23,0.5),inset_0_-100px_110px_-40px_rgba(0,0,0,0.35)] sm:-mt-[5.5rem] md:shadow-[inset_0_-60px_80px_-24px_rgba(248,250,252,0.55),inset_0_-120px_100px_-48px_rgba(226,232,240,0.22)] md:dark:shadow-[inset_0_-60px_80px_-24px_rgba(2,6,23,0.55),inset_0_-120px_120px_-48px_rgba(0,0,0,0.38)]"
        >
          <video
            key={BANNER_VIDEO_SOURCES[bannerVideoIndex]}
            className="absolute inset-0 z-[1] h-full min-h-dvh w-full object-cover object-center"
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            src={BANNER_VIDEO_SOURCES[bannerVideoIndex]}
            onError={() =>
              setBannerVideoIndex((i) => Math.min(i + 1, BANNER_VIDEO_SOURCES.length - 1))
            }
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 bottom-0 z-[2] h-20 bg-gradient-to-t from-slate-50 via-slate-50/25 to-transparent sm:h-24 md:h-28 dark:from-slate-950 dark:via-slate-950/35 dark:to-transparent"
          />
        </section>

        <UzbekistanMapSection isDark={isDark} />

        <section className="relative scroll-mt-24 overflow-x-hidden px-4 pb-[calc(4rem+env(safe-area-inset-bottom,0px))] pt-10 sm:px-6 sm:pb-[calc(5rem+env(safe-area-inset-bottom,0px))] sm:pt-12 md:flex md:min-h-[100dvh] md:items-center md:justify-center md:px-8 md:pb-[calc(6rem+env(safe-area-inset-bottom,0px))] md:pt-16 lg:px-10">
          <div className="mx-auto w-full max-w-6xl">
            <section className="grid w-full items-start gap-8 md:grid-cols-2 md:items-center md:gap-10 lg:gap-14">
              <div className="min-w-0">
                <motion.h1
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.6 }}
                  className="text-balance text-3xl font-bold leading-[1.12] tracking-tight sm:text-4xl md:text-5xl lg:text-6xl lg:leading-[1.08]"
                >
                  {t('homeHeroTitle', 'A unique React experience with motion, mood, and interaction.')}
                </motion.h1>
                <motion.p
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.12 }}
                  className="mt-5 max-w-xl text-pretty text-[0.95rem] leading-relaxed text-slate-600 dark:text-slate-300 sm:mt-6 sm:text-base md:text-lg"
                >
                  {t(
                    'homeHeroText',
                    'This Vite + React website uses Tailwind and motion for a polished, modern feel. Use it as your foundation for a memorable brand.',
                  )}
                </motion.p>
              </div>

              <motion.div
                animate={reduceMotion ? false : { rotate: [0, 1.8, 0, -1.8, 0] }}
                transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
                className="relative mx-auto w-full max-w-md rounded-2xl border border-violet-400/30 bg-gradient-to-br from-violet-500/20 to-cyan-400/20 p-5 shadow-2xl sm:max-w-none sm:rounded-3xl sm:p-7 md:mx-0 md:p-8"
              >
                <div className="absolute -top-3 right-4 rounded-full bg-white px-2.5 py-0.5 text-[10px] font-semibold shadow-sm sm:-top-4 sm:right-6 sm:px-3 sm:py-1 sm:text-xs dark:bg-slate-900">
                  {t('homeLiveUi', 'LIVE UI')}
                </div>
                <div className="space-y-4 sm:space-y-5">
                  <div className="h-2 w-2/3 rounded-full bg-slate-700/20 dark:bg-white/30" />
                  <div className="h-2 w-1/2 rounded-full bg-slate-700/20 dark:bg-white/30" />
                  <motion.div
                    className="h-24 rounded-xl bg-gradient-to-r from-violet-500/70 to-cyan-400/70 sm:h-28 sm:rounded-2xl"
                    animate={reduceMotion ? false : { scale: [1, 1.02, 1], opacity: [0.85, 1, 0.85] }}
                    transition={{ duration: 3, repeat: Infinity }}
                  />
                </div>
              </motion.div>
            </section>

            <section className="mt-10 grid w-full grid-cols-1 gap-4 sm:mt-12 sm:grid-cols-2 sm:gap-5 md:mt-14 md:gap-6 lg:grid-cols-3">
              {cards.map((card) => {
                const body = (
                  <>
                    <Sparkles className="mb-3 h-5 w-5 text-violet-500 sm:mb-4" />
                    <h2 className="text-lg font-semibold sm:text-xl">{card.title}</h2>
                    <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                      {card.description}
                    </p>
                  </>
                )
                const shellClass =
                  'scroll-mt-28 rounded-2xl border border-slate-200 bg-white/80 p-5 dark:border-slate-700 dark:bg-slate-900/80 sm:p-6'

                if (card.id === 'news') {
                  return (
                    <Link
                      key={card.title}
                      to="/news"
                      className={`block transition hover:border-violet-400/60 hover:shadow-md dark:hover:border-violet-500/40 ${shellClass}`}
                    >
                      <article id={card.id}>{body}</article>
                    </Link>
                  )
                }

                if (card.id === 'about') {
                  return (
                    <Link
                      key={card.title}
                      to="/about"
                      className={`block transition hover:border-violet-400/60 hover:shadow-md dark:hover:border-violet-500/40 ${shellClass}`}
                    >
                      <article id={card.id}>{body}</article>
                    </Link>
                  )
                }

                return (
                  <article key={card.title} id={card.id} className={shellClass}>
                    {body}
                  </article>
                )
              })}
            </section>
          </div>
        </section>

        <HomeMoreSections />
      </main>

      <SiteFooter />
    </>
  )
}

export default function App() {
  useLayoutEffect(() => {
    applyDarkClass(readStoredThemeIsDark())
  }, [])

  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<MainSite />} />
        <Route path="/universities" element={<UniversitiesPage />} />
        <Route path="/universities/:id" element={<UniversityDetailPage />} />
        <Route path="/collections" element={<CollectionsPage />} />
        <Route path="/collections/:id" element={<CollectionProductPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/news" element={<NewsPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
