import { useEffect, useId, useLayoutEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import {
  ArrowLeft,
  Check,
  CreditCard,
  Hash,
  Package,
  Shield,
  Sparkles,
  Truck,
} from 'lucide-react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import SiteFooter from './components/SiteFooter.jsx'
import SiteHeader from './components/SiteHeader.jsx'
import { useCart } from './CartContext.jsx'
import { readAuthToken, readAuthUser } from './authSession.js'
import { createPaymeCheckout, completeTestPayment, getOrder } from './api/ordersApi.js'
import { isApiError } from './api/core.js'
import { useI18n } from './i18n.jsx'
import { applyDarkClass, persistTheme, readStoredThemeIsDark } from './theme.js'

function formatMoney(n) {
  if (typeof n !== 'number' || Number.isNaN(n)) return '—'
  return new Intl.NumberFormat(undefined, { style: 'currency', currency: 'USD' }).format(n)
}

function useTicketRef() {
  return useMemo(() => {
    try {
      const k = 'union-checkout-ticket'
      let t = sessionStorage.getItem(k)
      if (!t) {
        t = `${Math.floor(100000 + Math.random() * 900000)}`
        sessionStorage.setItem(k, t)
      }
      return t
    } catch {
      return String(Math.floor(100000 + Math.random() * 900000))
    }
  }, [])
}

const inputClass =
  'w-full rounded-xl border border-slate-300/90 bg-white/90 px-3.5 py-2.5 text-sm text-slate-900 outline-none ring-violet-500/0 transition placeholder:text-slate-400 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/25 dark:border-slate-600 dark:bg-slate-900/60 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-violet-400 dark:focus:ring-violet-400/20'

const labelClass = 'mb-1.5 block text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400'

function BackgroundMesh() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute -left-1/4 top-0 h-[60vh] w-[80vw] rounded-full bg-violet-500/10 blur-[100px] dark:bg-violet-500/20" />
      <div className="absolute -right-1/4 bottom-0 h-[50vh] w-[70vw] rounded-full bg-cyan-500/10 blur-[90px] dark:bg-cyan-500/15" />
      <div
        className="absolute inset-0 opacity-[0.4] dark:opacity-[0.2]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2394a3b8' fill-opacity='0.12'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />
    </div>
  )
}

