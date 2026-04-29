import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useSpring,
  useTransform,
  useMotionValue,
} from 'framer-motion'
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Orbit,
  Package,
  Radio,
  Share2,
  ShieldCheck,
  Sparkles,
} from 'lucide-react'
import { Link, Navigate, useLocation, useNavigate, useParams } from 'react-router-dom'
import { getStoreProductById, getStoreProducts } from './api/catalogApi.js'
import { useCart } from './CartContext.jsx'
import SiteFooter from './components/SiteFooter.jsx'
import SiteHeader from './components/SiteHeader.jsx'
import {
  COLLECTION_CATEGORIES,
  computeVariantPrice,
  defaultOptionSelections,
  getProductGalleryImages,
  resolveActiveBundle,
} from './data/collectionsData.js'
import { readAuthToken } from './authSession.js'
import { useI18n } from './i18n.jsx'
import { applyDarkClass, persistTheme, readStoredThemeIsDark } from './theme.js'

const EMPTY_OPTIONS = []

const MotionLink = motion.create(Link)

function formatCampusLabel(universitySlug) {
  if (!universitySlug || typeof universitySlug !== 'string') return ''
  return universitySlug
    .split('-')
    .map((w) => (w ? w.charAt(0).toUpperCase() + w.slice(1) : ''))
    .join(' ')
}

const ACCORDIONS = [
  {
    id: 'tel',
    title: 'Telemetry',
    body: 'Demo payload: dimensions, weight class, and handling flags would live here. Wire to your PIM or CMS.',
  },
  {
    id: 'line',
    title: 'Lineage',
    body: 'Batch codes, supplier notes, and restock windows — placeholder until you connect inventory.',
  },
  {
    id: 'pol',
    title: 'Policies',
    body: 'Returns and warranty copy is stubbed. Swap for your legal-approved blocks.',
  },
]

