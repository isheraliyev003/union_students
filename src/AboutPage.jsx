import { useLayoutEffect, useMemo, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { Feather, Layers, Mail, Shield, Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'
import SiteFooter from './components/SiteFooter.jsx'
import SiteHeader from './components/SiteHeader.jsx'
import { useI18n } from './i18n.jsx'
import { applyDarkClass, persistTheme, readStoredThemeIsDark } from './theme.js'

const CHARTER = [
  {
    num: 'I',
    title: {
      en: 'Why we exist',
      uz: 'Nega biz bormiz',
      ru: 'Почему мы существуем',
    },
    body: {
      en: 'Union Students Studio is a playground for interfaces that feel considered - motion, hierarchy, and tone that respect attention instead of grabbing it.',
      uz: "Union Students Studio - bu e'tiborni tortib olish emas, hurmat qilishga qaratilgan interfeyslar maydoni.",
      ru: 'Union Students Studio - это площадка интерфейсов, где движение, иерархия и тон уважают внимание пользователя.',
    },
  },
  {
    num: 'II',
    title: {
      en: 'What we ship',
      uz: 'Nimani taqdim etamiz',
      ru: 'Что мы создаем',
    },
    body: {
      en: 'Exploratory pages, catalog metaphors, and narrative layouts. Each route in this demo is allowed to look like itself, so you can feel the contrast side by side.',
      uz: "Tadqiqotga yo'naltirilgan sahifalar, katalog metaforalari va hikoyaviy layoutlar. Har bir route o'z uslubida qoladi.",
      ru: 'Исследовательские страницы, метафоры каталога и нарративные макеты. Каждый маршрут в демо сохраняет свой характер.',
    },
  },
  {
    num: 'III',
    title: {
      en: 'How we work',
      uz: 'Qanday ishlaymiz',
      ru: 'Как мы работаем',
    },
    body: {
      en: 'Small surfaces, fast feedback, and accessible defaults. We bias toward clarity in code and in UI, then layer delight where it earns its place.',
      uz: "Kichik yuzalar, tez fikr-mulohaza va accessibilityga mos defaultlar. Avvalo aniqlik, keyin o'rinli estetik qatlamlar.",
      ru: 'Небольшие поверхности, быстрая обратная связь и доступные значения по умолчанию. Сначала ясность, потом выразительность.',
    },
  },
]

const PRINCIPLES = [
  {
    label: { en: 'Signal over noise', uz: "Shovqindan ko'ra mazmun", ru: 'Сигнал важнее шума' },
    detail: { en: 'One idea per view; typography carries the story.', uz: "Har ko'rinishda bitta g'oya; hikoyani tipografiya olib boradi.", ru: 'Одна идея на экран; типографика ведет историю.' },
    icon: Feather,
  },
  {
    label: { en: 'Motion with purpose', uz: 'Maqsadli animatsiya', ru: 'Анимация с целью' },
    detail: { en: 'Springs and stagger - never decoration-only loops.', uz: 'Spring va stagger - faqat bezak uchun emas.', ru: 'Пружины и stagger - не ради пустого декора.' },
    icon: Sparkles,
  },
  {
    label: { en: 'Room to breathe', uz: 'Nafas olish uchun joy', ru: 'Пространство для воздуха' },
    detail: { en: 'Whitespace and rhythm tuned like editorial layout.', uz: "Bo'sh joy va ritm editorial uslubida sozlangan.", ru: 'Пробелы и ритм настроены как в редакционном макете.' },
    icon: Layers,
  },
  {
    label: { en: 'Built to extend', uz: "Kengaytirishga tayyor", ru: 'Готово к расширению' },
    detail: { en: 'Plain React + Tailwind; easy to fork and rename.', uz: 'Oddiy React + Tailwind; fork qilish va moslash oson.', ru: 'Чистый React + Tailwind; легко форкать и переименовывать.' },
    icon: Shield,
  },
]

export default function AboutPage() {
  const reduceMotion = useReducedMotion()
  const { language } = useI18n()
  const [isDark, setIsDark] = useState(readStoredThemeIsDark)
  const tx = (v) => (typeof v === 'object' ? v[language] ?? v.en : v)

  useLayoutEffect(() => {
    applyDarkClass(isDark)
    persistTheme(isDark)
  }, [isDark])

  const enter = useMemo(
    () => ({
      initial: reduceMotion ? false : { opacity: 0, y: 28 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] },
    }),
    [reduceMotion],
  )

  return (
    <div className="about-charter about-charter-canvas relative min-h-dvh w-full min-w-0 text-[var(--ab-ink)]">
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="about-charter-aurora absolute -left-[20%] top-[-18%] h-[55vmin] w-[55vmin] rounded-full blur-[80px]" />
        <div className="about-charter-aurora2 absolute -right-[15%] bottom-[10%] h-[45vmin] w-[45vmin] rounded-full blur-[90px]" />
        <div className="about-charter-grid absolute inset-0 opacity-[0.45] dark:opacity-[0.35]" />
      </div>

      <SiteHeader isDark={isDark} setIsDark={setIsDark} />

      <main className="relative z-10 mx-auto w-full max-w-[1100px] px-5 pb-28 pt-10 sm:px-8 md:px-12 md:pt-14">
        <motion.header {...enter} className="relative">
          <p className="about-charter-label text-[11px] font-medium uppercase tracking-[0.42em] text-[var(--ab-muted)]">
            {tx({ en: 'Charter · about the studio', uz: 'Nizom · studiya haqida', ru: 'Хартия · о студии' })}
          </p>
          <div className="mt-8 flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between lg:gap-12">
            <h1 className="about-charter-display max-w-[14ch] text-[clamp(2.75rem,8vw,4.75rem)] font-medium leading-[0.95] tracking-[-0.02em]">
              {tx({ en: 'We build', uz: 'Biz yaratamiz', ru: 'Мы создаем' })}
              <span className="block text-[var(--ab-accent)]">
                {tx({ en: 'with intention.', uz: 'maqsad bilan.', ru: 'осознанно.' })}
              </span>
            </h1>
            <div className="flex shrink-0 flex-col items-start gap-4 lg:items-end lg:pb-2">
              <div
                className="about-charter-seal flex size-[5.5rem] items-center justify-center rounded-full border-2 border-[var(--ab-line-strong)] bg-[var(--ab-surface)] text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--ab-accent)] shadow-[inset_0_0_0_1px_var(--ab-line)] sm:size-24"
                aria-hidden
              >
                <span className="about-charter-display text-lg font-medium tracking-tight">US</span>
              </div>
              <p className="about-charter-ui max-w-[16rem] text-right text-sm font-light leading-relaxed text-[var(--ab-muted)] lg:text-right">
                {tx({
                  en: 'A single page with its own voice - not another glass card grid.',
                  uz: "O'z ovoziga ega bitta sahifa - oddiy shaffof kartalar to'plami emas.",
                  ru: 'Одна страница со своим голосом - не очередная сетка стеклянных карточек.',
                })}
              </p>
            </div>
          </div>
        </motion.header>

        <motion.div
          initial={reduceMotion ? false : { scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.9, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
          className="about-charter-rule mt-14 w-full origin-left md:mt-20"
          aria-hidden
        />

        <div className="mt-14 grid gap-14 md:mt-20 md:grid-cols-[minmax(0,1fr)_minmax(0,0.42fr)] md:gap-y-16 md:gap-x-20">
          <div className="flex flex-col gap-16 md:gap-20">
            {CHARTER.map((block, i) => (
              <motion.article
                key={block.num}
                initial={reduceMotion ? false : { opacity: 0, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-12% 0px' }}
                transition={{ duration: 0.55, delay: reduceMotion ? 0 : i * 0.06, ease: [0.22, 1, 0.36, 1] }}
                className="relative pl-0 md:pl-4"
              >
                <span
                  className="about-charter-display mb-3 block text-[clamp(3rem,10vw,4.5rem)] font-medium leading-none text-[var(--ab-line-strong)] opacity-[0.22] dark:opacity-[0.28]"
                  aria-hidden
                >
                  {block.num}
                </span>
                <h2 className="about-charter-display text-2xl font-medium tracking-tight text-[var(--ab-ink)] sm:text-3xl">
                  {tx(block.title)}
                </h2>
                <p className="about-charter-ui mt-4 max-w-prose text-base font-light leading-relaxed text-[var(--ab-muted)] sm:text-lg">
                  {tx(block.body)}
                </p>
              </motion.article>
            ))}
          </div>

          <aside className="md:sticky md:top-[5.75rem] md:self-start">
            <motion.div
              initial={reduceMotion ? false : { opacity: 0, x: 16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-8% 0px' }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="rounded-2xl border border-[var(--ab-line)] bg-[var(--ab-surface)]/90 p-6 shadow-[12px_12px_0_0_var(--ab-shadow)] backdrop-blur-sm dark:bg-[var(--ab-surface)]/80 dark:shadow-[12px_12px_0_0_rgba(212,165,116,0.08)] sm:p-8"
            >
              <p className="about-charter-label text-[10px] tracking-[0.35em] text-[var(--ab-muted)]">
                {tx({ en: 'Principles', uz: 'Tamoyillar', ru: 'Принципы' })}
              </p>
              <ul className="mt-6 space-y-6">
                {PRINCIPLES.map(({ label, detail, icon: Icon }) => (
                  <li key={label} className="flex gap-4 border-b border-[var(--ab-line)] pb-6 last:border-0 last:pb-0">
                    <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-full border border-[var(--ab-line-strong)] text-[var(--ab-accent)]">
                      <Icon className="h-4 w-4" strokeWidth={1.5} aria-hidden />
                    </span>
                    <div>
                      <p className="about-charter-ui text-sm font-medium text-[var(--ab-ink)]">{tx(label)}</p>
                      <p className="about-charter-ui mt-1 text-xs font-light leading-relaxed text-[var(--ab-muted)]">
                        {tx(detail)}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
              <div className="mt-8 border-t border-[var(--ab-line)] pt-6">
                <p className="about-charter-label text-[10px] tracking-[0.3em] text-[var(--ab-muted)]">
                  {tx({ en: 'Say hello', uz: 'Aloqaga chiqing', ru: 'Напишите нам' })}
                </p>
                <a
                  href="mailto:hello@union.studio"
                  className="about-charter-ui mt-3 inline-flex items-center gap-2 text-sm font-medium text-[var(--ab-accent)] transition hover:underline"
                >
                  <Mail className="h-4 w-4 shrink-0" aria-hidden />
                  hello@union.studio
                </a>
              </div>
            </motion.div>
          </aside>
        </div>

        <motion.footer
          initial={reduceMotion ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="mt-24 flex flex-col items-start justify-between gap-6 border-t border-[var(--ab-line)] pt-10 sm:flex-row sm:items-center"
        >
          <p className="about-charter-display max-w-md text-xl font-medium italic leading-snug text-[var(--ab-ink)]">
            {tx({
              en: '“Different pages, different temperaments - same craft underneath.”',
              uz: '“Turli sahifalar, turli kayfiyat - ammo bir xil mahorat.”',
              ru: '“Разные страницы, разный характер - но одно и то же мастерство.”',
            })}
          </p>
          <Link
            to="/"
            className="about-charter-cta about-charter-ui inline-flex items-center gap-2 rounded-full border border-[var(--ab-line-strong)] bg-[var(--ab-surface)] px-5 py-2.5 text-sm font-medium text-[var(--ab-ink)] transition hover:border-[var(--ab-accent)] hover:text-[var(--ab-accent)]"
          >
            {tx({ en: 'Return home', uz: 'Bosh sahifaga qaytish', ru: 'На главную' })}
          </Link>
        </motion.footer>
      </main>

      <SiteFooter />
    </div>
  )
}