export default function CheckoutPage() {
  const { language } = useI18n()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const returnOrderId = searchParams.get('order')
  const { cart, loading, refresh } = useCart()
  const [isDark, setIsDark] = useState(readStoredThemeIsDark)
  const reduceMotion = useReducedMotion()
  const formId = useId()
  const ticketNo = useTicketRef()
  const [submitted, setSubmitted] = useState(false)
  const [payRedirecting, setPayRedirecting] = useState(false)
  const [checkoutError, setCheckoutError] = useState('')
  const [paymeNote, setPaymeNote] = useState('')
  /** Pending server-created order when API runs in test/mock payment mode */
  const [testAwaitPayment, setTestAwaitPayment] = useState(
    /** @type {{ orderId: string } | null} */ (null),
  )
  const [pollingOrder, setPollingOrder] = useState(
    /** @type {'idle' | 'polling' | 'paid' | 'failed' | 'timeout' | 'error'} */ ('idle'),
  )
  const user = readAuthUser()

  const [fullName, setFullName] = useState(() => user?.fullName ?? '')
  const [email, setEmail] = useState(() => user?.email ?? '')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')

  const lines = useMemo(() => (Array.isArray(cart?.lines) ? cart.lines : []), [cart])
  const subtotal = typeof cart?.subtotal === 'number' ? cart.subtotal : 0

  useLayoutEffect(() => {
    applyDarkClass(isDark)
    persistTheme(isDark)
  }, [isDark])

  useEffect(() => {
    refresh()
  }, [refresh])

  /** After Payme redirects back with ?order= */
  useEffect(() => {
    if (!returnOrderId || !readAuthToken()) {
      setPollingOrder('idle')
      return undefined
    }
    let cancelled = false
    let attempts = 0
    const maxAttempts = 24

    const poll = async () => {
      if (cancelled) return
      setPollingOrder('polling')
      attempts += 1
      try {
        const o = await getOrder(returnOrderId)
        if (cancelled) return
        if (o.status === 'paid') {
          setPollingOrder('paid')
          setSubmitted(true)
          await refresh()
          navigate('/checkout', { replace: true })
          return
        }
        if (o.status === 'cancelled' || o.status === 'failed') {
          setPollingOrder('failed')
          return
        }
        if (attempts >= maxAttempts) {
          setPollingOrder('timeout')
          return
        }
        window.setTimeout(poll, 2000)
      } catch {
        if (!cancelled) {
          setPollingOrder('error')
        }
      }
    }

    poll()
    return () => {
      cancelled = true
    }
  }, [returnOrderId, refresh, navigate])

  useEffect(() => {
    if (!loading && lines.length) {
      const prev = document.title
      document.title =
        language === 'uz' ? 'Buyurtma · Union' : language === 'ru' ? 'Оформление · Union' : 'Checkout · Union'
      return () => {
        document.title = prev
      }
    }
  }, [loading, lines.length, language])

  const copy = useMemo(() => {
    if (language === 'uz') {
      return {
        back: 'Savatcha',
        title: 'To‘lov va yetkazib berish',
        subtitle: "Ma’lumotlarni to‘ldiring, so‘ng Payme orqali to‘lang.",
        step1: 'Aloqa',
        step2: 'Tekshiruv',
        name: 'Ism',
        email: 'Email',
        phone: 'Telefon',
        address: 'Manzil',
        items: 'Buyurtma',
        pay: "Payme orqali to‘lash",
        done: "To‘lov qabul qilindi. Rahmat!",
        home: "Bosh sahifa",
        bag: "Savatcha",
        empty: "Savatcha bo'sh.",
        secure: "To‘lov Payme (Paycom) orqali amalga oshiriladi.",
        sub: 'Jami',
        review: "Tekshiruv",
        bound: "Hisobingizdagi savatcha",
        payNote: "To‘lov UZS bo‘yicha (so‘m) hisoblanadi; USD ko‘rinishi avtomatik konvertatsiya.",
        checking: "To‘lov tekshirilmoqda…",
        payWait: "Payme ilovasida to‘lovni yakunlang.",
        testPaymentHint:
          'Bu faqat ishlab chiqish uchun sinov. Haqiqiy Payme yoʻq — yakunda toʻlovni simulyatsiya qiladi.',
        testPaymentBtn: 'Sinov toʻlovini yakunlash',
      }
    }
    if (language === 'ru') {
      return {
        back: 'Корзина',
        title: 'Оплата и доставка',
        subtitle: 'Заполните поля, затем оплатите через Payme.',
        step1: 'Контакты',
        step2: 'Проверка',
        name: 'Имя',
        email: 'Почта',
        phone: 'Телефон',
        address: 'Адрес',
        items: 'Заказ',
        pay: 'Оплатить через Payme',
        done: 'Оплата получена. Спасибо!',
        home: 'Главная',
        bag: 'Корзина',
        empty: 'Корзина пуста.',
        secure: 'Оплата проходит через Payme (Paycom).',
        sub: 'Итого',
        review: 'Проверка',
        bound: 'Корзина аккаунта',
        payNote: 'Списание в UZS (сум); USD — ориентир по курсу из настроек.',
        checking: 'Проверяем оплату…',
        payWait: 'Завершите оплату в приложении Payme.',
        testPaymentHint:
          'Только для разработки: настоящего Payme нет — кнопка симулирует успешную оплату.',
        testPaymentBtn: 'Завершить тестовую оплату',
      }
    }
    return {
      back: 'Cart',
      title: 'Checkout',
      subtitle: 'Enter your details, then pay securely with Payme.',
      step1: 'Details',
      step2: 'Review',
      name: 'Full name',
      email: 'Email',
      phone: 'Phone',
      address: 'Shipping address',
      items: 'Your order',
      pay: 'Pay with Payme',
      done: 'Payment received. Thank you!',
      home: 'Home',
      bag: 'Cart',
      empty: 'Your cart is empty.',
      secure: 'Checkout is processed by Payme (Paycom).',
      sub: 'Subtotal',
      review: 'Review',
      bound: 'Cart linked to your account',
      payNote: 'Charge is in UZS (tiyin); USD is converted using the server rate.',
      checking: 'Confirming payment…',
      payWait: 'Complete payment in the Payme app.',
      testPaymentHint:
        'Development only: Payme is not used — this button simulates a successful payment.',
      testPaymentBtn: 'Complete test payment',
    }
  }, [language])

  const onSubmit = async (e) => {
    e.preventDefault()
    setCheckoutError('')
    setPaymeNote('')
    setTestAwaitPayment(null)
    if (!readAuthToken()) {
      setCheckoutError(
        language === 'uz'
          ? 'Kirish kerak.'
          : language === 'ru'
            ? 'Войдите в аккаунт.'
            : 'Sign in to continue.',
      )
      return
    }
    setPayRedirecting(true)
    try {
      const origin = typeof window !== 'undefined' ? window.location.origin : ''
      const data = await createPaymeCheckout({
        returnUrl: origin ? `${origin}/checkout` : undefined,
      })
      if (data?.checkoutUrl && typeof data.checkoutUrl === 'string') {
        const tiyin = typeof data.amountTiyin === 'number' ? data.amountTiyin : 0
        const uzs = (tiyin / 100).toLocaleString()
        setPaymeNote(`${copy.payNote} ≈ ${uzs} UZS.`)
        window.location.assign(data.checkoutUrl)
        return
      }
      if (data?.paymentMode === 'test' && data?.orderId) {
        const tiyin = typeof data.amountTiyin === 'number' ? data.amountTiyin : 0
        const uzs = (tiyin / 100).toLocaleString()
        setPaymeNote(`${copy.payNote} ≈ ${uzs} UZS.`)
        setTestAwaitPayment({ orderId: data.orderId })
        return
      }
      setCheckoutError(
        language === 'uz'
          ? 'To‘lov sozlanmagan (PAYME_MERCHANT_ID).'
          : language === 'ru'
            ? 'Оплата не настроена (PAYME_MERCHANT_ID).'
            : 'Payment is not configured (missing merchant id on server).',
      )
    } catch (err) {
      const msg = isApiError(err) ? err.message : 'Could not start checkout'
      setCheckoutError(msg)
    } finally {
      setPayRedirecting(false)
    }
  }

  const onCompleteTestPayment = async () => {
    if (!testAwaitPayment?.orderId) return
    setCheckoutError('')
    setPayRedirecting(true)
    try {
      await completeTestPayment(testAwaitPayment.orderId)
      setTestAwaitPayment(null)
      await refresh()
      setSubmitted(true)
    } catch (err) {
      const msg = isApiError(err) ? err.message : 'Could not complete test payment'
      setCheckoutError(msg)
    } finally {
      setPayRedirecting(false)
    }
  }

  return (
    <div className="relative min-h-dvh text-slate-900 dark:text-slate-100">
      <BackgroundMesh />
      <SiteHeader isDark={isDark} setIsDark={setIsDark} />

      {returnOrderId && pollingOrder === 'polling' ? (
        <div className="relative z-10 border-b border-violet-200/50 bg-violet-50/90 px-4 py-3 text-center text-sm text-violet-900 dark:border-violet-500/25 dark:bg-violet-950/50 dark:text-violet-100">
          {copy.checking} {copy.payWait}
        </div>
      ) : null}
      {pollingOrder === 'timeout' ? (
        <div className="relative z-10 border-b border-amber-200/50 bg-amber-50/90 px-4 py-3 text-center text-sm text-amber-900 dark:border-amber-500/25 dark:bg-amber-950/40 dark:text-amber-100">
          {language === 'uz'
            ? 'To‘lov hali tasdiqlanmadi. Keyinroq sahifani yangilang.'
            : language === 'ru'
              ? 'Оплата ещё не подтверждена. Обновите страницу позже.'
              : 'Payment not confirmed yet. Refresh later or contact support.'}
        </div>
      ) : null}
      {pollingOrder === 'failed' ? (
        <div className="relative z-10 border-b border-slate-200 bg-slate-100 px-4 py-3 text-center text-sm text-slate-700 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-200">
          {language === 'uz'
            ? 'Buyurtma bekor qilindi yoki toʻlov yakunlanmadi.'
            : language === 'ru'
              ? 'Заказ отменён или оплата не завершена.'
              : 'Order was cancelled or payment did not complete.'}
        </div>
      ) : null}

      {loading ? (
        <div className="flex min-h-[50vh] items-center justify-center px-4">
          <div className="h-9 w-9 animate-spin rounded-full border-2 border-violet-500 border-t-transparent" />
        </div>
      ) : lines.length === 0 ? (
        submitted ? (
          <main className="relative z-10 mx-auto flex min-h-[50vh] max-w-lg flex-col items-center justify-center px-4 py-16 text-center">
            <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-6 py-8 dark:border-emerald-500/30 dark:bg-emerald-950/40">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-700 dark:text-emerald-300">
                <Check className="h-6 w-6" />
              </div>
              <p className="text-base font-medium text-slate-800 dark:text-slate-200">{copy.done}</p>
              <div className="mt-6 flex flex-wrap justify-center gap-3 text-sm">
                <Link
                  to="/collections"
                  className="font-medium text-violet-600 hover:underline dark:text-violet-400"
                >
                  {copy.home}
                </Link>
                <span className="text-slate-300 dark:text-slate-600" aria-hidden>
                  |
                </span>
                <Link
                  to="/cart"
                  className="font-medium text-slate-600 hover:underline dark:text-slate-400"
                >
                  {copy.bag}
                </Link>
              </div>
            </div>
          </main>
        ) : (
          <main className="relative z-10 mx-auto flex min-h-[50vh] max-w-lg flex-col items-center justify-center px-4 py-16 text-center">
            <Package className="h-12 w-12 text-slate-400" strokeWidth={1.2} />
            <p className="mt-4 text-slate-600 dark:text-slate-400">{copy.empty}</p>
            <Link
              to="/cart"
              className="mt-6 inline-flex items-center justify-center rounded-full bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-violet-500 dark:bg-violet-500 dark:hover:bg-violet-400"
            >
              {copy.bag}
            </Link>
          </main>
        )
      ) : (
        <main className="relative z-10 mx-auto max-w-6xl px-4 pb-20 pt-6 sm:px-6 sm:pt-8 md:pt-10">
          <Link
            to="/cart"
            className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition hover:text-violet-600 dark:text-slate-400 dark:hover:text-violet-400"
          >
            <ArrowLeft className="h-4 w-4" />
            {copy.back}
          </Link>

          <div className="mb-8 flex flex-col gap-3 sm:mb-10 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-violet-600 dark:text-violet-400">
                {copy.review}
              </p>
              <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100 sm:text-4xl">
                {copy.title}
              </h1>
              <p className="mt-2 max-w-xl text-pretty text-sm text-slate-600 dark:text-slate-400">
                {copy.subtitle}
              </p>
              {cart?.userId ? (
                <p className="mt-2 inline-flex items-center gap-1.5 rounded-full border border-violet-500/25 bg-violet-500/10 px-3 py-1 text-xs font-medium text-violet-800 dark:text-violet-200">
                  <Sparkles className="h-3.5 w-3.5" />
                  {copy.bound}
                </p>
              ) : null}
            </div>
            <div className="flex items-center gap-2 self-start rounded-2xl border border-slate-200 bg-white/80 px-3 py-2 text-xs font-mono text-slate-600 shadow-sm backdrop-blur dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-300 sm:self-auto">
              <Hash className="h-3.5 w-3.5 text-violet-500" />
              {ticketNo}
            </div>
          </div>

          <div className="mb-6 flex gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-500">
            <span className="rounded-full bg-violet-600 px-3 py-1 text-white dark:bg-violet-500">
              1 · {copy.step1}
            </span>
            <span className="rounded-full border border-slate-300 px-3 py-1 dark:border-slate-600">
              2 · {copy.step2}
            </span>
          </div>

          <div className="grid gap-6 lg:grid-cols-12 lg:items-start lg:gap-8">
            <motion.section
              initial={reduceMotion ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="lg:col-span-7"
            >
              <div className="overflow-hidden rounded-2xl border border-slate-200/90 bg-white/80 shadow-xl shadow-slate-900/5 backdrop-blur-md dark:border-slate-700/80 dark:bg-slate-900/50 dark:shadow-none">
                <div className="border-b border-slate-200 bg-gradient-to-r from-violet-600/8 to-cyan-500/5 px-5 py-3 dark:border-slate-700">
                  <div className="flex items-center gap-2">
                    <Truck className="h-4 w-4 text-violet-600 dark:text-violet-400" />
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-200">
                      {copy.step1}
                    </span>
                  </div>
                </div>
                <form id={formId} onSubmit={onSubmit} className="space-y-4 p-5 sm:p-6">
                  {checkoutError && !testAwaitPayment ? (
                    <p className="rounded-lg border border-red-400/40 bg-red-500/10 px-3 py-2 text-sm text-red-700 dark:text-red-200" role="alert">
                      {checkoutError}
                    </p>
                  ) : null}
                  <div>
                    <label className={labelClass} htmlFor={`${formId}-name`}>
                      {copy.name}
                    </label>
                    <input
                      id={`${formId}-name`}
                      className={inputClass}
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      autoComplete="name"
                    />
                  </div>
                  <div>
                    <label className={labelClass} htmlFor={`${formId}-email`}>
                      {copy.email}
                    </label>
                    <input
                      id={`${formId}-email`}
                      className={inputClass}
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      autoComplete="email"
                    />
                  </div>
                  <div>
                    <label className={labelClass} htmlFor={`${formId}-phone`}>
                      {copy.phone}
                    </label>
                    <input
                      id={`${formId}-phone`}
                      className={inputClass}
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      autoComplete="tel"
                    />
                  </div>
                  <div>
                    <label className={labelClass} htmlFor={`${formId}-addr`}>
                      {copy.address}
                    </label>
                    <textarea
                      id={`${formId}-addr`}
                      className={`${inputClass} min-h-[5.5rem] resize-y py-2.5`}
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      autoComplete="street-address"
                    />
                  </div>
                  <p className="flex items-start gap-2 rounded-xl border border-slate-200/80 bg-slate-50/80 px-3 py-2.5 text-xs text-slate-600 dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-400">
                    <Shield className="mt-0.5 h-3.5 w-3.5 shrink-0 text-violet-500" />
                    {copy.secure}
                  </p>
                </form>
              </div>
            </motion.section>

            <motion.aside
              initial={reduceMotion ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              className="lg:col-span-5"
            >
              <div className="sticky top-24 overflow-hidden rounded-2xl border border-slate-200/90 bg-gradient-to-b from-white to-slate-50/90 shadow-xl shadow-slate-900/5 dark:border-slate-700 dark:from-slate-900/90 dark:to-slate-950/90 dark:shadow-[0_20px_50px_-20px_rgba(0,0,0,0.5)]">
                <div className="border-b border-slate-200 px-5 py-3 dark:border-slate-700">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <CreditCard className="h-4 w-4 text-violet-600 dark:text-violet-400" />
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-200">
                        {copy.items}
                      </span>
                    </div>
                  </div>
                </div>
                <ul className="max-h-[min(50vh,24rem)] space-y-3 overflow-y-auto border-b border-slate-200 px-5 py-4 dark:border-slate-700">
                  {lines.map((line, i) => (
                    <motion.li
                      key={line.id}
                      initial={reduceMotion ? false : { opacity: 0, x: 6 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.03 * i }}
                      className="flex gap-3"
                    >
                      <div
                        className="h-12 w-12 shrink-0 overflow-hidden rounded-lg border border-slate-200 bg-slate-100 bg-cover dark:border-slate-600 dark:bg-slate-800"
                        style={line.image ? { backgroundImage: `url(${line.image})` } : undefined}
                      />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-slate-900 dark:text-slate-100">
                          {line.name}
                        </p>
                        {line.selectionSummary ? (
                          <p className="mt-0.5 truncate text-xs text-slate-500 dark:text-slate-400">
                            {line.selectionSummary}
                          </p>
                        ) : null}
                        <p className="mt-0.5 font-mono text-[11px] text-slate-500 dark:text-slate-500">
                          {formatMoney(line.unitPrice)} × {line.quantity}
                        </p>
                      </div>
                      <p className="shrink-0 text-sm font-semibold tabular-nums text-slate-900 dark:text-slate-100">
                        {formatMoney(line.lineTotal)}
                      </p>
                    </motion.li>
                  ))}
                </ul>
                <div className="flex items-center justify-between gap-3 px-5 py-4">
                  <span className="text-sm font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                    {copy.sub}
                  </span>
                  <span className="text-xl font-bold tabular-nums text-violet-600 dark:text-violet-400">
                    {formatMoney(subtotal)}
                  </span>
                </div>
                <div className="px-5 pb-5">
                  <AnimatePresence mode="wait">
                    {testAwaitPayment ? (
                      <motion.div
                        key="test-pay"
                        initial={reduceMotion ? false : { opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -4 }}
                        className="space-y-3 rounded-xl border border-amber-500/35 bg-amber-500/10 px-4 py-4 text-left dark:border-amber-500/25 dark:bg-amber-950/35"
                      >
                        <p className="text-xs leading-relaxed text-amber-950 dark:text-amber-100">
                          {copy.testPaymentHint}
                        </p>
                        {checkoutError ? (
                          <p className="text-sm text-red-600 dark:text-red-400" role="alert">
                            {checkoutError}
                          </p>
                        ) : null}
                        <button
                          type="button"
                          onClick={onCompleteTestPayment}
                          disabled={payRedirecting}
                          className="w-full rounded-xl bg-amber-600 py-3 text-sm font-extrabold uppercase tracking-wider text-white shadow-lg transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-amber-600"
                        >
                          {payRedirecting ? '…' : copy.testPaymentBtn}
                        </button>
                      </motion.div>
                    ) : !submitted ? (
                      <motion.button
                        key="go"
                        type="submit"
                        form={formId}
                        disabled={payRedirecting}
                        className="relative w-full overflow-hidden rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 py-3.5 text-sm font-extrabold uppercase tracking-wider text-white shadow-lg transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60 dark:from-violet-500 dark:to-fuchsia-600"
                        whileHover={reduceMotion || payRedirecting ? {} : { scale: 1.01 }}
                        whileTap={{ scale: payRedirecting ? 1 : 0.99 }}
                        initial={{ opacity: 1 }}
                        exit={{ opacity: 0, y: -4 }}
                      >
                        {payRedirecting ? '…' : copy.pay}
                      </motion.button>
                    ) : (
                      <motion.div
                        key="ok"
                        initial={reduceMotion ? false : { opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-5 text-center dark:border-emerald-500/30 dark:bg-emerald-950/40"
                      >
                        <div className="mx-auto mb-2 flex h-11 w-11 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-700 dark:text-emerald-300">
                          <Check className="h-5 w-5" />
                        </div>
                        <p className="text-sm font-medium text-slate-800 dark:text-slate-200">{copy.done}</p>
                        <div className="mt-4 flex flex-wrap justify-center gap-3 text-sm">
                          <Link
                            to="/collections"
                            className="font-medium text-violet-600 hover:underline dark:text-violet-400"
                          >
                            {copy.home}
                          </Link>
                          <span className="text-slate-300 dark:text-slate-600" aria-hidden>
                            |
                          </span>
                          <Link
                            to="/cart"
                            className="font-medium text-slate-600 hover:underline dark:text-slate-400"
                          >
                            {copy.bag}
                          </Link>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  <p className="mt-3 text-center text-[10px] text-slate-500 dark:text-slate-500">
                    {paymeNote || copy.payNote}
                  </p>
                </div>
              </div>
            </motion.aside>
          </div>
        </main>
      )}

      <SiteFooter />
    </div>
  )
}