export default function CollectionProductPage() {
  const { language, tl } = useI18n()
  const { addItem } = useCart()
  const navigate = useNavigate()
  const location = useLocation()
  const { id } = useParams()
  const reduceMotion = useReducedMotion()
  const [isDark, setIsDark] = useState(readStoredThemeIsDark)
  const [openAccordion, setOpenAccordion] = useState('tel')
  const [priceLabel, setPriceLabel] = useState(0)
  const [activeImageIndex, setActiveImageIndex] = useState(0)
  const [selections, setSelections] = useState(() => ({}))
  const [product, setProduct] = useState(null)
  const [loadStatus, setLoadStatus] = useState(() => (id ? 'loading' : 'notfound'))
  const [related, setRelated] = useState(() => [])
  const [shareCopied, setShareCopied] = useState(false)
  const [addingToCart, setAddingToCart] = useState(false)
  const [justAddedToCart, setJustAddedToCart] = useState(false)

  const heroImgRef = useRef(null)
  const priceRef = useRef(null)
  const mx = useMotionValue(0)
  const my = useMotionValue(0)

  const springPrice = useSpring(0, { stiffness: 100, damping: 24 })

  const categoryLabel = useMemo(
    () => COLLECTION_CATEGORIES.find((c) => c.id === product?.category)?.label ?? product?.category,
    [product],
  )

  useEffect(() => {
    if (!id) {
      setProduct(null)
      setLoadStatus('notfound')
      return
    }
    let cancelled = false
    setLoadStatus('loading')
    getStoreProductById(id)
      .then((p) => {
        if (cancelled) return
        setProduct(p)
        setLoadStatus('ok')
      })
      .catch(() => {
        if (cancelled) return
        setProduct(null)
        setLoadStatus('notfound')
      })
    return () => {
      cancelled = true
    }
  }, [id])

  useEffect(() => {
    if (!product?.id) {
      setRelated([])
      return
    }
    let cancelled = false
    getStoreProducts({
      university: product.universitySlug,
      excludeId: product.id,
      limit: 8,
      sort: 'featured',
    })
      .then((list) => {
        if (cancelled) return
        setRelated(Array.isArray(list) ? list : [])
      })
      .catch(() => {
        if (cancelled) return
        setRelated([])
      })
    return () => {
      cancelled = true
    }
  }, [product?.id, product?.universitySlug])
  const hasBundles = useMemo(
    () => Array.isArray(product?.variants) && product.variants.length > 0,
    [product],
  )
  const optionGroups = useMemo(() => {
    if (product?.optionGroups == null) return EMPTY_OPTIONS
    return Array.isArray(product.optionGroups) ? product.optionGroups : EMPTY_OPTIONS
  }, [product])
  const activeBundle = useMemo(
    () => (hasBundles ? resolveActiveBundle(product, selections) : null),
    [hasBundles, product, selections],
  )
  const gallery = useMemo(() => {
    if (!product) return []
    if (activeBundle?.images?.length) return [...activeBundle.images]
    return getProductGalleryImages(product)
  }, [product, activeBundle])
  const resolvedPrice = useMemo(() => {
    if (!product) return 0
    if (activeBundle) return Number(activeBundle.price) || 0
    if (optionGroups.length) {
      return computeVariantPrice(
        { price: product.price, optionGroups },
        selections,
      )
    }
    return Number(product.price) || 0
  }, [product, activeBundle, optionGroups, selections])
  const showOptionDeltas = !hasBundles
  const canAddToCart = Boolean(hasBundles && activeBundle?.id && product?.id)

  const handleAddToCart = async () => {
    if (!canAddToCart || !product?.id || !activeBundle?.id) return
    if (!readAuthToken()) {
      const returnTo = `${location.pathname}${location.search || ''}`
      navigate(`/login?returnTo=${encodeURIComponent(returnTo)}`, { replace: false })
      return
    }
    setAddingToCart(true)
    try {
      await addItem({
        productId: product.id,
        variantId: activeBundle.id,
        quantity: 1,
      })
      setJustAddedToCart(true)
      window.setTimeout(() => setJustAddedToCart(false), 2200)
    } catch {
      /* errors surface via CartContext in other views; optional: toast */
    } finally {
      setAddingToCart(false)
    }
  }

  useEffect(() => {
    if (!product?.name) return
    const prev = document.title
    document.title = `${product.name} · Union`
    return () => {
      document.title = prev
    }
  }, [product?.id, product?.name])

  useEffect(() => {
    queueMicrotask(() => {
      if (!optionGroups.length) {
        setSelections({})
        return
      }
      if (product?.variants?.[0]?.selection) {
        setSelections({ ...product.variants[0].selection })
        return
      }
      setSelections(defaultOptionSelections(optionGroups))
    })
  }, [product?.id, optionGroups])

  const bundleKey = activeBundle?.id ?? ''
  useEffect(() => {
    if (!product) return
    setActiveImageIndex(0)
  }, [product?.id, bundleKey])

  useEffect(() => {
    if (!product) return
    const max = Math.max(0, gallery.length - 1)
    setActiveImageIndex((i) => Math.min(i, max))
  }, [product?.id, gallery.length])

  const pickOption = (group, value) => {
    setSelections((p) => ({ ...p, [group.id]: value.id }))
    if (showOptionDeltas && group.id === 'color' && typeof value.imageIndex === 'number' && gallery.length > 0) {
      const next = Math.min(Math.max(0, value.imageIndex), gallery.length - 1)
      setActiveImageIndex(next)
    }
  }

  const rotateX = useTransform(my, [-0.5, 0.5], reduceMotion ? [0, 0] : [7, -7])
  const rotateY = useTransform(mx, [-0.5, 0.5], reduceMotion ? [0, 0] : [-11, 11])
  const imgX = useTransform(mx, [-0.5, 0.5], reduceMotion ? [0, 0] : [12, -12])
  const imgY = useTransform(my, [-0.5, 0.5], reduceMotion ? [0, 0] : [10, -10])

  useLayoutEffect(() => {
    applyDarkClass(isDark)
    persistTheme(isDark)
  }, [isDark])

  /** Keep hero price in sync with variant math on every selection change (not gated on scroll). */
  useEffect(() => {
    if (!product) return
    if (reduceMotion && typeof springPrice.jump === 'function') {
      springPrice.jump(resolvedPrice)
    } else {
      springPrice.set(resolvedPrice)
    }
  }, [product, resolvedPrice, reduceMotion, springPrice])

  useMotionValueEvent(springPrice, 'change', (v) => {
    setPriceLabel(Math.round(v))
  })

  const galleryLen = gallery.length
  const activeSrc = product ? gallery[activeImageIndex] ?? gallery[0] : ''
  const goPrevImage = () => {
    if (!product || galleryLen <= 1) return
    setActiveImageIndex((i) => (i <= 0 ? galleryLen - 1 : i - 1))
  }
  const goNextImage = () => {
    if (!product || galleryLen <= 1) return
    setActiveImageIndex((i) => (i >= galleryLen - 1 ? 0 : i + 1))
  }

  const onHeroPointer = (e) => {
    if (reduceMotion) return
    const el = heroImgRef.current
    if (!el) return
    const r = el.getBoundingClientRect()
    mx.set((e.clientX - r.left) / r.width - 0.5)
    my.set((e.clientY - r.top) / r.height - 0.5)
  }

  const onHeroLeave = () => {
    mx.set(0)
    my.set(0)
  }

  const copyShareLink = () => {
    const url = typeof window !== 'undefined' ? window.location.href : ''
    if (!url) return
    navigator.clipboard.writeText(url).then(
      () => {
        setShareCopied(true)
        setTimeout(() => setShareCopied(false), 2200)
      },
      () => {},
    )
  }

  const collectionsIndexHref = product?.universitySlug
    ? `/collections?university=${encodeURIComponent(product.universitySlug)}`
    : '/collections'

  if (loadStatus === 'loading') {
    return (
      <div className="prd-signal prd-signal-mesh relative min-h-dvh text-[var(--prd-ink)]">
        <SiteHeader isDark={isDark} setIsDark={setIsDark} />
        <main className="relative z-10 mx-auto max-w-[1180px] px-4 pb-24 pt-8 sm:px-6 sm:pt-10">
          <div className="mb-8 h-10 max-w-xs animate-pulse rounded-full bg-[var(--prd-line)]/40" aria-hidden />
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-6">
            <div className="lg:col-span-7">
              <div className="aspect-[4/5] w-full animate-pulse rounded-[1.25rem] bg-[var(--prd-line)]/35 sm:aspect-[5/6]" />
              <div className="mt-3 flex gap-2">
                <div className="h-16 w-14 shrink-0 animate-pulse rounded-lg bg-[var(--prd-line)]/30" />
                <div className="h-16 w-14 shrink-0 animate-pulse rounded-lg bg-[var(--prd-line)]/30" />
                <div className="h-16 w-14 shrink-0 animate-pulse rounded-lg bg-[var(--prd-line)]/30" />
              </div>
            </div>
            <div className="flex flex-col gap-4 lg:col-span-5">
              <div className="h-4 w-24 animate-pulse rounded bg-[var(--prd-line)]/40" />
              <div className="h-8 w-3/4 max-w-sm animate-pulse rounded-lg bg-[var(--prd-line)]/35" />
              <div className="h-20 w-full animate-pulse rounded-xl bg-[var(--prd-line)]/25" />
              <div className="h-12 w-full animate-pulse rounded-xl bg-[var(--prd-line)]/30" />
            </div>
          </div>
          <p className="mt-8 text-center text-sm text-[var(--prd-muted)]">
            {language === 'uz' ? 'Yuklanmoqda…' : language === 'ru' ? 'Загрузка…' : 'Loading product…'}
          </p>
        </main>
        <SiteFooter />
      </div>
    )
  }

  if (!product) {
    return <Navigate to="/collections" replace />
  }

  return (
    <div className="prd-signal prd-signal-mesh relative min-h-dvh text-[var(--prd-ink)]">
      <div aria-hidden className="pointer-events-none fixed inset-0 prd-signal-grid" />

      <div
        aria-hidden
        className="prd-signal-watermark pointer-events-none fixed left-1/2 top-1/2 z-0 -translate-x-1/2 -translate-y-1/2 select-none whitespace-nowrap font-mono text-[clamp(4rem,18vw,14rem)] font-black uppercase leading-none"
      >
        {product.id}
      </div>

      <div aria-hidden className="pointer-events-none fixed right-[-18%] top-[12%] z-0 opacity-40 motion-reduce:opacity-25">
        <div className="motion-safe:animate-prd-orbit motion-reduce:animate-none">
          <Orbit className="h-[min(55vw,420px)] w-[min(55vw,420px)] text-[var(--prd-lime)]" strokeWidth={0.35} />
        </div>
      </div>

      <div
        aria-hidden
        className="pointer-events-none fixed left-[6%] top-[22%] z-0 h-3 w-3 rounded-full bg-[var(--prd-magenta)] motion-safe:animate-prd-pulse"
      />

      <SiteHeader isDark={isDark} setIsDark={setIsDark} />

      <main className="relative z-10">
        <div className="mx-auto max-w-[1180px] px-4 pb-24 pt-5 sm:px-6 sm:pt-7 md:pb-28 md:pt-9">
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-8 flex flex-wrap items-center justify-between gap-4 sm:mb-10"
          >
            <Link
              to={collectionsIndexHref}
              className="group inline-flex items-center gap-3 rounded-full border border-[var(--prd-line)] bg-[var(--prd-surface)] px-4 py-2.5 text-sm font-semibold text-[var(--prd-ink)] shadow-sm backdrop-blur-md transition hover:border-[var(--prd-lime)]/50 hover:shadow-[0_0_24px_-4px_var(--prd-glow)]"
            >
              <motion.span
                className="flex items-center gap-2 text-[var(--prd-muted)] group-hover:text-[var(--prd-ink)]"
                whileHover={reduceMotion ? {} : { x: -2 }}
              >
                <ArrowLeft className="h-4 w-4 shrink-0 transition-transform group-hover:-translate-x-1" aria-hidden />
                {language === 'uz' ? 'Indeks' : language === 'ru' ? 'Индекс' : 'Index'}
              </motion.span>
              <span className="hidden h-4 w-px bg-[var(--prd-line)] sm:block" aria-hidden />
              <span className="hidden max-w-[200px] truncate text-[var(--prd-muted)] sm:inline">{product.name}</span>
            </Link>

            <div className="flex items-center gap-2 rounded-full border border-[var(--prd-line)] bg-[var(--prd-surface-2)] px-3 py-1.5 font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--prd-muted)] backdrop-blur-sm">
              <Radio className="h-3.5 w-3.5 text-[var(--prd-lime)] motion-safe:animate-pulse" aria-hidden />
              {language === 'uz' ? "jonli ko'rinish" : language === 'ru' ? 'live preview' : 'live preview'}
            </div>
          </motion.div>

          <div className="relative grid gap-10 lg:grid-cols-12 lg:gap-6 lg:gap-y-0">
            <div className="relative lg:col-span-7 lg:row-span-2">
              <motion.div
                ref={heroImgRef}
                onPointerMove={onHeroPointer}
                onPointerLeave={onHeroLeave}
                className="relative lg:-ml-2 lg:mr-4 [perspective:1200px]"
                tabIndex={0}
                role="region"
                aria-roledescription="carousel"
                aria-label={language === 'uz' ? 'Mahsulot rasmlari' : language === 'ru' ? 'Фото продукта' : 'Product photos'}
                onKeyDown={(e) => {
                  if (galleryLen <= 1) return
                  if (e.key === 'ArrowLeft') {
                    e.preventDefault()
                    goPrevImage()
                  }
                  if (e.key === 'ArrowRight') {
                    e.preventDefault()
                    goNextImage()
                  }
                }}
              >
                <motion.div
                  className="relative overflow-hidden rounded-[1.25rem] border-2 border-[var(--prd-line)] bg-[var(--prd-void)] shadow-[0_24px_80px_-28px_rgba(0,0,0,0.35)] lg:rounded-br-[3rem] lg:rounded-tl-[2rem] lg:rounded-tr-[0.5rem] dark:shadow-[0_28px_90px_-30px_rgba(0,0,0,0.65)]"
                  style={{
                    rotateX,
                    rotateY,
                    transformStyle: 'preserve-3d',
                  }}
                >
                  {galleryLen > 1 ? (
                    <>
                      <button
                        type="button"
                        onClick={goPrevImage}
                        aria-label={language === 'uz' ? 'Oldingi rasm' : language === 'ru' ? 'Предыдущее изображение' : 'Previous image'}
                        className="absolute left-2 top-1/2 z-30 flex size-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/45 text-white shadow-lg backdrop-blur-md transition hover:bg-black/60 sm:left-3 sm:size-11"
                      >
                        <ChevronLeft className="h-5 w-5" aria-hidden />
                      </button>
                      <button
                        type="button"
                        onClick={goNextImage}
                        aria-label={language === 'uz' ? 'Keyingi rasm' : language === 'ru' ? 'Следующее изображение' : 'Next image'}
                        className="absolute right-2 top-1/2 z-30 flex size-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/45 text-white shadow-lg backdrop-blur-md transition hover:bg-black/60 sm:right-3 sm:size-11"
                      >
                        <ChevronRight className="h-5 w-5" aria-hidden />
                      </button>
                    </>
                  ) : null}

                  <motion.div
                    className="relative aspect-[4/5] w-full overflow-hidden sm:aspect-[5/6]"
                    style={{ x: imgX, y: imgY }}
                  >
                    <AnimatePresence mode="wait" initial={false}>
                      <motion.div
                        key={activeSrc}
                        initial={reduceMotion ? false : { opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={reduceMotion ? undefined : { opacity: 0 }}
                        transition={{ duration: reduceMotion ? 0 : 0.28 }}
                        className="absolute inset-0"
                      >
                        <img
                          src={activeSrc}
                          alt={product.name}
                          className="h-[108%] w-[108%] max-w-none -translate-x-[4%] -translate-y-[4%] object-cover opacity-95 saturate-[1.05]"
                          loading={activeImageIndex === 0 ? 'eager' : 'lazy'}
                          decoding="async"
                        />
                      </motion.div>
                    </AnimatePresence>
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-[var(--prd-void)]/50 via-transparent to-[var(--prd-magenta)]/15" />
                  </motion.div>

                  <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[var(--prd-void)] via-[var(--prd-void)]/40 to-transparent" />

                  <div className="absolute bottom-4 left-4 right-4 flex flex-wrap items-end justify-between gap-3 sm:bottom-6 sm:left-6 sm:right-6">
                    <span className="inline-flex items-center gap-2 rounded-lg border border-white/15 bg-black/50 px-3 py-2 text-[11px] font-bold uppercase tracking-[0.15em] text-white backdrop-blur-md">
                      <Sparkles className="h-3.5 w-3.5 text-[var(--prd-lime)]" aria-hidden />
                    {tl(product.tag)}
                    </span>
                    <motion.div
                      ref={priceRef}
                      className="rounded-xl border border-white/20 bg-white/10 px-4 py-2 backdrop-blur-md"
                      initial={reduceMotion ? false : { scale: 0.92, opacity: 0 }}
                      whileInView={{ scale: 1, opacity: 1 }}
                      viewport={{ once: true, amount: 0.4 }}
                    >
                      <p className="text-[9px] font-bold uppercase tracking-[0.25em] text-white/70">Signal</p>
                      <p className="font-mono text-3xl font-black tabular-nums text-[var(--prd-lime)] sm:text-4xl">
                        ${priceLabel}
                      </p>
                    </motion.div>
                  </div>
                </motion.div>

                <div
                  aria-hidden
                  className="pointer-events-none absolute -right-3 -top-3 hidden h-16 w-16 border-r-2 border-t-2 border-[var(--prd-lime)]/70 lg:block"
                />

                {galleryLen > 1 ? (
                  <div className="mt-3 flex gap-2 overflow-x-auto pb-1 pt-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                    {gallery.map((src, idx) => (
                      <button
                        key={`${idx}-${src}`}
                        type="button"
                        onClick={() => setActiveImageIndex(idx)}
                        aria-label={`Show image ${idx + 1} of ${galleryLen}`}
                        aria-current={idx === activeImageIndex ? 'true' : undefined}
                        className={`relative h-16 w-14 shrink-0 overflow-hidden rounded-lg border-2 transition sm:h-[4.5rem] sm:w-16 ${
                          idx === activeImageIndex
                            ? 'border-[var(--prd-lime)] ring-2 ring-[var(--prd-lime)]/35'
                            : 'border-[var(--prd-line)] opacity-80 hover:border-[var(--prd-magenta)]/50 hover:opacity-100'
                        }`}
                      >
                        <img
                          src={src}
                          alt={`${product.name} — ${idx + 1}`}
                          className="h-full w-full object-cover"
                          loading="lazy"
                        />
                      </button>
                    ))}
                  </div>
                ) : null}
              </motion.div>
            </div>

            <div className="flex flex-col gap-6 lg:col-span-5 lg:row-span-2 lg:pl-2">
              <motion.div
                initial={reduceMotion ? false : { opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: reduceMotion ? 0 : 0.08, duration: 0.5 }}
                className="relative rounded-2xl border border-[var(--prd-line)] bg-[var(--prd-surface)] p-6 shadow-[8px_8px_0_0_var(--prd-lime-dim)] backdrop-blur-xl dark:shadow-[8px_8px_0_0_rgba(217,249,157,0.08)] sm:p-7"
              >
                <p className="font-mono text-[10px] font-bold uppercase tracking-[0.28em] text-[var(--prd-muted)]">
                  {product.id}
                </p>
                <p className="mt-2 inline-flex items-center gap-2 rounded-md bg-[var(--prd-lime-dim)] px-2.5 py-1 text-xs font-bold uppercase tracking-wider text-[var(--prd-ink)]">
                  {categoryLabel}
                </p>
                {product.universitySlug ? (
                  <Link
                    to={`/collections?university=${encodeURIComponent(product.universitySlug)}`}
                    className="mt-2 inline-flex items-center gap-1.5 text-xs font-medium text-[var(--prd-muted)] transition hover:text-[var(--prd-lime)]"
                  >
                    <MapPin className="h-3.5 w-3.5 shrink-0 opacity-80" aria-hidden />
                    <span>
                      {language === 'uz'
                        ? 'Kampus: '
                        : language === 'ru'
                          ? 'Кампус: '
                          : 'Campus: '}
                      {formatCampusLabel(product.universitySlug)}
                    </span>
                  </Link>
                ) : null}
                <h1 className="mt-4 text-[clamp(1.65rem,4.5vw,2.35rem)] font-extrabold leading-[1.08] tracking-tight">
                  {product.name}
                </h1>
                <p className="mt-4 text-pretty text-sm leading-relaxed text-[var(--prd-muted)] sm:text-[0.9375rem]">
                  {galleryLen > 1
                    ? language === 'uz'
                      ? `${galleryLen} rasm - galereya fokusda bo'lsa strelkalar yoki thumbnaildan foydalaning. `
                      : language === 'ru'
                        ? `${galleryLen} фото - используйте стрелки или миниатюры при фокусе галереи. `
                        : `${galleryLen} photos - use arrows, thumbnails, or ← → when the gallery is focused. `
                    : ''}
                  {language === 'uz'
                    ? "Parallax uchun rasm ustida harakat qiling. Variant tanlang - narx jonli yangilanadi. Demo mantiq."
                    : language === 'ru'
                      ? 'Двигайте курсор по изображению для параллакса. Выбирайте варианты - цена обновляется в реальном времени. Демо-логика.'
                      : 'Drag over the hero to steer parallax. Pick variants below - price updates live. Stubs only - swap for real commerce logic.'}
                </p>

                {optionGroups.length > 0 ? (
                  <div className="mt-6 space-y-5 border-t border-[var(--prd-line)] pt-6">
                    <p className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.25em] text-[var(--prd-muted)]">
                      <span className="h-px w-6 bg-[var(--prd-magenta)]/60" aria-hidden />
                      Options
                    </p>
                    {optionGroups.map((group) => (
                      <div key={group.id}>
                        <p id={`pdp-opt-${group.id}`} className="text-xs font-bold text-[var(--prd-ink)]">
                          {tl(group.label)}
                        </p>
                        <div
                          role="radiogroup"
                          aria-labelledby={`pdp-opt-${group.id}`}
                          className="mt-2.5 flex flex-wrap gap-2"
                        >
                          {group.values.map((v) => {
                            const selected = selections[group.id] === v.id
                            const delta =
                              showOptionDeltas && v.priceDelta
                                ? ` · +$${v.priceDelta}`
                                : ''
                            if (group.type === 'swatch') {
                              return (
                                <button
                                  key={v.id}
                                  type="button"
                                  role="radio"
                                  aria-checked={selected}
                                  aria-label={`${v.label}${delta}`}
                                  title={`${v.label}${delta}`}
                                  onClick={() => pickOption(group, v)}
                                  className={`flex items-center gap-2 rounded-full border-2 px-2 py-1.5 text-left text-[11px] font-bold uppercase tracking-wider transition ${
                                    selected
                                      ? 'border-[var(--prd-lime)] bg-[var(--prd-lime-dim)] text-[var(--prd-ink)] ring-2 ring-[var(--prd-lime)]/30'
                                      : 'border-[var(--prd-line)] bg-[var(--prd-surface-2)] text-[var(--prd-muted)] hover:border-[var(--prd-magenta)]/45 hover:text-[var(--prd-ink)]'
                                  }`}
                                >
                                  <span
                                    aria-hidden
                                    className="h-6 w-6 shrink-0 rounded-full border border-[var(--prd-line)] shadow-inner"
                                    style={{ backgroundColor: v.swatch ?? '#64748b' }}
                                  />
                                  <span className="pr-1">{v.label}</span>
                                </button>
                              )
                            }
                            return (
                              <button
                                key={v.id}
                                type="button"
                                role="radio"
                                aria-checked={selected}
                                aria-label={`${v.label}${delta}`}
                                onClick={() => pickOption(group, v)}
                                className={`rounded-xl border-2 px-3.5 py-2 text-xs font-bold transition ${
                                  selected
                                    ? 'border-[var(--prd-lime)] bg-[var(--prd-lime-dim)] text-[var(--prd-ink)] shadow-[0_0_0_1px_var(--prd-lime)]'
                                    : 'border-[var(--prd-line)] bg-[var(--prd-surface-2)] text-[var(--prd-muted)] hover:border-[var(--prd-magenta)]/45 hover:text-[var(--prd-ink)]'
                                }`}
                              >
                                {v.label}
                                {showOptionDeltas && v.priceDelta ? (
                                  <span className="ml-1 font-mono text-[10px] font-semibold opacity-80">
                                    +${v.priceDelta}
                                  </span>
                                ) : null}
                              </button>
                            )
                          })}
                        </div>
                      </div>
                    ))}
                    <p className="font-mono text-[10px] leading-relaxed text-[var(--prd-muted)]">
                      Selection:{' '}
                      {optionGroups
                        .map((g) => {
                          const v = g.values.find((x) => x.id === selections[g.id])
                          return v?.label
                        })
                        .filter(Boolean)
                        .join(' · ') || '—'}
                    </p>
                  </div>
                ) : null}

                <div className="mt-5 flex flex-wrap gap-2">
                  {['demo', 'motion', `score ${product.featuredScore}`].map((chip) => (
                    <button
                      key={chip}
                      type="button"
                      className="rounded-full border border-[var(--prd-line)] bg-[var(--prd-surface-2)] px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-[var(--prd-muted)] transition hover:border-[var(--prd-magenta)]/40 hover:text-[var(--prd-ink)]"
                    >
                      {chip}
                    </button>
                  ))}
                </div>

                <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                  <motion.button
                    type="button"
                    onClick={handleAddToCart}
                    disabled={!canAddToCart || addingToCart}
                    className="relative inline-flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-[var(--prd-void)] px-6 py-3.5 text-sm font-extrabold uppercase tracking-[0.12em] text-[var(--prd-lime)] shadow-lg enabled:cursor-pointer enabled:hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
                    whileHover={reduceMotion || !canAddToCart ? {} : { scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {!reduceMotion ? (
                      <motion.span
                        aria-hidden
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/12 to-transparent"
                        initial={{ x: '-100%' }}
                        whileHover={{ x: '100%' }}
                        transition={{ duration: 0.55, ease: 'easeInOut' }}
                      />
                    ) : null}
                    <span className="relative z-10">
                      {addingToCart
                        ? language === 'uz'
                          ? 'Qo‘shilmoqda…'
                          : language === 'ru'
                            ? 'Добавление…'
                            : 'Adding…'
                        : justAddedToCart
                          ? language === 'uz'
                            ? 'Savatchada ✓'
                            : language === 'ru'
                              ? 'В корзине ✓'
                              : 'In cart ✓'
                          : language === 'uz'
                            ? 'Sotib olish'
                            : language === 'ru'
                              ? 'Купить'
                              : 'Add to cart'}
                    </span>
                    {justAddedToCart ? (
                      <Check className="relative z-10 h-4 w-4 text-[var(--prd-lime)]" aria-hidden />
                    ) : (
                      <ArrowRight className="relative z-10 h-4 w-4" aria-hidden />
                    )}
                  </motion.button>
                  <motion.button
                    type="button"
                    onClick={copyShareLink}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-[var(--prd-line)] bg-transparent px-5 py-3.5 text-sm font-bold text-[var(--prd-ink)] transition hover:border-[var(--prd-magenta)]/50 sm:w-auto"
                    whileHover={reduceMotion ? {} : { rotate: [-0.5, 0.5, 0] }}
                    transition={{ duration: 0.35 }}
                  >
                    {shareCopied ? (
                      <Check className="h-4 w-4 text-[var(--prd-lime)]" aria-hidden />
                    ) : (
                      <Share2 className="h-4 w-4" aria-hidden />
                    )}
                    {shareCopied
                      ? language === 'uz'
                        ? 'Nusxa olindi'
                        : language === 'ru'
                          ? 'Ссылка скопирована'
                          : 'Link copied'
                      : language === 'uz'
                        ? 'Havolani ulashish'
                        : language === 'ru'
                          ? 'Поделиться ссылкой'
                          : 'Copy link'}
                  </motion.button>
                </div>
              </motion.div>

              <div className="space-y-2">
                <p className="flex items-center gap-2 pl-1 text-[10px] font-bold uppercase tracking-[0.25em] text-[var(--prd-muted)]">
                  <span className="h-px w-6 bg-[var(--prd-lime)]/60" aria-hidden />
                  Foldouts
                </p>
                {ACCORDIONS.map((item) => {
                  const open = openAccordion === item.id
                  return (
                    <div key={item.id} className="overflow-hidden rounded-xl border border-[var(--prd-line)] bg-[var(--prd-surface)]/90 backdrop-blur-md">
                      <button
                        type="button"
                        onClick={() => setOpenAccordion((v) => (v === item.id ? '' : item.id))}
                        className="flex w-full items-center justify-between gap-3 px-4 py-3.5 text-left text-sm font-bold text-[var(--prd-ink)] transition hover:bg-[var(--prd-surface-2)]"
                        aria-expanded={open}
                      >
                        {item.title}
                        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ type: 'spring', stiffness: 300, damping: 22 }}>
                          <ChevronDown className="h-4 w-4 shrink-0 text-[var(--prd-muted)]" aria-hidden />
                        </motion.span>
                      </button>
                      <AnimatePresence initial={false}>
                        {open ? (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                            className="border-t border-[var(--prd-line)]"
                          >
                            <p className="px-4 py-3 text-sm leading-relaxed text-[var(--prd-muted)]">{item.body}</p>
                          </motion.div>
                        ) : null}
                      </AnimatePresence>
                    </div>
                  )
                })}
              </div>

              <ul className="grid gap-3 sm:grid-cols-2">
                <li className="flex gap-3 rounded-xl border border-[var(--prd-line)] bg-[var(--prd-surface-2)] p-4 backdrop-blur-sm">
                  <Package className="mt-0.5 h-5 w-5 shrink-0 text-[var(--prd-lime)]" aria-hidden />
                  <span className="text-xs leading-relaxed text-[var(--prd-muted)]">
                    {language === 'uz' ? "Yetkazib berish API yo'q - demo jo'natish." : language === 'ru' ? 'Нет API доставки - только демо-отправка.' : 'No carrier APIs - demo dispatch only.'}
                  </span>
                </li>
                <li className="flex gap-3 rounded-xl border border-[var(--prd-line)] bg-[var(--prd-surface-2)] p-4 backdrop-blur-sm">
                  <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-[var(--prd-magenta)]" aria-hidden />
                  <span className="text-xs leading-relaxed text-[var(--prd-muted)]">
                    {language === 'uz' ? "Policy matni hozircha demo to'ldiruvchi." : language === 'ru' ? 'Текст политики пока заполнитель.' : 'Policy text is filler until legal signs off.'}
                  </span>
                </li>
              </ul>
            </div>
          </div>

          {related.length ? (
            <section className="relative mt-20 border-t border-[var(--prd-line)] pt-14 sm:mt-24 sm:pt-16">
              <div className="mb-8 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <h2 className="text-xl font-extrabold tracking-tight sm:text-2xl">
                    {language === 'uz' ? "Shu kampusdan boshqa" : language === 'ru' ? 'Ещё с этого кампуса' : 'More from this campus'}
                  </h2>
                  <p className="mt-1 max-w-md text-sm text-[var(--prd-muted)]">
                    {language === 'uz'
                      ? "Ushbu universitetdigi boshqa buyumlar. Kartani bosing yoki uylanishni kuzating."
                      : language === 'ru'
                        ? 'Другие позиции для этого вуза. Клик по карточке или наведение для наклона.'
                        : 'Other pieces stocked for this university. Click through or hover for tilt.'}
                  </p>
                </div>
                <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--prd-lime)]">
                  {related.length} {language === 'uz' ? 'kanal' : language === 'ru' ? 'каналов' : 'channels'}
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4 pt-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {related.map((p, i) => (
                  <motion.div
                    key={p.id}
                    initial={reduceMotion ? false : { opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-20px' }}
                    transition={{ delay: reduceMotion ? 0 : 0.05 * i, duration: 0.4 }}
                    className="min-w-0"
                    style={{ perspective: 900 }}
                  >
                    <MotionLink
                      to={`/collections/${p.id}`}
                      className="group block overflow-hidden rounded-xl border-2 border-[var(--prd-line)] bg-[var(--prd-surface)] shadow-md outline-none ring-[var(--prd-lime)]/50 ring-offset-2 ring-offset-[var(--prd-bg)] focus-visible:ring-2"
                      whileHover={reduceMotion ? {} : { rotateY: -5, rotateX: 3, y: -6 }}
                      transition={{ type: 'spring', stiffness: 260, damping: 20 }}
                      style={{ transformStyle: 'preserve-3d' }}
                    >
                      <div className="aspect-[4/5] overflow-hidden bg-[var(--prd-void)]">
                        <motion.img
                          src={p.image}
                          alt={p.name}
                          className="h-full w-full object-cover"
                          loading="lazy"
                          whileHover={reduceMotion ? {} : { scale: 1.08 }}
                          transition={{ duration: 0.45 }}
                        />
                      </div>
                      <div className="border-t border-[var(--prd-line)] p-3">
                        <p className="truncate text-sm font-bold">{p.name}</p>
                        <p className="mt-1 font-mono text-xs font-bold text-[var(--prd-lime)]">${p.price}</p>
                      </div>
                    </MotionLink>
                  </motion.div>
                ))}
              </div>
            </section>
          ) : null}
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}
