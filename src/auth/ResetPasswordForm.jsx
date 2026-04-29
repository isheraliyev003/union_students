import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useAnimation } from 'framer-motion'
import {
  requestPasswordReset,
  verifyPasswordResetCode,
  confirmPasswordReset,
  ApiError,
} from '../api/authApi.js'
import { useI18n } from '../i18n.jsx'
import { cardVariants, staggerContainer, staggerItem } from './motion'

const inputClass =
  'w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-500/30 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100'

const stepCopy = {
  1: 'Enter the email for your account.',
  2: 'Enter the 6-digit verification code sent to your email.',
  3: 'Choose a new password.',
}

export default function ResetPasswordForm({ onBack, onComplete }) {
  const { t } = useI18n()
  const [step, setStep] = useState(1)
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const firstFieldRef = useRef(null)
  const controls = useAnimation()

  useEffect(() => {
    firstFieldRef.current?.focus()
  }, [step])

  const sendEmail = async (e) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      await requestPasswordReset({ email: email.trim() })
      setStep(2)
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.status === 404) {
          setError(t('authErrorNoAccount', 'No account found for this email.'))
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

  const verifyCode = async (e) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      await verifyPasswordResetCode({ email: email.trim(), code: code.trim() })
      setStep(3)
    } catch (err) {
      if (err instanceof ApiError) {
        setError(t('authErrorInvalidCodeTryAgain', 'Invalid code. Try again.'))
        controls.start({ x: [0, -10, 10, -10, 10, 0], transition: { duration: 0.45 } })
      } else {
        setError(t('authErrorNetwork', 'Could not reach the server. Is the API running?'))
      }
    } finally {
      setSubmitting(false)
    }
  }

  const savePassword = async (e) => {
    e.preventDefault()
    setError('')
    if (password !== confirm) {
      setError(t('authErrorPasswordsMismatch', 'Passwords do not match.'))
      return
    }
    setSubmitting(true)
    try {
      await confirmPasswordReset({
        email: email.trim(),
        code: code.trim(),
        newPassword: password,
      })
      onComplete(email)
      onBack()
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message)
      } else {
        setError(t('authErrorNetwork', 'Could not reach the server. Is the API running?'))
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <motion.div
      key="reset-form"
      layout
      variants={cardVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <motion.button
        type="button"
        whileTap={{ scale: 0.98 }}
        onClick={onBack}
        className="mb-4 text-sm font-medium text-violet-600 hover:underline dark:text-violet-400"
      >
        ← {t('authBackToSignIn', 'Back to sign in')}
      </motion.button>
      <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">{t('authResetPassword', 'Reset password')}</h2>
      <AnimatePresence mode="wait">
        <motion.p
          key={step}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.2 }}
          className="mt-1 text-sm text-slate-600 dark:text-slate-400"
        >
          {step === 1
            ? t('authEnterAccountEmail', stepCopy[1])
            : step === 2
              ? t('authEnterResetCode', stepCopy[2])
              : t('authChooseNewPassword', stepCopy[3])}
        </motion.p>
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {step === 1 ? (
          <motion.form
            key="rs-1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -16 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            onSubmit={sendEmail}
            className="mt-6"
          >
            <motion.div variants={staggerContainer} initial="initial" animate="animate" className="space-y-4">
              <motion.div variants={staggerItem}>
                <label htmlFor="reset-email" className="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-400">
                  {t('authEmail', 'Email')}
                </label>
                <input
                  ref={firstFieldRef}
                  id="reset-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
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
              className="mt-6 w-full rounded-xl bg-violet-600 px-4 py-3 text-sm font-medium text-white hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? t('authSending', 'Sending…') : t('authSend', 'Send')}
            </motion.button>
          </motion.form>
        ) : null}

        {step === 2 ? (
          <motion.form
            key="rs-2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -16 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            onSubmit={verifyCode}
            className="mt-6"
          >
            <motion.div animate={controls}>
              <label htmlFor="reset-code" className="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-400">
                {t('authVerificationCode', 'Verification code')}
              </label>
              <input
                ref={firstFieldRef}
                id="reset-code"
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                maxLength={6}
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                className={inputClass}
                placeholder={t('authCodePlaceholder', '6-digit code')}
                required
              />
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
              className="mt-6 w-full rounded-xl bg-violet-600 px-4 py-3 text-sm font-medium text-white hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? t('authVerifying', 'Verifying…') : t('authVerifyCode', 'Verify code')}
            </motion.button>
          </motion.form>
        ) : null}

        {step === 3 ? (
          <motion.form
            key="rs-3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -16 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            onSubmit={savePassword}
            className="mt-6"
          >
            <motion.div variants={staggerContainer} initial="initial" animate="animate" className="space-y-4">
              <motion.div variants={staggerItem}>
                <label htmlFor="reset-new-pass" className="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-400">
                  {t('authNewPassword', 'New password')}
                </label>
                <input
                  ref={firstFieldRef}
                  id="reset-new-pass"
                  type="password"
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={inputClass}
                  required
                />
              </motion.div>
              <motion.div variants={staggerItem}>
                <label htmlFor="reset-confirm" className="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-400">
                  {t('authConfirmPassword', 'Confirm password')}
                </label>
                <input
                  id="reset-confirm"
                  type="password"
                  autoComplete="new-password"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
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
              className="mt-6 w-full rounded-xl bg-violet-600 px-4 py-3 text-sm font-medium text-white hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? t('authSaving', 'Saving…') : t('authUpdatePassword', 'Update password')}
            </motion.button>
          </motion.form>
        ) : null}
      </AnimatePresence>
    </motion.div>
  )
}
