import { useState } from 'react'
import { motion } from 'framer-motion'
import { signIn, ApiError } from '../api/authApi.js'
import { setSession } from '../authSession.js'
import { useI18n } from '../i18n.jsx'
import { cardVariants, staggerContainer, staggerItem } from './motion'

const inputClass =
  'w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none ring-violet-500/0 transition focus:border-violet-500 focus:ring-2 focus:ring-violet-500/30 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100'

export default function SignInForm({ onSuccess, onForgotPassword, prefilledEmail = '' }) {
  const { t } = useI18n()
  const [email, setEmail] = useState(prefilledEmail)
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      const data = await signIn({ email, password })
      if (data?.token) {
        setSession({ token: data.token, user: data.user })
      } else {
        setSession({ user: data.user })
      }
      onSuccess()
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.status === 404) {
          setError(t('authErrorNoAccount', 'No account found for this email.'))
        } else if (err.status === 401) {
          setError(t('authErrorWrongPassword', 'Incorrect password.'))
        } else {
          setError(err.message)
        }
      } else {
        setError(t('authErrorNetwork', 'Could not reach the server. Is the API running?'))
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <motion.div
      key="signin-form"
      layout
      variants={cardVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">{t('authSignIn', 'Sign in')}</h2>
      <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
        {t('authEnterEmailPassword', 'Enter your email and password to continue.')}
      </p>
      <form onSubmit={submit} className="mt-6">
        <motion.div
          className="space-y-4"
          variants={staggerContainer}
          initial="initial"
          animate="animate"
        >
          <motion.div variants={staggerItem}>
            <label htmlFor="signin-email" className="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-400">
              {t('authEmail', 'Email')}
            </label>
            <input
              id="signin-email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputClass}
              required
            />
          </motion.div>
          <motion.div variants={staggerItem}>
            <label htmlFor="signin-password" className="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-400">
              {t('authPassword', 'Password')}
            </label>
            <input
              id="signin-password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={inputClass}
              required
            />
          </motion.div>
        </motion.div>
        {error ? (
          <p className="mt-3 text-sm text-red-600 dark:text-red-400" role="alert" aria-live="polite">
            {error}
          </p>
        ) : null}
        <motion.button
          type="submit"
          disabled={submitting}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          className="mt-6 w-full rounded-xl bg-violet-600 px-4 py-3 text-sm font-medium text-white shadow-lg shadow-violet-600/25 transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? t('authSigningIn', 'Signing in…') : t('authSignIn', 'Sign in')}
        </motion.button>
        <button
          type="button"
          className="mt-4 w-full text-center text-sm font-medium text-violet-600 hover:underline dark:text-violet-400"
          onClick={onForgotPassword}
        >
          {t('authForgotPassword', 'Forgot password?')}
        </button>
      </form>
    </motion.div>
  )
}
