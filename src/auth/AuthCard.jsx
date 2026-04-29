import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { setRegistered } from '../authSession.js'
import { useI18n } from '../i18n.jsx'
import ResetPasswordForm from './ResetPasswordForm.jsx'
import SignInForm from './SignInForm.jsx'
import SignUpForm from './SignUpForm.jsx'

/** Same-origin path only; blocks open redirects. */
function getSafeReturnPath(raw) {
  if (typeof raw !== 'string' || !raw.trim()) return null
  const t = raw.trim()
  if (!t.startsWith('/') || t.startsWith('//')) return null
  if (t.includes('://')) return null
  return t
}

export default function AuthCard() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { t } = useI18n()
  const [tab, setTab] = useState('signIn')
  const [showReset, setShowReset] = useState(false)
  const [prefilledEmail, setPrefilledEmail] = useState('')

  const handleAuthSuccess = () => {
    setRegistered(true)
    const next =
      getSafeReturnPath(searchParams.get('returnTo')) ||
      getSafeReturnPath(searchParams.get('from'))
    navigate(next ?? '/', { replace: true })
  }

  const handleResetComplete = (email) => {
    setPrefilledEmail(email)
  }

  return (
    <motion.div
      layout
      className="w-full max-w-md overflow-hidden rounded-2xl bg-white/65 p-8 shadow-2xl shadow-slate-900/15 dark:bg-slate-950/50 dark:shadow-black/40"
    >
      <AnimatePresence mode="wait">
        {showReset ? (
          <ResetPasswordForm
            key="reset"
            onBack={() => setShowReset(false)}
            onComplete={handleResetComplete}
          />
        ) : (
          <motion.div key="main-auth" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="mb-6 flex rounded-full bg-white/50 p-1 dark:bg-slate-950/40">
              <motion.button
                type="button"
                layout
                onClick={() => setTab('signIn')}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`relative flex-1 rounded-full px-4 py-2 text-sm font-medium transition ${
                  tab === 'signIn'
                    ? 'bg-white/95 text-violet-900 shadow-sm dark:bg-white/25 dark:text-violet-200'
                    : 'text-slate-800 hover:text-slate-950 dark:text-slate-200 dark:hover:text-white'
                }`}
              >
                {t('authSignIn', 'Sign in')}
              </motion.button>
              <motion.button
                type="button"
                layout
                onClick={() => setTab('signUp')}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`relative flex-1 rounded-full px-4 py-2 text-sm font-medium transition ${
                  tab === 'signUp'
                    ? 'bg-white/95 text-violet-900 shadow-sm dark:bg-white/25 dark:text-violet-200'
                    : 'text-slate-800 hover:text-slate-950 dark:text-slate-200 dark:hover:text-white'
                }`}
              >
                {t('authSignUp', 'Sign up')}
              </motion.button>
            </div>

            <AnimatePresence mode="wait">
              {tab === 'signIn' ? (
                <SignInForm
                  key={`signin-${prefilledEmail}`}
                  onSuccess={handleAuthSuccess}
                  onForgotPassword={() => setShowReset(true)}
                  prefilledEmail={prefilledEmail}
                />
              ) : (
                <SignUpForm key="tab-signup" onSuccess={handleAuthSuccess} />
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
