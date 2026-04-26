import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useAnimation } from 'framer-motion'
import { DEMO_OTP, PASSWORD_MIN_LENGTH } from './constants'
import { addDemoUser } from './demoUserStore'
import { UNIVERSITIES } from './universities'
import { cardVariants, staggerContainer, staggerItem } from './motion'

const inputClass =
  'w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-500/30 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100'

/** Native chevron gutter (~2rem) + 5px spacing before the indicator edge. */
const selectClass = `${inputClass.replace('px-3', 'pl-3')} pr-[calc(2rem+5px)]`

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())
}

export default function SignUpForm({ onSuccess }) {
  const [step, setStep] = useState(1)
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [gender, setGender] = useState('')
  const [universityId, setUniversityId] = useState('')
  const [code, setCode] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const firstFieldRef = useRef(null)
  const shakeControls = useAnimation()

  useEffect(() => {
    firstFieldRef.current?.focus()
  }, [step])

  const submitDetails = (e) => {
    e.preventDefault()
    setError('')
    if (!fullName.trim()) {
      setError('Please enter your full name.')
      return
    }
    if (!isValidEmail(email)) {
      setError('Please enter a valid email address.')
      return
    }
    if (!gender) {
      setError('Please select a gender.')
      return
    }
    if (!universityId) {
      setError('Please select a university.')
      return
    }
    setStep(2)
  }

  const submitCode = (e) => {
    e.preventDefault()
    setError('')
    if (code.trim() !== DEMO_OTP) {
      setError('Invalid code. Use 1234 for this demo.')
      shakeControls.start({ x: [0, -10, 10, -10, 10, 0], transition: { duration: 0.45 } })
      return
    }
    setStep(3)
  }

  const submitPasswords = (e) => {
    e.preventDefault()
    setError('')
    if (password.length < PASSWORD_MIN_LENGTH) {
      setError(`Password must be at least ${PASSWORD_MIN_LENGTH} characters.`)
      return
    }
    if (password !== confirm) {
      setError('Passwords do not match.')
      return
    }
    const res = addDemoUser({
      email,
      fullName,
      gender,
      universityId,
      password,
    })
    if (!res.ok) {
      setError(res.error)
      return
    }
    onSuccess()
  }

  const stepCopy = {
    1: 'Tell us about you and your university.',
    2: 'Enter the verification code (demo: 1234).',
    3: 'Set a secure password.',
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
      <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Create account</h2>
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
                Full name
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
                Email
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
                Gender
              </label>
              <select
                id="su-gender"
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className={selectClass}
                required
              >
                <option value="">Select…</option>
                <option value="female">Female</option>
                <option value="male">Male</option>
                <option value="non-binary">Non-binary</option>
                <option value="prefer-not">Prefer not to say</option>
              </select>
            </motion.div>
            <motion.div variants={staggerItem}>
              <label htmlFor="su-uni" className="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-400">
                University
              </label>
              <select
                id="su-uni"
                value={universityId}
                onChange={(e) => setUniversityId(e.target.value)}
                className={selectClass}
                required
              >
                <option value="">Select university…</option>
                {UNIVERSITIES.map((u) => (
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
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            className="mt-6 w-full rounded-xl bg-violet-600 px-4 py-3 text-sm font-medium text-white hover:bg-violet-700"
          >
            Continue
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
              Verification code
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
              placeholder="1234"
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
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            className="mt-6 w-full rounded-xl bg-violet-600 px-4 py-3 text-sm font-medium text-white hover:bg-violet-700"
          >
            Verify
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
                Password
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
                minLength={PASSWORD_MIN_LENGTH}
              />
            </motion.div>
            <motion.div variants={staggerItem}>
              <label htmlFor="su-confirm" className="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-400">
                Confirm password
              </label>
              <input
                id="su-confirm"
                type="password"
                autoComplete="new-password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                className={inputClass}
                required
                minLength={PASSWORD_MIN_LENGTH}
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
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            className="mt-6 w-full rounded-xl bg-violet-600 px-4 py-3 text-sm font-medium text-white hover:bg-violet-700"
          >
            Create account
          </motion.button>
        </motion.form>
      ) : null}
      </AnimatePresence>
    </motion.div>
  )
}
