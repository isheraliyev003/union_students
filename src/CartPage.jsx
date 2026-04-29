import { useEffect, useMemo, useRef, useState } from 'react'
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useSpring,
  useTransform,
} from 'framer-motion'
import { ArrowLeft, Loader2, Minus, Orbit, Plus, ShoppingBag, Sparkles, Trash2, Truck } from 'lucide-react'
import { Link } from 'react-router-dom'
import SiteFooter from './components/SiteFooter.jsx'
import SiteHeader from './components/SiteHeader.jsx'
import { useCart } from './CartContext.jsx'
import { useI18n } from './i18n.jsx'
import { applyDarkClass, persistTheme, readStoredThemeIsDark } from './theme.js'

function formatMoney(n) {
  if (typeof n !== 'number' || Number.isNaN(n)) return '—'
  return new Intl.NumberFormat(undefined, { style: 'currency', currency: 'USD' }).format(n)
}

function LineCard({ line, onMinus, onPlus, onRemove, reduceMotion }) {
  const r = useRef(null)
  const mx = useMotionValue(0.5)
  const my = useMotionValue(0.5)
  const rotX = useSpring(useTransform(my, [0, 1], [6, -6]), { stiffness: 120, damping: 18 })
  const rotY = useSpring(useTransform(mx, [0, 1], [-7, 7]), { stiffness: 120, damping: 18 })
  const [glow, setGlow] = useState('')

  const onMove = (e) => {
    if (reduceMotion) return
    const el = r.current
    if (!el) return
    const b = el.getBoundingClientRect()
    const x = (e.clientX - b.left) / b.width
    const y = (e.clientY - b.top) / b.height
    mx.set(x)
    my.set(y)
    setGlow(
      `radial-gradient(420px at ${(x * 100).toFixed(1)}% ${(y * 100).toFixed(1)}%, rgba(168, 85, 247, 0.2), transparent 55%)`,
    )
  }
  const onLeave = () => {
    mx.set(0.5)
    my.set(0.5)
    setGlow('')
  }

  return (
    <motion.article
      layout
      ref={r}
      initial={reduceMotion ? false : { opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={reduceMotion ? undefined : { opacity: 0, x: -24 }}
      transition={{ type: 'spring', stiffness: 320, damping: 28 }}
      style={{ rotateX: reduceMotion ? 0 : rotX, rotateY: reduceMotion ? 0 : rotY, transformStyle: 'preserve-3d' }}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      className="group relative overflow-hidden rounded-2xl border border-white/10 bg-slate-900/50 p-3 shadow-[0_20px_50px_-24px_rgba(0,0,0,0.85)] backdrop-blur-xl sm:p-4"
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-0 transition group-hover:opacity-100"
        style={{ background: reduceMotion || !glow ? undefined : glow }}
      />
      <div className="relative flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="flex shrink-0 items-center gap-3">
          <motion.div
            className="relative h-20 w-20 overflow-hidden rounded-xl border border-white/10 sm:h-24 sm:w-24"
            whileHover={reduceMotion ? {} : { scale: 1.04 }}
            transition={{ type: 'spring', stiffness: 400, damping: 22 }}
          >
            <img src={line.image} alt="" className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 to-transparent" />
          </motion.div>
          <div className="min-w-0 sm:hidden">
            <h3 className="truncate font-bold text-slate-100">{line.name}</h3>
            <p className="mt-0.5 line-clamp-2 text-xs text-slate-400">{line.selectionSummary || '·'}</p>
          </div>
        </div>
        <div className="min-w-0 flex-1 sm:pl-1">
          <h3 className="hidden font-bold text-slate-100 sm:block">{line.name}</h3>
          <p className="mt-0.5 hidden text-sm text-slate-400 sm:block">{line.selectionSummary || '·'}</p>
          <p className="mt-2 font-mono text-xs text-violet-300/90">
            {formatMoney(line.unitPrice)}
            <span className="text-slate-500"> × </span>
            {line.quantity}
          </p>
        </div>
        <div className="flex flex-row items-center justify-between gap-2 sm:flex-col sm:items-end">
          <div className="flex items-center gap-1 rounded-full border border-white/10 bg-slate-950/60 p-0.5">
            <button
              type="button"
              onClick={() => onMinus(line)}
              className="flex size-8 items-center justify-center rounded-full text-slate-300 transition hover:bg-white/10 hover:text-white"
              aria-label="Decrease"
            >
              <Minus className="h-3.5 w-3.5" />
            </button>
            <span className="min-w-8 text-center font-mono text-sm font-bold text-white">{line.quantity}</span>
            <button
              type="button"
              onClick={() => onPlus(line)}
              className="flex size-8 items-center justify-center rounded-full text-slate-300 transition hover:bg-white/10 hover:text-white"
              aria-label="Increase"
            >
              <Plus className="h-3.5 w-3.5" />
            </button>
          </div>
          <div className="flex items-center gap-2">
            <p className="font-mono text-sm font-bold text-lime-300">{formatMoney(line.lineTotal)}</p>
            <button
              type="button"
              onClick={() => onRemove(line)}
              className="rounded-lg p-2 text-slate-500 transition hover:bg-red-500/15 hover:text-red-400"
              aria-label="Remove"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </motion.article>
  )
}

export default function CartPage() {
  const { language, t } = useI18n()
  const { cart, loading, error, setLineQuantity, removeLine, clearError, refresh } = useCart()
  const [isDark, setIsDark] = useState(readStoredThemeIsDark)
  const reduceMotion = useReducedMotion()
  const subtotalSpring = useSpring(0, { stiffness: 95, damping: 26 })
  /** Mirrors the spring; null until the first `change` so we can show API subtotal for one frame. */
  const [animatedSubtotal, setAnimatedSubtotal] = useState(null)
  const lastSubtotalRef = useRef(null)

  useEffect(() => {
    applyDarkClass(isDark)
    persistTheme(isDark)
  }, [isDark])

  const lines = useMemo(() => (Array.isArray(cart?.lines) ? cart.lines : []), [cart])
  const subtotal = typeof cart?.subtotal === 'number' && !Number.isNaN(cart.subtotal) ? cart.subtotal : 0
  const subtotalToShow = animatedSubtotal !== null ? animatedSubtotal : subtotal

  useMotionValueEvent(subtotalSpring, 'change', (v) => {
    setAnimatedSubtotal(v)
  })

  useEffect(() => {
    if (loading) return
    if (reduceMotion) {
      subtotalSpring.jump(subtotal)
      setAnimatedSubtotal(subtotal)
      lastSubtotalRef.current = subtotal
      return
    }
    if (lastSubtotalRef.current === null) {
      subtotalSpring.jump(subtotal)
      lastSubtotalRef.current = subtotal
      return
    }
    if (subtotal !== lastSubtotalRef.current) {
      subtotalSpring.set(subtotal)
      lastSubtotalRef.current = subtotal
    }
  }, [loading, subtotal, subtotalSpring, reduceMotion])

  const copy = useMemo(
    () =>
      language === 'uz'
        ? {
            title: 'Sizning yukingiz',
            empty: "Hozircha bo'sh. Kolleksiyalardan narsa qo'shing — ular shu yerga tushadi.",
            browse: "Kolleksiyalarga o'tish",
            sub: 'Jami',
            cta: 'To‘lov (demo)',
            ship: 'Yetkazib berish — keyingi bosqich',
          }
        : language === 'ru'
          ? {
              title: 'Ваш груз',
              empty: 'Пока пусто. Добавьте товары из коллекций — они появятся здесь.',
              browse: 'В коллекции',
              sub: 'Итого',
              cta: 'Оплата (демо)',
              ship: 'Доставка — на следующем шаге',
            }
          : {
              title: 'Your cargo',
              empty: 'Nothing here yet. Add pieces from collections — they dock here.',
              browse: 'Browse collections',
              sub: 'Subtotal',
              cta: 'Checkout (demo)',
              ship: 'Shipping — next step',
            },
    [language],
  )

  const onMinus = async (line) => {
    await setLineQuantity(line.id, line.quantity - 1)
  }
  const onPlus = async (line) => {
    if (line.quantity >= 99) return
    await setLineQuantity(line.id, line.quantity + 1)
  }
  const onRemove = async (line) => {
    await removeLine(line.id)
  }

  return (
    <div
      className="cart-dock relative min-h-dvh overflow-x-hidden text-slate-100"
      style={{
        background:
          'radial-gradient(ellipse 120% 80% at 50% -20%, rgba(88, 28, 135, 0.45), transparent 50%), radial-gradient(ellipse 80% 50% at 100% 100%, rgba(6, 182, 212, 0.12), transparent 45%), #030712',
      }}
    >
      <div
        className="pointer-events-none fixed inset-0 z-0 opacity-[0.4]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h1v1H0V0zm39 0h1v1h-1V0zM0 39h1v1H0v-1zm39 0h1v1h-1v-1z' fill='%23ffffff' fill-opacity='0.04' fill-rule='evenodd'/%3E%3C/svg%3E")`,
        }}
      />

      <SiteHeader isDark={isDark} setIsDark={setIsDark} />

      <main className="relative z-10 mx-auto max-w-3xl px-4 pb-24 pt-6 sm:px-6 sm:pt-8 md:pt-10">
        <Link
          to="/collections"
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-violet-200/80 transition hover:text-lime-300"
        >
          <ArrowLeft className="h-4 w-4" />
          {copy.browse}
        </Link>

        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <motion.div
              initial={reduceMotion ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 rounded-full border border-lime-400/25 bg-lime-400/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-lime-200/90"
            >
              <Truck className="h-3 w-3" />
              {copy.ship}
            </motion.div>
            <h1 className="mt-3 flex items-center gap-2 text-3xl font-black tracking-tight sm:text-4xl">
              <Orbit className="h-7 w-7 text-cyan-400" aria-hidden />
              {copy.title}
            </h1>
            {cart?.userId ? (
              <p className="mt-2 text-xs text-slate-400">
                {language === 'uz'
                  ? 'Savatcha hisobingizga bog‘langan.'
                  : language === 'ru'
                    ? 'Корзина привязана к вашему аккаунту.'
                    : 'Cart is linked to your signed-in account.'}
              </p>
            ) : null}
          </div>
          {loading ? <Loader2 className="h-5 w-5 shrink-0 animate-spin text-violet-400" /> : null}
        </div>

        {error ? (
          <div className="mb-4 rounded-xl border border-red-500/40 bg-red-950/30 px-4 py-3 text-sm text-red-200">
            {error}
            <button type="button" onClick={clearError} className="ml-3 underline">
              {language === 'uz' ? 'Yopish' : language === 'ru' ? 'OK' : 'Dismiss'}
            </button>
            <button type="button" onClick={() => refresh()} className="ml-3 underline">
              Retry
            </button>
          </div>
        ) : null}

        <AnimatePresence mode="popLayout">
          {lines.length === 0 && !loading ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="relative flex min-h-[42vh] flex-col items-center justify-center overflow-hidden rounded-3xl border border-dashed border-white/15 bg-slate-900/30 px-6 py-20 text-center"
            >
              <motion.div
                className="absolute inset-0"
                style={{
                  background: 'radial-gradient(circle at 50% 50%, rgba(124, 58, 237, 0.2), transparent 60%)',
                }}
                animate={reduceMotion ? {} : { scale: [1, 1.05, 1], opacity: [0.4, 0.7, 0.4] }}
                transition={{ duration: 5, repeat: Infinity }}
              />
              <div className="relative">
                <motion.div
                  className="mx-auto flex h-24 w-24 items-center justify-center rounded-full border-2 border-violet-500/50 bg-slate-950/80 shadow-[0_0_40px_rgba(139,92,246,0.35)]"
                  animate={reduceMotion ? {} : { rotate: 360 }}
                  transition={{ duration: 28, repeat: Infinity, ease: 'linear' }}
                >
                  <ShoppingBag className="h-10 w-10 text-violet-300" />
                </motion.div>
                <Sparkles className="absolute -right-2 -top-2 h-6 w-6 text-lime-400" />
              </div>
              <p className="relative z-[1] mt-8 max-w-sm text-balance text-slate-300">{copy.empty}</p>
              <Link
                to="/collections"
                className="relative z-[1] mt-6 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-600 px-5 py-2.5 text-sm font-bold text-white shadow-lg transition hover:brightness-110"
              >
                {copy.browse}
                <ArrowLeft className="h-4 w-4 rotate-180" />
              </Link>
            </motion.div>
          ) : (
            <motion.div layout className="space-y-3">
              {lines.map((line) => (
                <LineCard
                  key={line.id}
                  line={line}
                  onMinus={onMinus}
                  onPlus={onPlus}
                  onRemove={onRemove}
                  reduceMotion={reduceMotion}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {lines.length > 0 ? (
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 overflow-hidden rounded-2xl border border-lime-400/20 bg-slate-950/70 p-5 shadow-[0_0_0_1px_rgba(190,242,100,0.08)]"
          >
            <div className="flex items-baseline justify-between gap-4">
              <span className="text-sm font-bold uppercase tracking-widest text-slate-500">{copy.sub}</span>
              <motion.span
                className="font-mono text-2xl font-bold tabular-nums text-lime-300"
                key={String(cart?.subtotal)}
                initial={reduceMotion ? false : { scale: 1.04 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 400, damping: 28 }}
              >
                {formatMoney(subtotalToShow)}
              </motion.span>
            </div>
            <motion.div whileHover={reduceMotion ? {} : { scale: 1.01 }} whileTap={{ scale: 0.99 }}>
              <Link
                to="/checkout"
                className="relative mt-4 flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-lime-400 py-3.5 text-sm font-extrabold uppercase tracking-widest text-slate-950"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  {copy.cta}
                  <Sparkles className="h-4 w-4" aria-hidden />
                </span>
                <motion.span
                  className="absolute inset-0 z-0 bg-gradient-to-r from-white/30 via-white/0 to-white/20"
                  animate={reduceMotion ? {} : { x: ['-100%', '100%'] }}
                  transition={{ duration: 2.2, repeat: Infinity, ease: 'linear' }}
                  aria-hidden
                />
              </Link>
            </motion.div>
            <p className="mt-2 text-center text-[10px] text-slate-500">
              {t('cartDemo', 'No payment is processed — this is a visual demo.')}
            </p>
          </motion.div>
        ) : null}
      </main>

      <SiteFooter />
    </div>
  )
}
