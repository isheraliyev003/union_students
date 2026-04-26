import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { LogOut, Menu, MoonStar, Settings, SunMedium, User, WandSparkles, X } from 'lucide-react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { readRegistered, setRegistered } from '../authSession.js'
import ScrollProgressRail from './ScrollProgressRail.jsx'

const navLinkClass = ({ isActive }) =>
  `rounded-full px-1 py-0.5 transition hover:text-violet-600 dark:hover:text-violet-400 ${
    isActive ? 'font-semibold text-violet-600 dark:text-violet-400' : ''
  }`

const mobileNavLinkClass = ({ isActive }) =>
  `flex w-full items-center rounded-xl px-4 py-3 text-left text-[0.9375rem] font-medium transition ${
    isActive
      ? 'bg-violet-500/15 text-violet-700 dark:text-violet-300'
      : 'text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800/90'
  }`

export default function SiteHeader({ isDark, setIsDark }) {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const [accountOpen, setAccountOpen] = useState(false)
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const accountWrapRef = useRef(null)
  const mobileNavRef = useRef(null)
  const menuButtonRef = useRef(null)

  useEffect(() => {
    let cancelled = false
    queueMicrotask(() => {
      if (!cancelled) setMobileNavOpen(false)
    })
    return () => {
      cancelled = true
    }
  }, [pathname])

  useEffect(() => {
    if (!mobileNavOpen) return
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [mobileNavOpen])

  useEffect(() => {
    if (!accountOpen) return
    const onPointerDown = (event) => {
      const el = accountWrapRef.current
      if (el && !el.contains(event.target)) setAccountOpen(false)
    }
    const onKeyDown = (event) => {
      if (event.key === 'Escape') setAccountOpen(false)
    }
    document.addEventListener('pointerdown', onPointerDown, true)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('pointerdown', onPointerDown, true)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [accountOpen])

  useEffect(() => {
    if (!mobileNavOpen) return
    const onPointerDown = (event) => {
      const panel = mobileNavRef.current
      const btn = menuButtonRef.current
      if (panel && !panel.contains(event.target) && btn && !btn.contains(event.target)) {
        setMobileNavOpen(false)
      }
    }
    const onKeyDown = (event) => {
      if (event.key === 'Escape') setMobileNavOpen(false)
    }
    document.addEventListener('pointerdown', onPointerDown, true)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('pointerdown', onPointerDown, true)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [mobileNavOpen])

  return (
    <>
      <ScrollProgressRail />
      <header className="site-header sticky top-0 z-50 w-full px-4 pb-2 pt-[max(0.75rem,env(safe-area-inset-top))] sm:px-6 md:px-10">
      <div className="relative mx-auto w-full max-w-6xl">
        <div className="site-header-bar flex items-center justify-between gap-3 rounded-2xl px-3 py-2.5 sm:gap-4 sm:rounded-full sm:px-4 sm:py-3 md:px-5">
          <Link
            to="/"
            className="flex min-w-0 flex-1 items-center gap-2 text-sm font-semibold text-slate-900 transition hover:text-violet-600 dark:text-slate-100 dark:hover:text-violet-400 lg:flex-none"
            onClick={() => setMobileNavOpen(false)}
          >
            <WandSparkles className="h-4 w-4 shrink-0 text-violet-500 sm:h-[1.125rem] sm:w-[1.125rem]" aria-hidden />
            <span className="truncate sm:whitespace-normal">Union Students Studio</span>
          </Link>

          <nav
            aria-label="Primary"
            className="hidden items-center justify-center gap-x-1 text-sm font-medium text-slate-600 lg:flex lg:flex-1 lg:gap-x-6 xl:gap-x-8 dark:text-slate-300"
          >
            <NavLink to="/" end className={navLinkClass}>
              Home
            </NavLink>
            <NavLink
              to="/universities"
              className={({ isActive }) =>
                navLinkClass({ isActive: isActive || pathname.startsWith('/universities/') })
              }
            >
              Universities
            </NavLink>
            <NavLink
              to="/collections"
              className={({ isActive }) =>
                navLinkClass({ isActive: isActive || pathname.startsWith('/collections/') })
              }
            >
              Collections
            </NavLink>
            <NavLink to="/news" className={navLinkClass}>
              News
            </NavLink>
            <NavLink to="/about" className={navLinkClass}>
              About Us
            </NavLink>
          </nav>

          <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
            <button
              type="button"
              onClick={() => setIsDark((prev) => !prev)}
              aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
              className="site-header-icon-btn flex size-9 shrink-0 items-center justify-center rounded-full transition hover:scale-105 active:scale-95 sm:size-10"
            >
              {isDark ? <SunMedium className="h-4 w-4" /> : <MoonStar className="h-4 w-4" />}
            </button>
            <div ref={accountWrapRef} className="relative">
              <button
                type="button"
                aria-expanded={readRegistered() ? accountOpen : false}
                aria-haspopup={readRegistered() ? 'dialog' : undefined}
                aria-controls={readRegistered() ? 'account-popover' : undefined}
                id="account-menu-button"
                aria-label={readRegistered() ? 'Open account menu' : 'Sign in — go to login page'}
                onClick={() => {
                  if (!readRegistered()) {
                    navigate('/login')
                    return
                  }
                  setAccountOpen((o) => !o)
                }}
                className="flex size-9 shrink-0 items-center justify-center rounded-full border border-slate-300 bg-gradient-to-br from-violet-500 to-violet-700 text-white shadow-inner transition hover:scale-105 hover:brightness-110 active:scale-95 dark:border-slate-600 dark:from-violet-600 dark:to-violet-900 sm:size-10"
              >
                <User className="h-4 w-4" strokeWidth={2} aria-hidden />
              </button>
              {accountOpen ? (
                <div
                  id="account-popover"
                  role="dialog"
                  aria-labelledby="account-popover-title"
                  className="absolute right-0 top-full z-[70] mt-2 w-[min(100vw-2rem,15rem)] origin-top-right rounded-2xl border py-2 shadow-xl sm:w-60"
                  style={{
                    borderColor: 'var(--site-header-popover-border)',
                    backgroundColor: 'var(--site-header-popover-bg)',
                  }}
                >
                  <div
                    className="border-b px-3 pb-2 pt-1"
                    style={{ borderColor: 'var(--site-header-popover-border)' }}
                  >
                    <p id="account-popover-title" className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                      Account
                    </p>
                    <p className="truncate text-xs text-slate-500 dark:text-slate-400">student@union.edu</p>
                  </div>
                  <div className="py-1">
                    <a
                      href="#profile"
                      className="flex items-center gap-2 px-3 py-2 text-sm text-slate-700 hover:bg-slate-100/80 dark:text-slate-200 dark:hover:bg-slate-800/80"
                      onClick={() => setAccountOpen(false)}
                    >
                      <User className="h-4 w-4 shrink-0 opacity-70" aria-hidden />
                      Profile
                    </a>
                    <a
                      href="#settings"
                      className="flex items-center gap-2 px-3 py-2 text-sm text-slate-700 hover:bg-slate-100/80 dark:text-slate-200 dark:hover:bg-slate-800/80"
                      onClick={() => setAccountOpen(false)}
                    >
                      <Settings className="h-4 w-4 shrink-0 opacity-70" aria-hidden />
                      Settings
                    </a>
                  </div>
                  <div className="border-t pt-1" style={{ borderColor: 'var(--site-header-popover-border)' }}>
                    <button
                      type="button"
                      className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/40"
                      onClick={() => {
                        setRegistered(false)
                        setAccountOpen(false)
                      }}
                    >
                      <LogOut className="h-4 w-4 shrink-0" aria-hidden />
                      Sign out
                    </button>
                  </div>
                </div>
              ) : null}
            </div>

            <button
              ref={menuButtonRef}
              type="button"
              className="site-header-menu-btn inline-flex size-9 shrink-0 items-center justify-center rounded-full transition active:scale-95 lg:hidden sm:size-10"
              aria-label={mobileNavOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileNavOpen}
              aria-controls="mobile-primary-nav"
              onClick={() => setMobileNavOpen((o) => !o)}
            >
              {mobileNavOpen ? <X className="h-5 w-5" aria-hidden /> : <Menu className="h-5 w-5" aria-hidden />}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {mobileNavOpen ? (
            <>
              <motion.button
                type="button"
                aria-label="Close menu"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="site-header-scrim fixed inset-0 z-[45] backdrop-blur-[2px] lg:hidden"
                onClick={() => setMobileNavOpen(false)}
              />
              <motion.div
                ref={mobileNavRef}
                id="mobile-primary-nav"
                role="navigation"
                aria-label="Primary mobile"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                className="site-header-mobile-panel absolute left-0 right-0 top-[calc(100%+0.35rem)] z-[50] overflow-hidden rounded-2xl py-2 lg:hidden"
              >
                <nav className="flex max-h-[min(70dvh,28rem)] flex-col gap-0.5 overflow-y-auto px-2 pb-[env(safe-area-inset-bottom,0px)] pt-1">
                  <NavLink to="/" end className={mobileNavLinkClass} onClick={() => setMobileNavOpen(false)}>
                    Home
                  </NavLink>
                  <NavLink
                    to="/universities"
                    className={({ isActive }) =>
                      mobileNavLinkClass({ isActive: isActive || pathname.startsWith('/universities/') })
                    }
                    onClick={() => setMobileNavOpen(false)}
                  >
                    Universities
                  </NavLink>
                  <NavLink
                    to="/collections"
                    className={({ isActive }) =>
                      mobileNavLinkClass({ isActive: isActive || pathname.startsWith('/collections/') })
                    }
                    onClick={() => setMobileNavOpen(false)}
                  >
                    Collections
                  </NavLink>
                  <NavLink to="/news" className={mobileNavLinkClass} onClick={() => setMobileNavOpen(false)}>
                    News
                  </NavLink>
                  <NavLink to="/about" className={mobileNavLinkClass} onClick={() => setMobileNavOpen(false)}>
                    About Us
                  </NavLink>
                </nav>
              </motion.div>
            </>
          ) : null}
        </AnimatePresence>
      </div>
    </header>
    </>
  )
}
