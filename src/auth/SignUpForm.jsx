import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useAnimation } from 'framer-motion'
import { checkSignUpEmail, verifySignUpCode, signIn, signUp, ApiError } from '../api/authApi.js'
import { getUniversities } from '../api/catalogApi.js'
import { setSession } from '../authSession.js'
import { useI18n } from '../i18n.jsx'
import { cardVariants, staggerContainer, staggerItem } from './motion'

const inputClass =
  'w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-500/30 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100'

/** Native chevron gutter (~2rem) + 5px spacing before the indicator edge. */
const selectClass = `${inputClass.replace('px-3', 'pl-3')} pr-[calc(2rem+5px)]`

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())
}

export default function SignUpForm({ onSuccess }) {
  const { t } = useI18n()
  const [step, setStep] = useState(1)
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [gender, setGender] = useState('')
  const [universityId, setUniversityId] = useState('')
  const [code, setCode] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [universitiesList, setUniversitiesList] = useState([])
  const firstFieldRef = useRef(null)
  const shakeControls = useAnimation()

  useEffect(() => {
    getUniversities()
      .then((list) => setUniversitiesList(list))
      .catch(() => setUniversitiesList([]))
  }, [])

  useEffect(() => {
    firstFieldRef.current?.focus()
  }, [step])

  const submitDetails = async (e) => {
    e.preventDefault()
    setError('')
    if (!fullName.trim()) {
      setError(t('authErrorEnterFullName', 'Please enter your full name.'))
      return
    }
    if (!isValidEmail(email)) {
      setError(t('authErrorInvalidEmail', 'Please enter a valid email address.'))
      return
    }
    if (!gender) {
      setError(t('authErrorSelectGender', 'Please select a gender.'))
      return
    }
    if (!universityId) {
      setError(t('authErrorSelectUniversity', 'Please select a university.'))
      return
    }
    setSubmitting(true)
    try {
      const data = await checkSignUpEmail({ email: email.trim() })
      if (!data?.available) {
        setError(t('authErrorAccountExists', 'An account with this email already exists.'))
        return
      }
      setStep(2)
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

  const submitCode = async (e) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      await verifySignUpCode({ email: email.trim(), code: code.trim() })
      setStep(3)
    } catch (err) {
      if (err instanceof ApiError) {
        setError(t('authErrorInvalidCode', 'Invalid verification code.'))
        shakeControls.start({ x: [0, -10, 10, -10, 10, 0], transition: { duration: 0.45 } })
      } else {
        setError(t('authErrorNetwork', 'Could not reach the server. Is the API running?'))
      }
    } finally {
      setSubmitting(false)
    }
  }

  const submitPasswords = async (e) => {
    e.preventDefault()
    setError('')
    if (password !== confirm) {
      setError(t('authErrorPasswordsMismatch', 'Passwords do not match.'))
      return
    }
    setSubmitting(true)
    try {
      await signUp({
        email: email.trim(),
        fullName: fullName.trim(),
        gender,
        universityId,
        password,
      })
      const data = await signIn({ email: email.trim(), password })
      if (data?.token) {
        setSession({ token: data.token, user: data.user })
      } else {
        setSession({ user: data.user })
      }
      onSuccess()
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.status === 400) {
          setError(t('authErrorAccountExists', 'An account with this email already exists.'))
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

  const stepCopy = {
    1: t('authTellUsAboutYou', 'Tell us about you and your university.'),
    2: t('authEnterCode', 'Enter the 6-digit verification code sent to your email.'),
    3: t('authSetSecurePassword', 'Set a secure password.'),
  }

  return (
    <motion.div
      key="signup-form"
      layout
      variants={cardVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">{t('authCreateAccount', 'Create account')}</h2>
      <AnimatePresence mode="wait">
        <motion.p
          key={step}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.2 }}
          className="mt-1 text-sm text-slate-600 dark:text-slate-400"
        >
          {stepCopy[step]}
        </motion.p>
      </AnimatePresence>

      <AnimatePresence mode="wait">
      {step === 1 ? (
        <motion.form
          key="su-step-1"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -16 }}
          transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          onSubmit={submitDetails}
          className="mt-6"
        >
          <motion.div variants={staggerContainer} initial="initial" animate="animate" className="space-y-4">
            <motion.div variants={staggerItem}>
              <label htmlFor="su-name" className="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-400">
                {t('authFullName', 'Full name')}
              </label>
              <input
                ref={firstFieldRef}
                id="su-name"
                type="text"
                autoComplete="name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className={inputClass}
                required
              />
            </motion.div>
            <motion.div variants={staggerItem}>
              <label htmlFor="su-email" className="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-400">
                {t('authEmail', 'Email')}
              </label>
              <input
                id="su-email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={inputClass}
                required
              />
            </motion.div>
            <motion.div variants={staggerItem}>
              <label htmlFor="su-gender" className="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-400">
                {t('authGender', 'Gender')}
              </label>
              <select
                id="su-gender"
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className={selectClass}
                required
              >
                <option value="">{t('authSelect', 'Select...')}</option>
                <option value="female">{t('authFemale', 'Female')}</option>
                <option value="male">{t('authMale', 'Male')}</option>
                <option value="non-binary">{t('authNonBinary', 'Non-binary')}</option>
                <option value="prefer-not">{t('authPreferNot', 'Prefer not to say')}</option>
              </select>
            </motion.div>
            <motion.div variants={staggerItem}>
              <label htmlFor="su-uni" className="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-400">
                {t('authUniversity', 'University')}
              </label>
              <select
                id="su-uni"
                value={universityId}
                onChange={(e) => setUniversityId(e.target.value)}
                className={selectClass}
                required
              >
                <option value="">{t('authSelectUniversity', 'Select university...')}</option>
                {universitiesList.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name}
                  </option>
                ))}
              </select>
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
            {submitting ? t('authChecking', 'Checking…') : t('authContinue', 'Continue')}
          </motion.button>
        </motion.form>
      ) : null}

      {step === 2 ? (
        <motion.form
          key="su-step-2"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -16 }}
          transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          onSubmit={submitCode}
          className="mt-6"
        >
          <motion.div animate={shakeControls}>
            <label htmlFor="su-code" className="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-400">
              {t('authVerificationCode', 'Verification code')}
            </label>
            <input
              ref={firstFieldRef}
              id="su-code"
              type="text"
              inputMode="numeric"
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
            {submitting ? t('authVerifying', 'Verifying…') : t('authVerify', 'Verify')}
          </motion.button>
        </motion.form>
      ) : null}

      {step === 3 ? (
        <motion.form
          key="su-step-3"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -16 }}
          transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          onSubmit={submitPasswords}
          className="mt-6"
        >
          <motion.div variants={staggerContainer} initial="initial" animate="animate" className="space-y-4">
            <motion.div variants={staggerItem}>
              <label htmlFor="su-pass" className="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-400">
                {t('authPassword', 'Password')}
              </label>
              <input
                ref={firstFieldRef}
                id="su-pass"
                type="password"
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={inputClass}
                required
              />
            </motion.div>
            <motion.div variants={staggerItem}>
              <label htmlFor="su-confirm" className="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-400">
                {t('authConfirmPassword', 'Confirm password')}
              </label>
              <input
                id="su-confirm"
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
            {submitting
              ? t('authCreatingAccount', 'Creating account…')
              : t('authCreateAccount', 'Create account')}
          </motion.button>
        </motion.form>
      ) : null}
      </AnimatePresence>
    </motion.div>
  )
}
