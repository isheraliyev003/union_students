import { Link } from 'react-router-dom'
import AuthCard from './auth/AuthCard.jsx'
import ScrollProgressRail from './components/ScrollProgressRail.jsx'
import { useI18n } from './i18n.jsx'

/** Login page background — decorative only. */
const LOGIN_BG =
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTrzH7M3VXSqxkoVdRRBYp6TbpWUK9tXsXY38mR64H7fXJEhnOOQZ1jqj8&s=10'

export default function LoginPage() {
  const { t } = useI18n()

  return (
    <div className="relative flex min-h-dvh flex-col overflow-x-hidden">
      <ScrollProgressRail />
      <img
        alt=""
        src={LOGIN_BG}
        className="pointer-events-none absolute inset-0 h-full min-h-full w-full object-cover"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/20 via-black/35 to-black/55 dark:from-black/35 dark:via-black/50 dark:to-black/70"
      />

      <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-6 py-12">
        <div className="flex w-full max-w-md flex-col items-stretch gap-6">
          <Link
            to="/"
            className="self-start text-sm font-semibold text-white/95 drop-shadow-md transition hover:text-amber-100 hover:underline"
          >
            ← {t('loginBack', 'Back to home')}
          </Link>
          <AuthCard />
        </div>
      </div>
    </div>
  )
}
